# AIEO対応実装プロンプト

> **実装担当AI向け指示書**
> 
> このプロンプトに従って、IYASAKAサイトのAIEO（AI Engine Optimization）対応を完了させてください。

---

## 📋 実装タスク一覧

| # | タスク | 対象ファイル | 優先度 |
|---|--------|-------------|--------|
| 1 | FAQページ作成 | `pages/faq.vue` | 🔴 高 |
| 2 | BreadcrumbList ユーティリティ追加 | `app/utils/ld.ts` | 🔴 高 |
| 3 | LocalBusiness スキーマ追加 | `app/utils/ld.ts` | 🔴 高 |
| 4 | 会社概要ページにLocalBusiness適用 | `pages/company/index.vue` | 🟡 中 |
| 5 | 全ページにBreadcrumbList適用 | 各ページ | 🟡 中 |

---

## 📖 参照ドキュメント

実装前に必ず以下を確認してください：

1. **AIEO仕様書**: `docs/ssot/AIEO_REQUIREMENTS_SPEC.md`
2. **HP SaaS仕様書**: `docs/ssot/HP_SAAS_MASTER_SPEC.md`（FAQページタイプ定義）
3. **既存LD実装**: `app/utils/ld.ts`
4. **製品データ**: `app/data/products.ts`（FAQ含む）
5. **会社データ**: `app/data/team.ts`（companyInfo）
6. **ブランドデータ**: `app/data/brand.ts`

---

## 1. FAQページ作成

### ファイル: `pages/faq.vue`

### 要件

1. **全製品のFAQを集約表示**
   - `app/data/products.ts` から全製品のFAQを取得
   - カテゴリ（製品）ごとにグループ化

2. **AIEO仕様準拠**
   - JSON-LD（FAQPage）を`<head>`に出力
   - `<time datetime>` で更新日を明示
   - 短い回答（100文字以内）を優先表示

3. **セマンティクスHTML**
   - `<main>`, `<section>`, `<article>` を適切に使用
   - 見出しレベル（h1→h2→h3）を正しく守る

4. **デザイン**
   - 既存のTailwindクラスを使用
   - アコーディオン形式（クリックで詳細表示）
   - モバイルフレンドリー

### 実装コード例

