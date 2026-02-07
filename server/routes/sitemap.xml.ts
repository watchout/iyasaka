import { defineEventHandler } from 'h3'
import { withBase } from 'ufo'
import { products } from '@/app/data/products'

type ContentListResponse = Array<{ _path?: string | null }>

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = (config.public?.siteUrl || 'https://example.com').replace(/\/$/, '')
  const baseURL = '/iyasaka/'

  const urls: string[] = []

  // ホーム
  urls.push(new URL(withBase('/', baseURL), siteUrl).toString())

  // 記事一覧は @nuxt/content の内部API経由で取得
  try {
    const entries = await $fetch<ContentListResponse>('/api/_content/query', {
      method: 'GET'
    })

    for (const a of entries) {
      if (!a._path) continue
      if (!a._path.startsWith('/articles/')) continue
      const loc = new URL(withBase(a._path, baseURL), siteUrl).toString()
      urls.push(loc)
    }
  } catch (err) {
    console.error('[sitemap] failed to fetch articles from @nuxt/content', err)
  }

  // プロダクトLP（external / noindex は除外）
  for (const p of products) {
    if (p.external || p.noindex) continue
    const path = `/products/${p.slug}`
    const loc = new URL(withBase(path, baseURL), siteUrl).toString()
    urls.push(loc)
  }

  const now = new Date().toISOString()

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((loc) => {
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${now}</lastmod>`,
        '  </url>'
      ].join('\n')
    }),
    '</urlset>'
  ].join('\n')

  return xml
})


