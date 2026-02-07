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

echo "🔐 Plane v1.0.0 認証方式テスト"
echo "=============================="
echo ""

# 各種認証ヘッダーパターンを試す
AUTH_PATTERNS=(
  "X-API-Key: $API_KEY"
  "x-api-key: $API_KEY"
  "Authorization: Bearer $API_KEY"
  "Authorization: Token $API_KEY"
  "Authorization: Api-Key $API_KEY"
  "Api-Key: $API_KEY"
)

ENDPOINTS=(
  "/api/workspaces/"
  "/api/users/me/workspaces/"
)

for endpoint in "${ENDPOINTS[@]}"; do
  echo "Testing endpoint: $endpoint"
  echo "----------------------------"
  
  for auth in "${AUTH_PATTERNS[@]}"; do
    echo "  Auth: $auth"
    
    RESPONSE=$(curl -s -w "\n%{http_code}" \
      -H "$auth" \
      -H "Content-Type: application/json" \
      "$PLANE_URL$endpoint" 2>/dev/null)
    
    STATUS=$(echo "$RESPONSE" | tail -1)
    BODY=$(echo "$RESPONSE" | head -n -1)
    
    if [ "$STATUS" = "200" ] || [ "$STATUS" = "201" ]; then
      echo "    ✅ 成功！ Status: $STATUS"
      echo "    Response:"
      echo "$BODY" | python3 -m json.tool 2>/dev/null | head -20
      echo ""
      echo "🎉 正しい認証方式が見つかりました！"
      echo "Endpoint: $PLANE_URL$endpoint"
      echo "Auth Header: $auth"
      exit 0
    else
      echo "    ❌ Status: $STATUS - $(echo "$BODY" | head -c 50)"
    fi
  done
  echo ""
done

echo "❌ すべての認証パターンが失敗しました"
echo ""
echo "次のステップ:"
echo "1. Plane管理画面でAPIトークンの権限を確認"
echo "2. APIトークンを再生成"
echo "3. Plane設定でAPI機能が有効化されているか確認"