```vue
<script setup lang="ts">
/**
 * IYASAKA FAQページ
 * AIEO対応: FAQPageスキーマ出力
 */
import { products, type ProductEntry } from '~/app/data/products'

// 全製品のFAQを集約
const allFaqs = computed(() => {
  const faqs: Array<{
    productId: string
    productName: string
    question: string
    answer: string
  }> = []
  
  for (const product of products) {
    if (!product.faq) continue
    for (const faq of product.faq) {
      faqs.push({
        productId: product.id,
        productName: product.name,
        question: faq.q,
        answer: faq.a
      })
    }
  }
  
  return faqs
})

// 製品ごとにグループ化
const faqsByProduct = computed(() => {
  const grouped: Record<string, typeof allFaqs.value> = {}
  for (const faq of allFaqs.value) {
    if (!grouped[faq.productName]) {
      grouped[faq.productName] = []
    }
    grouped[faq.productName].push(faq)
  }
  return grouped
})

// JSON-LD（FAQPage）
const faqJsonLd = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: allFaqs.value.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
}))

// パンくずリスト JSON-LD
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'ホーム',
      item: 'https://iyasaka.co.jp/iyasaka/'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'よくある質問',
      item: 'https://iyasaka.co.jp/iyasaka/faq'
    }
  ]
}

// 更新日（最新の製品更新日を使用）
const lastUpdated = '2026-01-16'

useHead({
  title: 'よくある質問（FAQ） | IYASAKA',
  meta: [
    { name: 'description', content: 'IYASAKAのサービスに関するよくある質問をまとめました。ミエルプラス、弱電プラス、OmotenasuAI、配信プラス、AIプラスについてのご質問にお答えします。' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(faqJsonLd.value)
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumbJsonLd)
    }
  ]
})
</script>

<template>
  <main class="min-h-screen bg-washi">
    <!-- パンくずリスト -->
    <nav aria-label="パンくずリスト" class="max-w-4xl mx-auto px-4 pt-8">
      <ol class="flex items-center gap-2 text-sm text-ash">
        <li>
          <NuxtLink to="/" class="hover:text-akatsuki">ホーム</NuxtLink>
        </li>
        <li>/</li>
        <li class="text-deep-sumi">よくある質問</li>
      </ol>
    </nav>

    <!-- ヘッダー -->
    <header class="max-w-4xl mx-auto px-4 py-12 text-center">
      <h1 class="text-3xl md:text-4xl font-bold text-deep-sumi mb-4">
        よくある質問（FAQ）
      </h1>
      <p class="text-sumi/80">
        IYASAKAのサービスに関するよくある質問をまとめました
      </p>
      <p class="text-sm text-ash mt-4">
        最終更新: <time :datetime="lastUpdated">{{ lastUpdated }}</time>
      </p>
    </header>

    <!-- FAQ一覧 -->
    <section class="max-w-4xl mx-auto px-4 pb-20">
      <div v-for="(faqs, productName) in faqsByProduct" :key="productName" class="mb-12">
        <h2 class="text-xl font-bold text-deep-sumi mb-6 border-b-2 border-akatsuki pb-2">
          {{ productName }}
        </h2>
        
        <div class="space-y-4">
          <article 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="bg-white rounded-xl border border-ash/20 overflow-hidden"
          >
            <details class="group">
              <summary class="flex items-center justify-between p-4 cursor-pointer hover:bg-washi/50 transition-colors">
                <h3 class="font-medium text-deep-sumi pr-4">
                  {{ faq.question }}
                </h3>
                <span class="text-akatsuki group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div class="p-4 pt-0 text-sumi/80 border-t border-ash/10">
                <p>{{ faq.answer }}</p>
              </div>
            </details>
          </article>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-gradient-to-r from-deep-sumi to-sumi py-16">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-2xl font-bold text-white mb-4">
          お探しの答えが見つかりませんでしたか？
        </h2>
        <p class="text-white/80 mb-8">
          お気軽にお問い合わせください。専門スタッフが丁寧にお答えします。
        </p>
        <NuxtLink 
          to="/contact"
          class="inline-block bg-akatsuki text-white px-8 py-3 rounded-lg font-medium hover:bg-akatsuki/90 transition-colors"
        >
          お問い合わせはこちら
        </NuxtLink>
      </div>
    </section>
  </main>
</template>
```

---

## 2. BreadcrumbList ユーティリティ追加

### ファイル: `app/utils/ld.ts`

### 追加するコード

```typescript
/**
 * パンくずリスト JSON-LD
 * @param items パンくず項目の配列 [{ name, path }]
 * @param siteUrl サイトURL
 */
export const breadcrumbLd = (
  items: Array<{ name: string; path: string }>,
  siteUrl: string = 'https://iyasaka.co.jp'
) => {
  const baseURL = '/iyasaka'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${baseURL}${item.path}`
    }))
  }
}
```

### 使用例

```typescript
// 製品ページでの使用
const breadcrumb = breadcrumbLd([
  { name: 'ホーム', path: '/' },
  { name: 'ソリューション', path: '/products' },
  { name: 'ミエルプラス', path: '/products/mieru-plus' }
])

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumb)
    }
  ]
})
```

---

## 3. LocalBusiness スキーマ追加

### ファイル: `app/utils/ld.ts`

### 追加するコード

```typescript
import { companyInfo } from '@/app/data/team'
import { brand } from '@/app/data/brand'

/**
 * LocalBusiness JSON-LD
 * 会社概要ページ用
 */
