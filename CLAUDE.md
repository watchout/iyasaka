# IYASAKA プロジェクト CLAUDE.md（v3.4）

IYASAKAは「今ある『不』を、未来の『光』へ。」をミッションとする中小企業DX支援企業の公式サイト＆HP SaaSプロジェクトです。

## プロジェクト概要

| 項目 | 値 |
|------|-----|
| フレームワーク | Nuxt 3 (Vue 3) |
| スタイリング | Tailwind CSS |
| データベース | Supabase (PostgreSQL) |
| ホスティング | VPS (Nginx) |
| 開発ポート | 4100 |
| 本番ドメイン | iyasaka.co |

## 会社ナレッジ参照ルール

> 設計判断・機能提案・マーケティング施策の前に、会社の知識データベースダイジェストを参照する。

```
参照ファイル: docs/knowledge/_company/KNOWLEDGE_DIGEST.md

1. 設計判断・機能提案の前に KNOWLEDGE_DIGEST.md を読み、記載された原則に従う
2. マーケティング関連の判断はダイジェストの原則を根拠にする
3. ダイジェストの原則と矛盾する実装を検出した場合は警告する
4. ダイジェストに記載のない領域の判断が必要な場合は報告する

更新: framework sync-knowledge（または手動で配置）
```

## スキル（専門家チーム）による合議制開発

各フェーズには専門家チームが定義されており、合議制で意思決定を行う。

```
.claude/skills/
├── deliberation/      <- 合議制意思決定プロトコル
├── discovery/         <- Discovery Phase専門家（D1-D4）
├── business/          <- Business Phase専門家（B1-B4）
├── product/           <- Product Phase専門家（P1-P5）
├── technical/         <- Technical Phase専門家（T1-T5）
├── implementation/    <- Implementation Phase専門家（I1-I5）
└── review-council/    <- レビュー評議会（R1-R5）
```

**スキル実行コマンド**:
```
「ディスカバリーを開始して」   -> Discovery Phaseを実行
「ビジネス設計を開始して」     -> Business Phaseを実行
「プロダクト設計を開始して」   -> Product Phaseを実行
「技術設計を開始して」         -> Technical Phaseを実行
「実装を開始して」             -> Implementation Phaseを実行
「レビュー評議会を開催して」   -> Review Councilを実行
```

**個別エージェント実行**:
```
「D1を実行」  -> Idea Excavator
「P4を実行」  -> Feature Spec Writer
「I3を実行」  -> Code Auditor
```

**合議の実行**:
```
「合議して：[議題]」     -> 自動で適切な専門家を選定
「軽量合議：[議題]」     -> DETAIL層の決定（2-3名）
「標準合議：[議題]」     -> CONTRACT層の決定（3-4名）
「重量合議：[議題]」     -> CORE層の決定（全専門家）
```

**合議トリガー（自動）**:
- CORE層の変更提案 -> 重量合議
- CONTRACT層の新規定義 -> 標準合議
- 複数SSOTへの影響 -> 標準合議
- 技術的負債の可能性 -> 軽量合議
- セキュリティ関連 -> 標準合議

詳細: .claude/skills/_INDEX.md 参照

---

## AI中断プロトコル（最優先ルール）

以下の場合、即座に作業を中断しユーザーに質問すること:

1. **T1**: SSOTに記載がない仕様判断が必要な時
2. **T2**: SSOTの記載が曖昧で複数解釈が可能な時
3. **T3**: 技術的な選択肢が複数あり判断できない時
4. **T4**: SSOTと既存実装が矛盾している時
5. **T5**: 制約・規約に未定義のケースに遭遇した時
6. **T6**: 変更の影響範囲が判断できない時
7. **T7**: ビジネス判断が必要な時

「推測で進める」「とりあえず仮で」は禁止。
詳細: docs/standards/21_AI_ESCALATION.md

---

## 重要ルール

