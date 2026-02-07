<script setup lang="ts">
/**
 * 事例詳細ページ
 * AIEO対応: BreadcrumbList スキーマ出力
 *
 * 心理学原理:
 * 1. ストーリーテリング - 課題→解決→成果の物語構造
 * 2. Before/After（コントラスト効果）- 変化を視覚的に表現
 * 3. 社会的証明 - 顧客の声で信頼性を強化
 * 4. 進捗バイアス - タイムラインで実現可能性を示す
 */
import { caseStudies } from '~/app/data/cases'
import { breadcrumbLd } from '~/app/utils/ld'

const route = useRoute()
const slug = route.params.slug as string

// 該当する事例を取得
const caseStudy = computed(() =>
  caseStudies.find(c => c.slug === slug)
)

// 404処理
if (!caseStudy.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '事例が見つかりません'
  })
}

// 日付フォーマット
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
}

// 関連事例（同業界）
const relatedCases = computed(() =>
  caseStudies
    .filter(c => c.industry === caseStudy.value?.industry && c.slug !== slug)
    .slice(0, 2)
)

// パンくずリスト JSON-LD
const breadcrumb = computed(() => breadcrumbLd([
  { name: 'ホーム', path: '/' },
  { name: '導入事例', path: '/cases' },
  { name: caseStudy.value?.clientName || '', path: `/cases/${slug}` }
]))