export const localBusinessLd = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${brand.siteUrl}/#organization`,
    name: companyInfo.name,
    alternateName: brand.brandAliases,
    description: 'IYASAKAは、中小企業のDX支援を専門とする会社です。弱電×AI×ホテルDXを横断し、予防保全で"止まる前"に手を打つ統括パートナーです。',
    url: brand.siteUrl,
    telephone: brand.tel,
    foundingDate: '2006-04-26',
    founder: {
      '@type': 'Person',
      name: companyInfo.representative
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: brand.address.country,
      postalCode: brand.address.postalCode,
      addressRegion: brand.address.region,
      addressLocality: brand.address.locality,
      streetAddress: brand.address.streetAddress
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 35.9756,  // 春日部市の緯度（概算）
      longitude: 139.7526 // 春日部市の経度（概算）
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00'
    },
    sameAs: [
      // SNSリンクがあれば追加
    ],
    priceRange: '$$'
  }
}
```

---

## 4. 会社概要ページにLocalBusiness適用

### ファイル: `pages/company/index.vue`

### 変更内容

`<script setup>` 内に以下を追加：

```typescript
import { localBusinessLd, breadcrumbLd } from '~/app/utils/ld'

// LocalBusiness JSON-LD
const businessLd = localBusinessLd()

// パンくずリスト JSON-LD
const breadcrumb = breadcrumbLd([
  { name: 'ホーム', path: '/' },
  { name: '会社概要', path: '/company' }
])

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(businessLd)
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumb)
    }
  ]
})
```

---

## 5. 全ページにBreadcrumbList適用

### 対象ページと実装

| ページ | パンくず |
|--------|---------|
| `/` | なし（トップページ） |
| `/products/[slug]` | ホーム → ソリューション → {製品名} |
| `/cases` | ホーム → 導入事例 |
| `/cases/[slug]` | ホーム → 導入事例 → {事例名} |
| `/company` | ホーム → 会社概要 |
| `/company/story` | ホーム → 会社概要 → ストーリー |
| `/contact` | ホーム → お問い合わせ |
| `/faq` | ホーム → よくある質問 |
| `/news` | ホーム → お知らせ |
| `/news/[slug]` | ホーム → お知らせ → {記事名} |
| `/legal/*` | ホーム → {ページ名} |

### 製品ページ例: `pages/products/[slug].vue`

```typescript
import { breadcrumbLd, productLd, faqLdFromProduct } from '~/app/utils/ld'

// ... 既存のproduct取得ロジック

const breadcrumb = computed(() => breadcrumbLd([
  { name: 'ホーム', path: '/' },
  { name: 'ソリューション', path: '/products' },
  { name: product.value?.name || '', path: `/products/${route.params.slug}` }
]))

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumb.value)
    },
    // ... 既存のproductLd, faqLd
  ]
})
```

---

## ✅ 完了チェックリスト

実装後、以下を確認してください：

### 1. ファイル作成・更新

- [ ] `pages/faq.vue` が作成されている
- [ ] `app/utils/ld.ts` に `breadcrumbLd()` が追加されている
- [ ] `app/utils/ld.ts` に `localBusinessLd()` が追加されている
- [ ] `pages/company/index.vue` にLocalBusinessが適用されている

### 2. JSON-LD検証

- [ ] FAQページで `FAQPage` スキーマが出力される
- [ ] 会社概要ページで `LocalBusiness` スキーマが出力される
- [ ] 各ページで `BreadcrumbList` スキーマが出力される

### 3. 動作確認

- [ ] `/faq` ページが正常に表示される
- [ ] アコーディオンが動作する
- [ ] 全製品のFAQが表示される
- [ ] モバイルで正常に表示される

### 4. Rich Results Test

- [ ] https://search.google.com/test/rich-results で検証
- [ ] エラーがないこと
- [ ] 意図したスキーマが検出されること

---

## 📝 注意事項

1. **siteUrl の設定**
   - 本番では `https://iyasaka.co.jp` を使用
   - `brand.ts` の `siteUrl` を更新するか、環境変数 `NUXT_PUBLIC_SITE_URL` を使用

2. **日付の更新**
   - FAQページの `lastUpdated` は手動で管理
   - 将来的にはDB連携で自動化

3. **アクセシビリティ**
   - `<details>/<summary>` はネイティブでキーボード対応
   - `aria-label` を適切に設定

---

*このプロンプトに従って実装を完了させてください。*
