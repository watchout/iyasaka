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

echo "🔍 正しいPlane APIエンドポイント探索"
echo "====================================="
echo ""

# よくあるワークスペース・スラッグ候補
WORKSPACE_SLUGS=(
  "arrowsworks"
  "default"
  "main"
  "workspace"
  "kaneko"
)

echo "1️⃣ ワークスペース一覧を試行（末尾スラッシュ付き）"
echo ""

# 正しいエンドポイント: /api/v1/workspaces/{slug}/
for slug in "${WORKSPACE_SLUGS[@]}"; do
  echo "Testing workspace slug: $slug"
  
  RESPONSE=$(curl -sS -w "\n%{http_code}" \
    -H "x-api-key: $API_KEY" \
    "$PLANE_URL/api/v1/workspaces/$slug/" 2>/dev/null)
  
  STATUS=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | head -n -1)
  
  if [ "$STATUS" = "200" ] || [ "$STATUS" = "201" ]; then
    echo "  ✅ 成功！ Status: $STATUS"
    echo "  Workspace Slug: $slug"
    echo "$BODY" | python3 -m json.tool 2>/dev/null | head -50
    echo ""
    echo "$slug" > /tmp/plane_workspace_slug.txt
    break
  else
    echo "  ❌ Status: $STATUS"
  fi
done

echo ""

# スラッグが見つからない場合、UIから推測
if [ ! -f /tmp/plane_workspace_slug.txt ]; then
  echo "⚠️  一般的なスラッグで見つかりませんでした"
  echo ""
  echo "2️⃣ プロジェクト一覧から逆引き（末尾スラッシュ付き）"
  echo ""
  
  # 試行: /api/v1/workspaces/ （スラッグなし）でリスト取得できるか
  RESPONSE=$(curl -sS -w "\n%{http_code}" \
    -H "x-api-key: $API_KEY" \
    "$PLANE_URL/api/v1/workspaces/" 2>/dev/null)
  
  STATUS=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | head -n -1)
  
  if [ "$STATUS" = "200" ]; then
    echo "  ✅ ワークスペース一覧取得成功！"
    echo "$BODY" | python3 -m json.tool 2>/dev/null
    
    # スラッグを抽出
    SLUG=$(echo "$BODY" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if isinstance(data, list) and len(data) > 0:
        print(data[0].get('slug', ''))
    elif isinstance(data, dict):
        print(data.get('slug', ''))
except: pass
" 2>/dev/null)
    
    if [ -n "$SLUG" ]; then
      echo ""
      echo "  🎯 ワークスペース・スラッグ: $SLUG"
      echo "$SLUG" > /tmp/plane_workspace_slug.txt
    fi
  else
    echo "  ❌ Status: $STATUS"
    echo "  Response: $(echo "$BODY" | head -c 200)"
  fi
fi

echo ""

# プロジェクト一覧取得
if [ -f /tmp/plane_workspace_slug.txt ]; then
  SLUG=$(cat /tmp/plane_workspace_slug.txt)
  echo "3️⃣ プロジェクト一覧取得（末尾スラッシュ付き）"
  echo "Workspace Slug: $SLUG"
  echo ""
  
  RESPONSE=$(curl -sS -w "\n%{http_code}" \
    -H "x-api-key: $API_KEY" \
    "$PLANE_URL/api/v1/workspaces/$SLUG/projects/" 2>/dev/null)
  
  STATUS=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | head -n -1)
  
  if [ "$STATUS" = "200" ]; then
    echo "  ✅ プロジェクト一覧取得成功！"
    echo "$BODY" | python3 -m json.tool 2>/dev/null | head -100
    
    echo ""
    echo "🎉 API接続成功！"
    echo ""
    echo "正しいエンドポイント:"
    echo "  Workspace: $PLANE_URL/api/v1/workspaces/$SLUG/"
    echo "  Projects: $PLANE_URL/api/v1/workspaces/$SLUG/projects/"
    echo ""
    
    # 情報を保存
    echo "$SLUG" > /tmp/plane_workspace_slug.txt
    echo "$PLANE_URL/api/v1/workspaces/$SLUG" > /tmp/plane_api_base.txt
  else
    echo "  ❌ Status: $STATUS"
    echo "  Response: $(echo "$BODY" | head -c 200)"
  fi
else
  echo "❌ ワークスペース・スラッグが特定できませんでした"
  echo ""
  echo "次のステップ:"
  echo "1. Plane UIにアクセス: $PLANE_URL"
  echo "2. URLからワークスペース・スラッグを確認"
  echo "   例: https://plane.arrowsworks.com/my-workspace/ → スラッグは 'my-workspace'"
  echo "3. スラッグを直接指定してテスト:"
  echo "   curl -H 'x-api-key: $API_KEY' '$PLANE_URL/api/v1/workspaces/YOUR-SLUG/projects/'"
fi

echo ""
