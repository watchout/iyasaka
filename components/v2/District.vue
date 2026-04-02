<script setup lang="ts">
import type { District } from '@/app/data/districts'

const props = defineProps<{
  district: District
  index: number
}>()

const isReversed = computed(() => props.index % 2 !== 0)
const sectionRef = ref<HTMLElement>()
const isVisible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.05, rootMargin: '100px' }
  )
  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
  // フォールバック: 2秒後に全街区を表示
  setTimeout(() => { isVisible.value = true }, 2000)
})

// 画像パターンのランダム選択
const imagePattern = computed(() => {
  return Math.floor(Math.random() * props.district.imagePatterns) + 1
})

const imagePath = computed(() => {
  return `/images/districts/${props.district.id}/pattern-${imagePattern.value}.png`
})

// ニュースは最初の2件を表示
const displayNews = computed(() => {
  return props.district.newsExamples.slice(0, 2)
})

const districtIcons: Record<string, string> = {
  hotel: 'i-heroicons-building-office',
  infra: 'i-heroicons-bolt',
  venue: 'i-heroicons-video-camera',
  genba: 'i-heroicons-clipboard-document-list',
  ai: 'i-heroicons-cpu-chip'
}

const emit = defineEmits<{
  (e: 'open-chat', districtId: string): void
}>()
</script>

<template>
  <section
    :id="`district-${district.id}`"
    ref="sectionRef"
    class="py-16 lg:py-24 transition-all duration-700"
    :class="[
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      index % 2 === 0 ? 'bg-[#0f1a2e]' : 'bg-[#152238]'
    ]"
  >
    <div class="container mx-auto px-4">
      <div
        class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto"
        :class="{ 'lg:grid-flow-dense': isReversed }"
      >
        <!-- 画像エリア -->
        <div :class="{ 'lg:col-start-2': isReversed }">
          <div class="relative aspect-video rounded-xl overflow-hidden bg-[#1a2d4d] border border-white/5">
            <img :src="imagePath" :alt="district.name" class="w-full h-full object-cover" loading="lazy">
          </div>
        </div>

        <!-- テキストエリア -->
        <div :class="{ 'lg:col-start-1': isReversed }">
          <!-- 街区名 -->
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-400/10 rounded-lg">
              <UIcon :name="districtIcons[district.id] || 'i-heroicons-building-office'" class="w-6 h-6 text-amber-400" />
            </div>
            <h2 class="font-mincho text-2xl md:text-3xl text-white">
              {{ district.name }}
            </h2>
          </div>

          <!-- この街区の「不」 -->
          <p class="text-lg text-white/70 mb-6 italic">
            「{{ district.tagline }}」
          </p>

          <!-- AI相談役 -->
          <div class="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10 mb-6">
            <div class="w-8 h-8 flex items-center justify-center bg-amber-400/20 rounded-full shrink-0 mt-0.5">
              <UIcon name="i-heroicons-cpu-chip" class="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p class="text-amber-400 text-sm font-medium mb-1">{{ district.aiAdvisor }}</p>
              <p class="text-white/60 text-sm">
                こんにちは。{{ district.name.replace('街区', '') }}業界のAI活用についてご相談ください。
              </p>
            </div>
          </div>

          <!-- 業界ニュース -->
          <div class="space-y-3 mb-6">
            <p class="text-white/40 text-xs font-medium uppercase tracking-wider">Latest AI News</p>
            <div
              v-for="(news, i) in displayNews"
              :key="i"
              class="flex items-start gap-2 text-sm text-white/60"
            >
              <span class="text-amber-400 mt-0.5 shrink-0">-</span>
              <span>{{ news }}</span>
            </div>
          </div>

          <!-- CTA -->
          <div class="flex flex-wrap gap-3">
            <button
              class="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-[#0f1a2e] rounded-full font-medium hover:bg-amber-300 transition-colors"
              @click="emit('open-chat', district.id)"
            >
              <UIcon name="i-heroicons-chat-bubble-left-right" class="w-5 h-5" />
              詳しく聞く
            </button>
            <NuxtLink
              :to="district.lpPath"
              class="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white/80 rounded-full hover:bg-white/5 transition-colors"
            >
              {{ district.product }} を見る
              <span>&#8594;</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
