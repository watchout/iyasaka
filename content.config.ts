import { defineContentConfig } from '@nuxt/content/config'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    articles: {
      type: 'markdown',
      schema: z.object({
        title: z.string().min(1, 'title is required'),
        description: z.string().optional(),
        primaryProduct: z.string().min(1, 'primaryProduct is required'),
        relatedProducts: z.array(z.string().min(1)).optional(),
        publishedAt: z.string().optional()
      })
    }
  }
})

import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

const articleSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  primaryProduct: z.string().min(1),
  relatedProducts: z.array(z.string().min(1)).optional(),
  publishedAt: z.string().optional(),
  // GEO / AIEO 拡張
  geoTargetQueries: z.array(z.string().min(1)).optional(),
  geoIntent: z.enum(['info', 'compare', 'convert']).optional(),
  aiAnswerSummary: z.string().optional(),
  faq: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1)
      })
    )
    .optional()
})

export default defineContentConfig({
  collections: {
    articles: defineCollection({
      type: 'markdown',
      schema: articleSchema
    })
  }
})


