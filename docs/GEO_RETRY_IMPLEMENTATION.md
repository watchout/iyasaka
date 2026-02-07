# GEO API レート制限対策 実装ドキュメント

## 📋 実装日
2025-12-11

## 🎯 実装内容

### 1. レート制御＆指数バックオフ

#### 指数バックオフ＋ジッター
```typescript
function getBackoffDelay(attempt: number): number {
  const baseDelay = 1000 // 1秒
  const exponential = baseDelay * Math.pow(2, attempt - 1)
  const jitter = exponential * 0.2 * (Math.random() - 0.5) // ±20%
  return exponential + jitter
}
```

- **1回目**: 1秒 ± 20% (0.8〜1.2秒)
- **2回目**: 2秒 ± 20% (1.6〜2.4秒)
- **3回目**: 4秒 ± 20% (3.2〜4.8秒)
- **4回目**: 8秒 ± 20% (6.4〜9.6秒)

#### リトライ判定ロジック
```typescript
function isRetryableError(statusCode?: number): boolean {
  if (!statusCode) return false
  return statusCode === 429 || statusCode >= 500
}
```

- **429 (Too Many Requests)**: リトライ対象 ✅
- **5xx (Server Error)**: リトライ対象 ✅
- **400, 403, 404**: 即失敗 ❌

#### 429エラー時の待機時間抽出
```typescript
function extractRetryAfter(errorMessage: string): number | null {
  const match = errorMessage.match(/retry in ([\d.]+)s/i)
  return match ? parseFloat(match[1]) * 1000 : null
}
```

Gemini APIのエラーメッセージから推奨待機時間を自動抽出

---

### 2. モデルフォールバック

#### フォールバック順序
```typescript
const GEMINI_MODELS = [
  'gemini-2.5-flash',   // 1st try
  'gemini-2.0-flash',   // 2nd try
  'gemini-1.5-flash'    // 3rd try
] as const
```

#### 動作フロー
1. `gemini-2.5-flash` で最大4回リトライ
2. 全失敗 → `gemini-2.0-flash` で最大4回リトライ
3. 全失敗 → `gemini-1.5-flash` で最大4回リトライ
4. 全失敗 → エラー記録

**合計最大リトライ回数**: 4 × 3モデル = **12回**

---

### 3. 失敗理由の記録

#### Supabase保存形式
```json
{
  "query": "クエリテキスト",
  "intent": "convert",
  "region": "JP",
  "evaluations": [],
  "visibility_score": 0,
  "error": "You exceeded your current quota...",
  "attempts": 12,
  "_meta": {
    "model": "gemini-2.5-flash",
    "attempts": 4
  }
}
```

#### メトリクスAPI拡張
```typescript
items.push({
  queryId,
  query: meta.text,
  intent: meta.intent,
  lastVisibility: last.visibility,
  error: last.error || null,        // ← 失敗理由
  attempts: last.attempts || 1,     // ← リトライ回数
  model: last.model || 'unknown',   // ← 使用モデル
  sparkline
})
```

---

### 4. 環境変数による制限設定

#### `.env` 追加項目
```bash
# GEO API制限設定
GEO_MAX_QUERIES_PER_RUN=20    # 1回の実行で処理する最大クエリ数
GEO_MAX_QUERIES_PER_DAY=200   # 1日の最大クエリ数
GEO_MAX_TOKENS_PER_RUN=50000  # 1回の実行で使用する最大トークン数
GEO_MAX_RETRIES=4             # 各モデルでの最大リトライ回数
```

#### `nuxt.config.ts` 設定
```typescript
runtimeConfig: {
  geo: {
    maxQueriesPerRun: Number(process.env.GEO_MAX_QUERIES_PER_RUN || '20'),
    maxQueriesPerDay: Number(process.env.GEO_MAX_QUERIES_PER_DAY || '200'),
    maxTokensPerRun: Number(process.env.GEO_MAX_TOKENS_PER_RUN || '50000'),
    maxRetries: Number(process.env.GEO_MAX_RETRIES || '4')
  }
}
```

