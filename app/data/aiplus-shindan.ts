/**
 * AIPlus shindan (AI活用診断) -- 設問データ + スコア計算
 *
 * 全7問の選択肢と計算ロジックを一元管理する。
 * スコアは 60-85 の範囲に収まる設計（低すぎ/高すぎを防ぐ）。
 */

import type {
  IndustryOption,
  EmployeeOption,
  ShindanOption,
  HourOption,
  GoalOption,
  ScoreLevel,
} from '~/app/types/aiplus-shindan'

// ---------------------------------------------------------------------------
// Q1: 業種（8業種）
// ---------------------------------------------------------------------------

export const industries: IndustryOption[] = [
  { id: 'manufacturing', label: '製造業', adoptionRate: 15, adoptionNote: '製造業では6社に1社がAI活用を開始' },
  { id: 'construction', label: '建設・不動産', adoptionRate: 8, adoptionNote: '建設業界はこれからの導入加速が予測' },
  { id: 'retail', label: '小売・飲食・サービス', adoptionRate: 12, adoptionNote: '飲食・小売では注文自動化が急増中' },
  { id: 'medical', label: '医療・介護・福祉', adoptionRate: 10, adoptionNote: '医療分野のAI活用は国も推進中' },
  { id: 'hospitality', label: '宿泊・観光', adoptionRate: 18, adoptionNote: '宿泊業はAI接客・多言語対応で先行' },
  { id: 'professional', label: '士業・コンサル', adoptionRate: 20, adoptionNote: '士業では書類作成AI活用が急増' },
  { id: 'it', label: 'IT・Web', adoptionRate: 45, adoptionNote: 'IT業界はAI活用が標準化しつつある' },
  { id: 'other', label: 'その他', adoptionRate: 12, adoptionNote: '中小企業全体のAI導入率は約12%' },
]

// ---------------------------------------------------------------------------
// Q2: 従業員数（5段階）
// ---------------------------------------------------------------------------

export const employeeSizes: EmployeeOption[] = [
  { id: 'xs', label: '1〜5名', coefficient: 0.6 },
  { id: 'sm', label: '6〜10名', coefficient: 0.8 },
  { id: 'md', label: '11〜30名', coefficient: 1.0 },
  { id: 'lg', label: '31〜50名', coefficient: 1.2 },
  { id: 'xl', label: '51名以上', coefficient: 1.5 },
]

// ---------------------------------------------------------------------------
// Q3: 手作業チェックリスト（8項目）
// ---------------------------------------------------------------------------

export const manualTasks: ShindanOption[] = [
  { id: 'invoice', label: '見積書・請求書の作成' },
  { id: 'inquiry', label: '顧客からの問い合わせ対応' },
  { id: 'scheduling', label: '予約管理・スケジュール調整' },
  { id: 'data_entry', label: 'データ入力・集計・レポート作成' },
  { id: 'inventory', label: '在庫管理・発注作業' },
  { id: 'communication', label: '社内の情報共有・連絡' },
  { id: 'recruiting', label: '求人・採用・面接調整' },
  { id: 'marketing', label: 'SNS更新・Web更新' },
]

// ---------------------------------------------------------------------------
// Q4: 月間手作業時間（6段階）
// ---------------------------------------------------------------------------

export const monthlyHours: HourOption[] = [
  { value: 5, label: '10時間未満' },
  { value: 20, label: '10〜30時間' },
  { value: 45, label: '30〜60時間' },
  { value: 80, label: '60〜100時間' },
  { value: 120, label: '100時間以上' },
  { value: 45, label: 'わからない' },
]

// ---------------------------------------------------------------------------
// Q5: 痛みチェックリスト（7項目）
// ---------------------------------------------------------------------------

export const painPoints: ShindanOption[] = [
  { id: 'owner_bottleneck', label: '特定の人が休むと業務が止まる' },
  { id: 'person_dependent', label: '特定の人しかできない業務がある' },
  { id: 'repetitive_inquiry', label: '同じ質問に何度も答えている' },
  { id: 'missed_opportunity', label: '営業時間外の問い合わせを逃している' },
  { id: 'no_training_time', label: '採用しても教育する時間がない' },
  { id: 'no_it_person', label: 'ITに詳しい社員がいない' },
  { id: 'no_manual', label: '業務マニュアルが整備されていない' },
]

// ---------------------------------------------------------------------------
// Q6: AI改善目標（6項目）
// ---------------------------------------------------------------------------

export const improvementGoals: GoalOption[] = [
  {
    id: 'owner_time',
    label: '経営・判断に集中する時間を作りたい',
    solution: '意思決定層の業務自動化',
    solutionDescription: '問い合わせ対応・見積作成・スケジュール管理など、意思決定層が抱える業務をAIで自動化。本業に集中できる環境を作ります。',
  },
  {
    id: 'labor',
    label: '人手不足を補いたい',
    solution: 'AI業務代行',
    solutionDescription: 'データ入力・顧客対応・在庫管理など、人手に頼っていた業務をAIが24時間365日代行。採用難の時代でも業務を回せる体制を構築します。',
  },
  {
    id: 'cost',
    label: 'コストを削減したい',
    solution: '業務効率化によるコスト削減',
    solutionDescription: '手作業の時間とミスを削減し、人件費・外注費を最適化。ROIの高い領域から段階的にAI化を進めます。',
  },
  {
    id: 'customer',
    label: '顧客対応を強化したい',
    solution: 'AI問い合わせ対応',
    solutionDescription: 'AIチャットボットやメール自動返信で、24時間即座に顧客対応。対応品質を均一化しながら、対応漏れをゼロにします。',
  },
  {
    id: 'sales',
    label: '売上を上げたい',
    solution: 'AI営業支援',
    solutionDescription: '顧客データ分析・提案書自動生成・フォロー自動化で、営業活動を効率化。限られたリソースで売上最大化を目指します。',
  },
  {
    id: 'explore',
    label: '何ができるかまず知りたい',
    solution: '業種別AI活用マップ',
    solutionDescription: '御社の業種・規模に合わせたAI活用の全体像をご提示。「何から始めるべきか」を明確にし、最初の一歩をサポートします。',
  },
]

