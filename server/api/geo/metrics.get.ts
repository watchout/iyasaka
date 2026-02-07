import { defineEventHandler, getQuery, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  if (!config.supabaseUrl || !config.supabaseServiceKey) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase config missing' })
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey)

  const query = getQuery(event)
  const days = Number(query.days || 7)
  const limit = Number(query.limit || 100)

  const since = new Date()
  since.setDate(since.getDate() - days)

  // 直近 days 日の snapshot + metrics を取得（engineも含める）
  const { data: snapshots, error: snapError } = await supabase
    .from('geo_snapshots')
    .select('id, created_at, query_id, raw_answer, engine')
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: true })

  if (snapError) {
    console.error('[geo/metrics] snapshots load failed', snapError)
    // エラー内容をそのまま返して原因を特定しやすくする
    throw createError({
      statusCode: 500,
      statusMessage: snapError.message || 'Failed to load snapshots'
    })
  }

  if (!snapshots || !snapshots.length) {
    return { ok: true, items: [] }
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
    console.error('[geo/metrics] metrics or queries load failed', metricError, queryError)
    throw createError({
      statusCode: 500,
      statusMessage:
        metricError?.message ||
        queryError?.message ||
        'Failed to load metrics data'
    })
  }

  const metricsBySnapshot = new Map<string, { visibility_score: number }>()
  for (const m of metrics || []) {
    metricsBySnapshot.set(m.snapshot_id, m)
  }

  const queryMeta = new Map<string, any>()
  for (const q of queries || []) {
    queryMeta.set(q.id, q)
  }

  // query_id ごとに時系列データをまとめる
  const tmpMap = new Map<
    string,
    Array<{ date: string; visibility: number; snapshotId: string; bestUrl?: string }>
  >()

  for (const s of snapshots) {
    const m = metricsBySnapshot.get(s.id)
    if (!m) continue

    const bestUrl = s.raw_answer?.best_url || undefined
    const error = s.raw_answer?.error || undefined
    const attempts = s.raw_answer?._meta?.attempts || s.raw_answer?.attempts || 1
    const model = s.raw_answer?._meta?.model || s.engine || 'unknown'
    
    const arr =
      tmpMap.get(s.query_id) ||
      (tmpMap.set(s.query_id, []), tmpMap.get(s.query_id) as Array<any>)

    arr.push({
      date: s.created_at,
      visibility: m.visibility_score,
      snapshotId: s.id,
      bestUrl,
      error,
      attempts,
      model
    })
  }

  const items: any[] = []

  for (const [queryId, dataPoints] of tmpMap.entries()) {
    const meta = queryMeta.get(queryId)
    if (!meta) continue

    dataPoints.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const last = dataPoints[dataPoints.length - 1]
    const prev = dataPoints.length > 1 ? dataPoints[dataPoints.length - 2] : null

    const sparkline = dataPoints.slice(-7).map((p) => ({
      date: p.date,
      visibility: p.visibility
    }))

    items.push({
      queryId,
      query: meta.text,
      intent: meta.intent,
      targetType: meta.target_type,
      targetSlug: meta.target_slug,
      lastVisibility: last.visibility,
      diff: prev ? last.visibility - prev.visibility : null,
      lastDate: last.date,
      bestUrl: last.bestUrl || null,
      error: last.error || null,
      attempts: last.attempts || 1,
      model: last.model || 'unknown',
      sparkline
    })
  }

  // スコアの低いものを上に（対策優先順）
  items.sort((a, b) => a.lastVisibility - b.lastVisibility)

  return {
    ok: true,
    items: items.slice(0, limit)
  }
})






