<template>
  <div
    v-if="show"
    class="fixed bottom-6 right-4 md:right-6 z-40"
  >
    <button
      ref="trigger"
      class="flex items-center gap-2 rounded-full bg-matsuha text-white px-4 py-3 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-matsuha/80 transition"
      aria-controls="chatwidget-panel"
      :aria-expanded="panelOpen ? 'true' : 'false'"
      @click="panelOpen = !panelOpen"
    >
      <span class="text-lg">💬</span>
      <span class="text-sm font-semibold">AIチャット（準備中）</span>
    </button>

    <div
      v-if="panelOpen"
      id="chatwidget-panel"
      class="mt-3 w-72 rounded-2xl bg-white shadow-2xl border border-matsuha/20 p-4 text-sm text-sumi"
      role="status"
    >
      <p class="font-semibold mb-1">AIチャット</p>
      <p class="text-sumi/70">
        現在ベータ準備中です。正式リリースまで少々お待ちください。
      </p>
      <NuxtLink
        to="/contact"
        class="mt-4 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-sumi text-white hover:bg-sumi/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sumi/70"
        @click="panelOpen = false"
      >
        お問い合わせへ
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { site } from '@/app/site'

const show = site.featureFlags.enableAiChat
const panelOpen = ref(false)
const trigger = ref<HTMLButtonElement | null>(null)

if (process.client) {
  watch(panelOpen, (open) => {
    if (!open) {
      trigger.value?.focus()
    }
  })
}
</script>


