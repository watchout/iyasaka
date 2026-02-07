<script setup lang="ts">
/**
 * IYASAKA About / Vision ページ
 * ブランド・マスター・プロトコルに基づく企業理念とビジョン
 * 農業は「未来の展望」として静かに提示
 */
import { categories } from '~/app/data/products'

// コアバリュー
const coreValues = [
  {
    icon: '🏭',
    title: '現場第一主義',
    description: '綺麗なコードやスペックよりも、現場の「溜息」を消すことを優先する。'
  },
  {
    icon: '➕',
    title: 'プラスの精神',
    description: '既存の努力や歴史を否定せず、そこに技術を「プラス」して価値を最大化する。'
  },
  {
    icon: '♻️',
    title: '弥栄の循環',
    description: '一社勝ちではなく、顧客、その先の利用者、地域社会が等しく潤う仕組みを設計する。'
  }
]

// SEO
useSeoMeta({
  title: 'IYASAKAについて | 不を光へ、ともに弥栄',
  description: 'IYASAKAは現場の「不」を「光」へ変換し、ともに弥栄する循環を実装するチームです。社名に込めた想いと、未来へのビジョンをお伝えします。',
  ogTitle: 'IYASAKAについて | 不を光へ、ともに弥栄',
  ogDescription: '現場の「不」を「光」へ変換し、ともに弥栄する循環を実装するチーム。',
})
</script>

