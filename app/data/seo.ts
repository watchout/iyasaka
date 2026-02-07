export const defaultSEO = {
  title: 'IYASAKA｜弱電・ホテルAI・動画配信・現場DX',
  description:
    '弱電・電気工事を土台に、ホテルAI、動画配信、現場DX（ミエルボード/ストック/ドライブ）、カスタムAI、dev-OSで、現場の「不」を技術で解消します。',
  ogImage: '/og.jpg',
  twitterCard: 'summary_large_image',
  robots: { index: true, follow: true }
} as const

export type PageSEO = Partial<typeof defaultSEO> & { title?: string }

export const buildSeo = (overrides?: PageSEO) => {
  const s = { ...defaultSEO, ...overrides }
  return {
    title: s.title ?? defaultSEO.title,
    description: s.description,
    ogImage: s.ogImage,
    twitterCard: s.twitterCard,
    robots: s.robots.index ? 'index,follow' : 'noindex,nofollow'
  } as const
}











