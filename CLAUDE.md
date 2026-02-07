# IYASAKA プロジェクト CLAUDE.md

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

| ❌ 避ける | ⭕ 推奨 |
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

## Git ワークフロー

- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- mainへの直接コミット禁止
- PRには必ずレビュー
- マージ前にテストパス必須

## 農業ビジョンの扱い

⚠️ **制約**: 農業は現在のサービスに含めない

- 「未来の展望」「究極の循環」として言及のみ
- AboutやVisionセクションで静かに提示

---

**Remember**: IYASAKAは「技術の押し売り」ではなく「現場の痛みに寄り添うパートナー」です。すべての実装において、現場視点を忘れないこと。
