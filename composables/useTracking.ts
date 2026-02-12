/**
 * AIPlus tracking -- UTM / variant / referrer persistence
 *
 * Captures UTM parameters, LP variant, and referrer on first visit.
 * Data is stored in sessionStorage so it persists across page navigations
 * within a single session but resets on new sessions.
 *
 * SSR safe: all browser APIs are guarded with import.meta.client.
 */

const TRACKING_KEY = 'aiplus_tracking'

export interface TrackingData {
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_content: string
  utm_term: string
  variant: string
  landed_at: string
  referrer: string
}

function detectVariant(path: string): string {
  if (path.includes('/aiplus/c')) return 'c'
  if (path.includes('/aiplus/b')) return 'b'
  return 'a'
}

export function useTracking() {
  const route = useRoute()

  /**
   * Capture UTM and variant data on first visit.
   * If data already exists in sessionStorage, returns the stored data.
   */
  const initTracking = (): TrackingData | null => {
    if (!import.meta.client) return null

    const existing = sessionStorage.getItem(TRACKING_KEY)
    if (existing) {
      try {
        return JSON.parse(existing) as TrackingData
      } catch {
        // corrupted data -- re-capture
      }
    }

    const trackingData: TrackingData = {
      utm_source: (route.query.utm_source as string) || 'direct',
      utm_medium: (route.query.utm_medium as string) || 'none',
      utm_campaign: (route.query.utm_campaign as string) || '',
      utm_content: (route.query.utm_content as string) || '',
      utm_term: (route.query.utm_term as string) || '',
      variant: detectVariant(route.path),
      landed_at: new Date().toISOString(),
      referrer: document.referrer || '',
    }

    try {
      sessionStorage.setItem(TRACKING_KEY, JSON.stringify(trackingData))
    } catch {
      // storage full or disabled -- proceed without persistence
    }

    return trackingData
  }

  /**
   * Retrieve previously stored tracking data.
   */
  const getTrackingData = (): Partial<TrackingData> => {
    if (!import.meta.client) return {}

    try {
      const raw = sessionStorage.getItem(TRACKING_KEY)
      return raw ? (JSON.parse(raw) as TrackingData) : {}
    } catch {
      return {}
    }
  }

  return { initTracking, getTrackingData }
}
