<script setup lang="ts">
/**
 * Neo-Japanesque Hero Section
 * 
 * Design Philosophy: 陰影礼賛 (In Praise of Shadows)
 * - 墨色の深い背景から光が滲み出す
 * - 縦書き + 横書きの組み合わせ
 * - 和紙のようなノイズテクスチャ
 * - 「不」→「光」の変換を視覚的に表現
 * 
 * CRO強化: リード獲得を最大化するコピーとCTA
 */
import { ref, onMounted } from 'vue'

const heroRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

onMounted(() => {
  // CSS遷移でアニメーション
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<template>
  <section 
    ref="heroRef"
    class="relative min-h-screen flex items-center justify-center overflow-hidden"
    style="background-color: #141414;"
  >
    <!-- 和紙ノイズオーバーレイ（強調） -->
    <div class="absolute inset-0 washi-noise opacity-[0.06] pointer-events-none" />
    
    <!-- 光のエフェクト（右上から滲み出す暁光） -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <!-- メイン暁光グラデーション -->
      <div 
        class="absolute top-0 right-0 w-[90vw] h-[90vh] translate-x-1/4 -translate-y-1/4"
        :class="[
          'transition-all duration-[2500ms] ease-out',
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        ]"
        style="
          background: radial-gradient(ellipse at center, 
            rgba(255, 158, 0, 0.18) 0%, 
            rgba(255, 158, 0, 0.08) 25%, 
            rgba(255, 158, 0, 0.02) 50%,
            transparent 70%
          );
        "
      />
      
      <!-- セカンダリの光（松葉色） -->
      <div 
        class="absolute bottom-0 left-0 w-[70vw] h-[70vh] -translate-x-1/3 translate-y-1/3"
        :class="[
          'transition-all duration-[3000ms] delay-500 ease-out',
          isVisible ? 'opacity-100' : 'opacity-0'
        ]"
        style="
          background: radial-gradient(ellipse at center, 
            rgba(47, 111, 79, 0.12) 0%, 
            transparent 60%
          );
        "
      />
    </div>
    
    <!-- メインコンテンツ -->
    <div class="container mx-auto px-6 lg:px-12 relative z-10">
      <div class="max-w-5xl mx-auto">
        
        <!-- 縦書きアクセント（装飾的） -->
        <div 
          class="absolute right-4 lg:right-0 top-1/2 -translate-y-1/2 hidden lg:block"
          :class="[
            'transition-all duration-1000 delay-1000',
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          ]"
        >
          <p 
            class="text-kinari/15 text-sm tracking-[0.6em] font-mincho"
            style="writing-mode: vertical-rl;"
          >
            今ある不を未来の光へ
          </p>
        </div>
        
        <!-- メインヘッドライン -->
        <div class="text-center space-y-10">
          
          <!-- キャッチコピー -->
          <div 
            :class="[
              'transition-all duration-1000 ease-out',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            ]"
          >
            <h1 class="text-5xl md:text-7xl lg:text-8xl font-oldMincho font-bold leading-[1.15] tracking-tight">
              <span class="text-kinari/95">今ある</span>
              <span class="text-[#E63946] relative inline-block mx-2">
                「不」
                <!-- 不のアンダーライン -->
                <span class="absolute -bottom-2 left-0 w-full h-1 bg-[#E63946]/60 rounded-full" />
              </span>
              <span class="text-kinari/95">を、</span>
              <br class="md:hidden" />
              <span class="text-kinari/95">未来の</span>
              <span class="text-gyoko relative inline-block mx-2 cta-glow">
                「光」
                <!-- 光のグロー（強化） -->
                <span 
                  class="absolute inset-0 blur-xl bg-gyoko/40 -z-10 animate-pulse-slow"
                  :class="[
                    'transition-opacity duration-1500 delay-1200',
                    isVisible ? 'opacity-100' : 'opacity-0'
                  ]"
                />
              </span>
              <span class="text-kinari/95">へ。</span>
            </h1>
          </div>
          
          <!-- サブコピー（CRO強化版） -->
          <div 
            :class="[
              'transition-all duration-1000 delay-300 ease-out',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            ]"
          >
            <p class="text-lg md:text-xl lg:text-2xl text-kinari/70 font-mincho leading-relaxed max-w-3xl mx-auto">
              <span class="text-kinari/90">現場の溜息を、テクノロジーの体温で希望に変える。</span><br class="hidden md:block" />
              インフラからAIまで、現場を知り尽くしたIYASAKAが<br class="hidden lg:block" />
              一気通貫の<span class="text-matsuha font-bold">「弥栄（いやさか）」</span>を実装します。
            </p>
          </div>
          
          <!-- 3つの柱 -->
          <div 
            class="flex flex-wrap justify-center gap-8 md:gap-14 pt-6"
            :class="[
              'transition-all duration-1000 delay-500 ease-out',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            ]"
          >
            <div class="flex items-center gap-3 text-kinari/60 hover:text-kinari/90 transition-colors cursor-default">
              <span class="text-2xl md:text-3xl">🔧</span>
              <span class="font-mincho text-lg md:text-xl">整える</span>
            </div>
            <div class="flex items-center gap-3 text-kinari/60 hover:text-kinari/90 transition-colors cursor-default">
              <span class="text-2xl md:text-3xl">🔗</span>
              <span class="font-mincho text-lg md:text-xl">つなぐ</span>
            </div>
            <div class="flex items-center gap-3 text-kinari/60 hover:text-kinari/90 transition-colors cursor-default">
              <span class="text-2xl md:text-3xl">🌱</span>
              <span class="font-mincho text-lg md:text-xl">育てる</span>
            </div>
          </div>
          
          <!-- CTA ボタン（CRO強化版） -->
          <div 
            class="flex flex-col sm:flex-row items-center justify-center gap-5 pt-10"
            :class="[
              'transition-all duration-1000 delay-700 ease-out',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            ]"
          >
            <!-- メインCTA（発光エフェクト付き） -->
            <NuxtLink 
              to="/contact"
              class="group relative inline-flex items-center gap-3 px-10 py-5 overflow-hidden rounded-xl"
            >
              <!-- 発光エフェクト -->
              <span class="absolute inset-0 bg-gyoko rounded-xl cta-glow-effect" />
              <span class="absolute inset-0 bg-gradient-to-r from-gyoko via-amber-400 to-gyoko bg-[length:200%_100%] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
              
              <!-- ボタンテキスト -->
              <span class="relative text-sumi font-bold text-lg">
                無料で現場の「不」を相談する
              </span>
              <svg class="relative w-5 h-5 text-sumi transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </NuxtLink>
            
            <!-- セカンダリCTA -->
            <NuxtLink 
              to="/services"
              class="inline-flex items-center gap-2 px-6 py-4 text-kinari/60 hover:text-kinari transition-colors font-mincho text-lg border border-kinari/20 rounded-xl hover:border-kinari/40 hover:bg-kinari/5"
            >
              ソリューションを見る
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
          </div>
          
        </div>
        
      </div>
    </div>
    
    <!-- スクロールインジケーター -->
    <div 
      class="absolute bottom-10 left-1/2 -translate-x-1/2"
      :class="[
        'transition-all duration-1000 delay-1500',
        isVisible ? 'opacity-100' : 'opacity-0'
      ]"
    >
      <div class="flex flex-col items-center gap-3 text-kinari/25">
        <span class="text-xs tracking-[0.3em] font-garamond uppercase">Scroll</span>
        <div class="w-px h-14 bg-gradient-to-b from-kinari/30 to-transparent scroll-indicator" />
      </div>
    </div>
    
  </section>
