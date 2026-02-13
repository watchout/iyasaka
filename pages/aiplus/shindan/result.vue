<script setup lang="ts">
/**
 * AIPlus AI活用診断 -- 結果ページ (v3)
 * /aiplus/shindan/result
 *
 * sessionStorage から診断結果を取得して 3 セクション + CTA で表示する。
 * v3: ポジティブフレーム（AI活用ポテンシャル）、青→緑配色、3セクション簡素化
 * 結果データが無い場合は /aiplus/shindan にリダイレクト。
 */

import type { ShindanResult } from '~/app/types/aiplus-shindan'

definePageMeta({ layout: 'lp' })

useHead({ titleTemplate: '%s' })
useSeoMeta({
  title: '診断結果 | AIプラス',
  description: '御社のAI活用ポテンシャル診断結果です。',
  robots: 'noindex, nofollow',
})

const router = useRouter()
const { getResult } = useAiplusShindan()
const {
  trackShindanComplete,
  trackReportRequestStep1,
  trackContactDirect,
  trackExitResultPage,
} = useAnalytics()

const result = ref<ShindanResult | null>(null)
const ready = ref(false)
const pageEnteredAt = ref(0)

// -- Section reveal animation (v3: 4 sections) --
const visibleSections = ref<number[]>([])
const totalSections = 4

const revealSections = (): void => {
  let delay = 400
  for (let i = 1; i <= totalSections; i++) {
    setTimeout(() => {
      visibleSections.value = [...visibleSections.value, i]
    }, delay)
    delay += 600
  }
}

const isSectionVisible = (index: number): boolean => {
  return visibleSections.value.includes(index)
}

// -- Animated score counter --
const displayScore = ref(0)

const animateScore = (target: number): void => {
  const duration = 1200
  const startTime = Date.now()
  const tick = (): void => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    displayScore.value = Math.round(eased * target)
    if (progress < 1) {
      requestAnimationFrame(tick)
    }
  }
  requestAnimationFrame(tick)
}

// -- mount 時に sessionStorage から結果を取得 --
onMounted(() => {
  const stored = getResult()
  if (!stored) {
    router.replace('/aiplus/shindan')
    return
  }
  result.value = stored
  ready.value = true
  pageEnteredAt.value = Date.now()

  // Start reveal animation
  revealSections()
  setTimeout(() => {
    animateScore(stored.score)
  }, 500)

  // v2: track shindan completion
  trackShindanComplete(
    stored.score,
    stored.answers.industry,
    stored.answers.employeeSize,
  )
})

// v2: track page exit without CTA click
if (import.meta.client) {
  const handleBeforeUnload = (): void => {
    if (result.value && pageEnteredAt.value > 0) {
      const timeOnPage = Math.round((Date.now() - pageEnteredAt.value) / 1000)
      trackExitResultPage(result.value.score, timeOnPage)
    }
  }
  onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
  })
  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })
}

// -- v3: スコアバーの色クラス（ポジティブ: 青→緑） --
const scoreColorClass = computed((): string => {
  if (!result.value) return 'bg-gray-300'
  switch (result.value.scoreLevel) {
    case 'critical': return 'bg-green-500'
    case 'high': return 'bg-emerald-500'
    case 'moderate': return 'bg-blue-500'
    default: return 'bg-gray-300'
  }
})

const scoreBadgeClass = computed((): string => {
  if (!result.value) return 'bg-gray-100 text-gray-700'
  switch (result.value.scoreLevel) {
    case 'critical': return 'bg-green-100 text-green-700'
    case 'high': return 'bg-emerald-100 text-emerald-700'
    case 'moderate': return 'bg-blue-100 text-blue-700'
    default: return 'bg-gray-100 text-gray-700'
  }
})

// -- レポート承認モーダル --
const showReportModal = ref(false)

const handleReportRequest = (): void => {
  showReportModal.value = true
}

const handleReportConfirm = (): void => {
  if (result.value) {
    trackReportRequestStep1(result.value.score)
  }
}

const handleReportCancel = (): void => {
  showReportModal.value = false
}

