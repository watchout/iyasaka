<script setup lang="ts">
/**
 * 診断プログレスバー
 * 「1 / 7」テキスト + アニメーション付きバー
 */
const props = defineProps<{
  currentStep: number
  totalSteps: number
}>()

const progressPercent = computed(() =>
  Math.round((props.currentStep / props.totalSteps) * 100)
)
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-aiplus-navy">
        {{ currentStep }} / {{ totalSteps }}
      </span>
      <span class="text-sm text-gray-400">
        {{ progressPercent }}%
      </span>
    </div>
    <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        class="h-full bg-aiplus-blue rounded-full transition-all duration-500 ease-out"
        :style="{ width: `${progressPercent}%` }"
      />
    </div>
  </div>
</template>
