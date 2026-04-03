import { copyPool, type CopyPattern } from '@/app/data/copy-pool'

const COOKIE_NAME = 'iy_copy_selections'
const COOKIE_MAX_AGE = 0 // No session persistence - fresh selection on every page load

function weightedRandom(patterns: CopyPattern[]): CopyPattern {
  const active = patterns.filter(p => p.status !== 'retired')
  if (active.length === 0) return patterns[0]
  if (active.length === 1) return active[0]

  const totalWeight = active.reduce((sum, p) => sum + p.weight, 0)
  let rand = Math.random() * totalWeight

  for (const pattern of active) {
    rand -= pattern.weight
    if (rand <= 0) return pattern
  }
  return active[active.length - 1]
}

export function useCopyTest() {
  const selections = useState<Record<string, string>>('copySelections', () => ({}))

  function initSelections() {
    // Fresh selection on every page load (no cookie persistence)
    const newSelections: Record<string, string> = {}
    for (const [slotKey, patterns] of Object.entries(copyPool)) {
      const selected = weightedRandom(patterns)
      newSelections[slotKey] = selected.id
    }
    selections.value = newSelections
  }

  function getCopy(slotKey: string): CopyPattern | undefined {
    const patternId = selections.value[slotKey]
    const patterns = copyPool[slotKey]
    if (!patterns) return undefined

    if (patternId) {
      const found = patterns.find(p => p.id === patternId)
      if (found) return found
    }

    // Fallback: select now
    return weightedRandom(patterns)
  }

  function getPatternId(slotKey: string): string {
    return selections.value[slotKey] || ''
  }

  function trackImpression(sectionId: string, slot: string, patternId: string) {
    if (import.meta.server) return
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      ;(window as any).gtag('event', 'copy_impression', {
        section_id: sectionId,
        slot,
        pattern_id: patternId
      })
    }
  }

  function trackClick(sectionId: string, patternId: string, ctaType: string) {
    if (import.meta.server) return
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      ;(window as any).gtag('event', 'cta_click', {
        section_id: sectionId,
        pattern_id: patternId,
        cta_type: ctaType
      })
    }
  }

  function trackLpTransition(sourceSection: string, sourcePatternId: string, destination: string) {
    if (import.meta.server) return
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      ;(window as any).gtag('event', 'lp_transition', {
        source_section: sourceSection,
        source_pattern_id: sourcePatternId,
        destination
      })
    }
  }

  return {
    initSelections,
    getCopy,
    getPatternId,
    trackImpression,
    trackClick,
    trackLpTransition
  }
}
