<script setup lang="ts">
/**
 * AIPlus shindan -- Report confirmation modal
 *
 * v2 small-step CTA: "Would you like us to send you a report?"
 * Displayed when user clicks the main CTA on the result page.
 */

const props = defineProps<{
  visible: boolean
  email: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const confirmed = ref(false)

const handleConfirm = (): void => {
  confirmed.value = true
  emit('confirm')
}

const handleCancel = (): void => {
  if (!confirmed.value) {
    emit('cancel')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleCancel"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" />

        <!-- Modal -->
        <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8">

          <!-- Confirmed state -->
          <template v-if="confirmed">
            <div class="text-center py-4">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-aiplus-navy mb-2">
                ありがとうございます
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                3営業日以内に<br>
                <strong class="text-aiplus-navy">{{ email }}</strong><br>
                にレポートをお届けします。
              </p>
            </div>
          </template>

          <!-- Confirmation state -->
          <template v-else>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-aiplus-light flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-aiplus-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-aiplus-navy">
                レポートをお送りします
              </h3>
            </div>

            <div class="bg-gray-50 rounded-xl p-4 mb-4">
              <p class="text-sm text-gray-500 mb-1">送付先</p>
              <p class="text-sm font-medium text-aiplus-navy">{{ email }}</p>
            </div>

            <p class="text-sm text-gray-600 mb-3">
              以下の内容をまとめたレポートを<br>
              <strong>3営業日以内</strong>にお届けします:
            </p>

            <ul class="space-y-2 mb-6">
              <li class="flex items-start gap-2 text-sm text-gray-700">
                <svg class="w-4 h-4 text-aiplus-blue shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span>御社と同業他社のAI導入事例</span>
              </li>
              <li class="flex items-start gap-2 text-sm text-gray-700">
                <svg class="w-4 h-4 text-aiplus-blue shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span>御社に最適なAI活用プラン</span>
              </li>
              <li class="flex items-start gap-2 text-sm text-gray-700">
                <svg class="w-4 h-4 text-aiplus-blue shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span>想定される時間削減効果の詳細</span>
              </li>
            </ul>

            <button
              type="button"
              class="w-full px-6 py-4 bg-aiplus-cta text-white font-bold text-base rounded-full shadow-aiplus-cta hover:bg-aiplus-cta-hover hover:shadow-aiplus-cta-hover transition-all"
              @click="handleConfirm"
            >
              はい、送ってください
            </button>

            <button
              type="button"
              class="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors text-center py-2"
              @click="handleCancel"
            >
              キャンセル
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
