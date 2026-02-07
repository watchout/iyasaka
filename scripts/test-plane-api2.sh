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

echo "🔍 認証ヘッダー形式テスト..."
echo ""

# 認証パターン1: x-api-key
echo "1️⃣ x-api-key (lowercase)"
curl -s -w "\nStatus: %{http_code}\n" \
  -H "x-api-key: $API_KEY" \
  "$PLANE_URL/api/workspaces/" | head -20
echo ""

# 認証パターン2: Authorization: Bearer
echo "2️⃣ Authorization: Bearer"
curl -s -w "\nStatus: %{http_code}\n" \
  -H "Authorization: Bearer $API_KEY" \
  "$PLANE_URL/api/workspaces/" | head -20
echo ""

# 認証パターン3: Authorization: Api-Key
echo "3️⃣ Authorization: Api-Key"
curl -s -w "\nStatus: %{http_code}\n" \
  -H "Authorization: Api-Key $API_KEY" \
  "$PLANE_URL/api/workspaces/" | head -20
