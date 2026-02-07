# IYASAKA Web 開発バックログ（T3〜T5以降）

このドキュメントは、IYASAKA 公式サイト（Nuxt 3）の**機能バックログと優先度**を一元管理するためのものです。
Plane 等のツールを導入するまでは、このファイルを「ソース・オブ・トゥルース」として扱います。

---

## ルール（必ず守ること）

- **機能追加・改修のアイデアは、まずここにID付きで追記する。**
- 「実装するかどうか未確定」のものも、`status: proposed` でここに残す。
- 実装を始めるときは `status` を `in_progress` に、完了したら `done` に更新する。
- 大きな話（エピック）は **Now / Next / Later** のいずれかに必ず分類する。

ステータスの意味:

- `done`        : 実装・リリース済み
- `in_progress` : 実装中
- `planned`     : 実装予定（合意済み）
- `proposed`    : 提案中（まだ優先度未決）

---

## 1. Now（すぐ着手〜近日中に見るべきもの）

### [NOW-001] T3〜T5 ソフトローンチ後の観測・初回チューニング

- **status**: planned  
- **概要**:
  - 既に実装済みの T3〜T5 を本番ソフトローンチし、初週の数字を見て最初のチューニングを行う。
- **期待するアウトカム**:
  - 記事→LP CTR, LP→送信 CVR, DL CVR, 有効リード件数（初週≥1）の実測値が取れる。
  - どの記事・どのLPが効いているかの感覚値が掴める。
- **主な作業**:
  - 本番 ENV セット（`LEADS_PERSIST` 未設定, Supabase/Slack 設定）。
  - `/api/health/supabase` / `/iyasaka/sitemap.xml` / `robots.txt` / DLヘッダ確認。
  - Plausible Goals 4種設定＋Realtimeでのイベント着弾確認。
  - 初週の数字に基づき、下の NOW-002〜004 の優先度を再確認。

### [NOW-002] 配信プラスLPへの事例2本追加（写真＋Before/After＋数値KPI）

- **status**: planned  
- **概要**:
  - `/iyasaka/products/haishin-plus` に、具体的な導入事例ブロックを2本追加する。
- **期待するアウトカム**:
  - LP内の「信頼・具体性」が上がり、LP→送信 CVR の向上が見込める。
- **実装の方向性メモ**:
  - `app/data/products.ts` の `haishin-plus` に `cases` 相当のフィールドを追加するか、
  - もしくは `components` 下に事例専用コンポーネントを置き、LPテンプレート側で組み込む。

### [NOW-003] 記事テンプレに「冒頭100–140字の要約」フィールド追加

- **status**: planned  
- **概要**:
  - `content/articles/*.md` の frontmatter に `summary` などのフィールドを追加し、
  - 記事一覧やOGP、note要約テンプレで流用できるようにする。
- **期待するアウトカム**:
  - 検索結果・SNSシェア・note からの導線でCTRが上がる。
- **実装の方向性メモ**:
  - `content.config.ts` の schema に `summary?: string` を追加。
  - 記事ページ・一覧・OGP生成ロジックで optional に参照。

### [NOW-004] DLマグネット2本目（オンサイト保守チェックリスト）の追加とAB計測

- **status**: planned  
- **概要**:
  - `/iyasaka/downloads` に「オンサイト保守チェックリスト」PDFを追加し、
  - 既存のDLと source を分けてAB観測する。
- **期待するアウトカム**:
  - DLゲート全体のCVR向上、どのマグネットがリードに効いているかの判別。
- **実装の方向性メモ**:
  - 現行DLフォームの `source` / `assetPath` をパラメータ化し、2種のDLボタン＋計測を実装。

---

## 2. Next（次のサイクルで検討・着手するもの）

### [NEXT-001] Lead保存のアダプタ分離（saveLead 抽象化）

- **status**: proposed  
- **概要**:
  - `/api/leads` 内の Supabase 直書きを、`saveLead()` アダプタ経由に変更し、
  - 将来のCRM連携・別ストレージ（例: HubSpot, Salesforce）への切り替えをしやすくする。
- **期待するアウトカム**:
  - リード保存先を変えるときに `/api/leads` をほぼ触らずに済む。
- **実装の方向性メモ**:
  - `server/adapters/leads/index.ts` に `saveLead(payload, ctx)` を定義。
  - `LEADS_PERSIST` の値（`supabase` / `dummy` / 将来の `crm` など）で内部実装を切り替える。

### [NEXT-002] Supabase leads テーブルのINDEX追加と運用ルール明文化

- **status**: proposed  
- **概要**:
  - `leads(email, created_at)` 複合INDEX追加など、読み取りパフォーマンスとレートリミット判定を安定化。
  - 「APIはサーバ側のみ利用／クライアントから直接叩かない」方針を docs に明文化。
- **期待するアウトカム**:
  - リード数が増えてもレスポンスが安定し、将来のRLS導入にも備えられる。

---

## 3. Later（やる可能性はあるが、現時点では優先度低）

### [LATER-001] 管理UI（簡易CMS/ダッシュボード）の検討

- **status**: proposed  
- **概要**:
  - `content/articles/*.md` や `products.ts` を、非エンジニアでも扱えるようにする管理画面。
- **メモ**:
  - まずは Markdown + Git 運用で回してみて、本当に必要になってから設計する。

### [LATER-002] note 連携の半自動化

- **status**: proposed  
- **概要**:
  - 自社記事の frontmatter（title/summary/url）から note 用のドラフトを自動生成する仕組み。
- **メモ**:
  - 実装コストと運用メリットを見てから優先度を再評価。

---

## 4. Done（完了した主なエピック／里程標）

### [DONE-001] T3：記事⇄LP 自動連携＋計測（最小・堅牢）

- 記事 frontmatter 標準化（`primaryProduct` / `relatedProducts` / `publishedAt`）。  
- 記事ページ末尾の「関連するサービス」セクション実装。  
- LP側「この製品に関する読み物」ブロック実装。  
- `article_related_product_click` / `product_related_article_click` イベント実装。

### [DONE-002] T4：SEO/AIEO 基盤の仕上げ

- `buildSeo` / `articleLd` による head/JSON-LD 共通化。  
- canonical の `/iyasaka/` 揃え、sitemap.xml・robots.txt の追加。  
- 記事タイトル一段化（`記事タイトル | IYASAKA`）。

### [DONE-003] T5：note サテライト運用の最低限

- `docs/note/summary-template.md` でnote要約テンプレ整備。  
- `docs/ops-content-guideline.md` で「自社公開→48〜72h後にnote」「canonicalは自社指し」を明文化。






