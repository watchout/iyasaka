/**
 * Analytics composable -- GA4 + Plausible dual sending
 *
 * v2: Adds GA4 event sending alongside existing Plausible.
 * Provides both the generic track() for backward compatibility
 * and typed helpers for v2 shindan/LP events.
 */

import { analytics } from '~/app/data/analytics'
import { useTracking } from '~/composables/useTracking'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
    plausible?: (event: string, opts?: { props?: Record<string, unknown> }) => void
  }
}

export const useAnalytics = () => {
  const { getTrackingData } = useTracking()

  // ---------------------------------------------------------------------------
  // Core: send event to GA4 + Plausible
  // ---------------------------------------------------------------------------

  const sendEvent = (eventName: string, params: Record<string, unknown> = {}): void => {
    if (!import.meta.client) return

    const tracking = getTrackingData()

    const eventParams: Record<string, unknown> = {
      ad_copy: tracking.utm_content || '',
      variant: tracking.variant || '',
      keyword: tracking.utm_term || '',
      source: tracking.utm_source || '',
      medium: tracking.utm_medium || '',
      campaign: tracking.utm_campaign || '',
      ...params,
    }

    // GA4
    if (window.gtag) {
      window.gtag('event', eventName, eventParams)
    }

    // Plausible
    if (analytics.enabled && window.plausible) {
      window.plausible(eventName, { props: eventParams })
    }

    // Dev debug
    if (import.meta.dev) {
      // eslint-disable-next-line no-console
      console.log(`[Analytics] ${eventName}`, eventParams)
    }
  }

  // ---------------------------------------------------------------------------
  // Backward-compatible: generic track()
  // Used by LeadForm.vue, downloads.vue, articles/[...slug].vue, useABTest.ts
  // ---------------------------------------------------------------------------

  const track = (event: string, props?: Record<string, unknown>): void => {
    sendEvent(event, props || {})
  }

  // ---------------------------------------------------------------------------
  // v2 typed helpers -- LP
  // ---------------------------------------------------------------------------

  const trackLPView = (): void => {
    sendEvent('lp_view')
  }

  const trackCTAClick = (ctaType: string): void => {
    sendEvent('cta_click', { cta_type: ctaType })
  }

  // ---------------------------------------------------------------------------
  // v2 typed helpers -- Shindan
  // ---------------------------------------------------------------------------

  const trackShindanStart = (): void => {
    sendEvent('shindan_start')
  }

  const trackQuestion = (q: number, answer: string | number): void => {
    sendEvent(`shindan_q${q}`, { answer: String(answer) })
  }

  const trackQuestionCount = (q: number, count: number): void => {
    sendEvent(`shindan_q${q}`, { answer_count: count })
  }

  const trackQ7Submit = (hasPhone: boolean, hasUrl: boolean): void => {
    sendEvent('shindan_q7_submit', { has_phone: hasPhone, has_url: hasUrl })
  }

  const trackDropout = (lastQ: number): void => {
    sendEvent('shindan_dropout', { last_question: lastQ })
  }

  const trackShindanComplete = (score: number, industry: string, size: string): void => {
    sendEvent('shindan_complete', { score, industry, size })
  }

  // ---------------------------------------------------------------------------
  // v2 typed helpers -- Small-step CTA
  // ---------------------------------------------------------------------------

  const trackReportRequestStep1 = (score: number): void => {
    sendEvent('report_request_step1', { score })
  }

  const trackContactDirect = (score: number): void => {
    sendEvent('cta_contact_direct', { score })
  }

  const trackExitResultPage = (score: number, timeOnPage: number): void => {
    sendEvent('exit_result_page', { score, time_on_page: timeOnPage })
  }

  // ---------------------------------------------------------------------------
  // v2 typed helpers -- Other
  // ---------------------------------------------------------------------------

  const trackContactSubmit = (): void => {
    sendEvent('contact_submit')
  }

  const trackCalendlyBooking = (): void => {
    sendEvent('calendly_booking_complete')
  }

  return {
    // Backward compatible
    track,

    // LP
    trackLPView,
    trackCTAClick,

    // Shindan
    trackShindanStart,
    trackQuestion,
    trackQuestionCount,
    trackQ7Submit,
    trackDropout,
    trackShindanComplete,

    // Small-step CTA
    trackReportRequestStep1,
    trackContactDirect,
    trackExitResultPage,

    // Other
    trackContactSubmit,
    trackCalendlyBooking,
  }
}
