<script setup lang="ts">
/**
 * ニュース一覧ページ
 * AIEO対応: BreadcrumbList スキーマ出力
 *
 * 心理学原理:
 * 1. 認知的流暢性 - カテゴリフィルターで探しやすく
 * 2. 単純接触効果 - 定期的な情報発信で信頼を構築
 * 3. 権威性 - 活動実績として信頼性を向上
 */
import { pressReleases } from '~/app/data/media'
import { breadcrumbLd } from '~/app/utils/ld'

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

// フィルター状態
const selectedCategory = ref<string>('all')

// フィルター済みリリース
const filteredReleases = computed(() => {
  if (selectedCategory.value === 'all') {
    return pressReleases
  }
  return pressReleases.filter(r => r.category === selectedCategory.value)
})

// カテゴリ一覧
const categories = [
  { id: 'all', label: 'すべて' },
  { id: 'product', label: '製品・サービス' },
  { id: 'partnership', label: '提携・協業' },
  { id: 'award', label: '受賞' },
  { id: 'company', label: '会社情報' }
]

// パンくずリスト JSON-LD
const breadcrumb = breadcrumbLd([
  { name: 'ホーム', path: '/' },
  { name: 'お知らせ', path: '/news' }
])

// SEO
useSeoMeta({
  title: 'ニュース | IYASAKA',
  description: 'IYASAKAの最新ニュース、プレスリリース、お知らせを掲載しています。',
})

// 構造化データ
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumb)
    }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    
    <!-- ===== HERO ===== -->
    <section class="py-20 bg-white border-b border-slate-100">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl">
          <p class="text-sm font-medium text-matsuha uppercase tracking-widest mb-4">
            News & Updates
          </p>
          <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            ニュース
          </h1>
          <p class="text-xl text-slate-600">
            プレスリリース、製品アップデート、お知らせを掲載しています。
          </p>
        </div>
      </div>
    </section>
    
    
    <!-- ===== FILTER + LIST ===== -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        
        <!-- カテゴリフィルター -->
        <div class="flex flex-wrap gap-2 mb-10">
          <button 
            v-for="cat in categories"
            :key="cat.id"
            @click="selectedCategory = cat.id"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all"
            :class="{
              'bg-matsuha text-white': selectedCategory === cat.id,
              'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200': selectedCategory !== cat.id
            }"
          >
            {{ cat.label }}
          </button>
        </div>
        
        <!-- ニュースリスト -->
        <div class="space-y-4">
          <TransitionGroup name="list">
            <article 
              v-for="release in filteredReleases"
              :key="release.id"
              class="group bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:border-matsuha/20 transition-all"
            >
              <div class="flex flex-col md:flex-row md:items-center gap-4">
                <!-- 日付 -->
                <time class="text-sm text-slate-500 md:w-32 flex-shrink-0">
                  {{ formatDate(release.date) }}
                </time>
                
                <!-- カテゴリ -->
                <span 
                  class="inline-block px-3 py-1 text-xs font-medium rounded-full w-fit"
                  :class="{
                    'bg-blue-100 text-blue-700': release.category === 'product',
                    'bg-purple-100 text-purple-700': release.category === 'partnership',
                    'bg-amber-100 text-amber-700': release.category === 'award',
                    'bg-slate-100 text-slate-700': release.category === 'company'
                  }"
                >
                  {{ categoryLabels[release.category] }}
                </span>
                
                <!-- タイトル -->
                <h2 class="flex-1 font-bold text-slate-900 group-hover:text-matsuha transition-colors">
                  <NuxtLink :to="`/news/${release.slug}`">
                    {{ release.title }}
                  </NuxtLink>
                </h2>
                
                <!-- 矢印 -->
                <svg class="w-5 h-5 text-slate-400 group-hover:text-matsuha group-hover:translate-x-1 transition-all flex-shrink-0 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </article>
          </TransitionGroup>
        </div>
        
        <!-- 結果なし -->
        <div 
          v-if="filteredReleases.length === 0"
          class="text-center py-20 text-slate-500"
        >
          このカテゴリのニュースはまだありません。
        </div>
        
      </div>
    </section>
    
  </div>
</template>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>





