/**
 * useScrollAnimation
 * GSAP ScrollTrigger を使った スクロールアニメーション
 */

export const useScrollAnimation = () => {
  const nuxtApp = useNuxtApp()

  // GSAP と ScrollTrigger を取得
  const gsap = computed(() => nuxtApp.$gsap as typeof import('gsap').gsap | undefined)
  const ScrollTrigger = computed(() => nuxtApp.$ScrollTrigger as typeof import('gsap/ScrollTrigger').ScrollTrigger | undefined)

  /**
   * フェードイン アニメーション
   */
  const fadeIn = (
    selector: string | Element | Element[],
    options: {
      y?: number
      duration?: number
      delay?: number
      stagger?: number
      start?: string
    } = {}
  ) => {
    if (!gsap.value || !ScrollTrigger.value) return

    const {
      y = 30,
      duration = 0.6,
      delay = 0,
      stagger = 0.1,
      start = 'top 80%'
    } = options

    gsap.value.fromTo(
      selector,
      {
        opacity: 0,
        y
      },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: typeof selector === 'string' ? selector : selector[0] || selector,
          start,
          toggleActions: 'play none none none'
        }
      }
    )
  }

  /**
   * スケールイン アニメーション
   */
  const scaleIn = (
    selector: string | Element | Element[],
    options: {
      scale?: number
      duration?: number
      delay?: number
      start?: string
    } = {}
  ) => {
    if (!gsap.value || !ScrollTrigger.value) return

    const {
      scale = 0.9,
      duration = 0.6,
      delay = 0,
      start = 'top 80%'
    } = options

    gsap.value.fromTo(
      selector,
      {
        opacity: 0,
        scale
      },
      {
        opacity: 1,
        scale: 1,
        duration,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: typeof selector === 'string' ? selector : selector[0] || selector,
          start,
          toggleActions: 'play none none none'
        }
      }
    )
  }

  /**
   * パララックス アニメーション
   */
  const parallax = (
    selector: string | Element,
    options: {
      speed?: number
      start?: string
      end?: string
    } = {}
  ) => {
    if (!gsap.value || !ScrollTrigger.value) return

    const {
      speed = 0.5,
      start = 'top bottom',
      end = 'bottom top'
    } = options

    gsap.value.to(selector, {
      y: () => -100 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: selector,
        start,
        end,
        scrub: true
      }
    })
  }

  /**
   * テキスト分割アニメーション
   */
  const splitText = (
    selector: string | Element,
    options: {
      duration?: number
      stagger?: number
      start?: string
    } = {}
  ) => {
    if (!gsap.value || !ScrollTrigger.value) return

    const {
      duration = 0.5,
      stagger = 0.02,
      start = 'top 80%'
    } = options

    const element = typeof selector === 'string' 
      ? document.querySelector(selector) 
      : selector

    if (!element || !(element instanceof HTMLElement)) return

    const text = element.textContent || ''
    element.innerHTML = text
      .split('')
      .map(char => `<span class="split-char">${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('')

    gsap.value.fromTo(
      element.querySelectorAll('.split-char'),
      {
        opacity: 0,
        y: 20
      },
      {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start,
          toggleActions: 'play none none none'
        }
      }
    )
  }

  /**
   * クリーンアップ（コンポーネントアンマウント時に呼び出す）
   */
  const cleanup = () => {
    if (!ScrollTrigger.value) return
    ScrollTrigger.value.getAll().forEach(trigger => trigger.kill())
  }

  return {
    gsap,
    ScrollTrigger,
    fadeIn,
    scaleIn,
    parallax,
    splitText,
    cleanup
  }
}


