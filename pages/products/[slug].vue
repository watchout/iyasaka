<script setup lang="ts">
/**
 * 製品詳細ページ
 * AIEO対応: BreadcrumbList + Product + FAQPage スキーマ出力
 */
import { getProductBySlug, products } from '@/app/data/products'
import { breadcrumbLd, productLd, faqLdFromProduct } from '~/app/utils/ld'

const route = useRoute()
const slug = route.params.slug as string

const entry = computed(() => getProductBySlug(slug))

// 404処理
if (!entry.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Product not found'
  })
}

// URL
const productUrl = computed(() => `https://iyasaka.co.jp/iyasaka/products/${slug}`)

// パンくずリスト JSON-LD
const breadcrumb = computed(() => breadcrumbLd([
  { name: 'ホーム', path: '/' },
  { name: 'ソリューション', path: '/products' },
  { name: entry.value?.name || '', path: `/products/${slug}` }
]))

// Product JSON-LD
const productSchema = computed(() => entry.value ? productLd(entry.value, productUrl.value) : null)

// FAQ JSON-LD
const faqSchema = computed(() => entry.value ? faqLdFromProduct(entry.value, productUrl.value) : null)

// SEO
useSeoMeta({
  title: () => entry.value ? `${entry.value.name} | IYASAKA` : 'IYASAKA',
  description: () => entry.value?.solution || '',
  ogTitle: () => entry.value ? `${entry.value.name} - ${entry.value.subtitle}` : 'IYASAKA',
  ogDescription: () => entry.value?.solution || ''
})

// 構造化データ
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify(breadcrumb.value))
    },
    ...(productSchema.value ? [{
      type: 'application/ld+json',
      innerHTML: JSON.stringify(productSchema.value)
    }] : []),
    ...(faqSchema.value ? [{
      type: 'application/ld+json',
      innerHTML: JSON.stringify(faqSchema.value)
    }] : [])
  ]
})

// 関連製品
const relatedProducts = computed(() => {
  if (!entry.value) return []
  return products
    .filter(p => p.id !== entry.value!.id && p.homeFeatured)
    .slice(0, 3)
})
</script>

