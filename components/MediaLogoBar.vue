<script setup lang="ts">
/**
 * メディア掲載ロゴバー
 * 心理学原理：社会的証明（Social Proof）+ 権威性（Authority）
 * - 有名メディアのロゴを横並びで表示
 * - 無限スクロールアニメーションで視線を引く
 * - グレースケールでコンテンツを邪魔しない
 */
import { mediaLogos } from '~/app/data/media'

interface Props {
  title?: string
  showTitle?: boolean
  animate?: boolean
  grayscale?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'メディア掲載実績',
  showTitle: true,
  animate: true,
  grayscale: true
})
</script>

<template>
  <section class="py-8 bg-gradient-to-r from-slate-50 to-slate-100 border-y border-slate-200/50 overflow-hidden">
    <div class="container mx-auto px-4">
      <!-- タイトル -->
      <p 
        v-if="showTitle" 
        class="text-center text-xs uppercase tracking-[0.2em] text-slate-500 mb-6 font-medium"
      >
        {{ title }}
      </p>
      
      <!-- ロゴスライダー -->
      <div class="relative">
        <!-- グラデーションマスク（左右） -->
        <div class="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div class="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-100 to-transparent z-10 pointer-events-none" />
        
        <!-- スクロールコンテナ -->
        <div 
          class="flex items-center gap-12"
          :class="{ 'animate-scroll': animate }"
        >
          <!-- ロゴを2回繰り返して無限スクロール効果 -->
          <template v-for="n in 2" :key="n">
            <div
              v-for="logo in mediaLogos"
              :key="`${n}-${logo.id}`"
              class="flex-shrink-0"
            >
              <img
                :src="logo.src"
                :alt="logo.name"
                class="h-8 w-auto object-contain transition-all duration-300"
                :class="{
                  'grayscale opacity-60 hover:grayscale-0 hover:opacity-100': grayscale,
                  'opacity-80': !grayscale
                }"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-scroll {
  animation: scroll 30s linear infinite;
}

.animate-scroll:hover {
  animation-play-state: paused;
}
</style>


