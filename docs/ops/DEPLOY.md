# IYASAKA Deploy Guide

## Overview

| Item | Value |
|------|-------|
| VPS | ConoHa / Ubuntu 22.04 |
| IP | `160.251.209.16` |
| Project path | `/home/arrowsworks/iyasaka-release` |
| PM2 process | `iyasaka-nuxt` |
| Port | 4100 |
| Domain | `iyasaka.co` / `www.iyasaka.co` |
| SSL | Let's Encrypt (certbot, auto-renewal) |

---

## Daily Deploy (local -> VPS)

```bash
# 1. local: commit & push
git add -A && git commit -m "feat: ..." && git push origin main

# 2. VPS: pull, build, restart
ssh arrowsworks@160.251.209.16
cd /home/arrowsworks/iyasaka-release
git pull origin main
pnpm install --frozen-lockfile
pnpm run build

# .env を読み込んでから PM2 再起動
set -a && source .env && set +a
pm2 restart iyasaka-nuxt
pm2 logs iyasaka-nuxt --lines 20
```

or use the deploy script:

```bash
ssh arrowsworks@160.251.209.16 'bash /home/arrowsworks/iyasaka-release/scripts/vps-deploy.sh'
```

---

## PM2 Startup (important)

PM2 は `.env` を自動で読み込まないため、起動/再起動時は必ず
先に `.env` を source してから実行する。

```bash
cd /home/arrowsworks/iyasaka-release
set -a && source .env && set +a
NODE_ENV=production PORT=4100 HOST=127.0.0.1 \
  pm2 start .output/server/index.mjs --name iyasaka-nuxt
pm2 save
```

再起動の場合:
```bash
cd /home/arrowsworks/iyasaka-release
set -a && source .env && set +a
pm2 restart iyasaka-nuxt
```

---

## Verification

```bash
# HTTP -> HTTPS redirect
curl -I http://iyasaka.co

# HTTPS response
curl -I https://iyasaka.co

# www -> apex redirect
curl -I https://www.iyasaka.co

# Health check
curl -s https://iyasaka.co/api/health/supabase
```

---

## Rollback

```bash
cd /home/arrowsworks/iyasaka-release
git log --oneline -5
git checkout <previous-commit-hash>
pnpm run build
set -a && source .env && set +a
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
pm2 env 0                        # Check env vars for process 0
```

---

## Log Locations

| Log | Path |
|-----|------|
| PM2 stdout | `~/.pm2/logs/iyasaka-nuxt-out.log` |
| PM2 stderr | `~/.pm2/logs/iyasaka-nuxt-error.log` |
| Nginx access | `/var/log/nginx/access.log` |
| Nginx error | `/var/log/nginx/error.log` |

---

## SSL (completed)

- certbot + nginx plugin で取得済み
- 自動更新: `sudo certbot renew --dry-run` で確認
- 証明書: `/etc/letsencrypt/live/iyasaka.co/`

---

## Nginx

- Config: `/etc/nginx/sites-available/iyasaka.co.conf`
- upstream `nuxt_iyasaka` は `arrowsworks.conf` で定義 (127.0.0.1:4100)
- 変更時は必ず `sudo nginx -t && sudo systemctl reload nginx`
- 既存サービス (arrowsworks / plane / nc / linker) に触れない

---

## Key Technical Notes

### SSR build fix (treeshake)

Vue 3.5 + Nuxt 3.10 の組み合わせでは、Rollup の `@__PURE__` アノテーションにより
`tryUseNuxtApp()` がツリーシェイクで除去され、本番ビルドで
`[nuxt] instance unavailable` エラーが発生する。

`nuxt.config.ts` の `nitro.rollupConfig.treeshake.annotations = false` で回避済み。

### baseURL

`nuxt.config.ts` で `process.env.NUXT_APP_BASE_URL || '/'` を使用。
ドメイン直下アクセス (iyasaka.co) ではデフォルトの `/` で動作する。

---

## Constraints

- `.env` は Git に入れない (`.gitignore` で除外済み)
- VPS 上で直接コードを編集しない
- 変更は local -> push -> VPS pull の流れで
- `nginx -t` を必ず通してから reload
