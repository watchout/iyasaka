#!/bin/bash
# post-task.sh — タスク完了後に goals.json のバックログから次タスクを提案
#
# Usage: .framework/hooks/post-task.sh [completed_task_id]
# Output: [提案] 形式の次タスク情報（stdout）
#
# Dev Botはこの出力をDiscordに投稿し、CTO承認を待つ

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRAMEWORK_DIR="$(dirname "$SCRIPT_DIR")"
GOALS_FILE="$FRAMEWORK_DIR/goals.json"
AUTONOMY_FILE="$FRAMEWORK_DIR/autonomy.json"

COMPLETED_TASK="${1:-}"

# goals.json が存在しなければ終了
if [ ! -f "$GOALS_FILE" ]; then
  echo "[警告] goals.json が見つかりません: $GOALS_FILE" >&2
  exit 0
fi

# 次のready/pendingタスクをバックログから取得
NEXT_TASK=$(python3 -c "
import json, sys

with open('$GOALS_FILE') as f:
    goals = json.load(f)

backlog = goals.get('backlog', [])

# readyステータスのタスクを優先、次にpending
for status in ['ready', 'pending']:
    for task in backlog:
        if task.get('status') == status:
            print(json.dumps(task))
            sys.exit(0)

# バックログが空
sys.exit(1)
" 2>/dev/null) || true

if [ -z "$NEXT_TASK" ]; then
  echo "[提案] バックログに残タスクなし。goals.json を更新してください。"
  exit 0
fi

# 自律レベルを判定
AUTONOMY_LEVEL="approval_required"
if [ -f "$AUTONOMY_FILE" ]; then
  AUTONOMY_LEVEL=$(python3 -c "
import json

with open('$AUTONOMY_FILE') as f:
    autonomy = json.load(f)

task = json.loads('$NEXT_TASK')
task_name = task.get('name', '').lower()

# タスク名からアクション種別を推定
action_map = {
    'bug': 'bug_fix',
    'test': 'test',
    'refactor': 'refactoring',
    'lint': 'lint_fix',
    'crud': 'feature_implementation',
    'api': 'api_endpoint',
    'ui': 'ui_component',
    'db': 'db_schema_change',
    'migration': 'db_schema_change',
    'security': 'security_related',
    'deploy': 'deployment',
    'schema': 'db_schema_change',
}

estimated_action = 'feature_implementation'
for keyword, action in action_map.items():
    if keyword in task_name:
        estimated_action = action
        break

for level_name, level_def in autonomy['levels'].items():
    if estimated_action in level_def['actions']:
        print(level_name)
        break
else:
    print('approval_required')
" 2>/dev/null) || AUTONOMY_LEVEL="approval_required"
fi

# 出力フォーマット
TASK_ID=$(echo "$NEXT_TASK" | python3 -c "import json,sys; t=json.load(sys.stdin); print(t.get('id','?'))")
TASK_NAME=$(echo "$NEXT_TASK" | python3 -c "import json,sys; t=json.load(sys.stdin); print(t.get('name','?'))")
TASK_FEATURE=$(echo "$NEXT_TASK" | python3 -c "import json,sys; t=json.load(sys.stdin); print(t.get('feature','?'))")
TASK_PRIORITY=$(echo "$NEXT_TASK" | python3 -c "import json,sys; t=json.load(sys.stdin); print(t.get('priority','?'))")
TASK_DESC=$(echo "$NEXT_TASK" | python3 -c "import json,sys; t=json.load(sys.stdin); print(t.get('description',''))")

echo "[提案] 次のタスク"
if [ -n "$COMPLETED_TASK" ]; then
  echo "  前回完了: $COMPLETED_TASK"
fi
echo "  ID: $TASK_ID"
echo "  名前: $TASK_NAME"
echo "  機能: $TASK_FEATURE"
echo "  優先度: $TASK_PRIORITY"
echo "  説明: $TASK_DESC"
echo "  自律レベル: $AUTONOMY_LEVEL"
echo ""

case "$AUTONOMY_LEVEL" in
  autonomous)
    echo "  → 自律実行可能。着手して完了後に報告します。"
    ;;
  notify_then_proceed)
    echo "  → 5分以内に[却下]がなければ着手します。"
    ;;
  approval_required)
    echo "  → CTO承認を待ちます。[承認] で着手開始。"
    ;;
esac
