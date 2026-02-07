<script setup lang="ts">
/**
 * IYASAKA FAQページ
 * AIEO対応: FAQPageスキーマ出力
 */
import { products } from '~/app/data/products'
import { breadcrumbLd } from '~/app/utils/ld'

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
const breadcrumb = breadcrumbLd([
  { name: 'ホーム', path: '/' },
  { name: 'よくある質問', path: '/faq' }
])

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
      innerHTML: JSON.stringify(breadcrumb)
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
                <span class="text-akatsuki group-open:rotate-180 transition-transform flex-shrink-0">
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
