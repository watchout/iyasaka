import { defineEventHandler, readBody, createError } from 'h3'
import { z } from 'zod'
import { brand } from '@/app/data/brand'

const BodySchema = z.object({
  queryIds: z.array(z.string().uuid()).optional(),
  dryRun: z.boolean().optional()
})

type GeoEvaluation = {
  url: string
  relevance: number
  reason: string
}

type GeoJudgeResult = {
  query: string
  intent: 'info' | 'compare' | 'convert' | string
  region: string
  evaluations: GeoEvaluation[]
  best_url?: string
  visibility_score: number
}

type RetryResult<T> = {
  success: boolean
  data?: T
  error?: string
  attempts: number
  model?: string
}

// モデル優先順位（フォールバック）
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash'
] as const

function getGeminiEndpoint(model: string) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
}

// 指数バックオフ＋ジッター
function getBackoffDelay(attempt: number): number {
  const baseDelay = 1000 // 1秒
  const exponential = baseDelay * Math.pow(2, attempt - 1)
  const jitter = exponential * 0.2 * (Math.random() - 0.5) // ±20%
  return exponential + jitter
}

// リトライ可能なエラーかチェック
function isRetryableError(statusCode?: number): boolean {
  if (!statusCode) return false
  return statusCode === 429 || statusCode >= 500
}

