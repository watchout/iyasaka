# IYASAKA Web システム概要 SSOT（Single Source of Truth）

このドキュメントは、IYASAKA 公式サイト開発の「入り口」となる **全体像SSOT** です。  
誰が見ても「何の開発をしているのか」「どの技術・どの機能が関係しているのか」が分かることを目的とします。

---

## 1. プロジェクト概要

- **プロジェクト名**: IYASAKA Web（コーポレート＋リード獲得サイト）
- **目的**:
  - 弱電×AI×ホテルDXを軸にした「統括パートナー」としての世界観を伝える。
  - 配信プラス等のサービスLPから **BtoBリード（問い合わせ／資料DL）を獲得** する。
  - 記事（コンテンツ）とLPをつなぎ、検索・SNS・noteなどからの流入を線で管理する。
- **主要KPI（暫定）**:
  - 記事→LP CTR: ≥ 2.0%
  - LP→送信 CVR: 1.0–2.5%
  - DLゲート CVR: 5–15%
  - 有効リード: ローンチ週に ≥ 1

---

## 2. 技術スタック / アーキテクチャ

- **フロントエンド / アプリ**: Nuxt 3（Vue 3）
- **コンテンツ管理**:
  - 記事: `@nuxt/content` + `content/articles/*.md`（Markdown）
  - プロダクト: `app/data/products.ts`（TypeScript定義）
- **スタイル / UI**:
  - Tailwind CSS
  - `components/Header.vue`, `Footer.vue`, `LeadForm.vue` など
- **リード保存**:
  - API: `server/api/leads.post.ts`
  - ストレージ: Supabase（PostgreSQL）
  - 開発用ダミー保存: `.data/leads.ndjson`（`LEADS_PERSIST=dummy` のとき）
- **計測**:
  - Plausible Analytics  
  - イベント例: `lead_submit`, `download_click`, `article_related_product_click`, `product_related_article_click`
- **ルーティング / URL**:
  - baseURL: `/iyasaka/`
  - 主要パス:
    - トップ: `/iyasaka/`
    - 製品LP: `/iyasaka/products/<slug>`
    - 記事: `/iyasaka/articles/<slug>`
    - お問い合わせ: `/iyasaka/contact`
    - 資料DL: `/iyasaka/downloads`

---

## 3. 機能ドメインと対応SSOT

### 3.1 レイアウト / ナビゲーション

- **SSOT**: `docs/ssot/B1-layout.md`
- **関連コード**:
  - `layouts/default.vue`, `layouts/minimal.vue`
  - `components/Header.vue`, `HeaderNav.vue`, `Footer.vue`, `FooterCta.vue`

### 3.2 コンテンツ（記事 / LP）

- **記事SSOT**:
  - スキーマ: `content.config.ts`（`articles` コレクションのschema）
  - 型: `app/types/content.ts` (`ContentArticle`)
- **LP SSOT**:
  - プロダクト定義: `app/data/products.ts`
  - LPテンプレート: `pages/products/[slug].vue`

### 3.3 リード / フォーム

- **SSOT候補**:（今後必要に応じて詳細化）
  - API仕様: `server/api/leads.post.ts`
  - 型: `app/types/leads.ts`
  - UI: `components/LeadForm.vue`

### 3.4 SEO / AIEO / 計測

- **共通ヘッド／JSON-LD**:
  - `app/utils/seo.ts`（`buildSeo`）
  - `app/utils/ld.ts`（`articleLd`）
- **計測イベント定義**:
  - `app/data/analytics.ts`
- **サイトマップ／robots**:
  - `server/routes/sitemap.xml.ts`
  - `server/routes/robots.txt.ts`

### 3.5 運用 / プロセス

- **バックログSSOT**:
  - `docs/ops/iyasaka-backlog.md`（Now/Next/Later/Done）
- **リリースチェックリスト**:
  - `docs/ops/iyasaka-release-checklist.md`
- **note運用ルール**:
  - `docs/note/summary-template.md`
  - `docs/ops-content-guideline.md`

---

## 4. 機能ごとのSSOT運用方針

1. **新しい機能を検討する時**  
   - まず `docs/ops/iyasaka-backlog.md` にエピックを追加し、`status: proposed` で登録する。
2. **機能の仕様が固まった時**  
   - 関連するSSOTドキュメント（例: レイアウトなら `B1-layout.md`、SEOなら `seo.ts` 節）に追記し、「正本」を更新する。
3. **実装を始める時**  
   - Backlogの該当IDを `in_progress` にし、PRやコミットメッセージでIDを参照する。
4. **実装完了 / リリース時**  
   - Backlogのステータスを `done` にし、必要であれば overview（本ドキュメント）の関連節にリンクを追加する。

このフローにより、「何の開発か」は本ドキュメント（overview）が入口となり、  
詳細仕様は各ドメインごとのSSOT（レイアウト／コンテンツ／リード／SEOなど）に集約されます。






