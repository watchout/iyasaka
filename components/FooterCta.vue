<template>
  <div v-if="flags.enableFooterCta">
    <!-- PC版: 右下固定（閾値+上方向スクロールで表示） -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="isVisible"
        class="hidden lg:block fixed bottom-6 right-6 z-40"
      >
        <div class="flex flex-col gap-3">
          <NuxtLink 
            :to="site.cta.contact"
            class="btn-primary inline-flex items-center gap-2 shadow-2xl focus:outline-none focus:ring-2 focus:ring-matsuha focus:ring-offset-2"
          >
            <span>📞</span>
            <span>お問い合わせ</span>
          </NuxtLink>
          <NuxtLink 
            :to="site.cta.download"
            class="btn-secondary inline-flex items-center gap-2 shadow-xl focus:outline-none focus:ring-2 focus:ring-matsuha focus:ring-offset-2"
          >
            <span>📄</span>
            <span>資料DL</span>
          </NuxtLink>
        </div>
      </div>
    </Transition>

    <!-- モバイル版: 下部固定バー（常時表示） -->
    <div class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-matsuha/20 shadow-2xl">
      <div class="container mx-auto px-4 py-3">
        <div class="flex gap-3">
          <NuxtLink 
            :to="site.cta.contact"
            class="btn-primary flex-1 text-center inline-flex items-center justify-center gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-matsuha focus:ring-offset-2"
          >
            <span>📞</span>
            <span>お問い合わせ</span>
          </NuxtLink>
          <NuxtLink 
            :to="site.cta.download"
            class="btn-secondary flex-1 text-center inline-flex items-center justify-center gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-matsuha focus:ring-offset-2"
          >
            <span>📄</span>
            <span>資料DL</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { site } from '~/app/site'
import { useFeatureFlags } from '~/composables/useFeatureFlags'
import { useFloatingCtaVisibility } from '~/composables/useFloatingCtaVisibility'

// FeatureFlag確認
const { flags } = useFeatureFlags()

// PC版の表示制御（閾値200px超え + 上方向スクロール時に表示）
const { isVisible } = useFloatingCtaVisibility({
  threshold: 200,
  showOnScrollUp: true
})
</script>