---

## 📊 コスト試算

### Gemini 2.5 Flash 料金
- **入力**: $0.075 / 1M トークン
- **出力**: $0.30 / 1M トークン

### 28件処理の推定コスト
```
入力: 28件 × 500トークン × $0.075/1M = $0.00105
出力: 28件 × 200トークン × $0.30/1M  = $0.00168
─────────────────────────────────────────────
合計: 約 $0.003 (約0.5円)
```

### 月間コスト推定（毎日28件実行）
```
日次: $0.003
月間: $0.003 × 30日 = $0.09 (約13円)
```

---

## 🔒 セキュリティ＆エラーハンドリング

### 1. タイムアウト設定
```typescript
const response = await $fetch<any>(`${endpoint}?key=${apiKey}`, {
  method: 'POST',
  body: { ... },
  timeout: 15000  // 15秒
})
```

### 2. JSON パースエラー対策
```typescript
let cleanedText = text.trim()
if (cleanedText.startsWith('```json')) {
  cleanedText = cleanedText.replace(/^```json\n?/, '').replace(/\n?```$/, '')
} else if (cleanedText.startsWith('```')) {
  cleanedText = cleanedText.replace(/^```\n?/, '').replace(/\n?```$/, '')
}
const json = JSON.parse(cleanedText)
```

Geminiがマークダウンコードブロックで返した場合も正しく処理

### 3. 部分的な失敗の許容
```typescript
// 1件失敗しても残りの処理を続行
if (!retryResult.success || !retryResult.data) {
  console.error(`[geo] ❌ Failed to evaluate query "${q.text}": ${retryResult.error}`)
  failureCount++
  // 失敗を記録して次へ
  await supabase.from('geo_snapshots').insert({ ... })
  continue
}
```

---

## 🚀 次のステップ

### 即座に実行すべきこと

1. **AI Studio 課金化（Pay-as-you-go）**
   - URL: https://aistudio.google.com/
   - 左メニュー「Billing」→「Pay as you go」
   - クレジットカード登録
   - 既存の `GEMINI_API_KEY` はそのまま使用可

2. **課金化完了後のテスト実行**
   ```bash
   curl -X POST http://localhost:4100/iyasaka/api/geo/snapshot \
     -H 'Content-Type: application/json' \
     -H 'x-geo-snapshot-token: 19f23426c19c53d32cc0c4c8ac477e563f6b30273179f619d38932e4998ac37b' \
     -d '{"dryRun": false}'
   ```

3. **ダッシュボードで確認**
   - URL: http://localhost:4100/iyasaka/admin/geo
   - `error`, `attempts`, `model` カラムを確認

### 今後の改善候補

1. **プロンプト最適化**
   - JSON Schema による厳密な型定義
   - 入力要約による トークン削減

2. **並列実行の制御**
   - `p-limit` によるRPM制限内での並列実行

3. **Cron分散実行**
   - 1日4回（6時間おき）に分割実行
   - 例: 06:30, 10:30, 14:30, 18:30 JST

4. **コスト監視**
   - トークン使用量のログ記録
   - 日次/月次コストレポート

---

## 📝 変更ファイル一覧

1. `/server/api/geo/snapshot.post.ts`
   - `callGeoJudgeWithRetry()` 関数追加
   - `getBackoffDelay()` 関数追加
   - `isRetryableError()` 関数追加
   - `extractRetryAfter()` 関数追加
   - モデルフォールバック実装
   - 失敗理由の記録

2. `/server/api/geo/metrics.get.ts`
   - `error`, `attempts`, `model` カラム追加

3. `/.env`
   - GEO制限設定の環境変数追加

4. `/nuxt.config.ts`
   - `geo.maxRetries` 設定追加

---

## 🎉 実装完了

すべての再発防止策が実装され、課金化後は安定して動作する準備が整いました！

















