/**
 * useLeadTracking - Day 5 強化版
 * p_id パラメータ対応、UTM追跡強化
 */

import type { 
  LeadTrackingData, 
  DiagnosisResult, 
  SimpleDiagnosisResult,
  ContactFormData,
  LeadSubmission,
  UTMParams
} from '~/app/types/leads'
import type { ProductId } from '~/app/data/products'

const STORAGE_KEYS = {
  DIAGNOSIS_RESULT: 'iyasaka_diagnosis_result',
  SIMPLE_DIAGNOSIS: 'iyasaka_simple_diagnosis',
  LANDING_PAGE: 'iyasaka_landing_page',
  SESSION_START: 'iyasaka_session_start',
  FIRST_PRODUCT: 'iyasaka_first_product',
  UTM_PARAMS: 'iyasaka_utm_params',
  PAGE_VIEWS: 'iyasaka_page_views',
} as const

const PID_TO_PRODUCT_MAP: Record<string, ProductId> = {
  'mieru-plus': 'mieru-plus',
  'mieru-board': 'mieru-plus',
  'mieru-stock': 'mieru-plus',
  'mieru-drive': 'mieru-plus',
  'mieru-file': 'mieru-plus',
  'weak-den': 'jakuden-plus',
  'jakuden-plus': 'jakuden-plus',
  'haishin': 'haishin-plus',
  'haishin-plus': 'haishin-plus',
  'tagengo': 'haishin-plus',
  'omo-ai': 'omotenasu-ai',
  'omotenasu-ai': 'omotenasu-ai',
  'ai-plus': 'ai-plus',
  'dev-os': 'dev-os',
}

