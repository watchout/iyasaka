<script setup lang="ts">
/**
 * 代表者プロフィール
 * 心理学原理：権威性（Authority）+ ハロー効果 + ストーリーテリング
 * - 資格・経歴で専門性を訴求
 * - 顔写真で人間味・信頼感を醸成
 * - パーソナルなメッセージで共感を創出
 */
import { representative } from '~/app/data/team'

interface Props {
  variant?: 'full' | 'compact' | 'card'
  showQualifications?: boolean
  showAchievements?: boolean
  showSocialLinks?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'full',
  showQualifications: true,
  showAchievements: true,
  showSocialLinks: true
})
</script>

<template>
  <section 
    class="relative overflow-hidden"
    :class="{
      'py-20 bg-gradient-to-br from-slate-50 to-kinari': variant === 'full',
      'p-8 bg-white rounded-2xl shadow-lg border border-slate-100': variant === 'card'
    }"
  >
    <!-- 背景装飾 -->
    <div 
      v-if="variant === 'full'"
      class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-matsuha/5 to-transparent pointer-events-none" 
    />
    
    <div class="container mx-auto px-4 relative">
      <div 
        class="grid gap-12 items-center"
        :class="{
          'lg:grid-cols-2': variant === 'full',
          'md:grid-cols-[200px_1fr]': variant === 'card'
        }"
      >
        <!-- 写真側 -->
        <div 
          class="relative"
          :class="{
            'lg:order-2': variant === 'full'
          }"
        >
          <div 
            class="relative rounded-3xl overflow-hidden shadow-2xl"
            :class="{
              'aspect-[4/5] max-w-md mx-auto': variant === 'full',
              'aspect-square w-48': variant === 'card'
            }"
          >
            <!-- 写真 -->
            <img 
              :src="representative.avatar" 
              :alt="representative.name"
              class="w-full h-full object-cover"
            />
            
            <!-- オーバーレイ -->
            <div class="absolute inset-0 bg-gradient-to-t from-matsuha/80 via-transparent to-transparent" />
            
            <!-- 名前・役職（写真上） -->
            <div 
              v-if="variant === 'full'"
              class="absolute bottom-0 left-0 right-0 p-6 text-white"
            >
              <p class="text-sm font-medium opacity-80">{{ representative.role }}</p>
              <h3 class="text-2xl font-bold">{{ representative.name }}</h3>
            </div>
          </div>
          
          <!-- 装飾（ドット） -->
          <div 
            v-if="variant === 'full'"
            class="absolute -bottom-4 -left-4 w-24 h-24 bg-matsuha/10 rounded-full -z-10" 
          />
          <div 
            v-if="variant === 'full'"
            class="absolute -top-4 -right-4 w-16 h-16 bg-shu/10 rounded-full -z-10" 
          />
        </div>
        
        <!-- テキスト側 -->
        <div :class="{ 'lg:order-1': variant === 'full' }">
          <!-- セクションタイトル -->
          <div v-if="variant === 'full'" class="mb-8">
            <p class="text-sm font-medium text-matsuha uppercase tracking-widest mb-2">
              About the Founder
            </p>
            <h2 class="text-3xl lg:text-4xl font-bold text-slate-900">
              代表メッセージ
            </h2>
          </div>
          
          <!-- カード版の名前 -->
          <div v-if="variant === 'card'" class="mb-4">
            <p class="text-sm text-matsuha font-medium">{{ representative.role }}</p>
            <h3 class="text-xl font-bold text-slate-900">{{ representative.name }}</h3>
          </div>
          
          <!-- Bio -->
          <p 
            class="text-slate-600 leading-relaxed whitespace-pre-line"
            :class="{
              'text-lg': variant === 'full',
              'text-sm': variant === 'card'
            }"
          >
            {{ representative.bio }}
          </p>
          
          <!-- 資格 -->
          <div v-if="showQualifications && representative.qualifications?.length" class="mt-8">
            <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              資格・認定
            </h4>
            <ul class="flex flex-wrap gap-2">
              <li 
                v-for="(q, i) in representative.qualifications" 
                :key="i"
                class="px-3 py-1 text-xs font-medium rounded-full bg-matsuha/10 text-matsuha"
              >
                {{ q }}
              </li>
            </ul>
          </div>
          
          <!-- 実績 -->
          <div v-if="showAchievements && representative.achievements?.length" class="mt-6">
            <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              実績
            </h4>
            <ul class="space-y-2">
              <li 
                v-for="(a, i) in representative.achievements" 
                :key="i"
                class="flex items-start gap-2 text-sm text-slate-600"
              >
                <svg class="w-5 h-5 text-shu flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                {{ a }}
              </li>
            </ul>
          </div>
          
          <!-- ソーシャルリンク -->
          <div 
            v-if="showSocialLinks && representative.socialLinks" 
            class="mt-8 flex gap-4"
          >
            <a 
              v-if="representative.socialLinks.note"
              :href="representative.socialLinks.note"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 hover:bg-matsuha hover:text-white transition-colors text-sm font-medium"
            >
              <span>📝</span> note
            </a>
            <a 
              v-if="representative.socialLinks.linkedin"
              :href="representative.socialLinks.linkedin"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 hover:bg-[#0077B5] hover:text-white transition-colors text-sm font-medium"
            >
              <span>💼</span> LinkedIn
            </a>
          </div>
          
          <!-- CTA -->
          <div v-if="variant === 'full'" class="mt-10">
            <NuxtLink 
              to="/company/story"
              class="inline-flex items-center gap-2 text-matsuha font-medium hover:text-matsuha/80 transition-colors"
            >
              創業ストーリーを読む
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


