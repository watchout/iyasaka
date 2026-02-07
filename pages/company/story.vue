<script setup lang="ts">
/**
 * 創業ストーリーページ
 * AIEO対応: BreadcrumbList スキーマ出力
 *
 * 心理学原理:
 * 1. ストーリーテリング（Narrative Transportation）- 物語に没入させて説得
 * 2. コントラスト効果 - 困難からの成長を強調
 * 3. 権威性 - 経験と実績で信頼性を構築
 * 4. 単純接触効果 - ブランドの人間味を伝える
 */
import { foundingStory } from '~/app/data/story'
import { representative } from '~/app/data/team'
import { breadcrumbLd } from '~/app/utils/ld'

// 感情に応じた装飾色
const emotionColors = {
  struggle: 'from-red-500/20 to-orange-500/20',
  'turning-point': 'from-amber-500/20 to-yellow-500/20',
  growth: 'from-emerald-500/20 to-teal-500/20',
  vision: 'from-matsuha/20 to-emerald-500/20'
}

const emotionIcons = {
  struggle: '⛈️',
  'turning-point': '💡',
  growth: '🌱',
  vision: '🚀'
}

// パンくずリスト JSON-LD
const breadcrumb = breadcrumbLd([
  { name: 'ホーム', path: '/' },
  { name: '会社概要', path: '/company' },
  { name: 'ストーリー', path: '/company/story' }
])

// SEO
useSeoMeta({
  title: '創業ストーリー | IYASAKA',
  description: '20年間の現場経験から生まれた「統括パートナー」という答え。IYASAKAの創業ストーリーをご紹介します。',
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
    <section class="relative py-32 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-matsuha/80">
      <!-- 背景装飾 -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute inset-0 opacity-10">
          <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="story-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#story-pattern)" />
          </svg>
        </div>
        <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-matsuha/20 to-transparent" />
      </div>
      
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-3xl">
          <p class="text-sm font-medium text-matsuha uppercase tracking-widest mb-4 animate-fade-in-up">
            Our Story
          </p>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-up" style="animation-delay: 0.1s">
            {{ foundingStory.prologue.title }}
          </h1>
          <p class="text-xl text-white/70 leading-relaxed whitespace-pre-line animate-fade-in-up" style="animation-delay: 0.2s">
            {{ foundingStory.prologue.lead }}
          </p>
        </div>
      </div>
    </section>
    
    
    <!-- ===== CHAPTERS ===== -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          
          <!-- 各チャプター -->
          <div 
            v-for="(chapter, index) in foundingStory.chapters"
            :key="chapter.id"
            class="relative mb-24 last:mb-0"
          >
            <!-- タイムライン装飾（左側の線） -->
            <div 
              v-if="index < foundingStory.chapters.length - 1"
              class="absolute left-[39px] top-20 bottom-0 w-0.5 bg-gradient-to-b from-matsuha/30 to-transparent"
            />
            
            <div class="flex gap-8">
              <!-- 年代マーカー -->
              <div class="flex-shrink-0">
                <div 
                  class="w-20 h-20 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg"
                  :class="{
                    'bg-red-500': chapter.emotion === 'struggle',
                    'bg-amber-500': chapter.emotion === 'turning-point',
                    'bg-emerald-500': chapter.emotion === 'growth',
                    'bg-matsuha': chapter.emotion === 'vision'
                  }"
                >
                  <span class="text-2xl">{{ emotionIcons[chapter.emotion] }}</span>
                </div>
                <p class="text-center text-sm font-medium text-slate-500 mt-2">
                  {{ chapter.year }}
                </p>
              </div>
              
              <!-- コンテンツ -->
              <div class="flex-1">
                <!-- 画像（あれば） -->
                <div 
                  v-if="chapter.image"
                  class="mb-6 rounded-2xl overflow-hidden shadow-lg aspect-[16/9] bg-slate-200"
                >
                  <img 
                    :src="chapter.image" 
                    :alt="chapter.title"
                    class="w-full h-full object-cover"
                  />
                </div>
                
                <!-- タイトル -->
                <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                  {{ chapter.title }}
                </h2>
                
                <!-- 本文 -->
                <div 
                  class="prose prose-lg max-w-none"
                >
                  <p 
                    v-for="(paragraph, pIndex) in chapter.content.split('\n\n')"
                    :key="pIndex"
                    class="text-slate-600 leading-relaxed whitespace-pre-line"
                  >
                    {{ paragraph }}
                  </p>
                </div>
                
                <!-- 感情グラデーションバー -->
                <div 
                  class="mt-8 h-1 w-32 rounded-full bg-gradient-to-r"
                  :class="emotionColors[chapter.emotion]"
                />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
    
    
    <!-- ===== EPILOGUE ===== -->
    <section class="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
            {{ foundingStory.epilogue.title }}
          </h2>
          <p class="text-xl text-slate-600 leading-relaxed whitespace-pre-line">
            {{ foundingStory.epilogue.content }}
          </p>
        </div>
      </div>
    </section>
    
    
    <!-- ===== MISSION & VALUES ===== -->
    <section class="py-20 bg-matsuha text-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          
          <!-- ミッション -->
          <div class="text-center mb-16">
            <p class="text-sm font-medium text-white/60 uppercase tracking-widest mb-4">
              Mission
            </p>
            <h2 class="text-4xl md:text-5xl font-bold mb-4">
              {{ foundingStory.mission.statement }}
            </h2>
            <p class="text-xl text-white/70">
              {{ foundingStory.mission.description }}
            </p>
          </div>
          
          <!-- バリュー -->
          <div class="grid md:grid-cols-3 gap-8">
            <div 
              v-for="value in foundingStory.values"
              :key="value.title"
              class="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm"
            >
              <h3 class="text-xl font-bold mb-3">{{ value.title }}</h3>
              <p class="text-white/70">{{ value.description }}</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
    
    
    <!-- ===== FOUNDER QUOTE ===== -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="grid md:grid-cols-[200px_1fr] gap-12 items-center">
            <!-- 写真 -->
            <div class="mx-auto md:mx-0">
              <div class="w-48 h-48 rounded-full overflow-hidden shadow-2xl bg-slate-200">
                <img 
                  :src="representative.avatar" 
                  :alt="representative.name"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <!-- 引用 -->
            <div>
              <svg class="w-12 h-12 text-matsuha/20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <blockquote class="text-2xl md:text-3xl font-bold text-slate-900 leading-relaxed mb-6">
                技術は手段に過ぎない。<br />
                本当に必要なのは、「人が変わっても回る仕組み」をつくることだ。
              </blockquote>
              <footer>
                <p class="font-bold text-slate-900">{{ representative.name }}</p>
                <p class="text-slate-500">{{ representative.role }} / {{ representative.title }}</p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    
    <!-- ===== CTA ===== -->
    <CtaSection 
      title="一緒に「弥栄」を目指しませんか"
      subtitle="私たちの想いに共感いただけましたら、ぜひお話しさせてください。"
      primary-label="お問い合わせ"
      primary-to="/contact"
      secondary-label="会社概要を見る"
      secondary-to="/company"
      variant="dark"
    />
    
  </div>
</template>

<style>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out both;
}
</style>





