# HP v2 ディレクトリ構成（確定版）

バージョン: 1.0.0
作成日: 2026-04-02
ステータス: CEO承認済み

## 方針

- 現行HP(v1)と新HP(v2)を同一Nuxt 3プロジェクト内で共存
- 環境変数 `HP_VERSION` で切り替え（v1 / v2）
- v2開発中もv1が本番で動き続ける
- 切り替えは1秒（環境変数変更 + PM2再起動）

## 技術決定

| 項目 | 決定 |
|------|------|
| フレームワーク | Nuxt 3（現行維持、Next.jsへの移行なし） |
| デプロイ先 | ConoHa VPS（現行維持、Vercelへの移行なし） |
| AIチャット | Anthropic Claude Sonnet API直接呼び出し |
| ブログ | Nuxt Content モジュール |
| 画像 | Midjourney生成 → public/に配置 |

## ディレクトリ構成

```
iyasaka/
├── pages/
│   ├── index.vue                  ← ルーター（HP_VERSIONでv1/v2切り替え）
│   │
│   ├── v1/                        ← 現行HP（既存コードを移動）
│   │   └── index.vue              ← 現行トップページ
│   │
│   ├── v2/                        ← 新HP（街ビュー）
│   │   ├── index.vue              ← 街全体ビュー（ヒーロー + 5街区）
│   │   ├── hotel.vue              ← ホテル街区
│   │   ├── infra.vue              ← 弱電街区
│   │   ├── venue.vue              ← 配信街区
│   │   ├── genba.vue              ← 現場DX街区
│   │   └── ai.vue                 ← AI街区
│   │
│   ├── blog/                      ← NEW: ブログ
│   │   ├── index.vue              ← ブログ一覧
│   │   └── [slug].vue             ← 個別記事
│   │
│   ├── hotel/index.vue            ← 既存（v2移行後はv2/hotel.vueへリダイレクト）
│   ├── infra/index.vue            ← 既存（同上）
│   ├── venue/index.vue            ← 既存（同上）
│   ├── genba/index.vue            ← 既存（同上）
│   ├── aiplus/                    ← 既存LP維持・改善
│   ├── company/                   ← 既存修正
│   ├── contact/                   ← 既存（項目削減）
│   └── about.vue                  ← 既存修正
│
├── components/
│   ├── v2/                        ← NEW: v2専用コンポーネント
│   │   ├── VoxelHero.vue          ← ヒーロー（街全景 + テキスト入力欄）
│   │   ├── District.vue           ← 街区テンプレート（共通）
│   │   ├── DistrictImage.vue      ← 画像4パターンランダム表示
│   │   ├── DistrictNews.vue       ← 業界xAIニュースダイジェスト
│   │   ├── AiChat.vue             ← チャットパネル（サイド/フルスクリーン）
│   │   ├── AiChatMessage.vue      ← チャット吹き出し
│   │   ├── DistrictNav.vue        ← 街区ショートカットボタン
│   │   └── Ending.vue             ← エンディングCTA
│   │
│   ├── home/                      ← 既存v1コンポーネント（維持）
│   ├── ui/                        ← 既存共通UI（v1/v2共用）
│   ├── Header.vue                 ← 既存（v2でも共用）
│   ├── Footer.vue                 ← 既存（フッター文言修正）
│   └── ContactForm.vue            ← 既存（項目削減）
│
├── server/api/
│   ├── chat/                      ← NEW: AIチャットAPI
│   │   └── [district].post.ts     ← 街区別チャットエンドポイント
│   ├── news/                      ← NEW: ニュース取得API
│   │   └── [district].get.ts      ← 街区別ニュースダイジェスト
│   ├── blog/                      ← NEW: ブログAPI
│   │   └── generate.post.ts       ← ブログ記事生成
│   └── (既存API維持)
│
├── app/data/
│   ├── districts.ts               ← NEW: 5街区マスターデータ
│   ├── chat-prompts.ts            ← NEW: 街区別システムプロンプト
│   └── (既存データ維持)
│
├── composables/
│   ├── useAiChat.ts               ← NEW: チャット状態管理
│   ├── useDistrictNews.ts         ← NEW: ニュース取得
│   ├── useImageRotation.ts        ← NEW: 画像パターン管理 + A/B計測
│   └── (既存コンポーザブル維持)
│
├── content/blog/                  ← NEW: ブログ記事（Nuxt Content）
│   └── *.md
│
├── public/images/districts/       ← NEW: ボクセルアート画像
│   ├── hotel/pattern-{1-4}.webp
│   ├── infra/pattern-{1-4}.webp
│   ├── venue/pattern-{1-4}.webp
│   ├── genba/pattern-{1-4}.webp
│   └── ai/pattern-{1-4}.webp
│
└── docs/
    ├── hp-v2-concept.md           ← 仕様書（保存済み）
    └── hp-v2-directory.md         ← 本ドキュメント
```

## 切り替えメカニズム

### pages/index.vue（ルーター）

```vue
<script setup lang="ts">
const hpVersion = useRuntimeConfig().public.hpVersion || 'v1'
</script>

<template>
  <V1Index v-if="hpVersion === 'v1'" />
  <V2Index v-else />
</template>
```

### nuxt.config.ts

```ts
runtimeConfig: {
  public: {
    hpVersion: process.env.HP_VERSION || 'v1'
  }
}
```

### .env

```bash
# v1（現行）で運用中
HP_VERSION=v1

# v2に切り替える時
# HP_VERSION=v2
```

### 切り替え手順

```bash
# ConoHa VPSで:
sed -i 's/HP_VERSION=v1/HP_VERSION=v2/' .env
pm2 restart iyasaka-nuxt

# 戻す場合:
sed -i 's/HP_VERSION=v2/HP_VERSION=v1/' .env
pm2 restart iyasaka-nuxt
```

## 街区ページのURL戦略

v2移行時、既存URL(/hotel, /infra等)は維持する:

### v1運用時
- `/hotel` → 現行 `pages/hotel/index.vue`

### v2運用時
- `/hotel` → `pages/hotel/index.vue` が v2版にリダイレクト or v2コンテンツを表示

実装方法: pages/hotel/index.vue内でも HP_VERSION を参照し、v2の場合は街区コンポーネントを表示。

## リダイレクト（v2本番化時）

```
/products/ai-plus → /aiplus（301）
/diagnosis → /aiplus/shindan（301）
/products/* → 各街区ページへ（301）
```
