<script setup lang="ts">
/**
 * メディア向けページ（プレスルーム）
 * 
 * 心理学原理:
 * 1. 互恵性 - プレスキットを無料提供
 * 2. 権威性 - メディア掲載実績を並べて信頼性を構築
 * 3. 認知的流暢性 - 記者が必要な情報に素早くアクセス
 */
import { mediaCoverages, pressReleases, pressKit, mediaLogos } from '~/app/data/media'

// 日付フォーマット
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
}

// カテゴリラベル
const categoryLabels: Record<string, string> = {
  product: '製品・サービス',
  partnership: '提携・協業',
  award: '受賞',
  company: '会社情報'
}

// タイプアイコン
const typeIcons: Record<string, string> = {
  article: '📰',
  interview: '🎙️',
  mention: '📝',
  tv: '📺'
}

// SEO
useSeoMeta({
  title: 'プレスルーム | IYASAKA',
  description: 'IYASAKAのプレスリリース、メディア掲載情報、プレスキットをご覧いただけます。取材のお問い合わせもこちらから。',
})
</script>

<template>
  <div class="min-h-screen">
    
    <!-- ===== HERO ===== -->
    <section class="relative py-24 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
      <!-- 背景装飾 -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-matsuha/10 to-transparent" />
        <div class="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-shu/10 to-transparent" />
      </div>
      
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-3xl">
          <p class="text-sm font-medium text-matsuha uppercase tracking-widest mb-4">
            Press Room
          </p>
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">
            プレスルーム
          </h1>
          <p class="text-xl text-white/70 leading-relaxed">
            プレスリリース、メディア掲載情報、取材用素材を<br class="hidden md:block" />
            ご覧いただけます。
          </p>
        </div>
      </div>
    </section>
    
    
    <!-- ===== MEDIA COVERAGE ===== -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        
        <!-- セクションヘッダー -->
        <div class="flex items-end justify-between mb-12">
          <div>
            <p class="text-sm font-medium text-matsuha uppercase tracking-widest mb-2">
              Media Coverage
            </p>
            <h2 class="text-3xl font-bold text-slate-900">メディア掲載</h2>
          </div>
        </div>
        
        <!-- メディアロゴ -->
        <div class="flex flex-wrap items-center justify-center gap-8 mb-12 py-8 border-y border-slate-100">
          <div 
            v-for="logo in mediaLogos"
            :key="logo.id"
            class="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all"
          >
            <img 
              :src="logo.src" 
              :alt="logo.name"
              class="h-8 w-auto object-contain"
            />
          </div>
        </div>
        
        <!-- 掲載リスト -->
        <div class="space-y-6">
          <article 
            v-for="coverage in mediaCoverages"
            :key="coverage.id"
            class="group flex gap-6 p-6 rounded-2xl border border-slate-100 hover:border-matsuha/20 hover:shadow-lg transition-all"
            :class="{ 'bg-matsuha/5 border-matsuha/20': coverage.featured }"
          >
            <!-- 日付・タイプ -->
            <div class="flex-shrink-0 text-center w-20">
              <span class="text-3xl">{{ typeIcons[coverage.type] }}</span>
              <p class="text-xs text-slate-500 mt-2">
                {{ formatDate(coverage.date).split('年')[0] }}年
              </p>
            </div>
            
            <!-- コンテンツ -->
            <div class="flex-1 min-w-0">
              <!-- 注目バッジ -->
              <span 
                v-if="coverage.featured"
                class="inline-block px-2 py-0.5 text-xs font-bold rounded bg-shu text-white mb-2"
              >
                注目
              </span>
              
              <!-- メディア名 -->
              <p class="text-sm text-matsuha font-medium mb-1">
                {{ coverage.outlet }}
              </p>
              
              <!-- タイトル -->
              <h3 class="text-lg font-bold text-slate-900 group-hover:text-matsuha transition-colors mb-2">
                <a v-if="coverage.url" :href="coverage.url" target="_blank" rel="noopener noreferrer">
                  {{ coverage.title }}
                </a>
                <span v-else>{{ coverage.title }}</span>
              </h3>
              
              <!-- 抜粋 -->
              <p v-if="coverage.excerpt" class="text-sm text-slate-600">
                {{ coverage.excerpt }}
              </p>
            </div>
            
            <!-- 日付 -->
            <div class="flex-shrink-0 text-right">
              <time class="text-sm text-slate-500">
                {{ formatDate(coverage.date) }}
              </time>
            </div>
          </article>
        </div>
        
      </div>
    </section>
    
    
    <!-- ===== PRESS RELEASES ===== -->
    <section class="py-16 bg-slate-50">
      <div class="container mx-auto px-4">
        
        <!-- セクションヘッダー -->
        <div class="mb-12">
          <p class="text-sm font-medium text-matsuha uppercase tracking-widest mb-2">
            Press Releases
          </p>
          <h2 class="text-3xl font-bold text-slate-900">プレスリリース</h2>
        </div>
        
        <!-- リリースリスト -->
        <div class="grid md:grid-cols-2 gap-6">
          <article 
            v-for="release in pressReleases"
            :key="release.id"
            class="group bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-all"
          >
            <!-- カテゴリ・日付 -->
            <div class="flex items-center gap-3 mb-4">
              <span 
                class="px-3 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-blue-100 text-blue-700': release.category === 'product',
                  'bg-purple-100 text-purple-700': release.category === 'partnership',
                  'bg-amber-100 text-amber-700': release.category === 'award',
                  'bg-slate-100 text-slate-700': release.category === 'company'
                }"
              >
                {{ categoryLabels[release.category] }}
              </span>
              <time class="text-sm text-slate-500">
                {{ formatDate(release.date) }}
              </time>
            </div>
            
            <!-- タイトル -->
            <h3 class="text-lg font-bold text-slate-900 group-hover:text-matsuha transition-colors mb-3">
              {{ release.title }}
            </h3>
            
            <!-- サマリー -->
            <p class="text-sm text-slate-600 mb-4">
              {{ release.summary }}
            </p>
            
            <!-- リンク -->
            <NuxtLink 
              :to="`/news/${release.slug}`"
              class="inline-flex items-center gap-1 text-sm font-medium text-matsuha hover:text-matsuha/80 transition-colors"
            >
              詳細を読む
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
          </article>
        </div>
        
      </div>
    </section>
    
    
    <!-- ===== PRESS KIT ===== -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        
        <div class="max-w-4xl mx-auto">
          <!-- セクションヘッダー -->
          <div class="text-center mb-12">
            <p class="text-sm font-medium text-matsuha uppercase tracking-widest mb-2">
              Press Kit
            </p>
            <h2 class="text-3xl font-bold text-slate-900 mb-4">{{ pressKit.title }}</h2>
            <p class="text-lg text-slate-600">{{ pressKit.description }}</p>
          </div>
          
          <!-- ダウンロードアイテム -->
          <div class="grid md:grid-cols-2 gap-6 mb-12">
            <div 
              v-for="item in pressKit.items"
              :key="item.name"
              class="group p-6 rounded-2xl border-2 border-slate-100 hover:border-matsuha transition-all"
            >
              <div class="flex items-start gap-4">
                <!-- アイコン -->
                <div class="w-12 h-12 rounded-xl bg-matsuha/10 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-matsuha" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </div>
                
                <!-- 情報 -->
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-slate-900 mb-1">{{ item.name }}</h3>
                  <p class="text-sm text-slate-500 mb-2">{{ item.description }}</p>
                  <p class="text-xs text-slate-400">{{ item.fileSize }}</p>
                </div>
              </div>
              
              <!-- ダウンロードボタン -->
              <a 
                :href="item.downloadUrl"
                class="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-matsuha hover:text-white transition-all"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                ダウンロード
              </a>
            </div>
          </div>
          
          <!-- 取材窓口 -->
          <div class="bg-slate-50 rounded-3xl p-8 md:p-12">
            <div class="text-center">
              <h3 class="text-2xl font-bold text-slate-900 mb-4">取材のお問い合わせ</h3>
              <p class="text-slate-600 mb-8">{{ pressKit.contact.note }}</p>
              
              <div class="flex flex-col md:flex-row items-center justify-center gap-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-matsuha/10 flex items-center justify-center">
                    <svg class="w-5 h-5 text-matsuha" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="text-xs text-slate-500">Email</p>
                    <a href="mailto:press@iyasaka.co.jp" class="font-medium text-matsuha hover:underline">
                      {{ pressKit.contact.email }}
                    </a>
                  </div>
                </div>
                
                <div class="hidden md:block w-px h-8 bg-slate-200" />
                
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-matsuha/10 flex items-center justify-center">
                    <svg class="w-5 h-5 text-matsuha" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="text-xs text-slate-500">TEL（{{ pressKit.contact.department }}）</p>
                    <a href="tel:048-872-6822" class="font-medium text-matsuha hover:underline">
                      {{ pressKit.contact.phone }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
    
  </div>
</template>