// 429エラーの待機時間を抽出
function extractRetryAfter(errorMessage: string): number | null {
  const match = errorMessage.match(/retry in ([\d.]+)s/i)
  return match ? parseFloat(match[1]) * 1000 : null
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)
  const parsed = BodySchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid payload' })
  }

  const { queryIds, dryRun = false } = parsed.data

  // 内部トークンによるガード（本番想定）
  const snapshotToken = config.geoSnapshotToken
  if (snapshotToken) {
    const header = event.node.req.headers['x-geo-snapshot-token']
    if (header !== snapshotToken) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
  }

  if (!config.supabaseUrl || !config.supabaseServiceKey) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase config missing' })
  }

  const geminiApiKey = config.geminiApiKey || process.env.GEMINI_API_KEY
  // dryRunでない場合のみGEMINI_API_KEYを必須とする
  if (!dryRun && !geminiApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'GEMINI_API_KEY missing' })
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey)

  // dryRunモードの場合はダミーデータで動作確認
  if (dryRun) {
    const dummyQueries = [
      {
        id: 'dummy-query-1',
        text: '埼玉 ホテルDX AI導入',
        intent: 'info',
        target_type: 'article',
        target_slug: 'hotel-dx-ai',
        enabled: true
      }
    ]
    
    const results: any[] = []
    for (const q of dummyQueries) {
      const dummyJudge = {
        query: q.text,
        intent: q.intent,
        region: 'JP/Saitama',
        evaluations: [
          { url: '/iyasaka/articles/hotel-dx-ai', relevance: 85, reason: 'ダミーデータ（dryRun）' }
        ],
        best_url: '/iyasaka/articles/hotel-dx-ai',
        visibility_score: 85
      }
      results.push({ queryId: q.id, judge: dummyJudge })
    }
    
    return {
      ok: true,
      dryRun: true,
      processed: results.length,
      results
    }
  }

  // 1日の実行上限チェック（本番モードのみ）
  const maxPerDay = Number(config.geo?.maxQueriesPerDay || 0)
  if (maxPerDay > 0) {
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const { count, error: countError } = await supabase
      .from('geo_snapshots')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', todayStart.toISOString())

    if (countError) {
      console.error('[geo] daily limit check failed', countError)
      throw createError({ statusCode: 500, statusMessage: 'Failed to check daily limit' })
    }

    if ((count || 0) >= maxPerDay) {
      throw createError({ statusCode: 429, statusMessage: 'GEO daily limit exceeded' })
    }
  }

  // 対象クエリ取得
  // - 通常運用: enabled=true のみ
  // - 明示的に queryIds が指定された場合: enabled を無視して強制的に対象にする（手動実行・検証用）
  let queryBuilder = supabase.from('geo_queries').select('*')

  if (queryIds && queryIds.length) {
    queryBuilder = queryBuilder.in('id', queryIds)
  } else {
    queryBuilder = queryBuilder.eq('enabled', true)
  }

  const { data: queries, error: queriesError } = await queryBuilder
  if (queriesError) {
    console.error('[geo] failed to load geo_queries', queriesError)
    throw createError({ statusCode: 500, statusMessage: 'Failed to load geo queries' })
  }

  if (!queries || !queries.length) {
    return { ok: true, processed: 0, dryRun, results: [] }
  }

  const maxPerRun = Number(config.geo?.maxQueriesPerRun || 10)
  const limitedQueries = queries.slice(0, maxPerRun)

  const results: any[] = []
  let totalAttempts = 0
  let failureCount = 0

  for (const q of limitedQueries) {
    console.log(`[geo] Processing query: "${q.text}"`)
    
    const retryResult = await callGeoJudgeWithRetry(geminiApiKey, {
      text: q.text,
      intent: q.intent || 'info',
      targetType: q.target_type,
      targetSlug: q.target_slug
    })
    
    totalAttempts += retryResult.attempts

    if (!retryResult.success || !retryResult.data) {
      console.error(`[geo] ❌ Failed to evaluate query "${q.text}": ${retryResult.error}`)
      failureCount++
      
      // 失敗を記録（evaluations空、理由付き）
      if (!dryRun) {
        await supabase.from('geo_snapshots').insert({
          query_id: q.id,
          engine: 'failed',
          raw_answer: {
            query: q.text,
            intent: q.intent || 'info',
            region: 'JP',
            evaluations: [],
            visibility_score: 0,
            error: retryResult.error,
            attempts: retryResult.attempts
          }
        })
      }
      
      results.push({
        queryId: q.id,
        snapshotId: null,
        visibilityScore: 0,
        bestUrl: null,
        error: retryResult.error
      })
      continue
    }

    const judge = retryResult.data

    if (dryRun) {
      results.push({ 
        queryId: q.id, 
        judge,
        model: retryResult.model,
        attempts: retryResult.attempts
      })
      continue
    }

    // geo_snapshots への保存
    const { data: snapshotInserted, error: snapshotError } = await supabase
      .from('geo_snapshots')
      .insert({
        query_id: q.id,
        engine: retryResult.model || 'gemini-2.5-flash',
        raw_answer: {
          ...judge,
          _meta: {
            attempts: retryResult.attempts,
            model: retryResult.model
          }
        }
      })
      .select('id')
      .single()

    if (snapshotError) {
      console.error('[geo] failed to insert snapshot', snapshotError)
      continue
    }

    const snapshotId = snapshotInserted?.id
    if (!snapshotId) continue

    // メトリクスの計算
    const presence = Boolean(judge.best_url && judge.visibility_score > 0)
    const selfMentions = Array.isArray(judge.evaluations) ? judge.evaluations.length : 0
    const otherMentions = 0

    const { error: metricError } = await supabase.from('geo_metrics').insert({
      snapshot_id: snapshotId,
      presence,
      self_mentions: selfMentions,
      other_mentions: otherMentions,
      visibility_score: judge.visibility_score
    })

    if (metricError) {
      console.error('[geo] failed to insert metric', metricError)
    }

    results.push({
      queryId: q.id,
      snapshotId,
      visibilityScore: judge.visibility_score,
      bestUrl: judge.best_url,
      model: retryResult.model,
      attempts: retryResult.attempts
    })
  }

  console.log(`[geo] 📊 Batch complete: ${results.length} queries, ${totalAttempts} total attempts, ${failureCount} failures`)

  return {
    ok: true,
    dryRun,
    processed: results.length,
    results
  }
})

