<script setup lang="ts">
import { districts } from '@/app/data/districts'

const { getCopy, getPatternId, trackImpression } = useCopyTest()

const heroCopy = computed(() => getCopy('hero/main_copy'))
const heroSubCopy = computed(() => getCopy('hero/sub_copy'))

const query = ref('')
const emit = defineEmits<{
  (e: 'navigate-district', id: string): void
  (e: 'submit-query', query: string): void
}>()

function handleSubmit() {
  if (query.value.trim()) {
    emit('submit-query', query.value.trim())
  }
}

function navigateToDistrict(id: string) {
  emit('navigate-district', id)
}

const districtLabels: Record<string, string> = {
  hotel: 'ホテル',
  infra: '弱電',
  venue: '配信/イベント',
  genba: '現場DX',
  ai: 'AI'
}

const districtIcons: Record<string, string> = {
  hotel: 'i-heroicons-building-office',
  infra: 'i-heroicons-bolt',
  venue: 'i-heroicons-video-camera',
  genba: 'i-heroicons-clipboard-document-list',
  ai: 'i-heroicons-cpu-chip'
}

const heroRef = ref<HTMLElement>()
onMounted(() => {
  if (heroCopy.value) {
    trackImpression('hero', 'main_copy', heroCopy.value.id)
  }
})
</script>

<template>
  <section
    ref="heroRef"
    class="relative min-h-[80vh] flex items-center overflow-hidden"
    data-section="hero"
    :data-pattern-id="heroCopy?.id"
  >
    <!-- ボクセルアート背景画像 -->
    <div class="absolute inset-0">
      <img
        :src="`/images/hero/pattern-${Math.floor(Math.random() * 4) + 1}.png`"
        alt="IYASAKA Town"
        class="w-full h-full object-cover"
      >
      <div class="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/60" />
    </div>

    <!-- コンテンツ -->
    <div class="relative z-10 container mx-auto px-4 py-20 lg:py-32">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="font-mincho text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight mb-6 drop-shadow-sm">
          <template v-if="heroCopy?.id === 'hero_main_001'">
            この街は、<span class="text-amber-600">AIが動かしている。</span>
          </template>
          <template v-else>
            {{ heroCopy?.text }}
          </template>
        </h1>

        <form class="max-w-xl mx-auto mb-10" @submit.prevent="handleSubmit">
          <div class="relative">
            <input
              v-model="query"
              type="text"
              :placeholder="heroSubCopy?.text || 'あなたの業種と悩みを教えてください'"
              class="w-full px-6 py-4 pr-14 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 shadow-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 transition-all"
            >
            <button
              type="submit"
              class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
            >
              <span class="text-lg">&#8594;</span>
            </button>
          </div>
        </form>

        <div class="flex flex-wrap justify-center gap-3">
          <button
            v-for="district in districts"
            :key="district.id"
            class="flex items-center gap-2 px-5 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-full text-gray-700 shadow-sm hover:bg-white hover:border-amber-400 hover:text-amber-600 transition-all"
            @click="navigateToDistrict(district.id)"
          >
            <UIcon :name="districtIcons[district.id] || 'i-heroicons-building-office'" class="w-5 h-5" />
            <span class="text-sm font-medium">{{ districtLabels[district.id] || district.id }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- AI生成表示 -->
    <div class="absolute bottom-16 left-1/2 -translate-x-1/2 z-10">
      <p class="text-sm md:text-base font-medium text-gray-800 bg-white/60 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm">
        このサイトはAIがリアルタイムで生成・構築・運用しています
      </p>
    </div>

    <div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-400 animate-bounce">
      <UIcon name="i-heroicons-chevron-down" class="w-8 h-8" />
    </div>
  </section>
</template>
