import type { ProductId } from '../data/products'

// ===== 2026年版 リード型定義（Day 5 強化版）=====

export type BudgetPhase = 'research' | 'comparison' | 'ready'

// UTMパラメータ
export interface UTMParams {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
}

// 診断結果
export interface DiagnosisResult {
  product: ProductId
  answers: Record<string, 'yes' | 'no'>
  timestamp: number
}

// 簡易診断結果（製品LP用）
export interface SimpleDiagnosisResult {
  product: ProductId
  score: number
  timestamp: number
}

// トラッキングデータ
export interface LeadTrackingData extends UTMParams {
  product?: ProductId | string
  rawPid?: string | null
  source?: string
  diagnosisResult?: DiagnosisResult
  simpleDiagnosisResult?: SimpleDiagnosisResult
  landingPage?: string
  referrer?: string
  sessionStart?: number
  currentTime?: number
  pageViews?: number
}

// フォームデータ
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  company?: string
  employees: string
  interestedProducts: ProductId[]
  message: string
  privacyAgreed: boolean
}

// リード送信ペイロード（2026年版）
export interface LeadSubmission extends ContactFormData, UTMParams {
  source: string
  primaryProduct: ProductId | string
  rawPid?: string | null
  diagnosisResult?: DiagnosisResult
  simpleDiagnosisResult?: SimpleDiagnosisResult
  landingPage?: string
  referrer?: string
  pageViews?: number
  timeToConversion?: number
  createdAt: string
}

// レガシー（API互換性のため維持）
export interface LeadPayload {
  name: string
  email: string
  company: string
  phone?: string
  role?: string
  budgetPhase?: BudgetPhase
  primaryProductSlug: string
  relatedProductSlugs?: string[]
  source: string
  articleSlug?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  notes?: string
  website?: string
}
