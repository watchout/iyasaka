<script setup lang="ts">
/**
 * 回答サマリーバー
 *
 * 回答済みの設問をチップで表示し、タップで即座にその設問に戻れる。
 * 未回答の設問はグレーアウト、現在の設問はハイライト表示。
 */
import { questionHeaders, getAnswerSummaryLabel } from '~/app/data/aiplus-shindan'
import type { ShindanAnswers } from '~/app/types/aiplus-shindan'

const props = defineProps<{
  currentStep: number
  answers: ShindanAnswers
}>()

const emit = defineEmits<{
  (e: 'jump', step: number): void
}>()

const shortLabels = ['業種', '人数', '手作業', '時間', '課題', '目標', '情報']

const chips = computed(() => {
  return questionHeaders.slice(0, 6).map((header, idx) => {
    const step = idx + 1
    const answerLabel = getAnswerSummaryLabel(step, props.answers)
    const isAnswered = answerLabel !== ''
    const isCurrent = props.currentStep === step
    return {
      step,
      shortLabel: shortLabels[idx],
      answerLabel,
      isAnswered,
      isCurrent,
      canJump: isAnswered && !isCurrent,
    }
  })
})

const handleJump = (step: number, canJump: boolean): void => {
  if (canJump) {
    emit('jump', step)
  }
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="chip in chips"
      :key="chip.step"
      type="button"
      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all border"
      :class="[
        chip.isCurrent
          ? 'border-aiplus-blue bg-aiplus-light text-aiplus-navy font-bold'
          : chip.isAnswered
            ? 'border-gray-200 bg-white text-gray-700 hover:border-aiplus-blue/50 cursor-pointer'
            : 'border-gray-100 bg-gray-50 text-gray-300 cursor-default',
      ]"
      :disabled="!chip.canJump"
      @click="handleJump(chip.step, chip.canJump)"
    >
      <span class="font-medium">{{ chip.shortLabel }}</span>
      <span
        v-if="chip.isAnswered"
        class="text-aiplus-blue truncate max-w-[6rem]"
      >
        {{ chip.answerLabel }}
      </span>
    </button>
  </div>
</template>
