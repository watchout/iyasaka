# IYASAKA Deploy Guide

## Overview

| Item | Value |
|------|-------|
| VPS | ConoHa / Ubuntu 22.04 |
| IP | `160.251.209.16` |
| Project path | `/home/arrowsworks/iyasaka` |
| PM2 process | `iyasaka-nuxt` |
| Port | 4100 |
| Domain | `iyasaka.co` / `www.iyasaka.co` |

---

## Daily Deploy (local -> VPS)

```bash
# 1. local: commit & push
git add -A && git commit -m "feat: ..." && git push origin main

# 2. VPS: pull, build, restart
ssh arrowsworks@160.251.209.16
cd /home/arrowsworks/iyasaka
git pull origin main
pnpm install --frozen-lockfile
pnpm run build
pm2 restart iyasaka-nuxt
pm2 logs iyasaka-nuxt --lines 20
```

or use the deploy script:

```bash
ssh arrowsworks@160.251.209.16 'bash /home/arrowsworks/iyasaka/scripts/vps-deploy.sh'
```

---

## Initial VPS Setup (one-time)

### 1. Production build

```bash
cd /home/arrowsworks/iyasaka
pnpm install --frozen-lockfile
pnpm run build
# Verify .output/server/index.mjs exists
ls -la .output/server/index.mjs
```

### 2. PM2 production config

```bash
# Copy template and adjust if needed
cp ecosystem.config.example.cjs ecosystem.config.cjs
mkdir -p logs

# Stop old dev process
pm2 delete iyasaka-nuxt 2>/dev/null || true

# Start production
pm2 start ecosystem.config.cjs
pm2 save

# Verify
pm2 list
curl -s http://127.0.0.1:4100/ | head -5
```

### 3. Nginx for iyasaka.co

```bash
# Copy config
sudo cp docs/ops/nginx/iyasaka.co.conf /etc/nginx/sites-available/iyasaka.co.conf

# Before SSL: comment out the listen 443 block
sudo vim /etc/nginx/sites-available/iyasaka.co.conf

# Enable
sudo ln -s /etc/nginx/sites-available/iyasaka.co.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 4. SSL (Let's Encrypt)

```bash
# Install certbot if not present
sudo apt update && sudo apt install -y certbot python3-certbot-nginx

# Get certificate (certbot modifies the nginx config automatically)
sudo certbot --nginx -d iyasaka.co -d www.iyasaka.co

# Verify auto-renewal
sudo certbot renew --dry-run
```

### 5. DNS

Ensure these records exist at your domain registrar:

| Type | Name | Value |
|------|------|-------|
| A | `iyasaka.co` | `160.251.209.16` |
| A | `www.iyasaka.co` | `160.251.209.16` |

---

## Verification

```bash
# HTTP -> HTTPS redirect
curl -I http://iyasaka.co

# HTTPS response
curl -I https://iyasaka.co

# Health check
curl -s https://iyasaka.co/api/health/supabase
```

---

## Rollback

```bash
# Revert to previous commit
cd /home/arrowsworks/iyasaka
git log --oneline -5
git checkout <previous-commit-hash>
pnpm run build
pm2 restart iyasaka-nuxt
```

---

## PM2 Useful Commands

```bash
pm2 list                         # Process status
pm2 logs iyasaka-nuxt            # Real-time logs
pm2 logs iyasaka-nuxt --lines 50 # Last 50 lines
pm2 monit                        # Resource monitor
pm2 restart iyasaka-nuxt         # Restart
pm2 stop iyasaka-nuxt            # Stop
pm2 delete iyasaka-nuxt          # Remove
```

---

## Log Locations

| Log | Path |
|-----|------|
| PM2 stdout | `/home/arrowsworks/iyasaka/logs/out.log` |
| PM2 stderr | `/home/arrowsworks/iyasaka/logs/error.log` |
| Nginx access | `/var/log/nginx/access.log` |
| Nginx error | `/var/log/nginx/error.log` |

---

## Constraints

- `.env` is never committed (`.gitignore` enforced)
- Do not edit code directly on VPS
- Always `nginx -t` before `systemctl reload nginx`
- Do not touch: arrowsworks.com / plane / nc / linker configs
