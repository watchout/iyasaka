<script setup lang="ts">
import { districts } from '@/app/data/districts'

const { initSelections } = useCopyTest()
initSelections()

const activeChatDistrict = ref<string | null>(null)

function handleNavigateDistrict(id: string) {
  const el = document.getElementById(`district-${id}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

function handleSubmitQuery(_query: string) {
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
  <div class="min-h-screen bg-[#f8f7f5]">
    <V2VoxelHero
      @navigate-district="handleNavigateDistrict"
      @submit-query="handleSubmitQuery"
    />

    <V2District
      v-for="(district, index) in districts"
      :key="district.id"
      :district="district"
      :index="index"
      @open-chat="handleOpenChat"
    />

    <V2Ending />


    <!-- チャットパネル -->
    <Teleport to="body">
      <Transition name="slide">
        <div
          v-if="activeChatDistrict"
          class="fixed inset-y-0 right-0 w-full md:w-[420px] bg-white border-l border-gray-200 z-50 flex flex-col shadow-2xl"
        >
          <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-full">
                <UIcon name="i-heroicons-cpu-chip" class="w-4 h-4 text-amber-600" />
              </div>
              <span class="text-gray-900 font-medium text-sm">
                {{ districts.find(d => d.id === activeChatDistrict)?.aiAdvisor || 'AI相談役' }}
              </span>
            </div>
            <button
              class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
              @click="closeChat"
            >
              <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
            </button>
          </div>

          <div class="flex-1 flex items-center justify-center p-6">
            <div class="text-center text-gray-400">
              <UIcon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 mx-auto mb-3" />
              <p class="text-sm mb-2">AIチャット（Phase 2で実装）</p>
              <p class="text-xs">Anthropic Claude Sonnet APIで応答予定</p>
            </div>
          </div>

          <div class="p-4 border-t border-gray-100">
            <div class="flex gap-2">
              <input
                type="text"
                placeholder="メッセージを入力..."
                disabled
                class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 text-sm cursor-not-allowed"
              >
              <button
                disabled
                class="w-10 h-10 flex items-center justify-center bg-amber-400 text-white rounded-full cursor-not-allowed opacity-50"
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
