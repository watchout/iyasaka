<script setup lang="ts">
/**
 * 解決策カード（サービスカード）
 * 心理学原理：選択のパラドックス対策 + フレーミング効果
 * - 3つに絞ったシンプルな選択肢
 * - ポジティブなフレーミングで訴求
 * - 明確なCTAで行動を促す
 */
interface Props {
  slug: string
  title: string
  description: string
  icon?: string
  benefits?: string[]
  featured?: boolean
  ctaLabel?: string
  ctaTo?: string
}

withDefaults(defineProps<Props>(), {
  benefits: () => [],
  featured: false,
  ctaLabel: '詳しく見る'
})
</script>

<template>
  <article 
    class="group relative p-8 rounded-3xl transition-all duration-300"
    :class="{
      'bg-matsuha text-white shadow-2xl shadow-matsuha/20 scale-[1.02]': featured,
      'bg-white border-2 border-slate-100 hover:border-matsuha/30 hover:shadow-xl': !featured
    }"
  >
    <!-- 「おすすめ」バッジ -->
    <div 
      v-if="featured"
      class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-shu text-white text-xs font-bold shadow-lg"
    >
      おすすめ
    </div>
    
    <!-- アイコン -->
    <div 
      class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6"
      :class="{
        'bg-white/20': featured,
        'bg-matsuha/10': !featured
      }"
    >
      {{ icon || '🚀' }}
    </div>
    
    <!-- タイトル -->
    <h3 
      class="text-xl font-bold mb-3"
      :class="{
        'text-white': featured,
        'text-slate-900': !featured
      }"
    >
      {{ title }}
    </h3>
    
    <!-- 説明 -->
    <p 
      class="text-sm leading-relaxed mb-6"
      :class="{
        'text-white/80': featured,
        'text-slate-600': !featured
      }"
    >
      {{ description }}
    </p>
    
    <!-- 特典リスト -->
    <ul v-if="benefits.length" class="space-y-3 mb-6">
      <li 
        v-for="(benefit, i) in benefits" 
        :key="i"
        class="flex items-start gap-3 text-sm"
      >
        <svg 
          class="w-5 h-5 flex-shrink-0 mt-0.5"
          :class="{
            'text-shu': featured,
            'text-matsuha': !featured
          }"
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <span :class="featured ? 'text-white/90' : 'text-slate-700'">
          {{ benefit }}
        </span>
      </li>
    </ul>
    
    <!-- CTA -->
    <NuxtLink 
      :to="ctaTo || `/products/${slug}`"
      class="inline-flex items-center justify-center w-full py-3 rounded-xl font-medium transition-all duration-300"
      :class="{
        'bg-white text-matsuha hover:bg-white/90': featured,
        'bg-matsuha text-white hover:bg-matsuha/90': !featured
      }"
    >
      {{ ctaLabel }}
      <svg class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </NuxtLink>
  </article>
</template>