// ---------------------------------------------------------------------------
// Q7: 質問ヘッダーテキスト
// ---------------------------------------------------------------------------

export const questionHeaders = [
  {
    number: 1,
    title: '御社の業種を教えてください',
    purpose: '同業界のAI導入率と成功事例をもとに診断します',
  },
  {
    number: 2,
    title: '従業員数は何名ですか？',
    purpose: '御社の規模に合ったAI活用プランを判定します',
  },
  {
    number: 3,
    title: '手作業でやっている業務はどれですか？',
    sub: '当てはまるものをすべて選んでください',
    purpose: 'AIで自動化できる業務と削減時間を算出します',
  },
  {
    number: 4,
    title: 'その手作業に月どのくらい時間をかけていますか？',
    sub: '会社全体の合計で教えてください',
    purpose: 'AI導入で取り戻せる時間と年間コスト削減額を算出します',
  },
  {
    number: 5,
    title: '以下に当てはまるものはありますか？',
    sub: '当てはまるものをすべて選んでください',
    purpose: '御社の課題に優先順位をつけ、最適な対策を特定します',
  },
  {
    number: 6,
    title: 'AIで最も改善したいことは？',
    purpose: '御社専用のAI活用提案をお作りします',
  },
  {
    number: 7,
    title: '診断結果をお届けします',
    sub: '30秒で完了します',
    purpose: '診断レポートをすぐにご確認いただけます',
  },
]

// ---------------------------------------------------------------------------
// 回答ラベル解決（サマリー表示用）
// ---------------------------------------------------------------------------

export function getAnswerSummaryLabel(questionNumber: number, answers: {
  industry: string
  employeeSize: string
  manualTasks: string[]
  monthlyHours: number
  painPoints: string[]
  improvementGoal: string
}): string {
  switch (questionNumber) {
    case 1: {
      const ind = industries.find((i) => i.id === answers.industry)
      return ind ? ind.label : ''
    }
    case 2: {
      const emp = employeeSizes.find((e) => e.id === answers.employeeSize)
      return emp ? emp.label : ''
    }
    case 3:
      return answers.manualTasks.length > 0
        ? `${answers.manualTasks.length}項目`
        : ''
    case 4: {
      if (answers.monthlyHours <= 0) return ''
      const h = monthlyHours.find((m) => m.value === answers.monthlyHours)
      return h ? h.label : `${answers.monthlyHours}h`
    }
    case 5:
      return answers.painPoints.length > 0
        ? `${answers.painPoints.length}項目`
        : ''
    case 6: {
      const goal = improvementGoals.find((g) => g.id === answers.improvementGoal)
      return goal ? goal.label : ''
    }
    default:
      return ''
  }
}

// ---------------------------------------------------------------------------
// スコア計算
// ---------------------------------------------------------------------------

const SCORE_CONFIG = {
  BASE: 40,
  MANUAL_POINTS: 5,
  PAIN_POINTS: 5,
  MIN: 60,
  MAX: 85,
  AI_RATE: 0.5,
  HOURLY_COST: 2000,
} as const

export function calculateScore(manualCount: number, painCount: number): number {
  const raw = SCORE_CONFIG.BASE
    + (manualCount * SCORE_CONFIG.MANUAL_POINTS)
    + (painCount * SCORE_CONFIG.PAIN_POINTS)
  return Math.max(SCORE_CONFIG.MIN, Math.min(SCORE_CONFIG.MAX, raw))
}

export function getScoreLevel(score: number): { level: ScoreLevel; label: string } {
  if (score >= 80) return { level: 'critical', label: '非常に大きい' }
  if (score >= 70) return { level: 'high', label: '大きい' }
  return { level: 'moderate', label: '期待できる' }
}

export function calculateRecoverableHours(monthlyHours: number): number {
  return Math.round(monthlyHours * SCORE_CONFIG.AI_RATE)
}

export function calculateWeeklyDays(recoverableHours: number): number {
  // 月の営業日を約22日（= 8h * 22日 = 176h）で換算
  return Math.round((recoverableHours / 8) * 10) / 10
}

export function calculateAnnualSaving(
  employeeSizeId: string,
  monthlyHours: number,
): number {
  const size = employeeSizes.find((s) => s.id === employeeSizeId)
  const coefficient = size ? size.coefficient : 1.0
  const annual = coefficient * monthlyHours * SCORE_CONFIG.HOURLY_COST * 12 * SCORE_CONFIG.AI_RATE
  // 万円単位に丸め
  return Math.round(annual / 10000) * 10000
}

export function getIndustryData(industryId: string): { rate: number; note: string } {
  const ind = industries.find((i) => i.id === industryId)
  return {
    rate: ind ? ind.adoptionRate : 12,
    note: ind ? ind.adoptionNote : '中小企業全体のAI導入率は約12%',
  }
}

export function getGoalRecommendation(goalId: string): { solution: string; description: string } {
  const goal = improvementGoals.find((g) => g.id === goalId)
  return {
    solution: goal ? goal.solution : 'カスタムAI導入支援',
    description: goal ? goal.solutionDescription : '御社に最適なAI活用方法をご提案します。',
  }
}
