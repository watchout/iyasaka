<script setup lang="ts">
/**
 * AIPlus AI活用診断 -- 結果ページ
 * /aiplus/shindan/result
 *
 * sessionStorage から診断結果を取得して 6 セクションで表示する。
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

// -- スコアバーの色クラス --
const scoreColorClass = computed((): string => {
  if (!result.value) return 'bg-gray-300'
  switch (result.value.scoreLevel) {
    case 'critical': return 'bg-red-500'
    case 'high': return 'bg-orange-500'
    case 'moderate': return 'bg-yellow-500'
    default: return 'bg-gray-300'
  }
})

const scoreBadgeClass = computed((): string => {
  if (!result.value) return 'bg-gray-100 text-gray-700'
  switch (result.value.scoreLevel) {
    case 'critical': return 'bg-red-100 text-red-700'
    case 'high': return 'bg-orange-100 text-orange-700'
    case 'moderate': return 'bg-yellow-100 text-yellow-700'
    default: return 'bg-gray-100 text-gray-700'
  }
})

// -- 年間削減額フォーマット --
const formattedAnnualSaving = computed((): string => {
  if (!result.value) return '0'
  const man = result.value.annualSaving / 10000
  return man.toLocaleString('ja-JP')
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

      <!-- ===== Section 1: 手作業依存度スコア ===== -->
      <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
        <h2 class="text-sm font-bold text-gray-500 mb-4">社長依存度スコア</h2>

        <div class="text-center mb-4">
          <span class="text-5xl md:text-6xl font-bold text-aiplus-navy">
            {{ result.score }}
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
            社長依存度：{{ result.scoreLevelLabel }}
          </span>
        </div>

        <!-- 詳細指標 -->
        <div class="grid grid-cols-2 gap-3 mt-5 mb-4">
          <div class="bg-gray-50 rounded-xl p-3 text-center">
            <p class="text-2xl font-bold text-aiplus-navy">
              {{ result.answers.manualTasks.length + result.answers.painPoints.length }}
            </p>
            <p class="text-xs text-gray-500 mt-1 leading-snug">
              社長がいないと<br>止まる業務
            </p>
          </div>
          <div class="bg-gray-50 rounded-xl p-3 text-center">
            <p class="text-2xl font-bold text-aiplus-navy">
              {{ result.answers.monthlyHours }}
            </p>
            <p class="text-xs text-gray-500 mt-1 leading-snug">
              社長が作業に費やす<br>月間時間
            </p>
          </div>
        </div>

        <p class="text-sm text-gray-600 mt-4 text-center leading-relaxed">
          <template v-if="result.scoreLevel === 'critical'">
            御社は社長への依存度が非常に高い状態です。<br>
            AI導入による改善余地が大きく、優先的な対応をおすすめします。
          </template>
          <template v-else-if="result.scoreLevel === 'high'">
            御社は社長への依存度が高い状態です。<br>
            AI導入により大幅な業務改善が期待できます。
          </template>
          <template v-else>
            御社にも社長の負担をAIで軽減できる業務があります。<br>
            段階的なAI導入で、さらなる効率化が可能です。
          </template>
        </p>
      </section>

      <!-- ===== Section 2: AI化で取り戻せる時間 ===== -->
      <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
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
      <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
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

      <!-- ===== Section 4: 業界AI導入率 ===== -->
      <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
        <h2 class="text-sm font-bold text-gray-500 mb-4">業界AI導入率</h2>

        <div class="flex items-center gap-4 mb-4">
          <div class="flex-1">
            <div class="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                class="bg-aiplus-blue h-6 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                :style="{ width: `${Math.max(result.industryAdoptionRate, 10)}%` }"
              >
                <span class="text-xs font-bold text-white">
                  {{ result.industryAdoptionRate }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <p class="text-sm text-gray-600 leading-relaxed">
          {{ result.industryAdoptionNote }}。<br>
          <strong class="text-aiplus-navy">
            つまり、今AI導入を始めれば同業他社に大きく差をつけられます。
          </strong>
        </p>
      </section>

      <!-- ===== Section 5: 年間削減額 ===== -->
      <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
        <h2 class="text-sm font-bold text-gray-500 mb-4">参考：年間の人件費削減ポテンシャル</h2>

        <div class="text-center mb-4">
          <p class="text-sm text-gray-500 mb-1">AI化で見込める年間削減額</p>
          <p class="text-4xl md:text-5xl font-bold text-aiplus-navy">
            {{ formattedAnnualSaving }}<span class="text-lg ml-1">万円</span>
          </p>
        </div>

        <p class="text-xs text-gray-400 text-center leading-relaxed">
          ※ 時間単価2,000円で試算した参考値です。<br>
          業務内容・人員配置により実際の効果は異なります。
        </p>
      </section>

      <!-- ===== Section 6: 感情クロージング + CTA ===== -->
      <section class="bg-gradient-to-br from-aiplus-navy to-aiplus-blue rounded-2xl shadow-lg p-6 md:p-8 text-white mb-8">
        <h2 class="text-xl md:text-2xl font-bold leading-snug mb-4">
          毎月{{ result.weeklyDays }}日分の時間が<br>
          戻ったら、何をしますか？
        </h2>

        <p class="text-white/80 text-sm leading-relaxed mb-5">
          この結果をもとに、{{ result.leadData.company }}様専用の<br>
          AI活用レポートを作成いたします。
        </p>

        <ul class="space-y-2 mb-6">
          <li class="flex items-start gap-2 text-sm text-white/90">
            <svg class="w-4 h-4 text-aiplus-cta shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>御社と同業他社のAI導入事例</span>
          </li>
          <li class="flex items-start gap-2 text-sm text-white/90">
            <svg class="w-4 h-4 text-aiplus-cta shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>御社に最適なAI活用プラン</span>
          </li>
          <li class="flex items-start gap-2 text-sm text-white/90">
            <svg class="w-4 h-4 text-aiplus-cta shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>想定される時間削減効果の詳細</span>
          </li>
        </ul>

        <!-- Main CTA: Report request (small-step) -->
        <button
          type="button"
          class="block w-full px-6 py-4 bg-aiplus-cta text-white font-bold text-lg rounded-full shadow-aiplus-cta hover:bg-aiplus-cta-hover hover:shadow-aiplus-cta-hover transition-all text-center"
          @click="handleReportRequest"
        >
          レポートを受け取る
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
        @confirm="handleReportConfirm"
        @cancel="handleReportCancel"
      />

    </div>
  </div>
</template>
