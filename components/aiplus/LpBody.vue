<script setup lang="ts">
/**
 * AIPlus LP本体コンポーネント
 * index.vue と [variant].vue の両方から利用される
 */

import { ref } from 'vue'
import {
  heroCommon,
  founderSection,
  painPoints,
  futureVision,
  comparisonHeading,
  comparisonRows,
  caseStudiesHeading,
  caseStudies,
  caseStudiesNote,
  humanVsAIHeading,
  humanVsAIRows,
  flowHeading,
  flowSteps,
  narrowing,
  faqHeading,
  faqs,
  footerCta,
} from '~/app/data/aiplus-lp'
import type { HeroVariant } from '~/app/data/aiplus-lp'

const props = defineProps<{
  variant: HeroVariant
  trackConversion: (eventName: string) => void
}>()

// CTA クリックハンドラ
const onCtaClick = () => {
  props.trackConversion('aiplus_cta_click')
}

// FAQ開閉状態
const openFaqIndex = ref<number | null>(null)
const toggleFaq = (index: number) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}

// ペインアイコンマッピング
const painIcons: Record<string, string> = {
  chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  phone: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  question: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  money: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

// フローステップアイコン
const flowIcons = [
  'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
]
</script>

<template>
  <div class="min-h-screen">

    <!-- ===== Section 1: ヒーロー ===== -->
    <section class="relative py-20 md:py-32 bg-gradient-to-br from-aiplus-navy via-aiplus-navy to-aiplus-blue overflow-hidden">
      <!-- 背景パターン -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-1/4 right-0 w-96 h-96 bg-aiplus-blue rounded-full blur-3xl" />
        <div class="absolute bottom-0 left-1/4 w-80 h-80 bg-aiplus-cta rounded-full blur-3xl opacity-30" />
      </div>

      <div class="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <!-- 5社限定バッジ -->
        <div class="inline-block px-4 py-1.5 bg-aiplus-cta/20 text-aiplus-cta rounded-full text-sm font-bold mb-8 border border-aiplus-cta/30">
          {{ heroCommon.narrowingBadge }}
        </div>

        <!-- キャッチコピー（A/Bテスト対象） -->
        <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-gothic font-bold text-white leading-relaxed mb-6 whitespace-pre-line">
          {{ variant.catchcopy }}
        </h1>

        <p class="text-lg md:text-xl text-white/90 font-medium mb-8">
          {{ variant.subcopy }}
        </p>

        <!-- 説明文 -->
        <p class="text-base md:text-lg text-white/70 mb-10 whitespace-pre-line max-w-2xl mx-auto">
          {{ heroCommon.description }}
        </p>

        <!-- CTA -->
        <NuxtLink
          :to="heroCommon.ctaLink"
          class="inline-flex items-center gap-3 px-10 py-5 bg-aiplus-cta text-white rounded-full font-bold text-lg shadow-aiplus-cta hover:bg-aiplus-cta-hover hover:shadow-aiplus-cta-hover hover:-translate-y-1 transition-all"
          @click="onCtaClick"
        >
          {{ heroCommon.ctaText }}
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </NuxtLink>

        <!-- リスクリバーサル -->
        <p class="text-sm text-white/50 mt-4">
          {{ heroCommon.riskReversal }}
        </p>
      </div>
    </section>

    <!-- ===== Section 2: 問題提起 ===== -->
    <section class="py-16 md:py-24 bg-gray-50">
      <div class="max-w-5xl mx-auto px-6">
        <h2 class="text-2xl md:text-3xl font-gothic font-bold text-aiplus-navy text-center mb-12">
          こんな状態、続けますか？
        </h2>

        <div class="grid md:grid-cols-2 gap-6">
          <div
            v-for="pain in painPoints"
            :key="pain.title"
            class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-xl bg-aiplus-light flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-aiplus-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="painIcons[pain.icon]" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-aiplus-navy mb-2">{{ pain.title }}</h3>
                <p class="text-sm text-gray-500 leading-relaxed">{{ pain.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Section 3: 代表者（Affinity -- 共感と信頼） ===== -->
    <section class="py-16 md:py-24 bg-white">
      <div class="max-w-4xl mx-auto px-6">
        <h2 class="text-2xl md:text-3xl font-gothic font-bold text-aiplus-navy text-center mb-12">
          {{ founderSection.heading }}
        </h2>

        <div class="md:flex md:items-start md:gap-10">
          <!-- 写真 -->
          <div class="flex-shrink-0 mb-8 md:mb-0 text-center md:text-left">
            <div class="w-40 h-40 md:w-48 md:h-48 rounded-2xl bg-aiplus-light mx-auto md:mx-0 overflow-hidden">
              <img
                :src="founderSection.avatar"
                :alt="founderSection.name"
                class="w-full h-full object-cover"
                loading="lazy"
                onerror="this.style.display='none'"
              >
            </div>
            <p class="font-bold text-aiplus-navy mt-4 text-lg">{{ founderSection.name }}</p>
            <p class="text-sm text-gray-500">{{ founderSection.role }}</p>
            <p class="text-xs text-aiplus-blue mt-1">{{ founderSection.credential }}</p>
          </div>

          <!-- ストーリー -->
          <div class="flex-1">
            <p class="text-base md:text-lg text-gray-600 leading-loose whitespace-pre-line">
              {{ founderSection.story }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Section 4: 理想の未来 ===== -->
    <section class="py-16 md:py-24 bg-gray-50">
      <div class="max-w-3xl mx-auto px-6 text-center">
        <h2 class="text-2xl md:text-3xl font-gothic font-bold text-aiplus-navy mb-10">
          {{ futureVision.heading }}
        </h2>

        <p class="text-base md:text-lg text-gray-600 leading-loose mb-8 whitespace-pre-line">
          {{ futureVision.body }}
        </p>

        <div class="bg-white rounded-2xl p-8 md:p-10 shadow-sm">
          <p class="text-lg md:text-xl font-bold text-aiplus-navy whitespace-pre-line leading-relaxed">
            {{ futureVision.emphasis }}
          </p>
        </div>
      </div>
    </section>

    <!-- ===== Section 5: 大手AIツールとの比較 ===== -->
    <section class="py-16 md:py-24 bg-white">
      <div class="max-w-4xl mx-auto px-6">
        <h2 class="text-2xl md:text-3xl font-gothic font-bold text-aiplus-navy text-center mb-12">
          {{ comparisonHeading }}
        </h2>

        <!-- デスクトップ: テーブル -->
        <div class="hidden md:block">
          <table class="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <thead>
              <tr class="bg-gray-50">
                <th class="py-4 px-6 text-left text-gray-500 font-medium">大手AIツール</th>
                <th class="py-4 px-6 text-left text-aiplus-navy font-bold">AIプラス</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in comparisonRows"
                :key="i"
                class="border-t border-gray-100"
              >
                <td class="py-4 px-6 text-gray-500">{{ row.bigAI }}</td>
                <td class="py-4 px-6 text-aiplus-navy font-medium">{{ row.aiplus }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- モバイル: カード -->
        <div class="md:hidden space-y-4">
          <div
            v-for="(row, i) in comparisonRows"
            :key="i"
            class="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          >
            <div class="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <span class="w-2 h-2 rounded-full bg-gray-300" />
              大手AIツール
            </div>
            <p class="text-gray-500 mb-3 text-sm">{{ row.bigAI }}</p>
            <div class="flex items-center gap-2 text-sm text-aiplus-blue mb-2">
              <span class="w-2 h-2 rounded-full bg-aiplus-blue" />
              AIプラス
            </div>
            <p class="text-aiplus-navy font-medium">{{ row.aiplus }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Section 6: 導入事例 ===== -->
    <section class="py-16 md:py-24 bg-gray-50">
      <div class="max-w-5xl mx-auto px-6">
        <h2 class="text-2xl md:text-3xl font-gothic font-bold text-aiplus-navy text-center mb-12">
          {{ caseStudiesHeading }}
        </h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="cs in caseStudies"
            :key="cs.title"
            class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 class="font-bold text-aiplus-navy mb-4 text-lg">{{ cs.title }}</h3>

            <div class="space-y-3 mb-4">
              <div class="flex items-start gap-2">
                <span class="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded mt-0.5">Before</span>
                <p class="text-sm text-gray-500">{{ cs.before }}</p>
              </div>
              <div class="flex items-start gap-2">
                <span class="inline-block px-2 py-0.5 bg-aiplus-light text-aiplus-blue text-xs font-medium rounded mt-0.5">After</span>
                <p class="text-sm text-aiplus-navy">{{ cs.after }}</p>
              </div>
            </div>

            <div class="pt-3 border-t border-gray-100">
              <p class="text-sm font-bold text-aiplus-cta">{{ cs.effect }}</p>
            </div>
          </div>
        </div>

        <p class="text-center text-xs text-gray-400 mt-6">{{ caseStudiesNote }}</p>

        <!-- CTA (事例後) -->
        <div class="text-center mt-10">
          <NuxtLink
            :to="heroCommon.ctaLink"
            class="inline-flex items-center gap-3 px-8 py-4 bg-aiplus-cta text-white rounded-full font-bold shadow-aiplus-cta hover:bg-aiplus-cta-hover hover:shadow-aiplus-cta-hover hover:-translate-y-0.5 transition-all"
            @click="onCtaClick"
          >
            {{ heroCommon.ctaText }}
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
          <p class="text-xs text-gray-400 mt-3">{{ heroCommon.riskReversal }}</p>
        </div>
      </div>
    </section>

    <!-- ===== Section 7: 人を雇う vs AI ===== -->
    <section class="py-16 md:py-24 bg-white">
      <div class="max-w-4xl mx-auto px-6">
        <h2 class="text-2xl md:text-3xl font-gothic font-bold text-aiplus-navy text-center mb-12">
          {{ humanVsAIHeading }}
        </h2>

        <!-- デスクトップ: テーブル -->
        <div class="hidden md:block">
          <table class="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <thead>
              <tr class="bg-gray-50">
                <th class="py-4 px-6 text-left text-gray-500 font-medium w-1/4" />
                <th class="py-4 px-6 text-left text-gray-500 font-medium">パート採用</th>
                <th class="py-4 px-6 text-left text-aiplus-navy font-bold">AIプラス</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in humanVsAIRows"
                :key="i"
                class="border-t border-gray-100"
              >
                <td class="py-4 px-6 text-gray-700 font-medium">{{ row.label }}</td>
                <td class="py-4 px-6 text-gray-500">{{ row.human }}</td>
                <td class="py-4 px-6 text-aiplus-navy font-medium">{{ row.aiplus }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- モバイル: カード -->
        <div class="md:hidden space-y-3">
          <div
            v-for="(row, i) in humanVsAIRows"
            :key="i"
            class="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <p class="text-sm font-medium text-aiplus-navy mb-2">{{ row.label }}</p>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-gray-400 mb-1">パート採用</p>
                <p class="text-sm text-gray-500">{{ row.human }}</p>
              </div>
              <div>
                <p class="text-xs text-aiplus-blue mb-1">AIプラス</p>
                <p class="text-sm text-aiplus-navy font-medium">{{ row.aiplus }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Section 8: 導入の流れ ===== -->
    <section class="py-16 md:py-24 bg-gray-50">
      <div class="max-w-5xl mx-auto px-6">
        <h2 class="text-2xl md:text-3xl font-gothic font-bold text-aiplus-navy text-center mb-12">
          {{ flowHeading }}
        </h2>

        <!-- デスクトップ: 横並び -->
        <div class="hidden lg:grid grid-cols-6 gap-4">
          <div
            v-for="(step, i) in flowSteps"
            :key="step.step"
            class="text-center"
          >
            <div class="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mx-auto mb-3 shadow-sm">
              <svg class="w-7 h-7 text-aiplus-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="flowIcons[i]" />
              </svg>
            </div>
            <div class="text-xs font-bold text-aiplus-blue mb-1">STEP {{ step.step }}</div>
            <h3 class="text-sm font-bold text-aiplus-navy mb-1 leading-snug">{{ step.title }}</h3>
            <p class="text-xs text-gray-500 leading-relaxed">{{ step.description }}</p>
          </div>
        </div>

        <!-- モバイル/タブレット: 縦並び -->
        <div class="lg:hidden space-y-6">
          <div
            v-for="(step, i) in flowSteps"
            :key="step.step"
            class="flex items-start gap-4"
          >
            <div class="flex flex-col items-center flex-shrink-0">
              <div class="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <svg class="w-6 h-6 text-aiplus-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" :d="flowIcons[i]" />
                </svg>
              </div>
              <div v-if="i < flowSteps.length - 1" class="w-0.5 h-6 bg-aiplus-blue/20 mt-2" />
            </div>
            <div class="pt-1">
              <div class="text-xs font-bold text-aiplus-blue mb-1">STEP {{ step.step }}</div>
              <h3 class="font-bold text-aiplus-navy mb-1">{{ step.title }}</h3>
              <p class="text-sm text-gray-500">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Section 9: 毎月5社限定 ===== -->
    <section class="py-16 md:py-24 bg-aiplus-navy">
      <div class="max-w-3xl mx-auto px-6 text-center">
        <div class="inline-block px-4 py-1 bg-aiplus-cta/20 text-aiplus-cta rounded-full text-sm font-bold mb-6">
          限定
        </div>

        <h2 class="text-2xl md:text-3xl font-gothic font-bold text-white mb-8">
          {{ narrowing.heading }}
        </h2>

        <p class="text-base md:text-lg text-white/80 mb-4 whitespace-pre-line leading-relaxed">
          {{ narrowing.body }}
        </p>

        <p class="text-sm text-white/60 mb-10">
          {{ narrowing.credential }}
        </p>

        <NuxtLink
          :to="narrowing.ctaLink"
          class="inline-flex items-center gap-3 px-10 py-5 bg-aiplus-cta text-white rounded-full font-bold text-lg shadow-aiplus-cta hover:bg-aiplus-cta-hover hover:shadow-aiplus-cta-hover hover:-translate-y-1 transition-all"
          @click="onCtaClick"
        >
          {{ narrowing.ctaText }}
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </NuxtLink>

        <!-- リスクリバーサル -->
        <p class="text-sm text-white/40 mt-4">
          {{ narrowing.riskReversal }}
        </p>
      </div>
    </section>

    <!-- ===== Section 10: FAQ ===== -->
    <section class="py-16 md:py-24 bg-white">
      <div class="max-w-3xl mx-auto px-6">
        <h2 class="text-2xl md:text-3xl font-gothic font-bold text-aiplus-navy text-center mb-12">
          {{ faqHeading }}
        </h2>

        <div class="space-y-4">
          <div
            v-for="(faq, i) in faqs"
            :key="faq.q"
            class="bg-gray-50 rounded-xl overflow-hidden"
          >
            <button
              class="w-full flex items-center justify-between p-6 text-left cursor-pointer"
              @click="toggleFaq(i)"
            >
              <span class="font-medium text-aiplus-navy pr-4">{{ faq.q }}</span>
              <svg
                class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform"
                :class="{ 'rotate-180': openFaqIndex === i }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              v-show="openFaqIndex === i"
              class="px-6 pb-6 text-gray-500 leading-relaxed"
            >
              {{ faq.a }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Section 11: フッターCTA ===== -->
    <section class="py-16 md:py-24 bg-gradient-to-b from-aiplus-light to-white">
      <div class="max-w-3xl mx-auto px-6 text-center">
        <h2 class="text-2xl md:text-3xl font-gothic font-bold text-aiplus-navy mb-6">
          {{ footerCta.heading }}
        </h2>

        <p class="text-base md:text-lg text-gray-600 mb-10 whitespace-pre-line">
          {{ footerCta.body }}
        </p>

        <NuxtLink
          :to="footerCta.ctaLink"
          class="inline-flex items-center gap-3 px-12 py-6 bg-aiplus-cta text-white rounded-full font-bold text-xl shadow-aiplus-cta hover:bg-aiplus-cta-hover hover:shadow-aiplus-cta-hover hover:-translate-y-1 transition-all"
          @click="onCtaClick"
        >
          {{ footerCta.ctaText }}
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </NuxtLink>

        <p class="text-sm text-gray-400 mt-4">
          {{ footerCta.riskReversal }}
        </p>
      </div>
    </section>

  </div>
</template>
