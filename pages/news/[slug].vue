<script setup lang="ts">
/**
 * ニュース詳細ページ
 * AIEO対応: BreadcrumbList スキーマ出力
 */
import { pressReleases } from '~/app/data/media'
import { breadcrumbLd } from '~/app/utils/ld'

const route = useRoute()
const slug = route.params.slug as string

// 該当するリリースを取得
const release = computed(() =>
  pressReleases.find(r => r.slug === slug)
)

// 404処理
if (!release.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'ニュースが見つかりません'
  })
}

// 日付フォーマット
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
}

// カテゴリラベル
const categoryLabels: Record<string, string> = {
  product: '製品・サービス',
  partnership: '提携・協業',
  award: '受賞',
  company: '会社情報'
}

// 関連ニュース（同カテゴリ）
const relatedNews = computed(() =>
  pressReleases
    .filter(r => r.category === release.value?.category && r.slug !== slug)
    .slice(0, 3)
)

// パンくずリスト JSON-LD
const breadcrumb = computed(() => breadcrumbLd([
  { name: 'ホーム', path: '/' },
  { name: 'お知らせ', path: '/news' },
  { name: release.value?.title || '', path: `/news/${slug}` }
]))

// SEO
useSeoMeta({
  title: () => `${release.value?.title} | IYASAKA`,
  description: () => release.value?.summary,
})

// 構造化データ
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify(breadcrumb.value))
    }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-white">
    
    <!-- ===== HEADER ===== -->
    <section class="py-16 bg-slate-50 border-b border-slate-100">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto">
          <!-- ブレッドクラム -->
          <nav class="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <NuxtLink to="/" class="hover:text-matsuha">ホーム</NuxtLink>
            <span>/</span>
            <NuxtLink to="/news" class="hover:text-matsuha">ニュース</NuxtLink>
            <span>/</span>
            <span class="text-slate-700">{{ release?.title }}</span>
          </nav>
          
          <!-- カテゴリ・日付 -->
          <div class="flex items-center gap-4 mb-6">
            <span 
              class="px-3 py-1 text-xs font-medium rounded-full"
              :class="{
                'bg-blue-100 text-blue-700': release?.category === 'product',
                'bg-purple-100 text-purple-700': release?.category === 'partnership',
                'bg-amber-100 text-amber-700': release?.category === 'award',
                'bg-slate-100 text-slate-700': release?.category === 'company'
              }"
            >
              {{ categoryLabels[release?.category || 'company'] }}
            </span>
            <time class="text-sm text-slate-500">
              {{ formatDate(release?.date || '') }}
            </time>
          </div>
          
          <!-- タイトル -->
          <h1 class="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
            {{ release?.title }}
          </h1>
        </div>
      </div>
    </section>
    
    
    <!-- ===== CONTENT ===== -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto">
          
          <!-- リード文 -->
          <div class="prose prose-lg max-w-none mb-12">
            <p class="text-xl text-slate-600 leading-relaxed">
              {{ release?.summary }}
            </p>
          </div>
          
          <!-- 本文プレースホルダー -->
          <div class="prose prose-lg max-w-none">
            <p class="text-slate-600">
              ※ 本文コンテンツは準備中です。詳細については広報担当までお問い合わせください。
            </p>
            
            <h2>お問い合わせ</h2>
            <p>
              本件に関するお問い合わせは、下記までご連絡ください。
            </p>
            <ul>
              <li>IYASAKA 広報担当</li>
              <li>Email: press@iyasaka.co.jp</li>
              <li>TEL: 048-872-6822</li>
            </ul>
          </div>
          
          <!-- シェアボタン -->
          <div class="mt-12 pt-8 border-t border-slate-100">
            <p class="text-sm text-slate-500 mb-4">この記事をシェア</p>
            <div class="flex gap-3">
              <a 
                :href="`https://twitter.com/intent/tweet?url=${encodeURIComponent($route.fullPath)}&text=${encodeURIComponent(release?.title || '')}`"
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#1DA1F2] hover:text-white transition-colors"
              >
                𝕏
              </a>
              <a 
                :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent($route.fullPath)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#1877F2] hover:text-white transition-colors"
              >
                f
              </a>
              <a 
                :href="`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent($route.fullPath)}&title=${encodeURIComponent(release?.title || '')}`"
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#0077B5] hover:text-white transition-colors"
              >
                in
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </section>
    
    
    <!-- ===== RELATED NEWS ===== -->
    <section v-if="relatedNews.length > 0" class="py-12 bg-slate-50">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-xl font-bold text-slate-900 mb-6">関連ニュース</h2>
          
          <div class="space-y-4">
            <NuxtLink 
              v-for="news in relatedNews"
              :key="news.id"
              :to="`/news/${news.slug}`"
              class="block p-4 bg-white rounded-xl border border-slate-100 hover:shadow-md hover:border-matsuha/20 transition-all"
            >
              <div class="flex items-center gap-4">
                <time class="text-sm text-slate-500 flex-shrink-0">
                  {{ formatDate(news.date) }}
                </time>
                <span class="font-medium text-slate-900 hover:text-matsuha">
                  {{ news.title }}
                </span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
    
    
    <!-- ===== BACK LINK ===== -->
    <section class="py-8 bg-white border-t border-slate-100">
      <div class="container mx-auto px-4 text-center">
        <NuxtLink 
          to="/news"
          class="inline-flex items-center gap-2 text-matsuha font-medium hover:text-matsuha/80 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          ニュース一覧に戻る
        </NuxtLink>
      </div>
    </section>
    
  </div>
</template>





