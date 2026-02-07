import type { MetaObject } from '@unhead/schema'
import { withBase } from 'ufo'

type BuildSeoInput = {
  title: string
  description?: string
  path: string
}

export const buildSeo = ({ title, description, path }: BuildSeoInput, opts?: { siteUrl?: string; baseURL?: string }): MetaObject => {
  const baseURL = opts?.baseURL || '/iyasaka/'
  const siteUrl = (opts?.siteUrl || 'https://example.com').replace(/\/$/, '')

  // path は `/articles/foo` や `/products/bar` を想定
  const resolvedPath = withBase(path, baseURL)
  const canonical = new URL(resolvedPath, siteUrl).toString()

  const meta: MetaObject = {
    title,
    meta: [
      description
        ? {
            name: 'description',
            content: description
          }
        : undefined,
      {
        property: 'og:title',
        content: title
      },
      description
        ? {
            property: 'og:description',
            content: description
          }
        : undefined,
      {
        property: 'og:url',
        content: canonical
      },
      {
        property: 'og:site_name',
        content: 'IYASAKA（arrowsworks）'
      },
      {
        property: 'og:type',
        content: 'article'
      },
      {
        property: 'og:image',
        content: `${siteUrl}/iyasaka/images/og-default.jpg`
      }
    ].filter(Boolean) as NonNullable<MetaObject['meta']>,
    link: [
      {
        rel: 'canonical',
        href: canonical
      }
    ]
  }

  return meta
}








