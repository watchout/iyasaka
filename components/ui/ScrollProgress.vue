<script setup lang="ts">
/**
 * ScrollProgress - Apple風スクロールプログレスバー
 * ページ上部に表示されるスクロール進捗インジケーター
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const progressRef = ref<HTMLDivElement | null>(null)
const progress = ref(0)

onMounted(() => {
  if (!import.meta.client) return
  
  gsap.registerPlugin(ScrollTrigger)
  
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      progress.value = self.progress * 100
    }
  })
})
</script>

<template>
  <div 
    ref="progressRef"
    class="fixed top-0 left-0 right-0 h-1 z-[100] pointer-events-none"
  >
    <div 
      class="h-full bg-gradient-to-r from-akatsuki to-amber-500 transition-all duration-100 ease-out"
      :style="{ width: `${progress}%` }"
    />
  </div>
</template>

