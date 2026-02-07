<script setup lang="ts">
/**
 * IYASAKA ソリューション一覧ページ
 * 3つの柱（整える/つなぐ/育てる）で製品を分類
 */
import { 
  products, 
  categories,
  getProductsByCategory,
  type ProductCategory
} from '~/app/data/products'

// カテゴリ順序
const categoryOrder: ProductCategory[] = ['organize', 'connect', 'nurture']

// SEO
useSeoMeta({
  title: 'ソリューション一覧 | IYASAKA - 不を光へ',
  description: 'IYASAKAの全ソリューション。整える（Foundation）・つなぐ（Expansion）・育てる（Evolution）の3つの柱で、現場の課題を解決します。',
  ogTitle: 'ソリューション一覧 | IYASAKA',
  ogDescription: '整える・つなぐ・育てるの3つの柱で現場の課題を解決。',
})
</script>

<template>
  <main class="min-h-screen">
    
    <!-- ヒーロー -->
    <section class="py-20 bg-gradient-to-br from-[#1a365d] to-[#2c5282] relative overflow-hidden">
      <!-- 背景装飾 -->
      <div class="absolute inset-0 opacity-10">
        <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="services-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#services-pattern)" />
        </svg>
      </div>
      
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">
            <span class="text-red-400">「不」</span>を<span class="text-amber-400">「光」</span>へ変える<br />
            ソリューション
          </h1>
          <p class="text-xl text-white/70 mb-8">
            IYASAKAは3つの変換動詞で、現場の課題を解決します。
          </p>
          
          <!-- 3つの柱ナビ -->
          <div class="flex flex-wrap justify-center gap-4">
            <a 
              v-for="key in categoryOrder"
              :key="key"
              :href="`#${key}`"
              class="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium border border-white/20 transition-colors"
            >
              {{ categories[key].icon }} {{ categories[key].name }}
            </a>
          </div>
        </div>
      </div>
    </section>
    
    
    <!-- 製品一覧（カテゴリ別） -->
    <template v-for="(catKey, catIndex) in categoryOrder" :key="catKey">
      <section 
        :id="catKey"
        class="py-20"
        :class="catIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
      >
        <div class="container mx-auto px-4">
          <!-- カテゴリヘッダー -->
          <div class="max-w-3xl mb-16">
            <div class="flex items-center gap-3 mb-4">
              <span 
                class="text-4xl w-16 h-16 rounded-2xl flex items-center justify-center"
                :style="{ backgroundColor: categories[catKey].color + '20' }"
              >
                {{ categories[catKey].icon }}
              </span>
              <div>
                <h2 
                  class="text-3xl md:text-4xl font-bold"
                  :style="{ color: categories[catKey].color }"
                >
                  {{ categories[catKey].name }}
                </h2>
                <p class="text-gray-500">{{ categories[catKey].english }}</p>
              </div>
            </div>
            
            <p class="text-lg text-gray-600 mb-6">
              {{ categories[catKey].description }}
            </p>
            
            <!-- 不 → 光 -->
            <div class="flex flex-wrap gap-6 text-sm">
              <div>
                <span class="text-red-500 font-medium">不：</span>
                <span class="text-gray-600">
                  {{ catKey === 'organize' ? '不透明、不安、属人化' : catKey === 'connect' ? '分断、孤立、伝わらない' : '形骸化、余裕の欠如' }}
                </span>
              </div>
              <div>
                <span class="text-amber-500 font-medium">光：</span>
                <span class="text-gray-600">
                  {{ catKey === 'organize' ? '確信、可視化、安心' : catKey === 'connect' ? '接続、共鳴、グローバル' : '循環、共創、持続可能性' }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- 製品カード -->
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="product in getProductsByCategory(catKey)"
              :key="product.id"
              class="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <!-- ヘッダー -->
              <div 
                class="p-6 pb-4"
                :style="{ borderBottom: `3px solid ${categories[catKey].color}` }"
              >
                <h3 class="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                  {{ product.title }}
                </h3>
                <p class="text-gray-500 text-sm">{{ product.subtitle }}</p>
              </div>
              
              <!-- コンテンツ -->
              <div class="p-6 space-y-4">
                <!-- 不 → 光 -->
                <div class="space-y-2">
                  <div class="flex items-start gap-2">
                    <span class="text-red-400 text-sm mt-0.5">●</span>
                    <p class="text-sm text-gray-600">{{ product.pain }}</p>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-amber-400 text-sm mt-0.5">●</span>
                    <p class="text-sm text-gray-800 font-medium">{{ product.light }}</p>
                  </div>
                </div>
                
                <!-- 弥栄（ベネフィット） -->
                <div class="pt-4 border-t">
                  <p class="text-sm text-gray-600">
                    <span class="text-green-600 font-medium">弥栄：</span>
                    {{ product.keyResult }}
                  </p>
                </div>
                
                <!-- よくある状況（代表例） -->
                <ul v-if="product.commonPains?.length" class="pt-2 text-sm text-gray-600 space-y-1">
                  <li v-for="pain in product.commonPains.slice(0, 3)" :key="pain" class="flex items-start gap-2">
                    <span class="text-gray-400 mt-0.5">-</span>
                    <span>{{ pain }}</span>
                  </li>
                </ul>
              </div>
              
              <!-- フッター -->
              <div class="p-6 pt-0">
                <NuxtLink
                  :to="`/contact?p_id=${product.id}`"
                  class="block w-full py-3 rounded-lg text-center font-medium transition-colors"
                  :style="{ 
                    backgroundColor: categories[catKey].color,
                    color: 'white'
                  }"
                >
                  {{ product.primaryCta.label }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
    
    
    <!-- CTA -->
    <section class="py-20 bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
            どれを選べばいいか分からない？
          </h2>
          <p class="text-lg text-white/70 mb-10">
            ご安心ください。あなたの「不」を伺い、<br class="hidden md:inline" />
            最適なソリューションをご提案します。
          </p>
          
          <NuxtLink 
            to="/contact"
            class="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-amber-500 text-white text-lg font-bold hover:bg-amber-400 transition-colors"
          >
            無料相談を申し込む
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
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



