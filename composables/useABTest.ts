/**
 * useABTest -- A/Bテスト用コンポーザブル
 * URL方式でバリアントを解決し、Plausibleでトラッキングする
 */

import { heroVariants } from '~/app/data/aiplus-lp'
import type { HeroVariant } from '~/app/data/aiplus-lp'

type ABTestResult = {
  variantIndex: number
  variant: HeroVariant
  variantSlug: string
  trackConversion: (eventName: string) => void
}

const STORAGE_KEY_PREFIX = 'ab_variant_'

export const useABTest = (
  experimentId: string,
  variantSlug?: string
): ABTestResult => {
  const { track } = useAnalytics()

  // バリアントスラグからインデックスを解決
  const resolveVariantIndex = (slug?: string): number => {
    if (!slug || slug === '') return 0

    const index = heroVariants.findIndex((v) => v.slug === slug)
    return index >= 0 ? index : 0
  }

  const variantIndex = resolveVariantIndex(variantSlug)
  const variant = heroVariants[variantIndex] ?? heroVariants[0]
  const resolvedSlug = variant.slug

  // クライアントサイドでバリアント記録 + pageview送信
  if (import.meta.client) {
    const storageKey = `${STORAGE_KEY_PREFIX}${experimentId}`
    try {
      localStorage.setItem(storageKey, String(variantIndex))
    } catch {
      // localStorage利用不可の場合は無視
    }

    // ページ表示時にバリアントをトラッキング
    track('ab_pageview', {
      experiment: experimentId,
      variant: resolvedSlug || 'a',
      variant_index: variantIndex,
    })
  }

  // CTAクリック等のコンバージョンイベント送信
  const trackConversion = (eventName: string) => {
    track(eventName, {
      experiment: experimentId,
      variant: resolvedSlug || 'a',
      variant_index: variantIndex,
    })
  }

  return {
    variantIndex,
    variant,
    variantSlug: resolvedSlug || 'a',
    trackConversion,
  }
}
