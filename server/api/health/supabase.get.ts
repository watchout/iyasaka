import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  if (!config.supabaseUrl || !config.supabaseServiceKey) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase config missing' })
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey)

  // GEO系テーブルの存在確認を兼ねて、geo_snapshots を参照する
  const { error } = await supabase.from('geo_snapshots').select('id').limit(1)

  if (error) {
    console.error('[health/supabase] geo_snapshots check failed', error)
    // Supabase のエラーメッセージをそのまま返して原因を判別しやすくする
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Supabase health check failed'
    })
  }

  return { ok: true }
})








