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
  setTimeout(() => { isVisible.value = true }, 2000)
})

const imagePattern = computed(() => {
  return Math.floor(Math.random() * props.district.imagePatterns) + 1
})

const imagePath = computed(() => {
  return `/images/districts/${props.district.id}/pattern-${imagePattern.value}.png`
})

const displayNews = computed(() => {
  return props.district.newsExamples.slice(0, 2)
})

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
      index % 2 === 0 ? 'bg-[#f8f7f5]' : 'bg-white'
    ]"
  >
    <div class="container mx-auto px-4">
      <div
        class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto"
        :class="{ 'lg:grid-flow-dense': isReversed }"
      >
        <!-- 画像エリア -->
        <div :class="{ 'lg:col-start-2': isReversed }">
          <div class="relative aspect-video rounded-xl overflow-hidden shadow-lg">
            <img :src="imagePath" :alt="district.pain" class="w-full h-full object-cover" loading="lazy">
          </div>
        </div>

        <!-- テキストエリア -->
        <div :class="{ 'lg:col-start-1': isReversed }">
          <!-- この業界の「不」（街区名は表示しない） -->
          <p class="font-mincho text-xl md:text-2xl text-gray-900 mb-6 leading-relaxed">
            「{{ district.tagline }}」
          </p>

          <!-- AI相談役 -->
          <div class="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-100 mb-6">
            <div class="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-full shrink-0 mt-0.5">
              <UIcon name="i-heroicons-cpu-chip" class="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p class="text-amber-700 text-sm font-medium mb-1">{{ district.aiAdvisor }}</p>
              <p class="text-gray-600 text-sm">
                {{ district.pain }}についてご相談ください。
              </p>
            </div>
          </div>

          <!-- 業界ニュース -->
          <div class="space-y-3 mb-6">
            <p class="text-gray-400 text-xs font-medium uppercase tracking-wider">Latest AI News</p>
            <div
              v-for="(news, i) in displayNews"
              :key="i"
              class="flex items-start gap-2 text-sm text-gray-600"
            >
              <span class="text-amber-500 mt-0.5 shrink-0">-</span>
              <span>{{ news }}</span>
            </div>
          </div>

          <!-- CTA -->
          <div class="flex flex-wrap gap-3">
            <button
              class="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 transition-colors shadow-sm"
              @click="emit('open-chat', district.id)"
            >
              <UIcon name="i-heroicons-chat-bubble-left-right" class="w-5 h-5" />
              詳しく聞く
            </button>
            <NuxtLink
              :to="district.lpPath"
              class="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
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