// SEO
useSeoMeta({
  title: () => `${caseStudy.value?.title} | 導入事例 | IYASAKA`,
  description: () => caseStudy.value?.summary,
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
  <div class="min-h-screen">
    
    <!-- ===== HERO ===== -->
    <section class="relative py-0 overflow-hidden">
      <!-- ヒーロー画像 -->
      <div class="relative h-[50vh] min-h-[400px] bg-slate-900">
        <img 
          :src="caseStudy?.heroImage || caseStudy?.thumbnail"
          :alt="caseStudy?.title"
          class="w-full h-full object-cover opacity-60"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        
        <!-- コンテンツ -->
        <div class="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div class="container mx-auto">
            <div class="max-w-4xl">
              <!-- ブレッドクラム -->
              <nav class="flex items-center gap-2 text-sm text-white/60 mb-6">
                <NuxtLink to="/" class="hover:text-white">ホーム</NuxtLink>
                <span>/</span>
                <NuxtLink to="/cases" class="hover:text-white">導入事例</NuxtLink>
                <span>/</span>
                <span class="text-white/80">{{ caseStudy?.clientName }}</span>
              </nav>
              
              <!-- バッジ -->
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm">
                  {{ caseStudy?.industry }}
                </span>
                <span class="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm">
                  📍 {{ caseStudy?.location }}
                </span>
              </div>
              
              <!-- タイトル -->
              <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                {{ caseStudy?.title }}
              </h1>
              
              <!-- クライアント名 -->
              <p class="text-xl text-white/70">
                {{ caseStudy?.clientName }} 様
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    
    <!-- ===== SERVICES USED ===== -->
    <section class="py-8 bg-white border-b border-slate-100">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="flex flex-wrap items-center gap-4">
            <span class="text-sm text-slate-500">導入サービス:</span>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="service in caseStudy?.services"
                :key="service"
                class="px-4 py-2 rounded-lg bg-matsuha/10 text-matsuha text-sm font-medium"
              >
                {{ service }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    
    <!-- ===== SUMMARY ===== -->
    <section class="py-12 bg-slate-50">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <p class="text-xl text-slate-600 leading-relaxed">
            {{ caseStudy?.summary }}
          </p>
        </div>
      </div>
    </section>
    
    
    <!-- ===== CHALLENGE (Before) ===== -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-3xl">
              😰
            </div>
            <div>
              <p class="text-sm font-medium text-red-500 uppercase tracking-widest">Before</p>
              <h2 class="text-2xl md:text-3xl font-bold text-slate-900">
                {{ caseStudy?.challenge.title }}
              </h2>
            </div>
          </div>
          
          <ul class="space-y-4">
            <li 
              v-for="(point, index) in caseStudy?.challenge.points"
              :key="index"
              class="flex items-start gap-4 p-4 rounded-xl bg-red-50 border border-red-100"
            >
              <span class="w-8 h-8 rounded-full bg-red-200 text-red-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {{ index + 1 }}
              </span>
              <p class="text-slate-700 pt-1">{{ point }}</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
    
    
    <!-- ===== SOLUTION ===== -->
    <section class="py-16 bg-slate-900 text-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-16 h-16 rounded-2xl bg-matsuha flex items-center justify-center text-3xl">
              💡
            </div>
            <div>
              <p class="text-sm font-medium text-matsuha uppercase tracking-widest">Solution</p>
              <h2 class="text-2xl md:text-3xl font-bold">
                {{ caseStudy?.solution.title }}
              </h2>
            </div>
          </div>
          
          <ul class="space-y-4">
            <li 
              v-for="(point, index) in caseStudy?.solution.points"
              :key="index"
              class="flex items-start gap-4 p-4 rounded-xl bg-white/10"
            >
              <svg class="w-6 h-6 text-matsuha flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <p class="text-white/90 pt-0.5">{{ point }}</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
    
    
    <!-- ===== TIMELINE ===== -->
    <section v-if="caseStudy?.timeline?.length" class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-12 text-center">
            導入の流れ
          </h2>
          
          <div class="relative">
            <!-- 中央線 -->
            <div class="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-matsuha/20 transform md:-translate-x-1/2" />
            
            <!-- ステップ -->
            <div class="space-y-12">
              <div 
                v-for="(step, index) in caseStudy.timeline"
                :key="index"
                class="relative flex items-start gap-8"
                :class="{ 'md:flex-row-reverse': index % 2 === 1 }"
              >
                <!-- ドット -->
                <div class="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-matsuha transform -translate-x-1/2 z-10 ring-4 ring-white" />
                
                <!-- カード -->
                <div 
                  class="ml-16 md:ml-0 md:w-[calc(50%-40px)] p-6 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div class="flex items-center gap-3 mb-3">
                    <span class="px-3 py-1 rounded-full bg-matsuha text-white text-xs font-bold">
                      {{ step.phase }}
                    </span>
                    <span class="text-sm text-slate-500">{{ step.duration }}</span>
                  </div>
                  <p class="text-slate-700">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    
    <!-- ===== RESULTS (After) ===== -->
    <section class="py-16 bg-gradient-to-br from-matsuha to-matsuha/90 text-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <p class="text-sm font-medium text-white/60 uppercase tracking-widest mb-2">After</p>
            <h2 class="text-3xl md:text-4xl font-bold">
              {{ caseStudy?.results.title }}
            </h2>
          </div>
          
          <!-- メトリクスグリッド -->
          <div class="grid md:grid-cols-2 gap-6">
            <div 
              v-for="(metric, index) in caseStudy?.results.metrics"
              :key="index"
              class="p-6 rounded-2xl bg-white/10 backdrop-blur-sm"
            >
              <p class="text-sm text-white/70 mb-2">{{ metric.label }}</p>
              
              <div class="flex items-baseline gap-3 mb-3">
                <!-- Before -->
                <span 
                  v-if="metric.before" 
                  class="text-lg text-white/50 line-through"
                >
                  {{ metric.before }}
                </span>
                
                <!-- 矢印 -->
                <svg v-if="metric.before" class="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                
                <!-- After -->
                <span class="text-3xl md:text-4xl font-bold text-white">
                  {{ metric.after }}
                </span>
              </div>
              
              <!-- 改善率 -->
              <span 
                v-if="metric.improvement"
                class="inline-block px-3 py-1 rounded-full bg-shu text-white text-sm font-bold"
              >
                {{ metric.improvement }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    
    <!-- ===== TESTIMONIAL ===== -->
    <section v-if="caseStudy?.testimonial" class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <!-- 引用符 -->
          <svg class="w-16 h-16 text-matsuha/20 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          
          <!-- 引用文 -->
          <blockquote class="text-2xl md:text-3xl font-bold text-slate-900 leading-relaxed mb-8">
            {{ caseStudy.testimonial.quote }}
          </blockquote>
          
          <!-- 著者 -->
          <div class="flex items-center justify-center gap-4">
            <div 
              v-if="caseStudy.testimonial.avatar"
              class="w-16 h-16 rounded-full overflow-hidden bg-slate-200"
            >
              <img 
                :src="caseStudy.testimonial.avatar"
                :alt="caseStudy.testimonial.author"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="text-left">
              <p class="font-bold text-slate-900">{{ caseStudy.testimonial.author }}</p>
              <p class="text-slate-500">{{ caseStudy.testimonial.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    
    <!-- ===== RELATED CASES ===== -->
    <section v-if="relatedCases.length > 0" class="py-16 bg-slate-50">
      <div class="container mx-auto px-4">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-2xl font-bold text-slate-900 mb-8">関連事例</h2>
          
          <div class="grid md:grid-cols-2 gap-8">
            <CaseCard 
              v-for="related in relatedCases"
              :key="related.id"
              :case-study="related"
              variant="compact"
            />
          </div>
        </div>
      </div>
    </section>
    
    
    <!-- ===== CTA ===== -->
    <CtaSection 
      title="同じような課題をお持ちですか？"
      subtitle="まずは無料診断で現状を整理しませんか。最適な解決策をご提案します。"
      primary-label="無料診断を申し込む"
      primary-to="/contact?type=diagnosis"
      secondary-label="他の事例を見る"
      secondary-to="/cases"
      variant="gradient"
    />
    
  </div>
</template>