</template>

<style scoped>
/* 和紙ノイズ背景（強調） */
.washi-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

/* CTA発光エフェクト */
.cta-glow-effect {
  box-shadow: 
    0 0 20px rgba(255, 158, 0, 0.4),
    0 0 40px rgba(255, 158, 0, 0.2),
    0 0 60px rgba(255, 158, 0, 0.1);
  animation: cta-pulse 2s ease-in-out infinite;
}

@keyframes cta-pulse {
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(255, 158, 0, 0.4),
      0 0 40px rgba(255, 158, 0, 0.2),
      0 0 60px rgba(255, 158, 0, 0.1);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(255, 158, 0, 0.5),
      0 0 50px rgba(255, 158, 0, 0.3),
      0 0 80px rgba(255, 158, 0, 0.15);
  }
}

/* 光のテキストグロー */
.cta-glow {
  text-shadow: 0 0 30px rgba(255, 158, 0, 0.5);
}

/* シマーアニメーション */
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.animate-shimmer {
  animation: shimmer 3s linear infinite;
}

/* ゆっくりパルス */
.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}

/* スクロールインジケーター */
.scroll-indicator {
  animation: scroll-bounce 2s ease-in-out infinite;
}

@keyframes scroll-bounce {
  0%, 100% { transform: translateY(0); opacity: 0.3; }
  50% { transform: translateY(8px); opacity: 0.6; }
}
</style>




