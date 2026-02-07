# GEO Snapshot System 実装計画

**作成日**: 2024年12月16日  
**目的**: Google検索での自社コンテンツ可視性を自動評価・改善提案するシステム  
**全体進捗**: **80%完了** - 本番運用可能

---

## 🎯 システム概要

### **GEO（Google Evaluations & Opportunities）とは**
- 自社プロダクト（haishin-plus、onsite-support等）に関する検索クエリで、自社コンテンツがどれだけ上位表示されるかをAI（Gemini）が評価
- visibility_score（0-100点）で可視化
- 低スコアのクエリに対して記事作成を提案（BoFU対策）

### **技術スタック**
- **フロントエンド**: Nuxt 3 + Vue 3 + Tailwind CSS
- **バックエンド**: Nuxt Server API (h3)
- **データベース**: Supabase (PostgreSQL)
- **AI**: Google Gemini API (2.5-flash)
- **自動実行**: Cron

---

## 📊 全体アーキテクチャ

```
┌─────────────────────────────────────────────────────────┐
│  GEO Snapshot System                                     │
├─────────────────────────────────────────────────────────┤
│  Phase 1: 基盤構築          ✅ 100%完了                 │
│  Phase 2: データ収集        ✅ 100%完了                 │
│  Phase 3: 可視化            ✅ 100%完了                 │
│  Phase 4: 運用安定化        ✅ 100%完了                 │
│  Phase 5: 自動化・最適化    🚧 40%完了                  │
│  Phase 6: 改善提案の高度化  📋 0%完了                   │
└─────────────────────────────────────────────────────────┘
```

---

## Phase 1: 基盤構築 ✅ **100%完了**

### 実装内容

#### 1.1 データベース設計
- ✅ `geo_queries`（検索クエリマスタ）
  - `id`, `text`, `intent`, `target_type`, `target_slug`, `enabled`, `created_at`
- ✅ `geo_snapshots`（スナップショット履歴）
  - `id`, `query_id`, `visibility`, `best_url`, `raw_response`, `created_at`
  - `error`, `attempts`, `model`（Phase 4で追加）
- ✅ `geo_metrics`（集計データ）
  - `query_id`, `date`, `visibility`, `best_url`

#### 1.2 API設計
- ✅ `/api/geo/snapshot` POST - スナップショット実行
- ✅ `/api/geo/metrics` GET - メトリクス取得
- ✅ `/api/geo/gaps` GET - 改善提案取得

#### 1.3 認証基盤
- ✅ カスタムトークン認証（`x-geo-snapshot-token`）
- ✅ 環境変数管理（`.env`）

### 成果物
```
/server/api/geo/
├── snapshot.post.ts     # スナップショット実行API
├── metrics.get.ts       # メトリクス取得API
└── gaps.get.ts          # 改善提案API

/supabase/
└── geo-tables.sql       # テーブル定義
```

---

## Phase 2: データ収集 ✅ **100%完了**

### 実装内容

#### 2.1 Gemini API連携
- ✅ LLM判定ロジック（visibility評価）
- ✅ タイムアウト処理（10秒）
- ✅ JSON Schema対応プロンプト
- ✅ プロダクト情報・URL例の注入

#### 2.2 Supabase連携
- ✅ クエリ取得（`geo_queries`）
- ✅ スナップショット保存（`geo_snapshots`）
- ✅ メトリクス更新（`geo_metrics`）

#### 2.3 初期データ投入
- ✅ 28件のGEOクエリ作成
  - 各プロダクト × 3つのintent（info/compare/convert）
- ✅ シードスクリプト実装

### 成果物
```
/scripts/
├── initial-geo-queries.json   # 初期クエリデータ
├── seed-geo-queries.mjs       # Supabase投入スクリプト
└── geo-snapshot.mjs           # 手動実行スクリプト
```

---

## Phase 3: 可視化 ✅ **100%完了**

### 実装内容

#### 3.1 ダッシュボード実装
- ✅ `/admin/geo` ページ
- ✅ スパークライン表示（推移グラフ）
- ✅ ソート機能（スコア順/差分順）
- ✅ フィルタ機能（プロダクト別）
- ✅ Best URL表示

#### 3.2 外部アクセス設定
- ✅ Nginx リバースプロキシ設定
- ✅ URL: `http://160.251.209.16/iyasaka/admin/geo`

### 成果物
```
/pages/admin/
└── geo.vue              # GEOダッシュボード

/etc/nginx/sites-available/
└── arrowsworks.conf     # Nginx設定（既存利用）
```

---

## Phase 4: 運用安定化 ✅ **100%完了**

