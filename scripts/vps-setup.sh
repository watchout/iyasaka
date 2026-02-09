#!/bin/bash
# VPS Setup Script for IYASAKA
# Run this script on the VPS (160.251.209.16) as root
# Usage: bash /path/to/vps-setup.sh

set -euo pipefail

echo "========================================="
echo " IYASAKA VPS Setup Script"
echo "========================================="
echo ""

# --- Step 1: Git init + GitHub push ---
echo "[Step 1] Setting up Git repository at /var/www/iyasaka"
echo "-----------------------------------------"

cd /var/www/iyasaka

if [ -d ".git" ]; then
    echo "Git repo already initialized."
else
    git init
    echo "Git repo initialized."
fi

# Check if remote exists
if git remote get-url origin &>/dev/null; then
    echo "Remote 'origin' already exists: $(git remote get-url origin)"
    echo "Updating to GitHub..."
    git remote set-url origin git@github.com:watchout/iyasaka.git
else
    git remote add origin git@github.com:watchout/iyasaka.git
fi

# Check if GitHub repo exists (requires gh CLI)
if command -v gh &>/dev/null; then
    if ! gh repo view watchout/iyasaka &>/dev/null 2>&1; then
        echo "Creating GitHub repo watchout/iyasaka..."
        gh repo create watchout/iyasaka --private --source=. --push
    fi
fi

git add -A
git commit -m "feat: initial VPS production state push" --allow-empty || true
git branch -M main
git push -u origin main || {
    echo "Push failed. Ensure SSH key is configured for GitHub."
    echo "Run: ssh-keygen -t ed25519 -C 'vps@iyasaka.co'"
    echo "Then add the public key to GitHub: https://github.com/settings/keys"
    exit 1
}

echo ""
echo "[Step 1] COMPLETE - Pushed to watchout/iyasaka main"
echo ""

# --- Step 2: Memory check ---
echo "[Step 2] Memory status"
echo "-----------------------------------------"
free -h
echo ""

# --- Step 3: Find Plane docker-compose ---
echo "[Step 3] Locating Plane docker-compose.yml"
echo "-----------------------------------------"
echo "Searching for docker-compose files related to Plane..."
PLANE_COMPOSE=$(find / -name "docker-compose*" -path "*plane*" 2>/dev/null || true)
if [ -n "$PLANE_COMPOSE" ]; then
    echo "Found: $PLANE_COMPOSE"
else
    echo "No Plane-specific docker-compose found by path."
    echo ""
    echo "Searching all docker-compose files..."
    find / -name "docker-compose*" -not -path "*/proc/*" 2>/dev/null || true
fi
echo ""
echo "Docker containers running:"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}" 2>/dev/null || echo "Docker not available"
echo ""

# --- Step 4: Check Plane data ---
echo "[Step 4] Checking Plane data"
echo "-----------------------------------------"
# Try to get Plane data via API or database
PLANE_DB_CONTAINER=$(docker ps --filter "name=plane" --filter "name=postgres" --format "{{.Names}}" 2>/dev/null | head -1)
if [ -n "$PLANE_DB_CONTAINER" ]; then
    echo "Found Plane DB container: $PLANE_DB_CONTAINER"
    echo ""
    echo "Projects:"
    docker exec "$PLANE_DB_CONTAINER" psql -U plane -d plane -c "SELECT name, identifier FROM projects;" 2>/dev/null || \
    docker exec "$PLANE_DB_CONTAINER" psql -U postgres -d plane -c "SELECT name, identifier FROM projects;" 2>/dev/null || \
    echo "Could not query Plane database directly."
    echo ""
    echo "Issue counts per project:"
    docker exec "$PLANE_DB_CONTAINER" psql -U plane -d plane -c "SELECT p.name, COUNT(i.id) as issue_count FROM projects p LEFT JOIN issues i ON p.id = i.project_id GROUP BY p.name;" 2>/dev/null || \
    docker exec "$PLANE_DB_CONTAINER" psql -U postgres -d plane -c "SELECT p.name, COUNT(i.id) as issue_count FROM projects p LEFT JOIN issues i ON p.id = i.project_id GROUP BY p.name;" 2>/dev/null || \
    echo "Could not query issue counts."
else
    echo "No Plane PostgreSQL container found."
    echo "Trying to find any postgres container..."
    docker ps --filter "ancestor=postgres" --format "{{.Names}}" 2>/dev/null || true
    docker ps | grep -i "postgres\|plane" 2>/dev/null || true
fi
echo ""

# --- Step 5: Stop Plane Docker ---
echo "[Step 5] Stopping Plane Docker"
echo "-----------------------------------------"
echo "Memory BEFORE stopping Plane:"
free -h
echo ""

# Find and use the Plane docker-compose directory
PLANE_DIR=""
if [ -n "${PLANE_COMPOSE:-}" ]; then
    PLANE_DIR=$(dirname "$PLANE_COMPOSE" | head -1)
fi

# Common Plane installation paths
for dir in "$PLANE_DIR" /opt/plane /root/plane /home/*/plane /srv/plane /var/lib/plane; do
    if [ -n "$dir" ] && [ -d "$dir" ] && [ -f "$dir/docker-compose.yml" -o -f "$dir/docker-compose.yaml" ]; then
        echo "Found Plane directory: $dir"
        cd "$dir"
        echo "Stopping Plane containers..."
        docker compose down || docker-compose down || true
        echo "Plane stopped."
        break
    fi
done

# If no directory found, try stopping by container name
if docker ps | grep -qi plane 2>/dev/null; then
    echo "Plane containers still running. Stopping by name..."
    docker ps --filter "name=plane" --format "{{.Names}}" | xargs -r docker stop
fi

echo ""
echo "Memory AFTER stopping Plane:"
free -h
echo ""

echo "========================================="
echo " Setup Complete!"
echo "========================================="
echo ""
echo "Summary:"
echo "  - Git repo: /var/www/iyasaka -> github.com/watchout/iyasaka (main)"
echo "  - Plane: stopped"
echo "  - Memory status: shown above"
