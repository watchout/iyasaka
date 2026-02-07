export type ContentArticle = {
  _path: string
  title: string
  description?: string
  primaryProduct: string
  relatedProducts?: string[]
  publishedAt?: string
  // GEO / AIEO 用拡張
  geoTargetQueries?: string[]
  geoIntent?: 'info' | 'compare' | 'convert'
  aiAnswerSummary?: string
  faq?: {
    question: string
    answer: string
  }[]
}




