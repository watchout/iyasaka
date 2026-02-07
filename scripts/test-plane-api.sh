#!/bin/bash

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"

if [ -z "${PLANE_API_KEY:-}" ] && [ -f "$ENV_FILE" ]; then
  PLANE_API_KEY="$(awk -F= '$1 ~ /^[[:space:]]*PLANE_API_KEY[[:space:]]*$/ { gsub(/^[[:space:]]+|[[:space:]]+$/, "", $2); print $2; exit }' "$ENV_FILE")"
fi

API_KEY="${PLANE_API_KEY:-}"
PLANE_URL="${PLANE_URL:-https://plane.arrowsworks.com}"

if [ -z "$API_KEY" ]; then
  echo "❌ PLANE_API_KEY が未設定です（.env または環境変数に設定してください）" >&2
  exit 1
fi

echo "🔍 Plane APIエンドポイント確認中..."
echo ""

# パターン1: /api/v1/workspaces
echo "1️⃣ /api/v1/workspaces/"
curl -s -o /dev/null -w "Status: %{http_code}\n" \
  -H "X-API-Key: $API_KEY" \
  "$PLANE_URL/api/v1/workspaces/"
echo ""

# パターン2: /api/workspaces
echo "2️⃣ /api/workspaces/"
curl -s -o /dev/null -w "Status: %{http_code}\n" \
  -H "X-API-Key: $API_KEY" \
  "$PLANE_URL/api/workspaces/"
echo ""

# パターン3: /api/users/me/workspaces
echo "3️⃣ /api/users/me/workspaces/"
curl -s -o /dev/null -w "Status: %{http_code}\n" \
  -H "X-API-Key: $API_KEY" \
  "$PLANE_URL/api/users/me/workspaces/"
echo ""

# パターン4: /api/v1/users/me
echo "4️⃣ /api/v1/users/me/"
curl -s -w "\n" \
  -H "X-API-Key: $API_KEY" \
  "$PLANE_URL/api/v1/users/me/" | head -20
