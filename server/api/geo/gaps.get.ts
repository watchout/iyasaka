import { defineEventHandler, createError } from 'h3'
import { products } from '@/app/data/products'
import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  if (!config.supabaseUrl || !config.supabaseServiceKey) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase config missing' })
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey)

  // 記事存在チェックのN+1を避けるため、先に「primaryProductが存在するslug集合」を一括取得
  const articlePrimaryProducts = new Set<string>()
  try {
    const articles = await serverQueryContent(event, 'articles')
      .only(['primaryProduct'])
      .find()
    for (const a of articles as any[]) {
      const slug = a?.primaryProduct
      if (typeof slug === 'string' && slug) articlePrimaryProducts.add(slug)
    }
  } catch (e) {
    // Nuxt Content が未初期化等で失敗しても、gaps自体は落とさず「記事無し」扱いにする
    console.warn('[geo/gaps] failed to prefetch article primaryProduct list', e)
  }

  // 直近30日のメトリクスから「穴」候補を抽出
  const since = new Date()
  since.setDate(since.getDate() - 30)

  const { data: snapshots, error: snapError } = await supabase
    .from('geo_snapshots')
    .select('id, created_at, query_id, raw_answer')
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: true })

  if (snapError) {
    console.error('[geo] gaps snapshots load failed', snapError)
    throw createError({ statusCode: 500, statusMessage: 'Failed to load snapshots' })
  }

  if (!snapshots || !snapshots.length) {
    return { ok: true, gaps: [] }
  }

  const snapshotIds = snapshots.map((s) => s.id)
  const queryIds = Array.from(new Set(snapshots.map((s) => s.query_id)))

  const [{ data: metrics, error: metricError }, { data: queries, error: queryError }] =
    await Promise.all([
      supabase
        .from('geo_metrics')
        .select('snapshot_id, visibility_score')
        .in('snapshot_id', snapshotIds),
      supabase
        .from('geo_queries')
        .select('id, text, intent, target_type, target_slug')
        .in('id', queryIds)
    ])

  if (metricError || queryError) {
    console.error('[geo] gaps metrics load failed', metricError, queryError)
    throw createError({ statusCode: 500, statusMessage: 'Failed to load gaps data' })
  }

  const metricsBySnapshot = new Map<string, { visibility_score: number }>()
  for (const m of metrics || []) {
    metricsBySnapshot.set(m.snapshot_id, m)
  }

  const queryMeta = new Map<string, any>()
  for (const q of queries || []) {
    queryMeta.set(q.id, q)
  }

  const perQuery: Map<string, { snapshot: any; metric: any }> = new Map()

  // 各 query ごとに最新スナップショット＋メトリクスを保持
  for (const s of snapshots) {
    const m = metricsBySnapshot.get(s.id)
    if (!m) continue
    const prev = perQuery.get(s.query_id)
    if (!prev || new Date(s.created_at).getTime() > new Date(prev.snapshot.created_at).getTime()) {
      perQuery.set(s.query_id, { snapshot: s, metric: m })
    }
  }

  const gaps: any[] = []

  for (const [queryId, pair] of perQuery.entries()) {
    const meta = queryMeta.get(queryId)
    if (!meta) continue

    const visibility = pair.metric.visibility_score
    const raw = pair.snapshot.raw_answer || {}
    const bestUrl: string | undefined = raw.best_url

    // visibility < 50 かつ best_url が LP（/products/）の場合のみ対象
    if (!bestUrl || visibility >= 50) continue
    if (!bestUrl.includes('/products/')) continue

    // slug 抽出（絶対URL or 相対URL両対応）
    let slug: string | null = null
    try {
      const u = bestUrl.startsWith('http') ? new URL(bestUrl) : new URL(bestUrl, 'https://dummy')
      const path = u.pathname || ''
      const parts = path.split('/').filter(Boolean)
      const idx = parts.indexOf('products')
      if (idx !== -1 && parts[idx + 1]) {
        slug = parts[idx + 1]
      }
    } catch {
      // ignore parse error
    }

    if (!slug) continue

    const product = products.find((p) => p.slug === slug)
    if (!product) continue

    // 該当LPに紐づく記事が存在するかチェック（事前取得した集合でO(1)）
    if (articlePrimaryProducts.has(slug)) {
      // 既に記事がある場合はギャップではない
      continue
    }

    // BoFU 記事の提案
    const suggestedTitle = `【BoFU】${product.title} 向け: ${meta.text} に本気で答える記事`
    const outline = [
      '1. 読者の状況・前提の整理',
      '2. なぜ今この課題が表面化しているのか',
      `3. ${product.title} を使った解決アプローチの全体像`,
      '4. 検討時によくある比較ポイントと注意点',
      '5. 失敗しないためのチェックリストと次の一歩'
    ]

    gaps.push({
      queryId,
      query: meta.text,
      intent: meta.intent,
      visibility,
      bestUrl,
      targetLP: bestUrl,
      suggestedArticles: [
        {
          title: suggestedTitle,
          primaryProduct: slug,
          outline
        }
      ]
    })
  }

  // visibility の低い順にソート
  gaps.sort((a, b) => a.visibility - b.visibility)

  return {
    ok: true,
    gaps
  }
})