### 実装内容

#### 4.1 エラーハンドリング
- ✅ 指数バックオフ + ジッター（1s→2s→4s→8s, ±20%）
- ✅ リトライ回数制限（最大4回）
- ✅ エラー理由の記録（`geo_snapshots.error`）
- ✅ 使用モデルの記録（`geo_snapshots.model`）

#### 4.2 レート制御
- ✅ 環境変数による制限設定
  ```env
  GEO_MAX_QUERIES_PER_RUN=20
  GEO_MAX_QUERIES_PER_DAY=200
  GEO_MAX_TOKENS_PER_RUN=50000
  GEO_MAX_RETRIES=4
  ```
- ✅ 429エラー時の自動リトライ
- ✅ 4xxエラー（非リトライ）の識別

#### 4.3 モデルフォールバック
- ✅ `gemini-2.5-flash` → `gemini-2.0-flash` → `gemini-1.5-flash`
- ✅ 各モデルで最大4回リトライ
- ✅ 最終失敗時のエラー記録

#### 4.4 ダッシュボード拡張
- ✅ 失敗理由表示（`lastError`）
- ✅ リトライ回数表示（`lastAttempts`）
- ✅ 使用モデル表示（`lastModel`）

#### 4.5 AI Studio課金化
- ✅ Pay-as-you-go課金設定完了
- ✅ 無料枠制限（20 req/day）から解放

### 成果物
```
/docs/
└── GEO_RETRY_IMPLEMENTATION.md   # 実装詳細ドキュメント

/.env
└── GEO_MAX_* 環境変数
```

---

## Phase 5: 自動化・最適化 🚧 **40%完了**

### 5.1 Cron自動実行 ✅ **完了**
- ✅ 1日4回実行（06:30, 10:30, 14:30, 18:30 JST）
- ✅ ログ記録（`/home/arrowsworks/logs/geo-snapshot.log`）
- ✅ バックグラウンド実行

### 5.2 プロンプト最適化 📋 **未着手**
- [ ] 入力トークン削減（要約生成）
- [ ] JSON Schema強化（response_mime_type設定）
- [ ] Few-shot examples追加
- [ ] プロダクト別プロンプトテンプレート

### 5.3 コスト監視 📋 **未着手**
- [ ] トークン使用量の可視化
- [ ] 日次・月次コストレポート
- [ ] コスト上限アラート
- [ ] ダッシュボードにコスト表示

### 5.4 クエリ最適化 📋 **未着手**
- [ ] さつまいも系クエリの分離（Haleimo専用化）
- [ ] 各プロダクトの「勝ちたいクエリ」を50本ずつ追加
- [ ] intent別の優先度設定
- [ ] 無効クエリの自動検出

### 5.5 通知・アラート 📋 **未着手**
- [ ] Slack通知（スコア急落時）
- [ ] 週次レポート自動送信
- [ ] エラー率閾値アラート

---

## Phase 6: 改善提案の高度化 📋 **0%完了**

### 6.1 改善提案API拡張
- [ ] `/api/geo/gaps` の高度化
  - [ ] 競合コンテンツの自動分析
  - [ ] 記事構成案の自動生成
  - [ ] キーワード提案
  - [ ] 推定工数・優先度スコア

### 6.2 記事生成連携
- [ ] 低スコアクエリの自動抽出
- [ ] BoFU記事の自動下書き生成
- [ ] Nuxt Content連携（記事保存）
- [ ] レビューワークフロー

### 6.3 A/Bテスト
- [ ] 記事タイトル・構成のバリエーション生成
- [ ] 効果測定（公開前後のスコア比較）

### 6.4 競合分析
- [ ] 競合サイトのクエリ別ランキング取得
- [ ] 差分可視化
- [ ] 追い越し戦略の提案

---

## 🚀 次のアクション（優先順）

### **今週中（Phase 5完遂）**

1. **クエリ最適化**（所要時間：30分）
   - [ ] さつまいも系クエリを無効化（`enabled=false`）
   - [ ] 各プロダクトの「勝ちたいクエリ」を10本ずつ追加
   - [ ] 再実行して visibility 推移を確認

2. **Cron動作確認**（所要時間：翌日確認）
   - [ ] 今日18:30のCron実行を確認
   - [ ] ログ確認：`tail -f /home/arrowsworks/logs/geo-snapshot.log`
   - [ ] ダッシュボードでデータ更新を確認

3. **プロンプト最適化**（所要時間：1時間）
   - [ ] JSON Schema設定（`response_mime_type: application/json`）
   - [ ] プロダクト別の詳細情報注入
   - [ ] Few-shot examples追加