// フォールバック＋リトライ付きでGemini API呼び出し
async function callGeoJudgeWithRetry(
  apiKey: string,
  params: { text: string; intent: string; targetType: string; targetSlug: string }
): Promise<RetryResult<GeoJudgeResult>> {
  const maxAttempts = 4
  let lastError = ''
  
  // モデルフォールバック
  for (const model of GEMINI_MODELS) {
    console.log(`[geo] Trying model: ${model}`)
    
    // 各モデルで最大4回リトライ
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await callGeoJudge(apiKey, params, model)
        
        // 成功
        if (result.evaluations && result.evaluations.length > 0) {
          console.log(`[geo] ✅ Success with ${model} on attempt ${attempt}`)
          return {
            success: true,
            data: result,
            attempts: attempt,
            model
          }
        }
        
        // evaluationsが空 = 429エラーの可能性
        console.warn(`[geo] ⚠️ Empty evaluations from ${model}, attempt ${attempt}`)
        lastError = 'Empty evaluations (likely 429 or parse error)'
        
        // 次のリトライ前に待機
        if (attempt < maxAttempts) {
          const delay = getBackoffDelay(attempt)
          console.log(`[geo] Waiting ${Math.round(delay)}ms before retry...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
        
      } catch (error: any) {
        const statusCode = error?.response?.status || error?.statusCode
        lastError = error?.message || error?.toString() || 'Unknown error'
        
        console.error(`[geo] ❌ Error with ${model}, attempt ${attempt}:`, {
          statusCode,
          message: lastError
        })
        
        // リトライ不可能なエラー（400, 403, 404など）
        if (statusCode && !isRetryableError(statusCode)) {
          console.log(`[geo] Non-retryable error (${statusCode}), trying next model`)
          break // 次のモデルへ
        }
        
        // 429エラーの場合、推奨待機時間を抽出
        if (statusCode === 429) {
          const retryAfter = extractRetryAfter(lastError)
          if (retryAfter && attempt < maxAttempts) {
            console.log(`[geo] 429 detected, waiting ${Math.round(retryAfter)}ms...`)
            await new Promise(resolve => setTimeout(resolve, retryAfter))
            continue
          }
        }
        
        // 最後のリトライでなければ待機
        if (attempt < maxAttempts) {
          const delay = getBackoffDelay(attempt)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    // このモデルで全リトライ失敗、次のモデルへ
    console.log(`[geo] All retries failed for ${model}, trying next model...`)
  }
  
  // 全モデル・全リトライ失敗
  return {
    success: false,
    error: lastError,
    attempts: maxAttempts * GEMINI_MODELS.length
  }
}

// 単一モデルでの呼び出し（リトライなし）
async function callGeoJudge(
  apiKey: string,
  params: { text: string; intent: string; targetType: string; targetSlug: string },
  model: string
): Promise<GeoJudgeResult> {
  const prompt = buildJudgePrompt(params)
  const endpoint = getGeminiEndpoint(model)

  // 外部LLMコールはタイムアウト付き
  const response = await $fetch<any>(`${endpoint}?key=${apiKey}`, {
    method: 'POST',
    body: {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ]
    },
    timeout: 15000 // 15秒
  })

  const text =
    response?.candidates?.[0]?.content?.parts?.[0]?.text || ''

  // JSONの前後にマークダウンコードブロックがある場合は除去
  let cleanedText = text.trim()
  if (cleanedText.startsWith('```json')) {
    cleanedText = cleanedText.replace(/^```json\n?/, '').replace(/\n?```$/, '')
  } else if (cleanedText.startsWith('```')) {
    cleanedText = cleanedText.replace(/^```\n?/, '').replace(/\n?```$/, '')
  }
  
  const json = JSON.parse(cleanedText)
  
  return json
}

function buildJudgePrompt(params: { text: string; intent: string; targetType: string; targetSlug: string }) {
  const aliases = brand.brandAliases.join(', ')
  
  // 製品別のURL候補を定義
  const productUrlMap: Record<string, string[]> = {
    'haishin-plus': [
      '/iyasaka/products/haishin-plus',
      '/iyasaka/articles/haishin-plus-guide',
      '/iyasaka/articles/streaming-best-practices'
    ],
    'onsite-support': [
      '/iyasaka/products/onsite-support',
      '/iyasaka/articles/audio-troubleshooting',
      '/iyasaka/articles/av-equipment-maintenance'
    ],
    'multilingual-plus': [
      '/iyasaka/products/multilingual-plus',
      '/iyasaka/articles/video-translation-workflow',
      '/iyasaka/articles/ai-subtitle-guide'
    ],
    'ai-plus': [
      '/iyasaka/products/ai-plus',
      '/iyasaka/articles/ai-implementation-guide',
      '/iyasaka/articles/business-ai-training'
    ],
    'weak-current': [
      '/iyasaka/products/weak-current',
      '/iyasaka/articles/av-installation-guide',
      '/iyasaka/articles/network-cabling-best-practices'
    ]
  }

  const suggestedUrls = productUrlMap[params.targetSlug] || [
    `/iyasaka/products/${params.targetSlug}`,
    `/iyasaka/articles/${params.targetSlug}-guide`
  ]

  return `
あなたはBtoBサイトのGEO（Generative Engine Optimization）評価官です。
以下の制約をすべて守り、**必ず有効なJSONのみ**を出力してください。前後に説明文やMarkdownは一切書かないでください。

【ブランド情報】
- 公式ドメイン: ${brand.siteUrl}
- ブランド別名: ${aliases}
- 事業内容: 弱電工事・オンサイト保守・配信支援・AI導入支援・多言語化支援

【製品ラインナップ】
- haishin-plus: 会議室・ホール配信の設計・運用支援（JV型）
- onsite-support: 弱電設備のオンサイト保守（音響・映像トラブル対応）
- multilingual-plus: 動画・資料の多言語化（AI翻訳・ナレーション生成）
- ai-plus: 中小企業向けAI導入支援・社内研修
- weak-current: 弱電工事（音響・映像・LAN配線）

【クエリ情報】
- query: "${params.text}"
- intent: "${params.intent || 'info'}"  // info | compare | convert のいずれか
- targetType: "${params.targetType}"    // article | product
- targetSlug: "${params.targetSlug}"

【評価タスク】
このクエリに対して、IYASAKA公式サイト内で最も適切なURL候補を評価してください。

**重要**: evaluations には**必ず1〜3件のURL**を含めてください。空配列は不可です。

【URL候補の例（${params.targetSlug}）】
${suggestedUrls.map((url, i) => `${i + 1}. ${url}`).join('\n')}

上記以外にも、クエリに適したURL（/iyasaka/products/... や /iyasaka/articles/...）を自由に提案できます。

【評価基準】
1. intent に応じた重み付け:
   - info: 解説記事や技術ガイドを優先（relevance 60-80）
   - compare: 比較表やサービス選定ガイドを優先（relevance 70-85）
   - convert: 製品LPや問い合わせ導線を優先（relevance 75-95）

2. クエリとの関連性:
   - 直接的に答えられる: relevance 80-100
   - 間接的に関連する: relevance 50-70
   - 弱い関連: relevance 30-50

3. visibility_score の計算:
   - 最も高いrelevance値をベースに算出
   - 複数の関連URLがある場合は+10〜20加点
   - 最終的に0〜100の整数で出力

【出力フォーマット】
次のJSONスキーマに**厳密に従って**出力してください。

{
  "query": "${params.text}",
  "intent": "${params.intent}",
  "region": "JP/Saitama",
  "evaluations": [
    { "url": "/iyasaka/products/${params.targetSlug}", "relevance": 85, "reason": "製品公式ページで直接的に情報を提供" },
    { "url": "/iyasaka/articles/${params.targetSlug}-guide", "relevance": 70, "reason": "詳細な技術解説記事" }
  ],
  "best_url": "/iyasaka/products/${params.targetSlug}",
  "visibility_score": 85
}

**注意**: 上記は例です。実際のクエリ「${params.text}」に基づいて、適切なURL・relevance・reasonを記載してください。
evaluationsは必ず1件以上含めてください。
`
}






