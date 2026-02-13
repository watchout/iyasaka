<script setup lang="ts">
/**
 * AIPlus AI活用診断 -- 7問フォーム
 * /aiplus/shindan
 */

import {
  industries,
  employeeSizes,
  manualTasks,
  monthlyHours,
  painPoints,
  improvementGoals,
  questionHeaders,
} from '~/app/data/aiplus-shindan'

definePageMeta({ layout: 'lp' })

useHead({ titleTemplate: '%s' })
useSeoMeta({
  title: 'AI活用診断 | AIプラス',
  description: '7つの質問に答えるだけ。御社のAI活用ポテンシャルを無料で診断します。',
  robots: 'noindex, nofollow',
})

const router = useRouter()

const {
  currentQuestion,
  answers,
  leadData,
  canProceed,
  nextQuestion,
  prevQuestion,
  jumpToQuestion,
  buildResult,
  saveResult,
  toggleArrayItem,
} = useAiplusShindan()

const showLoading = ref(false)
const submitting = ref(false)
const errorMessage = ref('')

// -- Q7 field completion tracking --
const q7Fields = computed(() => {
  const fields = [
    { label: '会社名', done: leadData.company.trim() !== '' },
    { label: 'お名前', done: leadData.name.trim() !== '' },
    { label: 'メール', done: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadData.email) },
    { label: 'HP URL', done: /^https?:\/\/.+\..+/.test(leadData.companyUrl.trim()) },
    { label: '電話番号', done: leadData.phone.trim() !== '', optional: true },
  ]
  return fields
})

const q7CompletedCount = computed(() => {
  return q7Fields.value.filter(f => f.done).length
})

const q7RequiredTotal = 4 // required fields only

// -- v2: Analytics --
const {
  trackShindanStart,
  trackQuestion,
  trackQuestionCount,
  trackQ7Submit,
  trackDropout,
} = useAnalytics()

onMounted(() => {
  trackShindanStart()
})

// Scroll to top on question change
watch(currentQuestion, () => {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

// Track question progression
watch(currentQuestion, (newQ, oldQ) => {
  if (newQ > oldQ && oldQ >= 1 && oldQ <= 6) {
    // Track the answer for the question just completed
    switch (oldQ) {
      case 1:
        trackQuestion(1, answers.industry)
        break
      case 2:
        trackQuestion(2, answers.employeeSize)
        break
      case 3:
        trackQuestionCount(3, answers.manualTasks.length)
        break
      case 4:
        trackQuestion(4, answers.monthlyHours)
        break
      case 5:
        trackQuestionCount(5, answers.painPoints.length)
        break
      case 6:
        trackQuestion(6, answers.improvementGoal)
        break
    }
  }
})

// Track dropout on page unload
if (import.meta.client) {
  const handleBeforeUnload = (): void => {
    if (currentQuestion.value > 1 && !showLoading.value) {
      trackDropout(currentQuestion.value)
    }
  }
  onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
  })
  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })
}

// -- 単一選択: 300ms後に自動進行 --
const selectSingle = (field: 'industry' | 'employeeSize' | 'improvementGoal', value: string): void => {
  answers[field] = value
  setTimeout(() => { nextQuestion() }, 300)
}

const selectHours = (value: number): void => {
  answers.monthlyHours = value
  setTimeout(() => { nextQuestion() }, 300)
}

// -- 複数選択: toggle --
const toggleManualTask = (id: string): void => {
  answers.manualTasks = toggleArrayItem(answers.manualTasks, id)
}

const togglePainPoint = (id: string): void => {
  answers.painPoints = toggleArrayItem(answers.painPoints, id)
}

