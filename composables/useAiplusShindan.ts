/**
 * AIPlus shindan (AI活用診断) -- 状態管理 composable
 *
 * 7問の回答状態、リードフォームデータ、スコア計算、
 * sessionStorage永続化を一元管理する。
 */

import { reactive, ref, computed } from 'vue'
import type { ShindanAnswers, ShindanLeadData, ShindanResult } from '~/app/types/aiplus-shindan'
import {
  calculateScore,
  getScoreLevel,
  calculateRecoverableHours,
  calculateWeeklyDays,
  calculateAnnualSaving,
  getIndustryData,
  getGoalRecommendation,
  getCasebookTheme,
} from '~/app/data/aiplus-shindan'

const STORAGE_KEY = 'iyasaka_aiplus_shindan'

export function useAiplusShindan() {
  // -----------------------------------------------------------------------
  // State
  // -----------------------------------------------------------------------

  const currentQuestion = ref(1)

  const answers = reactive<ShindanAnswers>({
    industry: '',
    employeeSize: '',
    manualTasks: [],
    monthlyHours: 0,
    painPoints: [],
    improvementGoal: '',
  })

  const leadData = reactive<ShindanLeadData>({
    company: '',
    name: '',
    email: '',
    companyUrl: '',
    phone: '',
    website: '', // honeypot
  })

  // -----------------------------------------------------------------------
  // Validation
  // -----------------------------------------------------------------------

  const canProceed = computed((): boolean => {
    switch (currentQuestion.value) {
      case 1: return answers.industry !== ''
      case 2: return answers.employeeSize !== ''
      case 3: return answers.manualTasks.length > 0
      case 4: return answers.monthlyHours > 0
      case 5: return answers.painPoints.length > 0
      case 6: return answers.improvementGoal !== ''
      case 7:
        return (
          leadData.company.trim() !== ''
          && leadData.name.trim() !== ''
          && leadData.email.trim() !== ''
          && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadData.email)
          && leadData.companyUrl.trim() !== ''
          && /^https?:\/\/.+\..+/.test(leadData.companyUrl.trim())
        )
      default: return false
    }
  })

  // -----------------------------------------------------------------------
  // Navigation
  // -----------------------------------------------------------------------

  const nextQuestion = (): void => {
    if (currentQuestion.value < 7 && canProceed.value) {
      currentQuestion.value = currentQuestion.value + 1
    }
  }

  const prevQuestion = (): void => {
    if (currentQuestion.value > 1) {
      currentQuestion.value = currentQuestion.value - 1
    }
  }

  const jumpToQuestion = (step: number): void => {
    if (step >= 1 && step <= 7) {
      currentQuestion.value = step
    }
  }

  // -----------------------------------------------------------------------
  // Score Calculation
  // -----------------------------------------------------------------------

  const buildResult = (): ShindanResult => {
    const score = calculateScore(answers.manualTasks.length, answers.painPoints.length)
    const { level, label } = getScoreLevel(score)
    const recoverableHours = calculateRecoverableHours(answers.monthlyHours)
    const weeklyDays = calculateWeeklyDays(recoverableHours)
    const annualSaving = calculateAnnualSaving(answers.employeeSize, answers.monthlyHours)
    const industryData = getIndustryData(answers.industry)
    const goalData = getGoalRecommendation(answers.improvementGoal)
    const casebookTheme = getCasebookTheme(answers.industry)

    return {
      score,
      scoreLevel: level,
      scoreLevelLabel: label,
      recoverableHours,
      weeklyDays,
      annualSaving,
      topRecommendation: goalData.solution,
      topRecommendationDescription: goalData.description,
      industryAdoptionRate: industryData.rate,
      industryAdoptionNote: industryData.note,
      casebookTheme,
      answers: { ...answers, manualTasks: [...answers.manualTasks], painPoints: [...answers.painPoints] },
      leadData: {
        company: leadData.company,
        name: leadData.name,
        email: leadData.email,
        companyUrl: leadData.companyUrl,
        phone: leadData.phone,
      },
      completedAt: new Date().toISOString(),
    }
  }

  // -----------------------------------------------------------------------
  // SessionStorage
  // -----------------------------------------------------------------------

  const saveResult = (result: ShindanResult): void => {
    if (!import.meta.client) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result))
    } catch {
      // storage full or disabled -- ignore
    }
  }

  const getResult = (): ShindanResult | null => {
    if (!import.meta.client) return null
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as ShindanResult) : null
    } catch {
      return null
    }
  }

  const clearResult = (): void => {
    if (!import.meta.client) return
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  // -----------------------------------------------------------------------
  // Multi-select toggle
  // -----------------------------------------------------------------------

  const toggleArrayItem = (arr: string[], item: string): string[] => {
    const idx = arr.indexOf(item)
    if (idx > -1) {
      return [...arr.slice(0, idx), ...arr.slice(idx + 1)]
    }
    return [...arr, item]
  }

  // -----------------------------------------------------------------------
  // Return
  // -----------------------------------------------------------------------

  return {
    currentQuestion,
    answers,
    leadData,
    canProceed,
    nextQuestion,
    prevQuestion,
    jumpToQuestion,
    buildResult,
    saveResult,
    getResult,
    clearResult,
    toggleArrayItem,
  }
}
