<script setup lang="ts">
/**
 * 統計カウンター
 * 心理学原理：アンカリング（Anchoring）+ 社会的証明
 * - 大きな数字で最初に印象付け
 * - カウントアップアニメーションで注目を集める
 */
import { ref, onMounted, computed } from 'vue'

interface Props {
  value: string | number
  label: string
  suffix?: string
  prefix?: string
  duration?: number
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  suffix: '',
  prefix: '',
  duration: 2000,
  delay: 0
})

const displayValue = ref(0)
const isVisible = ref(false)
const counterRef = ref<HTMLElement | null>(null)

// 数値部分を抽出
const numericValue = computed(() => {
  const str = String(props.value)
  const match = str.match(/[\d,]+/)
  return match ? parseInt(match[0].replace(/,/g, ''), 10) : 0
})

// カウントアップアニメーション
const animateCount = () => {
  const start = 0
  const end = numericValue.value
  const startTime = performance.now()
  
  const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)
  
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    
    displayValue.value = Math.floor(easeOutQuart(progress) * end)
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      displayValue.value = end
    }
  }
  
  setTimeout(() => {
    requestAnimationFrame(animate)
  }, props.delay)
}

// Intersection Observer でビューポートに入ったらアニメーション開始
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isVisible.value) {
          isVisible.value = true
          animateCount()
        }
      })
    },
    { threshold: 0.5 }
  )
  
  if (counterRef.value) {
    observer.observe(counterRef.value)
  }
})

// フォーマット済み表示値
const formattedValue = computed(() => {
  return displayValue.value.toLocaleString()
})
</script>

<template>
  <div 
    ref="counterRef"
    class="text-center group"
  >
    <div class="relative">
      <!-- 数値 -->
      <p class="text-4xl md:text-5xl lg:text-6xl font-bold text-matsuha tracking-tight">
        <span v-if="prefix" class="text-2xl md:text-3xl">{{ prefix }}</span>
        <span class="tabular-nums">{{ formattedValue }}</span>
        <span v-if="suffix" class="text-2xl md:text-3xl text-matsuha/70">{{ suffix }}</span>
      </p>
      
      <!-- アンダーライン装飾 -->
      <div class="mt-2 h-1 bg-gradient-to-r from-transparent via-matsuha/30 to-transparent w-full max-w-[120px] mx-auto" />
    </div>
    
    <!-- ラベル -->
    <p class="mt-3 text-sm md:text-base text-slate-600 font-medium">
      {{ label }}
    </p>
  </div>
</template>