// -- Q7 送信 --
const submitShindan = async (): Promise<void> => {
  if (submitting.value || !canProceed.value) return

  submitting.value = true
  errorMessage.value = ''

  try {
    const result = buildResult()
    saveResult(result)

    // v2: track Q7 submission
    trackQ7Submit(!!leadData.phone, !!leadData.companyUrl)

    // honeypot: bot なら API呼ばずサイレントに遷移
    if (!leadData.website) {
      await $fetch('/api/aiplus-shindan', {
        method: 'POST',
        body: {
          company: leadData.company,
          name: leadData.name,
          email: leadData.email,
          companyUrl: leadData.companyUrl,
          phone: leadData.phone || undefined,
          score: result.score,
          recoverableHours: result.recoverableHours,
          weeklyDays: result.weeklyDays,
          annualSaving: result.annualSaving,
          topRecommendation: result.topRecommendation,
          casebookTheme: result.casebookTheme.theme,
          casebookThemeLabel: result.casebookTheme.label,
          answers: result.answers,
          source: 'aiplus_shindan',
        },
      }).catch(() => {
        // API失敗しても診断結果は表示する
      })
    }

    showLoading.value = true
    setTimeout(() => {
      router.push('/aiplus/shindan/result')
    }, 1500)
  } catch {
    errorMessage.value = '送信に失敗しました。もう一度お試しください。'
    submitting.value = false
  }
}