### 1. コード構成

- 多くの小さなファイルを少数の大きなファイルより優先
- 高凝集・低結合
- 1ファイルあたり200-400行を目安、最大800行
- 機能/ドメインごとに整理（タイプ別ではなく）

### 2. コードスタイル

- **コードやコメント、ドキュメントに絵文字を使わない**（プロダクトUIを除く）
- **イミュータブル** - オブジェクトや配列を直接変更しない
- 本番コードに console.log を残さない
- try/catch で適切なエラーハンドリング
- Zod でバリデーション

### 3. Vue/Nuxt規約

- `<script setup lang="ts">` を使用
- Composition API で記述
- コンポーザブルで再利用ロジックを抽出
- Piniaで状態管理

### 4. セキュリティ

- シークレットをハードコードしない
- 環境変数で機密データを管理
- 全てのユーザー入力をバリデーション
- パラメータ化クエリのみ使用

## ファイル構造

```
iyasaka/
├── app/
│   ├── data/           # データファイル（products.ts, brand.ts等）
│   └── utils/          # ユーティリティ（ld.ts等）
├── components/         # Vueコンポーネント
├── pages/              # ページ（自動ルーティング）
├── server/api/         # APIルート
├── docs/ssot/          # SSOTドキュメント（必読）
└── public/             # 静的ファイル
```

## 必読SSOTドキュメント

新機能開発前に必ず確認：

1. `docs/ssot/BRAND_MASTER_PROTOCOL.md` - ブランド規約
2. `docs/ssot/BRAND_NARRATIVE.md` - ナラティブOS
3. `docs/ssot/HP_SAAS_MASTER_SPEC.md` - HP SaaS仕様
4. `docs/ssot/AIEO_REQUIREMENTS_SPEC.md` - AIEO要件

### フレームワーク標準（docs/standards/）

```
0. フレームワーク標準     -> docs/standards/
   - マスターガイド       -> docs/standards/00_MASTER_GUIDE.md
   - ツールチェーン定義   -> docs/standards/09_TOOLCHAIN.md
   - SSOT 12セクション形式 -> docs/standards/12_SSOT_FORMAT.md
   - AIエスカレーション    -> docs/standards/21_AI_ESCALATION.md
```

### SSOT 3層と止まらないルール

```
SSOTは3層構造で管理する:
  CORE層（変わりにくい）: 目的、スコープ、ビジネスルール
  CONTRACT層（破壊しない）: API契約、画面I/O、DB主要テーブル
  DETAIL層（変更前提）: エラー文言、バリデーション、UI微調整

仕様がない場合の行動:
  CORE/CONTRACT層が未定義 -> 実装を開始せず、確認を求める
  DETAIL層が未定義 -> デフォルト案で実装し、Decision Backlog に記録
```

## ブランドガイドライン

### デザイントークン

```css
/* Primary: 信頼感のある紺 */
--color-primary: #1a365d;

/* Accent: 夜明けの光 */
--color-accent: #ff9e00;

/* 3つの柱 */
--color-organize: #3182ce;  /* 整える */
--color-connect: #319795;   /* つなぐ */
--color-nurture: #38a169;   /* 育てる */
```

### ライティング

| 避ける | 推奨 |
|----------|--------|
| 技術用語の羅列 | 体温のある言葉 |
| 上から目線 | 現場に寄り添う |
| 冷たい表現 | 「不」→「光」の変換 |

### CTA規格

```
https://iyasaka.co/contact?p_id=[プロダクトID]
```

## 環境変数

```bash
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# Mail (さくらSMTP)
MAIL_HOST=
MAIL_PORT=587
MAIL_USER=
MAIL_PASS=
MAIL_FROM=info@iyasaka.co
MAIL_TO=info@iyasaka.co

# Site
NUXT_PUBLIC_SITE_URL=https://iyasaka.co
```

## 利用可能なコマンド

