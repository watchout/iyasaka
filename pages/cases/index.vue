<script setup lang="ts">
/**
 * 事例一覧ページ
 * AIEO対応: BreadcrumbList スキーマ出力
 *
 * 心理学原理:
 * 1. 社会的証明 - 多くの成功事例で信頼性を構築
 * 2. 認知的流暢性 - フィルター機能で探しやすく
 * 3. ストーリーテリング - 各事例を物語として見せる
 */
import { caseStudies, caseCategories } from '~/app/data/cases'
import { breadcrumbLd } from '~/app/utils/ld'

// フィルター状態
const selectedCategory = ref<string>('all')

// フィルター済み事例
const filteredCases = computed(() => {
  if (selectedCategory.value === 'all') {
    return caseStudies
  }

  const categoryMap: Record<string, string> = {
    'event': 'イベント・会場運営',
    'hotel': 'ホテル・宿泊業',
    'public': '行政・公共',
    'manufacturing': '製造業',
    'education': '教育'
  }

  return caseStudies.filter(c => c.industry === categoryMap[selectedCategory.value])
})

// フィーチャード事例
const featuredCase = computed(() =>
  caseStudies.find(c => c.featured)
)

// パンくずリスト JSON-LD
const breadcrumb = breadcrumbLd([
  { name: 'ホーム', path: '/' },
  { name: '導入事例', path: '/cases' }
])

// SEO
useSeoMeta({
  title: '導入事例 | IYASAKA',
  description: '配信プラス、オンサイト保守プラス、多言語プラスなど、IYASAKAの導入事例をご紹介。業界別の課題解決ストーリーをご覧ください。',
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
  <div class="min-h-screen">
    
    <!-- ===== HERO ===== -->
    <section class="py-20 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden relative">
      <!-- 背景装飾 -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-matsuha/10 to-transparent" />
      </div>
      
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-3xl">
          <p class="text-sm font-medium text-matsuha uppercase tracking-widest mb-4">
            Case Studies
          </p>
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">
            導入事例
          </h1>
          <p class="text-xl text-white/70 leading-relaxed">
            さまざまな業界のお客様の課題解決をお手伝いしてきました。<br class="hidden md:block" />
            Before/Afterを含む詳細なストーリーをご覧ください。
          </p>
        </div>
      </div>
    </section>
    
    
    <!-- ===== FEATURED CASE ===== -->
    <section v-if="featuredCase" class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="mb-8">
          <span class="px-3 py-1 rounded-full bg-shu text-white text-xs font-bold">
            注目事例
          </span>
        </div>
        
        <CaseCard 
          :case-study="featuredCase"
          variant="featured"
        />
      </div>
    </section>
    
    
    <!-- ===== FILTER + GRID ===== -->
    <section class="py-16 bg-slate-50">
      <div class="container mx-auto px-4">
        
        <!-- カテゴリフィルター -->
        <div class="flex flex-wrap gap-2 mb-12">
          <button 
            v-for="cat in caseCategories"
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
        
        <!-- 事例グリッド -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TransitionGroup name="grid">
            <CaseCard 
              v-for="caseStudy in filteredCases"
              :key="caseStudy.id"
              :case-study="caseStudy"
            />
          </TransitionGroup>
        </div>
        
        <!-- 結果なし -->
        <div 
          v-if="filteredCases.length === 0"
          class="text-center py-20 text-slate-500"
        >
          このカテゴリの事例はまだありません。
        </div>
        
      </div>
    </section>
    
    
    <!-- ===== CTA ===== -->
    <CtaSection 
      title="御社の課題も解決できるかもしれません"
      subtitle="まずは無料診断で現状を整理しませんか。最適な解決策をご提案します。"
      primary-label="無料診断を申し込む"
      primary-to="/contact?type=diagnosis"
      secondary-label="資料をダウンロード"
      secondary-to="/downloads"
      variant="gradient"
    />
    
  </div>
</template>

<style>
.grid-enter-active,
.grid-leave-active {
  transition: all 0.4s ease;
}
.grid-enter-from,
.grid-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
