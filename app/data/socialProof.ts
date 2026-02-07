export type LogoItem = { src: string; alt: string; href?: string }
export type MetricItem = { label: string; value: string; note?: string }
export type Testimonial = {
  quote: string
  author: string
  role?: string
  company?: string
  avatar?: string
}

export const logoBar: LogoItem[] = [
  // 例: { src: '/logos/hotel-x.svg', alt: 'Hotel X' }
]

export const metrics: MetricItem[] = [
  // 例: { label: '導入拠点', value: '120+', note: '稼働含む' }
]

export const testimonials: Testimonial[] = [
  // 例: { quote: '運用が軽くなった', author: '○○ 様', role:'支配人', company:'△△ホテル' }
]











