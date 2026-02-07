<script setup lang="ts">
/**
 * 導入事例カード
 * 心理学原理：ストーリーテリング + Before/Afterコントラスト + 社会的証明
 * - サムネイルで視覚的に引きつける
 * - 成果数値で具体的なメリットを訴求
 * - 業界タグで「自分ごと」化を促進
 */
import type { CaseStudy } from '~/app/data/cases'

interface Props {
  caseStudy: CaseStudy
  variant?: 'default' | 'featured' | 'compact'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

// メイン成果を1つ取得
const mainResult = computed(() => props.caseStudy.results.metrics[0] || null)
</script>

<template>
  <article 
    class="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100"
    :class="{
      'lg:flex lg:items-stretch': variant === 'featured'
    }"
  >
    <!-- サムネイル -->
    <div 
      class="relative overflow-hidden"
      :class="{
        'aspect-[16/10]': variant !== 'featured',
        'lg:w-1/2 aspect-[16/10] lg:aspect-auto': variant === 'featured'
      }"
    >
      <img
        :src="caseStudy.thumbnail"
        :alt="caseStudy.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      <!-- オーバーレイグラデーション -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      <!-- 業界バッジ -->
      <span class="absolute top-4 left-4 px-3 py-1 text-xs font-medium rounded-full bg-white/90 text-slate-700 backdrop-blur-sm">
        {{ caseStudy.industry }}
      </span>
      
      <!-- Featured バッジ -->
      <span 
        v-if="caseStudy.featured && variant !== 'featured'" 
        class="absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full bg-matsuha text-white"
      >
        注目事例
      </span>
    </div>
    
    <!-- コンテンツ -->
    <div 
      class="p-6"
      :class="{
        'lg:w-1/2 lg:p-8 lg:flex lg:flex-col lg:justify-center': variant === 'featured'
      }"
    >
      <!-- サービスタグ -->
      <div class="flex flex-wrap gap-2 mb-3">
        <span 
          v-for="service in caseStudy.services.slice(0, 2)" 
          :key="service"
          class="px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-600"
        >
          {{ service }}
        </span>
      </div>
      
      <!-- タイトル -->
      <h3 
        class="font-bold text-slate-900 leading-tight group-hover:text-matsuha transition-colors"
        :class="{
          'text-xl lg:text-2xl': variant === 'featured',
          'text-lg': variant === 'default',
          'text-base': variant === 'compact'
        }"
      >
        {{ caseStudy.title }}
      </h3>
      
      <!-- サマリー -->
      <p 
        v-if="variant !== 'compact'"
        class="mt-3 text-sm text-slate-600 line-clamp-2"
      >
        {{ caseStudy.summary }}
      </p>
      
      <!-- 成果ハイライト（Before/Afterコントラスト） -->
      <div 
        v-if="mainResult && variant !== 'compact'"
        class="mt-4 p-4 rounded-xl bg-gradient-to-r from-matsuha/5 to-matsuha/10 border border-matsuha/10"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-500 mb-1">{{ mainResult.label }}</p>
            <div class="flex items-baseline gap-2">
              <span v-if="mainResult.before" class="text-sm text-slate-400 line-through">
                {{ mainResult.before }}
              </span>
              <span class="text-xl font-bold text-matsuha">
                {{ mainResult.after }}
              </span>
            </div>
          </div>
          <div 
            v-if="mainResult.improvement"
            class="px-3 py-1 rounded-full bg-matsuha text-white text-xs font-bold"
          >
            {{ mainResult.improvement }}
          </div>
        </div>
      </div>
      
      <!-- CTA -->
      <div class="mt-5">
        <NuxtLink 
          :to="`/cases/${caseStudy.slug}`"
          class="inline-flex items-center gap-2 text-sm font-medium text-matsuha hover:text-matsuha/80 transition-colors"
        >
          詳細を見る
          <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
