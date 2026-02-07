import { ref, onMounted, onBeforeUnmount } from 'vue'

type FloatingCtaOptions = {
  threshold?: number
  showOnScrollUp?: boolean
}

// 固定CTAの表示/非表示を制御する最小実装
// - PCではスクロール量とスクロール方向で表示
// - モバイルはレイアウト側で常時表示想定（本関数はPC向け）
export function useFloatingCtaVisibility(options: FloatingCtaOptions = {}) {
  const { threshold = 200, showOnScrollUp = true } = options
  const isVisible = ref(false)

  if (typeof window === 'undefined') {
    return { isVisible }
  }

  let lastY = window.scrollY || 0
  let ticking = false

  const update = () => {
    const y = window.scrollY || 0
    const scrolledEnough = y > threshold
    const scrollingUp = y < lastY

    if (!showOnScrollUp) {
      // 単純に閾値だけで表示
      isVisible.value = scrolledEnough
    } else {
      // 閾値を超え、かつ上方向スクロール時に表示
      isVisible.value = scrolledEnough && scrollingUp
    }

    lastY = y
    ticking = false
  }

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(update)
      ticking = true
    }
  }

  onMounted(() => {
    lastY = window.scrollY || 0
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { isVisible }
}