<template>
  <div v-if="entry" class="min-h-screen">
    <!-- Hero -->
    <section class="bg-gradient-to-br from-washi via-washi to-ash/30 py-16 lg:py-24">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl">
          <!-- パンくず -->
          <nav class="mb-6 text-sm text-sumi/60">
            <NuxtLink to="/" class="hover:text-akatsuki">ホーム</NuxtLink>
            <span class="mx-2">/</span>
            <span>{{ entry.name }}</span>
          </nav>
          
          <p class="text-akatsuki font-bold mb-2">{{ entry.subtitle }}</p>
          <h1 class="font-mincho text-4xl md:text-5xl text-sumi mb-6">
            {{ entry.name }}
          </h1>
          <p class="text-xl text-sumi/80 mb-8">
            {{ entry.solution }}
          </p>
          
          <!-- 主要成果 -->
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-akatsuki/10 rounded-lg">
            <span class="text-3xl font-bold text-akatsuki">{{ entry.keyResultValue }}</span>
            <span class="text-sumi">{{ entry.keyResult }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ターゲット・課題 -->
    <section class="py-16 bg-washi">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="font-mincho text-2xl md:text-3xl text-sumi mb-8">
            こんなお悩みはありませんか？
          </h2>
          
          <div class="space-y-4 mb-12">
            <div 
              v-for="(pain, i) in entry.commonPains" 
              :key="i"
              class="flex items-start gap-4 p-4 bg-white rounded-lg shadow-soft"
            >
              <span class="text-akatsuki text-xl">✓</span>
              <p class="text-sumi">{{ pain }}</p>
            </div>
          </div>
          
          <div class="p-6 bg-sumi text-washi rounded-lg">
            <p class="text-sm text-washi/70 mb-2">最も深刻な課題</p>
            <p class="text-xl font-bold">{{ entry.strongestPain }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ソリューション -->
    <section class="py-16 bg-ash/30">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="font-mincho text-2xl md:text-3xl text-sumi mb-8">
            {{ entry.name }}が解決します
          </h2>
          
          <div class="bg-white p-8 rounded-lg shadow-soft mb-8">
            <p class="text-lg text-sumi mb-4">{{ entry.solution }}</p>
            <p v-if="entry.solutionDetail" class="text-sumi/70">
              {{ entry.solutionDetail }}
            </p>
          </div>
          
          <!-- 導入情報 -->
          <div class="grid md:grid-cols-3 gap-6">
            <div class="p-6 bg-white rounded-lg shadow-soft">
              <p class="text-sm text-sumi/60 mb-1">導入期間</p>
              <p class="font-bold text-sumi">{{ entry.timeline }}</p>
            </div>
            <div class="p-6 bg-white rounded-lg shadow-soft">
              <p class="text-sm text-sumi/60 mb-1">料金</p>
              <p class="font-bold text-sumi">{{ entry.pricing }}</p>
            </div>
            <div v-if="entry.requirements" class="p-6 bg-white rounded-lg shadow-soft">
              <p class="text-sm text-sumi/60 mb-1">必要なもの</p>
              <p class="font-bold text-sumi">{{ entry.requirements }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 競合との違い -->
    <section class="py-16 bg-washi">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="font-mincho text-2xl md:text-3xl text-sumi mb-8">
            なぜIYASAKAなのか
          </h2>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div class="p-6 bg-ash/30 rounded-lg">
              <p class="text-sm text-sumi/60 mb-2">他社・従来の課題</p>
              <p class="text-sumi">{{ entry.competitorWeakness }}</p>
            </div>
            <div class="p-6 bg-akatsuki/10 rounded-lg border-l-4 border-akatsuki">
              <p class="text-sm text-akatsuki mb-2">IYASAKAの違い</p>
              <p class="text-sumi font-medium">{{ entry.ourDifference }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-16 bg-ash/30">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="font-mincho text-2xl md:text-3xl text-sumi mb-8">
            よくあるご質問
          </h2>
          
          <div class="space-y-4">
            <details 
              v-for="(faq, i) in entry.faq" 
              :key="i"
              class="bg-white rounded-lg shadow-soft group"
            >
              <summary class="p-6 cursor-pointer list-none flex items-center justify-between">
                <span class="font-medium text-sumi">{{ faq.q }}</span>
                <span class="text-akatsuki transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div class="px-6 pb-6 text-sumi/70">
                {{ faq.a }}
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 lg:py-24 bg-gradient-to-r from-akatsuki to-akatsuki/80 text-white">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="font-mincho text-3xl md:text-4xl mb-4">
            {{ entry.primaryCta.label }}
          </h2>
          <p v-if="entry.primaryCta.description" class="text-white/80 mb-6">
            {{ entry.primaryCta.description }}
          </p>
          <p class="text-white/60 text-sm mb-8">
            2営業日以内にご連絡いたします
          </p>
          
          <NuxtLink 
            :to="`/#contact?product=${entry.id}`"
            class="inline-flex items-center gap-2 px-8 py-4 bg-white text-akatsuki rounded-button font-bold hover:bg-white/90 transition-colors"
          >
            無料で相談する
            <span class="text-xl">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 関連製品 -->
    <section class="py-16 bg-washi">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="font-mincho text-2xl text-sumi mb-8">
            他のソリューションも見る
          </h2>
          
          <div class="grid md:grid-cols-3 gap-6">
            <NuxtLink 
              v-for="product in relatedProducts" 
              :key="product.id"
              :to="`/products/${product.slug}`"
              class="p-6 bg-white rounded-lg shadow-soft hover:shadow-md transition-all group"
            >
              <h3 class="font-bold text-sumi group-hover:text-akatsuki transition-colors mb-2">
                {{ product.name }}
              </h3>
              <p class="text-sm text-sumi/60">{{ product.subtitle }}</p>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
