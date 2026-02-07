<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useAsyncData, useRuntimeConfig, useHead, createError } from '#imports'
import { queryContent } from '#imports'
import { withBase } from 'ufo'
import { products } from '~/app/data/products'
import { useAnalytics } from '@/composables/useAnalytics'
import { ContentRenderer } from '#components'
import { buildSeo } from '@/app/utils/seo'
import { articleLd, faqLdFromArticle, organizationLd } from '@/app/utils/ld'
import type { ContentArticle } from '@/app/types/content'

const route = useRoute()
const slugParam = route.params.slug
const path = Array.isArray(slugParam) ? `/articles/${slugParam.join('/')}` : `/articles/${slugParam}`

const { data: doc } = await useAsyncData(`article-${path}`, () =>
  queryContent('articles').where({ _path: path }).findOne()
)

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}

const runtime = useRuntimeConfig()
const { track } = useAnalytics()

const relatedSlugs = computed(() => {
  if (doc.value?.relatedProducts?.length) return doc.value.relatedProducts
  return doc.value?.primaryProduct ? [doc.value.primaryProduct] : []
})

const relatedProducts = computed(() =>
  relatedSlugs.value
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
)

if (!relatedProducts.value.length && doc.value?.primaryProduct) {
  console.warn('[articles] unknown primaryProduct:', doc.value.primaryProduct)
}

const canonical = computed(() => {
  if (!doc.value?._path) return runtime.public?.siteUrl || 'https://example.com'
  const siteUrl = runtime.public?.siteUrl || 'https://example.com'
  return new URL(withBase(doc.value._path, runtime.app.baseURL), siteUrl).toString()
})

useHead(() => {
  const d = doc.value as ContentArticle
  const siteUrl = runtime.public?.siteUrl || 'https://example.com'
  const baseURL = runtime.app.baseURL || '/iyasaka/'

  const seo = buildSeo(
    {
      title: d?.title ?? '記事',
      description: d?.description,
      path: d?._path || ''
    },
    { siteUrl, baseURL }
  )

  const articleSchema = articleLd(d, canonical.value)
  const faqSchema = faqLdFromArticle(d, canonical.value)
  const orgSchema = organizationLd()

  const scripts: { type: string; children: string }[] = [
    {
      type: 'application/ld+json',
      children: JSON.stringify(articleSchema)
    }
  ]

  if (faqSchema) {
    scripts.push({
      type: 'application/ld+json',
      children: JSON.stringify(faqSchema)
    })
  }

  scripts.push({
    type: 'application/ld+json',
    children: JSON.stringify(orgSchema)
  })

  return {
    ...seo,
    titleTemplate: '%s | IYASAKA',
    title: d?.title ?? '記事',
    script: scripts
  }
})

// Nuxt Router 側で baseURL が考慮されるため、ここではルート相対パスを渡す
const buildProductLink = (slug: string) => `/products/${slug}`
const onProductClick = (slug: string) => {
  track('article_related_product_click', { article: doc.value?._path, product: slug })
}
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-10 space-y-8">
    <article v-if="doc">
      <header class="mb-8">
        <p class="text-xs text-sumi/60">
          {{ doc.publishedAt ? new Date(doc.publishedAt).toLocaleDateString('ja-JP') : '' }}
        </p>
        <h1 class="text-3xl font-bold text-sumi mt-2">
          {{ doc.title }}
        </h1>
        <!-- AI向け一段落サマリ -->
        <p v-if="doc.aiAnswerSummary" class="mt-3 text-sumi/80 text-sm border-l-4 border-matsuha pl-3">
          {{ doc.aiAnswerSummary }}
        </p>
        <p v-else-if="doc.description" class="text-sumi/70 mt-2">
          {{ doc.description }}
        </p>
      </header>
      <ContentRenderer :value="doc" />
      <!-- FAQ ブロック -->
      <section v-if="doc.faq?.length" class="mt-10 border-t border-sumi/10 pt-6">
        <h2 class="text-xl font-semibold mb-4">FAQ</h2>
        <div class="space-y-3">
          <details
            v-for="item in doc.faq"
            :key="item.question"
            class="border rounded-lg p-4 bg-white/50"
          >
            <summary class="cursor-pointer font-semibold">
              {{ item.question }}
            </summary>
            <p class="mt-2 text-sm text-sumi/80">
              {{ item.answer }}
            </p>
          </details>
        </div>
      </section>
    </article>

    <section v-if="relatedProducts.length" class="border-t border-sumi/10 pt-6">
      <h2 class="text-xl font-semibold mb-4">関連するサービス</h2>
      <div class="grid gap-4 md:grid-cols-2">
        <NuxtLink
          v-for="product in relatedProducts"
          :key="product.slug"
          :to="buildProductLink(product.slug)"
          class="block rounded-2xl border border-sumi/10 p-4 shadow-sm hover:border-matsuha/50 hover:bg-white transition"
          @click.native="onProductClick(product.slug)"
        >
          <h3 class="text-lg font-semibold text-sumi">
            {{ product.title }}
          </h3>
          <p class="text-sm text-sumi/70 mt-1">
            {{ product.blurb || product.subtitle }}
          </p>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
}
</style>


