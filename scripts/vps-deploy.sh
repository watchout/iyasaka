#!/usr/bin/env bash
# VPS deploy script for IYASAKA Nuxt production
# Usage: ssh arrowsworks@160.251.209.16 'bash /home/arrowsworks/iyasaka-release/scripts/vps-deploy.sh'
set -euo pipefail

PROJECT_DIR="/home/arrowsworks/iyasaka-release"
PM2_NAME="iyasaka-nuxt"

cd "$PROJECT_DIR"

echo "=== git pull ==="
git pull origin main

echo "=== pnpm install ==="
pnpm install --frozen-lockfile

echo "=== build ==="
pnpm run build

# Verify build output
if [ ! -f ".output/server/index.mjs" ]; then
  echo "ERROR: Build output not found (.output/server/index.mjs)"
  exit 1
fi

echo "=== load .env and pm2 restart ==="
set -a && source .env && set +a
pm2 restart "$PM2_NAME" || \
  NODE_ENV=production PORT=4100 HOST=127.0.0.1 \
  pm2 start .output/server/index.mjs --name "$PM2_NAME"

echo "=== health check (wait 3s) ==="
sleep 3
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:4100/ || echo "000")
if [ "$HTTP_STATUS" = "200" ]; then
  echo "OK: Server returned HTTP $HTTP_STATUS"
else
  echo "WARNING: Server returned HTTP $HTTP_STATUS"
  echo "Check logs: pm2 logs $PM2_NAME --lines 30"
fi

echo "=== deploy complete ==="
pm2 list
