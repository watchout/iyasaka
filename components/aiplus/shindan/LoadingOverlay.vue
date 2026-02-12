<script setup lang="ts">
/**
 * 診断中ローディングオーバーレイ
 * 送信後 1.5秒の演出
 */
</script>

<template>
  <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm">
    <!-- スピナー -->
    <div class="w-16 h-16 border-4 border-aiplus-light border-t-aiplus-blue rounded-full animate-spin mb-8" />

    <p class="text-xl font-bold text-aiplus-navy mb-2">
      診断中...
    </p>
    <p class="text-sm text-gray-500">
      御社のAI活用ポテンシャルを分析しています
    </p>
  </div>
</template>
