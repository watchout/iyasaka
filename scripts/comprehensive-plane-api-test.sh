#!/bin/bash
set -e

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

echo "🔍 Plane API完全調査スクリプト"
echo "================================"
echo ""

# ユーザー情報取得（成功確認済み）
echo "1️⃣ ユーザー情報取得"
USER_JSON=$(curl -s -H "X-API-Key: $API_KEY" "$PLANE_URL/api/v1/users/me/")
echo "$USER_JSON" | python3 -m json.tool 2>/dev/null || echo "$USER_JSON"
echo ""

# ワークスペース一覧を様々なパターンで試行
echo "2️⃣ ワークスペース一覧取得（全パターン）"
echo ""

# Plane公式ドキュメントベースのエンドポイント
WORKSPACE_ENDPOINTS=(
  "/api/workspaces/"
  "/api/v1/workspaces/"
  "/api/users/me/workspaces/"
  "/api/v1/users/me/workspaces/"
  "/api/v1/users/me/workspace/"
  "/api/workspaces/me/"
)

for endpoint in "${WORKSPACE_ENDPOINTS[@]}"; do
  echo "Testing: $endpoint"
  
  # ヘッダーパターン1: X-API-Key
  RESPONSE=$(curl -s -w "\n%{http_code}" \
    -H "X-API-Key: $API_KEY" \
    -H "Content-Type: application/json" \
    "$PLANE_URL$endpoint" 2>/dev/null)
  
  STATUS=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | head -n -1)
  
  if [ "$STATUS" = "200" ] || [ "$STATUS" = "201" ]; then
    echo "  ✅ 成功！ Status: $STATUS"
    echo "  Response:"
    echo "$BODY" | python3 -m json.tool 2>/dev/null | head -50
    echo ""
    echo "$BODY" > /tmp/plane_workspaces.json
    break
  else
    echo "  ❌ Status: $STATUS"
  fi
done

echo ""

# プロジェクト一覧を試す（ワークスペースslugがあれば）
if [ -f /tmp/plane_workspaces.json ]; then
  echo "3️⃣ ワークスペースからslugを抽出してプロジェクト取得"
  
  # JSONからslugを抽出（複数ワークスペース対応）
  WORKSPACE_SLUGS=$(cat /tmp/plane_workspaces.json | grep -oP '"slug":"[^"]*"' | cut -d'"' -f4)
  
  for slug in $WORKSPACE_SLUGS; do
    echo ""
    echo "Workspace: $slug"
    
    PROJECT_ENDPOINTS=(
      "/api/workspaces/$slug/projects/"
      "/api/v1/workspaces/$slug/projects/"
    )
    
    for endpoint in "${PROJECT_ENDPOINTS[@]}"; do
      echo "  Testing: $endpoint"
      RESPONSE=$(curl -s -w "\n%{http_code}" \
        -H "X-API-Key: $API_KEY" \
        -H "Content-Type: application/json" \
        "$PLANE_URL$endpoint" 2>/dev/null)
      
      STATUS=$(echo "$RESPONSE" | tail -1)
      BODY=$(echo "$RESPONSE" | head -n -1)
      
      if [ "$STATUS" = "200" ] || [ "$STATUS" = "201" ]; then
        echo "    ✅ 成功！ Status: $STATUS"
        echo "    Projects:"
        echo "$BODY" | python3 -m json.tool 2>/dev/null | head -30
        echo ""
        
        # 成功したエンドポイントを保存
        echo "$PLANE_URL$endpoint" > /tmp/plane_projects_endpoint.txt
        echo "$slug" > /tmp/plane_workspace_slug.txt
        break
      else
        echo "    ❌ Status: $STATUS"
      fi
    done
  done
fi

echo ""
echo "4️⃣ 結果まとめ"
echo "=============="

if [ -f /tmp/plane_workspace_slug.txt ] && [ -f /tmp/plane_projects_endpoint.txt ]; then
  WORKSPACE_SLUG=$(cat /tmp/plane_workspace_slug.txt)
  PROJECTS_ENDPOINT=$(cat /tmp/plane_projects_endpoint.txt)
  
  echo "✅ API連携可能！"
  echo ""
  echo "Workspace Slug: $WORKSPACE_SLUG"
  echo "Projects Endpoint: $PROJECTS_ENDPOINT"
  echo ""
  echo "次のステップ:"
  echo "1. プロジェクト作成APIをテスト"
  echo "2. イシュー作成APIをテスト"
  echo "3. 自動セットアップスクリプト実行"
else
  echo "❌ ワークスペース/プロジェクトエンドポイントが見つかりませんでした"
  echo ""
  echo "代替手段:"
  echo "1. Planeのバージョン確認: curl -s $PLANE_URL/api/instances/"
  echo "2. PlaneのWeb UIでネットワークタブ確認"
  echo "3. Plane管理者にAPI有効化を確認"
fi

echo ""