<template>
  <main class="min-h-screen">
    
    <!-- ヒーロー -->
    <section class="py-24 bg-gradient-to-br from-[#1a365d] to-[#0f2341] relative overflow-hidden">
      <!-- 背景装飾 -->
      <div class="absolute inset-0">
        <div class="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-3xl" />
        <div class="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-teal-500/10 blur-3xl" />
      </div>
      
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-3xl mx-auto text-center">
          <p class="text-amber-400 text-sm font-medium uppercase tracking-widest mb-4">
            About IYASAKA
          </p>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            弥栄<span class="text-white/60 text-2xl md:text-3xl ml-2">（いやさか）</span>
          </h1>
          <p class="text-xl text-white/70 leading-relaxed">
            「弥（いや）」は「いよいよ・ますます」<br />
            「栄（さか）」は「栄える・繁栄する」<br />
            <strong class="text-white">ともに、ますます繁栄していく。</strong><br />
            それがIYASAKAの願いです。
          </p>
        </div>
      </div>
    </section>
    
    
    <!-- ミッション -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16">
            <p class="text-sm font-medium text-primary uppercase tracking-widest mb-3">
              Mission
            </p>
            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              今ある<span class="text-red-500">「不」</span>を、<br />
              未来の<span class="text-amber-500">「光」</span>へ。
            </h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              IYASAKAは、単なるIT企業ではありません。<br />
              私たちは、現場に潜む「不」を「光」へと変換し、<br />
              関わるすべての人・地域が共に繁栄する<br />
              「弥栄（いやさか）」の循環を実装するチームです。
            </p>
          </div>
          
          <!-- ナラティブ・ループ図解 -->
          <div class="bg-gray-50 rounded-3xl p-8 md:p-12">
            <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <div class="text-center">
                <div class="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center text-3xl mb-2 mx-auto">
                  😰
                </div>
                <p class="font-bold text-gray-900">不</p>
                <p class="text-sm text-gray-500">痛み・課題</p>
              </div>
              
              <svg class="w-8 h-8 text-gray-300 rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              
              <div class="text-center">
                <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl mb-2 mx-auto">
                  🔧
                </div>
                <p class="font-bold text-gray-900">仕組み</p>
                <p class="text-sm text-gray-500">IYASAKA</p>
              </div>
              
              <svg class="w-8 h-8 text-gray-300 rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              
              <div class="text-center">
                <div class="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-3xl mb-2 mx-auto">
                  ✨
                </div>
                <p class="font-bold text-gray-900">光</p>
                <p class="text-sm text-gray-500">解決・希望</p>
              </div>
              
              <svg class="w-8 h-8 text-gray-300 rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              
              <div class="text-center">
                <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-3xl mb-2 mx-auto">
                  🌱
                </div>
                <p class="font-bold text-gray-900">弥栄</p>
                <p class="text-sm text-gray-500">繁栄・循環</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    
    <!-- コアバリュー -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <p class="text-sm font-medium text-primary uppercase tracking-widest mb-3">
            Core Values
          </p>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
            私たちの価値観
          </h2>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div 
            v-for="value in coreValues"
            :key="value.title"
            class="bg-white rounded-2xl p-8 text-center shadow-sm"
          >
            <div class="text-5xl mb-4">{{ value.icon }}</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ value.title }}</h3>
            <p class="text-gray-600">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>
    
    
    <!-- 3つの柱 -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <p class="text-sm font-medium text-primary uppercase tracking-widest mb-3">
            Narrative OS
          </p>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            3つの変換動詞
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            IYASAKAの全ての事業は、この3つのフェーズで課題を解決します。
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div 
            v-for="(cat, key) in categories"
            :key="key"
            class="rounded-2xl p-8"
            :style="{ backgroundColor: cat.color + '10', borderLeft: `4px solid ${cat.color}` }"
          >
            <div class="text-4xl mb-4">{{ cat.icon }}</div>
            <h3 
              class="text-2xl font-bold mb-2"
              :style="{ color: cat.color }"
            >
              {{ cat.name }}
            </h3>
            <p class="text-gray-500 text-sm mb-4">{{ cat.english }}</p>
            <p class="text-gray-600">{{ cat.description }}</p>
          </div>
        </div>
      </div>
    </section>
    
    
    <!-- ビジョン（農業への布石） -->
    <section class="py-24 bg-gradient-to-br from-green-900 to-green-800 relative overflow-hidden">
      <!-- 背景装飾 -->
      <div class="absolute inset-0 opacity-10">
        <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="vision-pattern-2" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vision-pattern-2)" />
        </svg>
      </div>
      
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <p class="text-sm font-medium text-green-300 uppercase tracking-widest mb-3">
              Our Vision
            </p>
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
              弥栄の究極のかたち
            </h2>
          </div>
          
          <div class="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12">
            <p class="text-xl text-white/90 leading-relaxed mb-8">
              私たちが現場の効率化で生み出す<strong class="text-green-300">「余白」</strong>——<br />
              それは単なる時間の節約ではありません。
            </p>
            
            <p class="text-lg text-white/80 leading-relaxed mb-8">
              いつかその余白が、<strong class="text-green-300">命の循環</strong>へと還元される日を夢見ています。<br />
              大地を耕し、食を育み、次世代へ繋ぐ。<br />
              テクノロジーが生み出した余裕が、人間らしい営みへと回帰する——<br />
              それがIYASAKAの描く、究極の「弥栄」です。
            </p>
            
            <div class="flex flex-wrap justify-center gap-4 mt-10">
              <span class="px-5 py-2 rounded-full bg-white/10 text-white text-sm font-medium border border-white/20">
                🌾 農業
              </span>
              <span class="px-5 py-2 rounded-full bg-white/10 text-white text-sm font-medium border border-white/20">
                🍃 持続可能性
              </span>
              <span class="px-5 py-2 rounded-full bg-white/10 text-white text-sm font-medium border border-white/20">
                ♻️ 命の循環
              </span>
              <span class="px-5 py-2 rounded-full bg-white/10 text-white text-sm font-medium border border-white/20">
                🌏 次世代への贈り物
              </span>
            </div>
          </div>
          
          <p class="text-center text-white/60 text-sm mt-8">
            ※ 農業事業は未来の展望として構想中です
          </p>
        </div>
      </div>
    </section>
    
    
    <!-- CTA -->
    <section class="py-20 bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
            一緒に「弥栄」しませんか？
          </h2>
          <p class="text-lg text-white/70 mb-10">
            あなたの現場の「不」を、ともに「光」へ変えましょう。
          </p>
          
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <NuxtLink 
              to="/contact"
              class="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl bg-amber-500 text-white text-lg font-bold hover:bg-amber-400 transition-colors"
            >
              お問い合わせ
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </NuxtLink>
            
            <NuxtLink 
              to="/services"
              class="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-xl text-white border border-white/20 hover:bg-white/10 transition-colors font-medium"
            >
              ソリューションを見る
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
    
  </main>
</template>

<style scoped>
.text-primary {
  color: #1a365d;
}
</style>



