<script setup lang="ts">
import { districts } from '@/app/data/districts'

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

const districtIcons: Record<string, string> = {
  hotel: 'i-heroicons-building-office',
  infra: 'i-heroicons-bolt',
  venue: 'i-heroicons-video-camera',
  genba: 'i-heroicons-clipboard-document-list',
  ai: 'i-heroicons-cpu-chip'
}
</script>

<template>
  <section class="relative min-h-[80vh] flex items-center bg-[#0f1a2e] overflow-hidden">
    <!-- 背景グラデーション -->
    <div class="absolute inset-0 bg-gradient-to-b from-[#0f1a2e] via-[#152238] to-[#1a2d4d]" />

    <!-- ボクセルアート背景画像 -->
    <div class="absolute inset-0 opacity-30">
      <img
        :src="`/images/hero/pattern-${Math.floor(Math.random() * 4) + 1}.png`"
        alt="IYASAKA Town"
        class="w-full h-full object-cover"
      >
    </div>

    <!-- コンテンツ -->
    <div class="relative z-10 container mx-auto px-4 py-20 lg:py-32">
      <div class="max-w-3xl mx-auto text-center">
        <!-- キャッチコピー -->
        <h1 class="font-mincho text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
          この街は、<span class="text-amber-400">AIが動かしている。</span>
        </h1>

        <!-- テキスト入力欄 -->
        <form class="max-w-xl mx-auto mb-10" @submit.prevent="handleSubmit">
          <div class="relative">
            <input
              v-model="query"
              type="text"
              placeholder="あなたの業種と悩みを教えてください"
              class="w-full px-6 py-4 pr-14 bg-white/10 backdrop-blur border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 transition-all"
            >
            <button
              type="submit"
              class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-amber-400 text-[#0f1a2e] rounded-full hover:bg-amber-300 transition-colors"
            >
              <span class="text-lg">&#8594;</span>
            </button>
          </div>
        </form>

        <!-- 街区ショートカットボタン -->
        <div class="flex flex-wrap justify-center gap-3">
          <button
            v-for="district in districts"
            :key="district.id"
            class="flex items-center gap-2 px-5 py-3 bg-white/5 backdrop-blur border border-white/10 rounded-full text-white/80 hover:bg-white/10 hover:border-amber-400/30 hover:text-amber-400 transition-all"
            @click="navigateToDistrict(district.id)"
          >
            <UIcon :name="districtIcons[district.id] || 'i-heroicons-building-office'" class="w-5 h-5" />
            <span class="text-sm font-medium">{{ district.name.replace('街区', '') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 下向き矢印 -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
      <UIcon name="i-heroicons-chevron-down" class="w-8 h-8" />
    </div>
  </section>
</template>