export const useLeadTracking = () => {
  const route = useRoute()

  const getSessionItem = <T>(key: string): T | null => {
    if (!import.meta.client) return null
    try {
      const item = sessionStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch { return null }
  }

  const setSessionItem = (key: string, value: unknown): void => {
    if (!import.meta.client) return
    try { sessionStorage.setItem(key, JSON.stringify(value)) }
    catch (e) { console.warn('[useLeadTracking] Storage error:', e) }
  }

  const removeSessionItem = (key: string): void => {
    if (!import.meta.client) return
    try { sessionStorage.removeItem(key) } catch {}
  }

  const extractUTMParams = (): UTMParams => {
    const params: UTMParams = {}
    if (route.query.utm_source) params.utmSource = route.query.utm_source as string
    if (route.query.utm_medium) params.utmMedium = route.query.utm_medium as string
    if (route.query.utm_campaign) params.utmCampaign = route.query.utm_campaign as string
    if (route.query.utm_term) params.utmTerm = route.query.utm_term as string
    if (route.query.utm_content) params.utmContent = route.query.utm_content as string
    return params
  }

  const getUTMParams = (): UTMParams => {
    return getSessionItem<UTMParams>(STORAGE_KEYS.UTM_PARAMS) || {}
  }

  const getProductFromParams = (): { productId: ProductId | null; rawPid: string | null } => {
    const pId = route.query.p_id as string
    if (pId) {
      const mapped = PID_TO_PRODUCT_MAP[pId]
      return { productId: mapped || null, rawPid: pId }
    }
    const product = route.query.product as string
    if (product) {
      const mapped = PID_TO_PRODUCT_MAP[product] || (product as ProductId)
      return { productId: mapped, rawPid: product }
    }
    return { productId: null, rawPid: null }
  }

  const recordLanding = (): void => {
    if (!import.meta.client) return
    if (sessionStorage.getItem(STORAGE_KEYS.LANDING_PAGE)) {
      const current = getSessionItem<number>(STORAGE_KEYS.PAGE_VIEWS) || 0
      setSessionItem(STORAGE_KEYS.PAGE_VIEWS, current + 1)
      return
    }
    setSessionItem(STORAGE_KEYS.LANDING_PAGE, window.location.href)
    setSessionItem(STORAGE_KEYS.SESSION_START, Date.now())
    setSessionItem(STORAGE_KEYS.PAGE_VIEWS, 1)
    const utmParams = extractUTMParams()
    if (Object.keys(utmParams).length > 0) {
      setSessionItem(STORAGE_KEYS.UTM_PARAMS, utmParams)
    }
    const { productId, rawPid } = getProductFromParams()
    if (productId) {
      setSessionItem(STORAGE_KEYS.FIRST_PRODUCT, { productId, rawPid })
    }
  }

  const saveDiagnosisResult = (result: DiagnosisResult): void => {
    setSessionItem(STORAGE_KEYS.DIAGNOSIS_RESULT, result)
  }

  const getDiagnosisResult = (): DiagnosisResult | null => {
    return getSessionItem<DiagnosisResult>(STORAGE_KEYS.DIAGNOSIS_RESULT)
  }

  const clearDiagnosisResult = (): void => {
    removeSessionItem(STORAGE_KEYS.DIAGNOSIS_RESULT)
  }

  const saveSimpleDiagnosisResult = (result: SimpleDiagnosisResult): void => {
    setSessionItem(STORAGE_KEYS.SIMPLE_DIAGNOSIS, result)
  }

  const getSimpleDiagnosisResult = (): SimpleDiagnosisResult | null => {
    return getSessionItem<SimpleDiagnosisResult>(STORAGE_KEYS.SIMPLE_DIAGNOSIS)
  }

  const determineSource = (utm: UTMParams, rawPid?: string | null): string => {
    if (utm.utmSource) return utm.utmSource
    if (rawPid) return `product-lp-${rawPid}`
    if (typeof document !== 'undefined' && document.referrer) {
      try {
        const refUrl = new URL(document.referrer)
        if (refUrl.hostname.includes('google')) return 'google-organic'
        if (refUrl.hostname.includes('yahoo')) return 'yahoo-organic'
        return `referral-${refUrl.hostname}`
      } catch { return 'referral' }
    }
    return 'direct'
  }

  const getTrackingData = (): LeadTrackingData => {
    if (!import.meta.client) return {}
    const sessionStart = getSessionItem<number>(STORAGE_KEYS.SESSION_START)
    const firstProduct = getSessionItem<{ productId: ProductId; rawPid: string }>(STORAGE_KEYS.FIRST_PRODUCT)
    const utmParams = getUTMParams()
    const pageViews = getSessionItem<number>(STORAGE_KEYS.PAGE_VIEWS) || 1
    const { productId: currentProduct, rawPid: currentPid } = getProductFromParams()
    return {
      product: currentProduct || firstProduct?.productId,
      rawPid: currentPid || firstProduct?.rawPid,
      source: determineSource(utmParams, firstProduct?.rawPid),
      diagnosisResult: getDiagnosisResult() || undefined,
      simpleDiagnosisResult: getSimpleDiagnosisResult() || undefined,
      landingPage: getSessionItem<string>(STORAGE_KEYS.LANDING_PAGE) || undefined,
      referrer: document.referrer || undefined,
      ...utmParams,
      sessionStart: sessionStart || undefined,
      currentTime: Date.now(),
      pageViews,
    }
  }

  const getPrefilledProduct = (): ProductId | null => {
    const { productId } = getProductFromParams()
    if (productId) return productId
    const diagnosisResult = getDiagnosisResult()
    if (diagnosisResult?.product) return diagnosisResult.product
    const simpleDiagnosis = getSimpleDiagnosisResult()
    if (simpleDiagnosis?.product) return simpleDiagnosis.product
    const firstProduct = getSessionItem<{ productId: ProductId }>(STORAGE_KEYS.FIRST_PRODUCT)
    if (firstProduct?.productId) return firstProduct.productId
    return null
  }

  const buildLeadPayload = (formData: ContactFormData): LeadSubmission => {
    const tracking = getTrackingData()
    const selectedPrimary = formData.interestedProducts[0] || tracking.product || 'mieru-plus'
    return {
      ...formData,
      source: tracking.source || 'direct',
      primaryProduct: selectedPrimary,
      rawPid: tracking.rawPid,
      utmSource: tracking.utmSource,
      utmMedium: tracking.utmMedium,
      utmCampaign: tracking.utmCampaign,
      utmTerm: tracking.utmTerm,
      utmContent: tracking.utmContent,
      diagnosisResult: tracking.diagnosisResult,
      simpleDiagnosisResult: tracking.simpleDiagnosisResult,
      landingPage: tracking.landingPage,
      referrer: tracking.referrer,
      pageViews: tracking.pageViews,
      timeToConversion: tracking.sessionStart 
        ? (tracking.currentTime || Date.now()) - tracking.sessionStart 
        : undefined,
      createdAt: new Date().toISOString(),
    }
  }

  const buildContactUrl = (product?: ProductId, source?: string): string => {
    const params = new URLSearchParams()
    if (product) params.set('p_id', product)
    if (source) params.set('utm_source', source)
    const queryString = params.toString()
    return queryString ? `/#contact?${queryString}` : '/#contact'
  }

  if (import.meta.client) recordLanding()

  return {
    recordLanding,
    saveDiagnosisResult,
    getDiagnosisResult,
    clearDiagnosisResult,
    saveSimpleDiagnosisResult,
    getSimpleDiagnosisResult,
    getTrackingData,
    getPrefilledProduct,
    getProductFromParams,
    getUTMParams,
    buildLeadPayload,
    buildContactUrl,
  }
}
