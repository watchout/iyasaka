<script setup lang="ts">
/**
 * CTAセクション
 * 心理学原理：ピークエンドの法則 + 互恵性 + 損失回避
 * - ページ最後の印象的なCTA
 * - 無料診断で互恵性を発動
 * - 緊急性・限定感で行動を促す
 */
interface Props {
  title?: string
  subtitle?: string
  primaryLabel?: string
  primaryTo?: string
  secondaryLabel?: string
  secondaryTo?: string
  variant?: 'default' | 'gradient' | 'dark'
  showBadge?: boolean
  badgeText?: string
}

withDefaults(defineProps<Props>(), {
  title: 'まずは無料診断から',
  subtitle: '現状の課題を整理し、最適な解決策をご提案します。お気軽にご相談ください。',
  primaryLabel: '無料診断を申し込む',
  primaryTo: '/contact?type=diagnosis',
  secondaryLabel: '資料をダウンロード',
  secondaryTo: '/downloads',
  variant: 'gradient',
  showBadge: true,
  badgeText: '相談無料・秘密厳守'
})
</script>

<template>
  <section 
    class="relative py-20 overflow-hidden"
    :class="{
      'bg-gradient-to-br from-matsuha via-matsuha/95 to-matsuha/90': variant === 'gradient',
      'bg-sumi': variant === 'dark',
      'bg-slate-100': variant === 'default'
    }"
  >
    <!-- 背景装飾 -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <!-- 円形グラデーション -->
      <div 
        class="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full"
        :class="{
          'bg-white/5': variant === 'gradient' || variant === 'dark',
          'bg-matsuha/5': variant === 'default'
        }"
      />
      <div 
        class="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full"
        :class="{
          'bg-white/5': variant === 'gradient' || variant === 'dark',
          'bg-shu/5': variant === 'default'
        }"
      />
      
      <!-- ドットパターン -->
      <div 
        class="absolute inset-0 opacity-10"
        style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 24px 24px;"
        :class="{
          'text-white': variant === 'gradient' || variant === 'dark',
          'text-matsuha': variant === 'default'
        }"
      />
    </div>
    
    <div class="container mx-auto px-4 relative">
      <div class="max-w-3xl mx-auto text-center">
        <!-- バッジ -->
        <div v-if="showBadge" class="mb-6">
          <span 
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            :class="{
              'bg-white/20 text-white': variant === 'gradient' || variant === 'dark',
              'bg-matsuha/10 text-matsuha': variant === 'default'
            }"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            {{ badgeText }}
          </span>
        </div>
        
        <!-- タイトル -->
        <h2 
          class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          :class="{
            'text-white': variant === 'gradient' || variant === 'dark',
            'text-slate-900': variant === 'default'
          }"
        >
          {{ title }}
        </h2>
        
        <!-- サブタイトル -->
        <p 
          class="text-lg md:text-xl mb-10 max-w-2xl mx-auto"
          :class="{
            'text-white/80': variant === 'gradient' || variant === 'dark',
            'text-slate-600': variant === 'default'
          }"
        >
          {{ subtitle }}
        </p>
        
        <!-- CTAボタン -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <!-- プライマリーCTA -->
          <NuxtLink 
            :to="primaryTo"
            class="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
            :class="{
              'bg-white text-matsuha hover:bg-kinari': variant === 'gradient',
              'bg-shu text-white hover:bg-shu/90': variant === 'dark',
              'bg-matsuha text-white hover:bg-matsuha/90': variant === 'default'
            }"
          >
            {{ primaryLabel }}
            <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
          
          <!-- セカンダリーCTA -->
          <NuxtLink 
            :to="secondaryTo"
            class="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300"
            :class="{
              'text-white hover:bg-white/10': variant === 'gradient' || variant === 'dark',
              'text-slate-700 hover:bg-slate-200': variant === 'default'
            }"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {{ secondaryLabel }}
          </NuxtLink>
        </div>
        
        <!-- 追加情報（互恵性の強化） -->
        <div 
          class="mt-10 pt-8 border-t"
          :class="{
            'border-white/20': variant === 'gradient' || variant === 'dark',
            'border-slate-200': variant === 'default'
          }"
        >
          <p 
            class="text-sm"
            :class="{
              'text-white/60': variant === 'gradient' || variant === 'dark',
              'text-slate-500': variant === 'default'
            }"
          >
            📞 お電話でのお問い合わせ: 
            <a 
              href="tel:048-872-6822" 
              class="font-medium hover:underline"
              :class="{
                'text-white/90': variant === 'gradient' || variant === 'dark',
                'text-slate-700': variant === 'default'
              }"
            >
              048-872-6822
            </a>
            <span class="mx-2">|</span>
            月〜金 9:00-17:00
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

