#!/bin/bash

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"

# Prefer exported env var, fallback to reading .env (without sourcing)
if [ -z "${PLANE_API_KEY:-}" ] && [ -f "$ENV_FILE" ]; then
  PLANE_API_KEY="$(awk -F= '$1 ~ /^[[:space:]]*PLANE_API_KEY[[:space:]]*$/ { gsub(/^[[:space:]]+|[[:space:]]+$/, "", $2); print $2; exit }' "$ENV_FILE")"
fi

API_KEY="${PLANE_API_KEY:-}"
PLANE_URL="${PLANE_URL:-https://plane.arrowsworks.com}"

if [ -z "$API_KEY" ]; then
  echo "❌ PLANE_API_KEY が未設定です（.env または環境変数に設定してください）" >&2
  exit 1
fi

echo "🔍 Plane API構造を探索中..."
echo ""

# 成功したエンドポイント
echo "✅ /api/v1/users/me/ (成功確認)"
USER_DATA=$(curl -s -H "X-API-Key: $API_KEY" "$PLANE_URL/api/v1/users/me/")
echo "$USER_DATA" | head -c 200
echo ""
echo ""

# ユーザーIDを抽出
USER_ID=$(echo "$USER_DATA" | grep -oP '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "📋 User ID: $USER_ID"
USER_EMAIL=$(echo "$USER_DATA" | grep -oP '"email":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "📧 Email: $USER_EMAIL"
echo ""

# 試すエンドポイント一覧（Plane公式ドキュメント準拠）
echo "🧪 ワークスペースエンドポイント探索..."
echo ""

ENDPOINTS=(
  "/api/workspaces/"
  "/api/users/me/workspaces/"
  "/api/v1/workspaces/"
  "/api/v1/users/me/workspaces/"
)

for endpoint in "${ENDPOINTS[@]}"; do
  echo "Testing: $endpoint"
  RESPONSE=$(curl -s -w "\n%{http_code}" -H "X-API-Key: $API_KEY" "$PLANE_URL$endpoint")
  STATUS=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | head -n -1)
  
  if [ "$STATUS" -eq 200 ] || [ "$STATUS" -eq 201 ]; then
    echo "   ✅ Status: $STATUS - 成功！"
    echo "   Response:"
    echo "$BODY" | head -c 500
    echo ""
    echo "   ---"
    
    # ワークスペースslugを抽出
    WORKSPACE_SLUG=$(echo "$BODY" | grep -oP '"slug":"[^"]*"' | head -1 | cut -d'"' -f4)
    if [ -n "$WORKSPACE_SLUG" ]; then
      echo "   🎯 Workspace Slug: $WORKSPACE_SLUG"
      echo "$WORKSPACE_SLUG" > /tmp/plane_workspace_slug.txt
    fi
  else
    echo "   ❌ Status: $STATUS"
    echo "   Error: $(echo "$BODY" | head -c 100)"
  fi
  echo ""
done

# ワークスペースslugが見つかった場合、プロジェクト関連エンドポイントをテスト
if [ -f /tmp/plane_workspace_slug.txt ]; then
  WORKSPACE_SLUG=$(cat /tmp/plane_workspace_slug.txt)
  echo "🎯 ワークスペースslug '$WORKSPACE_SLUG' を使用してプロジェクトAPI探索..."
  echo ""
  
  PROJECT_ENDPOINTS=(
    "/api/workspaces/$WORKSPACE_SLUG/projects/"
    "/api/v1/workspaces/$WORKSPACE_SLUG/projects/"
  )
  
  for endpoint in "${PROJECT_ENDPOINTS[@]}"; do
    echo "Testing: $endpoint"
    RESPONSE=$(curl -s -w "\n%{http_code}" -H "X-API-Key: $API_KEY" "$PLANE_URL$endpoint")
    STATUS=$(echo "$RESPONSE" | tail -1)
    BODY=$(echo "$RESPONSE" | head -n -1)
    
    if [ "$STATUS" -eq 200 ] || [ "$STATUS" -eq 201 ]; then
      echo "   ✅ Status: $STATUS - 成功！"
      echo "   Response (最初の500文字):"
      echo "$BODY" | head -c 500
      echo ""
    else
      echo "   ❌ Status: $STATUS"
      echo "   Error: $(echo "$BODY" | head -c 100)"
    fi
    echo ""
  done
fi

echo "🎉 探索完了！"