// -- 離脱確認（クライアントのみ） --
if (import.meta.client) {
  onBeforeRouteLeave((_to, _from, next) => {
    if (currentQuestion.value > 1 && !showLoading.value) {
      const ok = window.confirm('診断を中断しますか？入力内容は失われます。')
      next(ok)
    } else {
      next()
    }
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 md:py-16">
    <div class="max-w-xl mx-auto px-4">

      <!-- ヒーローセクション（Q1のみ表示） -->
      <div v-if="currentQuestion === 1" class="text-center mb-8">
        <img
          src="/images/aiplus/logo-icon.png"
          srcset="/images/aiplus/logo-icon.png 1x, /images/aiplus/logo-icon-2x.png 2x"
          alt="AIプラス"
          class="h-14 md:h-16 w-auto mx-auto mb-4"
        >
        <h1 class="text-2xl md:text-3xl font-gothic font-bold text-aiplus-navy leading-tight">
          御社のAI活用ポテンシャルを<br>
          <span class="text-aiplus-blue">無料で診断</span>します
        </h1>
        <p class="text-base md:text-lg text-gray-600 mt-3 leading-relaxed">
          たった7問・<span class="font-bold text-aiplus-navy">約2分</span>で完了
        </p>

        <!-- 得られるもの -->
        <div class="mt-6 bg-white rounded-xl border border-gray-200 p-5 text-left">
          <p class="text-xs font-bold text-aiplus-blue tracking-wide mb-3">診断で得られるもの</p>
          <ul class="space-y-2.5">
            <li class="flex items-start gap-2.5 text-sm text-gray-700">
              <span class="w-5 h-5 rounded-full bg-aiplus-blue/10 text-aiplus-blue flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">1</span>
              <span><strong class="text-aiplus-navy">AI活用ポテンシャルスコア</strong> -- 御社のAI導入効果を数値で可視化</span>
            </li>
            <li class="flex items-start gap-2.5 text-sm text-gray-700">
              <span class="w-5 h-5 rounded-full bg-aiplus-blue/10 text-aiplus-blue flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">2</span>
              <span><strong class="text-aiplus-navy">業種別AI活用事例集</strong> -- 同業他社の成功パターンがわかる</span>
            </li>
            <li class="flex items-start gap-2.5 text-sm text-gray-700">
              <span class="w-5 h-5 rounded-full bg-aiplus-blue/10 text-aiplus-blue flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">3</span>
              <span><strong class="text-aiplus-navy">御社専用レポート</strong> -- 具体的なAI活用の第一歩がわかる</span>
            </li>
          </ul>
        </div>

        <p class="text-xs text-gray-400 mt-4">
          営業電話なし。契約義務なし。
        </p>
      </div>

      <!-- コンパクトヘッダー（Q2以降） -->
      <div v-else class="text-center mb-6">
        <h1 class="text-lg font-gothic font-bold text-aiplus-navy">
          AI活用診断
        </h1>
      </div>

      <!-- プログレスバー -->
      <AiplusShindanStepProgress
        :current-step="currentQuestion"
        :total-steps="7"
        class="mb-4"
      />

      <!-- 回答サマリーバー -->
      <AiplusShindanAnswerSummary
        v-if="currentQuestion > 1"
        :current-step="currentQuestion"
        :answers="answers"
        class="mb-6"
        @jump="jumpToQuestion"
      />

      <!-- 質問カード -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[400px]">

        <!-- 質問タイトル -->
        <div class="mb-6">
          <p class="text-xs font-bold text-aiplus-blue mb-2">
            Q{{ questionHeaders[currentQuestion - 1].number }}
          </p>
          <h2 class="text-lg md:text-xl font-bold text-aiplus-navy leading-snug">
            {{ questionHeaders[currentQuestion - 1].title }}
          </h2>
          <p
            v-if="questionHeaders[currentQuestion - 1].sub"
            class="text-sm text-gray-500 mt-1"
          >
            {{ questionHeaders[currentQuestion - 1].sub }}
          </p>
          <!-- 質問の目的 -->
          <p
            v-if="questionHeaders[currentQuestion - 1].purpose"
            class="text-xs text-gray-400 mt-2 flex items-start gap-1"
          >
            <span class="shrink-0 mt-px">&#9656;</span>
            <span>{{ questionHeaders[currentQuestion - 1].purpose }}</span>
          </p>
        </div>

        <!-- ===== Q1: 業種 ===== -->
        <div v-if="currentQuestion === 1" class="space-y-3">
          <button
            v-for="opt in industries"
            :key="opt.id"
            type="button"
            class="w-full text-left px-4 py-3 rounded-xl border-2 transition-all cursor-pointer"
            :class="answers.industry === opt.id
              ? 'border-aiplus-blue bg-aiplus-light text-aiplus-navy font-medium'
              : 'border-gray-200 hover:border-aiplus-blue/50 text-gray-700'"
            @click="selectSingle('industry', opt.id)"
          >
            {{ opt.label }}
          </button>
        </div>

        <!-- ===== Q2: 従業員数 ===== -->
        <div v-else-if="currentQuestion === 2" class="space-y-3">
          <button
            v-for="opt in employeeSizes"
            :key="opt.id"
            type="button"
            class="w-full text-left px-4 py-3 rounded-xl border-2 transition-all cursor-pointer"
            :class="answers.employeeSize === opt.id
              ? 'border-aiplus-blue bg-aiplus-light text-aiplus-navy font-medium'
              : 'border-gray-200 hover:border-aiplus-blue/50 text-gray-700'"
            @click="selectSingle('employeeSize', opt.id)"
          >
            {{ opt.label }}
          </button>
        </div>

        <!-- ===== Q3: 手作業チェックリスト ===== -->
        <div v-else-if="currentQuestion === 3" class="space-y-3">
          <label
            v-for="opt in manualTasks"
            :key="opt.id"
            class="flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all"
            :class="answers.manualTasks.includes(opt.id)
              ? 'border-aiplus-blue bg-aiplus-light'
              : 'border-gray-200 hover:border-aiplus-blue/50'"
          >
            <input
              type="checkbox"
              :checked="answers.manualTasks.includes(opt.id)"
              class="w-5 h-5 rounded border-gray-300 text-aiplus-blue focus:ring-aiplus-blue"
              @change="toggleManualTask(opt.id)"
            >
            <span class="text-gray-700">{{ opt.label }}</span>
          </label>
        </div>

        <!-- ===== Q4: 月間時間 ===== -->
        <div v-else-if="currentQuestion === 4" class="space-y-3">
          <button
            v-for="opt in monthlyHours"
            :key="opt.value + opt.label"
            type="button"
            class="w-full text-left px-4 py-3 rounded-xl border-2 transition-all cursor-pointer"
            :class="answers.monthlyHours === opt.value
              ? 'border-aiplus-blue bg-aiplus-light text-aiplus-navy font-medium'
              : 'border-gray-200 hover:border-aiplus-blue/50 text-gray-700'"
            @click="selectHours(opt.value)"
          >
            {{ opt.label }}
          </button>
        </div>

        <!-- ===== Q5: 痛みチェックリスト ===== -->
        <div v-else-if="currentQuestion === 5" class="space-y-3">
          <label
            v-for="opt in painPoints"
            :key="opt.id"
            class="flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all"
            :class="answers.painPoints.includes(opt.id)
              ? 'border-aiplus-blue bg-aiplus-light'
              : 'border-gray-200 hover:border-aiplus-blue/50'"
          >
            <input
              type="checkbox"
              :checked="answers.painPoints.includes(opt.id)"
              class="w-5 h-5 rounded border-gray-300 text-aiplus-blue focus:ring-aiplus-blue"
              @change="togglePainPoint(opt.id)"
            >
            <span class="text-gray-700">{{ opt.label }}</span>
          </label>
        </div>

        <!-- ===== Q6: AI改善目標 ===== -->
        <div v-else-if="currentQuestion === 6" class="space-y-3">
          <button
            v-for="opt in improvementGoals"
            :key="opt.id"
            type="button"
            class="w-full text-left px-4 py-3 rounded-xl border-2 transition-all cursor-pointer"
            :class="answers.improvementGoal === opt.id
              ? 'border-aiplus-blue bg-aiplus-light text-aiplus-navy font-medium'
              : 'border-gray-200 hover:border-aiplus-blue/50 text-gray-700'"
            @click="selectSingle('improvementGoal', opt.id)"
          >
            {{ opt.label }}
          </button>
        </div>

        <!-- ===== Q7: リードフォーム ===== -->
        <div v-else-if="currentQuestion === 7">
          <!-- Progress counter -->
          <div class="flex items-center justify-between mb-4 px-1">
            <div class="flex items-center gap-2">
              <div class="flex gap-1">
                <span
                  v-for="(field, i) in q7Fields"
                  :key="i"
                  class="w-2 h-2 rounded-full transition-all duration-300"
                  :class="field.done ? 'bg-green-500 scale-110' : 'bg-gray-300'"
                />
              </div>
              <span class="text-sm text-gray-500">
                <span class="font-bold text-aiplus-blue">{{ q7CompletedCount }}</span>
                / {{ q7Fields.length }}
              </span>
            </div>
            <span
              v-if="q7CompletedCount >= q7RequiredTotal"
              class="text-xs text-green-600 font-medium"
            >
              入力完了
            </span>
            <span v-else class="text-xs text-gray-400">
              あと{{ q7RequiredTotal - Math.min(q7CompletedCount, q7RequiredTotal) }}項目
            </span>
          </div>

          <form class="space-y-4" @submit.prevent="submitShindan">
            <!-- 会社名 -->
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                会社名 <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="leadData.company"
                  type="text"
                  required
                  autocomplete="organization"
                  class="w-full px-4 py-3 pr-10 bg-white text-gray-900 border rounded-xl focus:ring-2 focus:ring-aiplus-blue focus:border-aiplus-blue transition-all"
                  :class="q7Fields[0].done ? 'border-green-400' : 'border-gray-300'"
                  placeholder="株式会社〇〇"
                >
                <span
                  v-if="q7Fields[0].done"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 transition-all duration-300"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>
            </div>

            <!-- お名前 -->
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                お名前 <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="leadData.name"
                  type="text"
                  required
                  autocomplete="name"
                  class="w-full px-4 py-3 pr-10 bg-white text-gray-900 border rounded-xl focus:ring-2 focus:ring-aiplus-blue focus:border-aiplus-blue transition-all"
                  :class="q7Fields[1].done ? 'border-green-400' : 'border-gray-300'"
                  placeholder="山田 太郎"
                >
                <span
                  v-if="q7Fields[1].done"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 transition-all duration-300"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>
            </div>

            <!-- メールアドレス -->
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="leadData.email"
                  type="email"
                  required
                  autocomplete="email"
                  class="w-full px-4 py-3 pr-10 bg-white text-gray-900 border rounded-xl focus:ring-2 focus:ring-aiplus-blue focus:border-aiplus-blue transition-all"
                  :class="q7Fields[2].done ? 'border-green-400' : 'border-gray-300'"
                  placeholder="info@example.co.jp"
                >
                <span
                  v-if="q7Fields[2].done"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 transition-all duration-300"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>
            </div>

            <!-- 会社HP URL -->
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                会社HP URL <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="leadData.companyUrl"
                  type="url"
                  required
                  autocomplete="url"
                  class="w-full px-4 py-3 pr-10 bg-white text-gray-900 border rounded-xl focus:ring-2 focus:ring-aiplus-blue focus:border-aiplus-blue transition-all"
                  :class="q7Fields[3].done ? 'border-green-400' : 'border-gray-300'"
                  placeholder="https://example.co.jp"
                >
                <span
                  v-if="q7Fields[3].done"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 transition-all duration-300"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>
              <p class="text-xs text-gray-400 mt-1">
                御社のホームページURLを入力してください
              </p>
            </div>

            <!-- 電話番号 -->
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                電話番号（任意）
              </label>
              <div class="relative">
                <input
                  v-model="leadData.phone"
                  type="tel"
                  autocomplete="tel"
                  class="w-full px-4 py-3 pr-10 bg-white text-gray-900 border rounded-xl focus:ring-2 focus:ring-aiplus-blue focus:border-aiplus-blue transition-all"
                  :class="q7Fields[4].done ? 'border-green-400' : 'border-gray-300'"
                  placeholder="048-XXX-XXXX"
                >
                <span
                  v-if="q7Fields[4].done"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 transition-all duration-300"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>
            </div>

            <!-- Honeypot -->
            <div class="sr-only" aria-hidden="true">
              <input v-model="leadData.website" type="text" name="website" tabindex="-1" autocomplete="off">
            </div>

            <p class="text-xs text-gray-400 leading-relaxed">
              ご入力いただいた情報は診断結果の送付にのみ使用します。営業電話はいたしません。
              <NuxtLink to="/legal/privacy" class="underline hover:text-gray-600">プライバシーポリシー</NuxtLink>
            </p>

            <button
              type="submit"
              :disabled="submitting || !canProceed"
              class="w-full px-6 py-4 bg-aiplus-cta text-white font-bold text-lg rounded-full shadow-aiplus-cta hover:bg-aiplus-cta-hover hover:shadow-aiplus-cta-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ submitting ? '送信中...' : '診断結果を見る' }}
            </button>

            <p v-if="errorMessage" class="text-red-600 text-sm text-center">
              {{ errorMessage }}
            </p>
          </form>
        </div>

      </div>

      <!-- ナビゲーション -->
      <div class="flex justify-between items-center mt-6">
        <button
          v-if="currentQuestion > 1"
          type="button"
          class="text-sm text-gray-500 hover:text-aiplus-navy transition-colors"
          @click="prevQuestion"
        >
          &larr; 戻る
        </button>
        <div v-else />

        <button
          v-if="(currentQuestion === 3 || currentQuestion === 5) && canProceed"
          type="button"
          class="px-6 py-2.5 bg-aiplus-blue text-white font-bold text-sm rounded-full hover:bg-aiplus-navy transition-colors"
          @click="nextQuestion"
        >
          次へ &rarr;
        </button>
      </div>

    </div>

    <!-- ローディングオーバーレイ -->
    <AiplusShindanLoadingOverlay v-if="showLoading" />
  </div>
</template>
