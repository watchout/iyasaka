<script setup lang="ts">
/**
 * 顧客の声カード
 * 心理学原理：社会的証明 + ストーリーテリング + 権威性
 * - 引用符で「誰かが言った」ことを強調
 * - 顔写真で実在感・信頼性を高める
 * - 役職・会社名で権威性を付与
 */
import type { Testimonial } from '~/app/data/testimonials'

interface Props {
  testimonial: Testimonial
  variant?: 'default' | 'featured' | 'compact'
}

withDefaults(defineProps<Props>(), {
  variant: 'default'
})
</script>

<template>
  <article 
    class="relative"
    :class="{
      'bg-white rounded-2xl shadow-lg p-8 border border-slate-100': variant === 'default' || variant === 'featured',
      'bg-slate-50 rounded-xl p-6': variant === 'compact',
      'ring-2 ring-matsuha/20': variant === 'featured'
    }"
  >
    <!-- 引用符アイコン -->
    <div 
      class="absolute -top-4 left-8 w-10 h-10 rounded-full flex items-center justify-center"
      :class="{
        'bg-matsuha text-white': variant === 'featured',
        'bg-slate-200 text-slate-500': variant !== 'featured'
      }"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
    </div>
    
    <!-- 星評価 -->
    <div v-if="testimonial.rating" class="flex gap-1 mb-4 mt-2">
      <template v-for="i in 5" :key="i">
        <svg 
          class="w-5 h-5" 
          :class="i <= testimonial.rating ? 'text-amber-400' : 'text-slate-200'"
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </template>
    </div>
    
    <!-- 引用文 -->
    <blockquote 
      class="text-slate-700 leading-relaxed"
      :class="{
        'text-lg': variant === 'featured',
        'text-base': variant === 'default',
        'text-sm': variant === 'compact'
      }"
    >
      {{ testimonial.quote }}
    </blockquote>
    
    <!-- 著者情報 -->
    <footer class="mt-6 flex items-center gap-4">
      <!-- アバター -->
      <div 
        class="rounded-full overflow-hidden bg-slate-200 flex-shrink-0"
        :class="{
          'w-14 h-14': variant !== 'compact',
          'w-10 h-10': variant === 'compact'
        }"
      >
        <img 
          v-if="testimonial.avatar"
          :src="testimonial.avatar" 
          :alt="testimonial.author"
          class="w-full h-full object-cover"
        />
        <div 
          v-else 
          class="w-full h-full flex items-center justify-center text-slate-400 font-bold"
        >
          {{ testimonial.author.charAt(0) }}
        </div>
      </div>
      
      <!-- 名前・役職・会社 -->
      <div>
        <p class="font-bold text-slate-900">{{ testimonial.author }}</p>
        <p class="text-sm text-slate-500">
          {{ testimonial.role }}
          <span v-if="testimonial.company"> / {{ testimonial.company }}</span>
        </p>
      </div>
    </footer>
    
    <!-- サービスバッジ -->
    <div v-if="testimonial.service" class="mt-4">
      <span class="inline-block px-3 py-1 text-xs font-medium rounded-full bg-matsuha/10 text-matsuha">
        {{ testimonial.service }}
      </span>
    </div>
  </article>
</template>


