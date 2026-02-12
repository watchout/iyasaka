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

    // honeypot: bot なら API呼ばずサイレントに遷移
    if (!leadData.website) {
      await $fetch('/api/aiplus-shindan', {
        method: 'POST',
        body: {
          company: leadData.company,
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone || undefined,
          score: result.score,
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

      <!-- ヘッダー -->
      <div class="text-center mb-6">
        <h1 class="text-xl md:text-2xl font-gothic font-bold text-aiplus-navy">
          AI活用診断
        </h1>
        <p class="text-sm text-gray-500 mt-1">7つの質問で御社のAI活用ポテンシャルがわかります</p>
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
          <form class="space-y-4" @submit.prevent="submitShindan">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                会社名 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="leadData.company"
                type="text"
                required
                autocomplete="organization"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-aiplus-blue focus:border-aiplus-blue transition-colors"
                placeholder="株式会社〇〇"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                お名前 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="leadData.name"
                type="text"
                required
                autocomplete="name"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-aiplus-blue focus:border-aiplus-blue transition-colors"
                placeholder="山田 太郎"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス <span class="text-red-500">*</span>
              </label>
              <input
                v-model="leadData.email"
                type="email"
                required
                autocomplete="email"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-aiplus-blue focus:border-aiplus-blue transition-colors"
                placeholder="info@example.co.jp"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                電話番号（任意）
              </label>
              <input
                v-model="leadData.phone"
                type="tel"
                autocomplete="tel"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-aiplus-blue focus:border-aiplus-blue transition-colors"
                placeholder="048-XXX-XXXX"
              >
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