const handleContactDirect = (): void => {
  if (result.value) {
    trackContactDirect(result.value.score)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 md:py-16">
    <div v-if="ready && result" class="max-w-xl mx-auto px-4">

      <!-- ヘッダー -->
      <div class="text-center mb-8">
        <img
          src="/images/aiplus/logo-icon.png"
          srcset="/images/aiplus/logo-icon.png 1x, /images/aiplus/logo-icon-2x.png 2x"
          alt="AIプラス"
          class="h-14 md:h-16 w-auto mx-auto mb-3"
        >
        <p class="text-sm font-bold text-aiplus-blue mb-2">AI活用診断</p>
        <h1 class="text-xl md:text-2xl font-gothic font-bold text-aiplus-navy">
          {{ result.leadData.company }}様の診断結果
        </h1>
      </div>

      <!-- ===== Section 1: AI活用ポテンシャルスコア ===== -->
      <section
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6 transition-all duration-700"
        :class="isSectionVisible(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <h2 class="text-sm font-bold text-gray-500 mb-4">AI活用ポテンシャルスコア</h2>

        <div class="text-center mb-4">
          <span class="text-5xl md:text-6xl font-bold text-aiplus-navy">
            {{ displayScore }}
          </span>
          <span class="text-lg text-gray-500 ml-1">/ 100</span>
        </div>

        <!-- スコアバー -->
        <div class="w-full bg-gray-200 rounded-full h-4 mb-3 overflow-hidden">
          <div
            :class="scoreColorClass"
            class="h-4 rounded-full transition-all duration-1000 ease-out"
            :style="{ width: `${result.score}%` }"
          />
        </div>

        <!-- レベルマーカー -->
        <div class="flex justify-between text-xs text-gray-400 mb-4">
          <span>0</span>
          <span>60</span>
          <span>70</span>
          <span>80</span>
          <span>100</span>
        </div>

        <div class="text-center">
          <span
            :class="scoreBadgeClass"
            class="inline-block px-4 py-1.5 rounded-full text-sm font-bold"
          >
            AI活用ポテンシャル：{{ result.scoreLevelLabel }}
          </span>
        </div>

        <p class="text-sm text-gray-600 mt-4 text-center leading-relaxed">
          <template v-if="result.scoreLevel === 'critical'">
            御社にはAI活用で大きく飛躍できる可能性があります。<br>
            今始めれば、同業他社に大きな差をつけられます。
          </template>
          <template v-else-if="result.scoreLevel === 'high'">
            御社にはAI活用で業務を改善できる余地が十分にあります。<br>
            段階的な導入で、着実に成果を実感できます。
          </template>
          <template v-else>
            御社にもAIで効率化できる業務があります。<br>
            小さな一歩から始めて、業務の質を高められます。
          </template>
        </p>
      </section>

      <!-- ===== Section 2: AI化で取り戻せる時間 ===== -->
      <section
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6 transition-all duration-700"
        :class="isSectionVisible(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <h2 class="text-sm font-bold text-gray-500 mb-4">AI化で取り戻せる時間</h2>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="text-center bg-aiplus-light rounded-xl p-4">
            <p class="text-3xl md:text-4xl font-bold text-aiplus-blue">
              {{ result.recoverableHours }}
            </p>
            <p class="text-sm text-gray-600 mt-1">時間/月</p>
          </div>
          <div class="text-center bg-aiplus-light rounded-xl p-4">
            <p class="text-3xl md:text-4xl font-bold text-aiplus-blue">
              {{ result.weeklyDays }}
            </p>
            <p class="text-sm text-gray-600 mt-1">日分/月</p>
          </div>
        </div>

        <p class="text-sm text-gray-600 text-center leading-relaxed">
          現在の手作業のうち、AIで自動化可能な部分を代替すると<br>
          毎月約<strong class="text-aiplus-navy">{{ result.recoverableHours }}時間</strong>（約<strong class="text-aiplus-navy">{{ result.weeklyDays }}日分</strong>）の時間が生まれます。
        </p>
      </section>

      <!-- ===== Section 3: おすすめAI活用 TOP1 ===== -->
      <section
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6 transition-all duration-700"
        :class="isSectionVisible(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <h2 class="text-sm font-bold text-gray-500 mb-4">おすすめAI活用</h2>

        <div class="bg-aiplus-light rounded-xl p-5 border border-aiplus-blue/20">
          <p class="text-xs font-bold text-aiplus-blue mb-2">御社に最適なAI活用</p>
          <h3 class="text-lg font-bold text-aiplus-navy mb-3">
            {{ result.topRecommendation }}
          </h3>
          <p class="text-sm text-gray-700 leading-relaxed">
            {{ result.topRecommendationDescription }}
          </p>
        </div>
      </section>

      <!-- ===== Section 4: CTA ===== -->
      <section
        class="bg-gradient-to-br from-aiplus-navy to-aiplus-blue rounded-2xl shadow-lg p-6 md:p-8 text-white mb-8 transition-all duration-700"
        :class="isSectionVisible(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <h2 class="text-xl md:text-2xl font-bold leading-snug mb-4">
          毎月{{ result.weeklyDays }}日分の時間が<br>
          戻ったら、何をしますか？
        </h2>

        <p class="text-white/80 text-sm leading-relaxed mb-5">
          この結果をもとに、{{ result.leadData.company }}様専用の<br>
          AI活用レポートをお届けします。
        </p>

        <ul class="space-y-2 mb-6">
          <li class="flex items-start gap-2 text-sm text-white/90">
            <svg class="w-4 h-4 text-aiplus-cta shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>「{{ result.casebookTheme.label }}」活用事例集</span>
          </li>
          <li class="flex items-start gap-2 text-sm text-white/90">
            <svg class="w-4 h-4 text-aiplus-cta shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>御社専用のAI活用レポート</span>
          </li>
        </ul>

        <!-- Main CTA: v3 casebook + report -->
        <button
          type="button"
          class="block w-full px-6 py-4 bg-aiplus-cta text-white font-bold text-lg rounded-full shadow-aiplus-cta hover:bg-aiplus-cta-hover hover:shadow-aiplus-cta-hover transition-all text-center"
          @click="handleReportRequest"
        >
          活用集とレポートを受け取る
        </button>

        <p class="text-white/60 text-xs text-center mt-3">
          営業電話なし。ご契約の義務なし。
        </p>

        <!-- Sub CTA: Direct contact (text link) -->
        <div class="text-center mt-5">
          <NuxtLink
            to="/contact?p_id=aiplus"
            class="text-sm text-white/60 hover:text-white/90 transition-colors underline underline-offset-4"
            @click="handleContactDirect"
          >
            今すぐ専門家に相談したい方はこちら &rarr;
          </NuxtLink>
        </div>
      </section>

      <!-- もう一度診断する -->
      <div class="text-center mb-8">
        <NuxtLink
          to="/aiplus/shindan"
          class="text-sm text-gray-500 hover:text-aiplus-navy transition-colors underline"
        >
          もう一度診断する
        </NuxtLink>
      </div>

      <!-- Report confirmation modal -->
      <AiplusShindanReportModal
        :visible="showReportModal"
        :email="result.leadData.email"
        :casebook-theme-label="result.casebookTheme.label"
        @confirm="handleReportConfirm"
        @cancel="handleReportCancel"
      />

    </div>
  </div>
</template>
