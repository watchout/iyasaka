/**
 * useSmoothScroll - Apple風スムーススクロール
 * Lenis + GSAPによる滑らかなスクロール体験
 */

import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let lenisInstance: Lenis | null = null

export const useSmoothScroll = () => {
  const isInitialized = ref(false)

  const initLenis = () => {
    if (!import.meta.client || lenisInstance) return

    // GSAP ScrollTrigger登録
    gsap.registerPlugin(ScrollTrigger)

    // Lenis初期化
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    // GSAPとの統合
    lenisInstance.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenisInstance?.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    isInitialized.value = true
  }

  const destroyLenis = () => {
    if (lenisInstance) {
      lenisInstance.destroy()
      lenisInstance = null
      isInitialized.value = false
    }
  }

  const scrollTo = (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => {
    if (!lenisInstance) return
    lenisInstance.scrollTo(target, {
      offset: options?.offset ?? 0,
      duration: options?.duration ?? 1.2,
    })
  }

  const stop = () => lenisInstance?.stop()
  const start = () => lenisInstance?.start()

  onMounted(() => {
    initLenis()
  })

  onUnmounted(() => {
    // インスタンスは共有なので破棄しない
  })

  return {
    isInitialized,
    initLenis,
    destroyLenis,
    scrollTo,
    stop,
    start,
    lenis: lenisInstance,
  }
}

// スクロールトリガーアニメーション用ユーティリティ
export const useScrollReveal = () => {
  const createRevealAnimation = (
    element: HTMLElement | string,
    options: {
      y?: number
      opacity?: number
      duration?: number
      delay?: number
      start?: string
      end?: string
    } = {}
  ) => {
    if (!import.meta.client) return

    gsap.registerPlugin(ScrollTrigger)

    const {
      y = 50,
      opacity = 0,
      duration = 1,
      delay = 0,
      start = 'top 85%',
      end = 'top 20%',
    } = options

    gsap.fromTo(
      element,
      { y, opacity },
      {
        y: 0,
        opacity: 1,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start,
          end,
          toggleActions: 'play none none reverse',
        },
      }
    )
  }

  const createParallax = (
    element: HTMLElement | string,
    options: { speed?: number; direction?: 'up' | 'down' } = {}
  ) => {
    if (!import.meta.client) return

    gsap.registerPlugin(ScrollTrigger)

    const { speed = 0.5, direction = 'up' } = options
    const yEnd = direction === 'up' ? -100 * speed : 100 * speed

    gsap.to(element, {
      y: yEnd,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })
  }

  const createFadeIn = (elements: HTMLElement[] | string, stagger = 0.1) => {
    if (!import.meta.client) return

    gsap.registerPlugin(ScrollTrigger)

    gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: elements,
          start: 'top 80%',
        },
      }
    )
  }

  return {
    createRevealAnimation,
    createParallax,
    createFadeIn,
  }
}

