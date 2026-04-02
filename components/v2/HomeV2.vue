<script setup lang="ts">
import { districts } from '@/app/data/districts'

useSeoMeta({
  title: 'IYASAKA | AIが息づく街',
  description: 'ホテルAI、弱電DX、配信、現場可視化、カスタムAI。各業界に特化したAIソリューションで、現場の「不」を「光」へ。',
  ogTitle: 'IYASAKA | AIが息づく街',
  ogDescription: '各業界に特化したAIソリューションで、現場の「不」を「光」へ。',
  ogType: 'website'
})

const activeChatDistrict = ref<string | null>(null)

function handleNavigateDistrict(id: string) {
  const el = document.getElementById(`district-${id}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

function handleSubmitQuery(query: string) {
  // Phase 1: AI街区のチャットを開く（将来的にはクエリ解析で適切な街区を選択）
  activeChatDistrict.value = 'ai'
}

function handleOpenChat(districtId: string) {
  activeChatDistrict.value = districtId
}

function closeChat() {
  activeChatDistrict.value = null
}
</script>

<template>
  <div class="min-h-screen bg-[#0f1a2e]">
    <!-- ヒーロー -->
    <V2VoxelHero
      @navigate-district="handleNavigateDistrict"
      @submit-query="handleSubmitQuery"
    />

    <!-- 5街区 -->
    <V2District
      v-for="(district, index) in districts"
      :key="district.id"
      :district="district"
      :index="index"
      @open-chat="handleOpenChat"
    />

    <!-- エンディング -->
    <V2Ending />

    <!-- フッター補足 -->
    <div class="py-6 bg-[#0a1020] text-center">
      <p class="text-white/30 text-sm">
        このサイトはAIが生成・構築・運用しています
      </p>
    </div>

    <!-- チャットパネル（Phase 1: プレースホルダー） -->
    <Teleport to="body">
      <Transition name="slide">
        <div
          v-if="activeChatDistrict"
          class="fixed inset-y-0 right-0 w-full md:w-[420px] bg-[#152238] border-l border-white/10 z-50 flex flex-col"
        >
          <!-- チャットヘッダー -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 flex items-center justify-center bg-amber-400/20 rounded-full">
                <UIcon name="i-heroicons-cpu-chip" class="w-4 h-4 text-amber-400" />
              </div>
              <span class="text-white font-medium text-sm">
                {{ districts.find(d => d.id === activeChatDistrict)?.aiAdvisor || 'AI相談役' }}
              </span>
            </div>
            <button
              class="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              @click="closeChat"
            >
              <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
            </button>
          </div>

          <!-- チャット本体（Phase 1: プレースホルダー） -->
          <div class="flex-1 flex items-center justify-center p-6">
            <div class="text-center text-white/40">
              <UIcon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 mx-auto mb-3" />
              <p class="text-sm mb-2">AIチャット（Phase 2で実装）</p>
              <p class="text-xs">Anthropic Claude Sonnet APIで応答予定</p>
            </div>
          </div>

          <!-- 入力欄（プレースホルダー） -->
          <div class="p-4 border-t border-white/10">
            <div class="flex gap-2">
              <input
                type="text"
                placeholder="メッセージを入力..."
                disabled
                class="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/30 text-sm cursor-not-allowed"
              >
              <button
                disabled
                class="w-10 h-10 flex items-center justify-center bg-amber-400/50 text-[#0f1a2e] rounded-full cursor-not-allowed"
              >
                <span>&#8594;</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-out;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