- `/plan` - 実装計画を作成（確認後に実装）
- `/code-review` - コードレビュー
- `/build-fix` - ビルドエラー修正
- `/tdd` - テスト駆動開発

## 開発コマンド

```bash
# 開発サーバー起動
cd /home/arrowsworks/iyasaka && pnpm run dev

# ビルド
pnpm run build

# 型チェック
pnpm run typecheck
```

## 実装開始前の Pre-Code Gate（3段階チェック）

```
コードを1行でも書く前に、以下の3段階を順番に確認する。
1つでも 未完了 がある段階では、実装を開始してはならない。
```

### Gate A: 開発環境・インフラの準備

```
以下が全て完了しているか:
  [ ] .env が存在し、必要な環境変数が定義されている
  [ ] npm install / pnpm install が成功する
  [ ] Supabase コンテナまたはクラウドに接続できる
  [ ] pnpm run dev でローカル開発サーバーが起動する（port 4100）
  [ ] pnpm run build が成功する

未完了 -> 「開発環境が未セットアップです」と報告し、先に構築する。
```

### Gate B: タスク分解・計画の完了

```
以下が全て完了しているか:
  [ ] 全SSOTの優先度・依存関係を分析済み
  [ ] 依存グラフを構築し、Wave 分類が完了している
  [ ] GitHub Projects ボードが作成されている
  [ ] 各機能の親 Issue が作成されている
  [ ] ブランチ戦略が確認されている:
    - main: 常にデプロイ可能（直接コミット禁止）
    - feature/[機能ID]-[レイヤー]: 機能実装用
    - fix/[機能ID]-[説明]: バグ修正用

未完了 -> 「タスク分解が未実施です」と報告し、先に計画する。
```

### Gate C: SSOT 完全性チェック

```
対象機能の SSOT で以下を確認する:
  [ ] S3-E 入出力例:  5ケース以上（正常2+異常3）が記入されているか
  [ ] S3-F 境界値:    全データ項目の境界パターンが定義されているか
  [ ] S3-G 例外応答:  全エラーケースの応答が定義されているか
  [ ] S3-H Gherkin:   全MUST要件のシナリオが存在するか
  [ ] 完全性チェックリスト: SSOT冒頭のチェックリストが全項目完了か

不足を発見 -> 「S3-E/F/G/H が未記入です。補完が必要です」と報告。
S3-E/F/G/H が空のまま実装を開始することは絶対に禁止。
```

### Gate 通過後の実装フロー

```
Gate A/B/C 全て完了の場合のみ:

1. feature/[機能ID]-[レイヤー] ブランチを作成
2. 標準タスク分解に従い実装:
   Task 1: DB（マイグレーション、シード、インデックス）
   Task 2: API（エンドポイント、バリデーション、エラーハンドリング）
   Task 3: UI（画面、状態管理、フロー）
   Task 4: 結合（API + UI 接続、E2E）
   Task 5: テスト
   Task 6: レビュー + ドキュメント更新
3. PR を作成し、レビューを経て main にマージ
```

---

## Git ワークフロー

- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- mainへの直接コミット禁止
- PRには必ずレビュー
- マージ前にテストパス必須

## 農業ビジョンの扱い

**制約**: 農業は現在のサービスに含めない

- 「未来の展望」「究極の循環」として言及のみ
- AboutやVisionセクションで静かに提示

## 禁止事項

```
- Gate A/B/C を確認せずに実装を開始する <- 最重要
- S3-E/F/G/H が空のまま実装を開始する
- CORE/CONTRACT層の仕様なしで実装を開始する
- main ブランチに直接コミットする
- 仕様書にない機能を勝手に実装
- エラーハンドリングを省略する
- テストを省略する
```

---

**Remember**: IYASAKAは「技術の押し売り」ではなく「現場の痛みに寄り添うパートナー」です。すべての実装において、現場視点を忘れないこと。
