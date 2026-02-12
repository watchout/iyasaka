/**
 * AIPlus shindan (AI活用診断) -- 型定義
 */

// ---------------------------------------------------------------------------
// 選択肢の型
// ---------------------------------------------------------------------------

export interface ShindanOption {
  id: string
  label: string
}

export interface IndustryOption extends ShindanOption {
  adoptionRate: number
  adoptionNote: string
}

export interface EmployeeOption extends ShindanOption {
  coefficient: number
}

export interface HourOption {
  value: number
  label: string
}

export interface GoalOption extends ShindanOption {
  solution: string
  solutionDescription: string
}

// ---------------------------------------------------------------------------
// 回答データ
// ---------------------------------------------------------------------------

export interface ShindanAnswers {
  industry: string
  employeeSize: string
  manualTasks: string[]
  monthlyHours: number
  painPoints: string[]
  improvementGoal: string
}

export interface ShindanLeadData {
  company: string
  name: string
  email: string
  companyUrl: string // v2: deep research source
  phone: string
  website: string // honeypot
}

// ---------------------------------------------------------------------------
// 計算結果
// ---------------------------------------------------------------------------

export type ScoreLevel = 'moderate' | 'high' | 'critical'

export interface ShindanResult {
  score: number
  scoreLevel: ScoreLevel
  scoreLevelLabel: string
  recoverableHours: number
  weeklyDays: number
  annualSaving: number
  topRecommendation: string
  topRecommendationDescription: string
  industryAdoptionRate: number
  industryAdoptionNote: string
  answers: ShindanAnswers
  leadData: Omit<ShindanLeadData, 'website'>
  completedAt: string
}