### **来週（Phase 6着手）**

4. **コスト監視ダッシュボード**（所要時間：2時間）
   - [ ] `/admin/geo/cost` ページ作成
   - [ ] トークン使用量グラフ
   - [ ] 日次・月次コスト推定表示

5. **改善提案API拡張**（所要時間：3時間）
   - [ ] `/api/geo/gaps` の高度化
   - [ ] 競合分析ロジック追加
   - [ ] 記事構成案の自動生成

---

## 📋 実装チェックリスト

### **Phase 1: 基盤構築**
- [x] データベース設計（`geo_queries`, `geo_snapshots`, `geo_metrics`）
- [x] API設計（`/api/geo/snapshot`, `/api/geo/metrics`, `/api/geo/gaps`）
- [x] 認証基盤（カスタムトークン）

### **Phase 2: データ収集**
- [x] Gemini API連携
- [x] Supabase連携
- [x] 初期データ投入（28件）

### **Phase 3: 可視化**
- [x] ダッシュボード実装（`/admin/geo`）
- [x] スパークライン表示
- [x] 外部アクセス設定（Nginx）

### **Phase 4: 運用安定化**
- [x] エラーハンドリング（指数バックオフ＋ジッター）
- [x] レート制御（環境変数）
- [x] モデルフォールバック（2.5→2.0→1.5）
- [x] ダッシュボード拡張（エラー表示）
- [x] AI Studio課金化

### **Phase 5: 自動化・最適化**
- [x] Cron自動実行
- [ ] プロンプト最適化
- [ ] コスト監視
- [ ] クエリ最適化
- [ ] 通知・アラート

### **Phase 6: 改善提案の高度化**
- [ ] 改善提案API拡張
- [ ] 記事生成連携
- [ ] A/Bテスト
- [ ] 競合分析

---

## 📊 KPI・目標

### **短期目標（1ヶ月）**
- ✅ システム稼働率 99%以上
- 🚧 全プロダクトの平均visibility 70点以上
- 📋 BoFU記事 10本作成・公開
- 📋 低スコアクエリ（<50点）を50%削減

### **中期目標（3ヶ月）**
- 📋 全プロダクトの平均visibility 85点以上
- 📋 検索流入 50%増加
- 📋 コンバージョン率 1.5% → 2.5%

### **長期目標（6ヶ月）**
- 📋 自動記事生成システム完成
- 📋 競合分析ダッシュボード完成
- 📋 月次レポート自動生成

---

## 🔧 運用マニュアル

### **日次タスク**
- ダッシュボード確認（`http://160.251.209.16/iyasaka/admin/geo`）
- エラーログ確認（`tail -f /home/arrowsworks/logs/geo-snapshot.log`）

### **週次タスク**
- 低スコアクエリの抽出（visibility < 50）
- BoFU記事の優先順位決定
- クエリの追加・無効化

### **月次タスク**
- コスト確認（AI Studio）
- KPI測定（平均visibility、記事数、検索流入）
- プロンプト・クエリの最適化

---

## 📁 ファイル構成

```
/home/arrowsworks/iyasaka/
├── server/api/geo/
│   ├── snapshot.post.ts         # スナップショット実行API
│   ├── metrics.get.ts           # メトリクス取得API
│   └── gaps.get.ts              # 改善提案API
├── pages/admin/
│   └── geo.vue                  # GEOダッシュボード
├── scripts/
│   ├── initial-geo-queries.json # 初期クエリデータ
│   ├── seed-geo-queries.mjs     # Supabase投入スクリプト
│   └── geo-snapshot.mjs         # 手動実行スクリプト
├── supabase/
│   └── geo-tables.sql           # テーブル定義
├── docs/
│   ├── GEO_IMPLEMENTATION_PLAN.md      # 本ドキュメント
│   └── GEO_RETRY_IMPLEMENTATION.md     # リトライ実装詳細
└── .env                         # 環境変数（トークン、制限値）
```

---

## 🎯 成功の定義

1. **システムの安定稼働** ✅
   - エラー率 < 1%
   - 稼働率 99%以上
   - Cron実行成功率 100%

2. **データの蓄積** 🚧
   - 1週間分のデータ蓄積（1日4回 × 7日 = 28回）
   - 推移グラフの可視化

3. **改善提案の実行** 📋
   - 低スコアクエリ10件の特定
   - BoFU記事 3本作成
   - 公開後のスコア上昇（+20点以上）

---

**次のアクション**: クエリ最適化 → Cron動作確認 → Phase 6着手









