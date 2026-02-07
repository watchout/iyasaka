import { defineEventHandler, readBody, getRequestHeader, createError, getRequestIP } from 'h3'
import { z } from 'zod'
import nodemailer from 'nodemailer'
import type { LeadPayload, LeadSubmission } from '@/app/types/leads'
import fs from 'node:fs/promises'
import { join } from 'node:path'

const rateLimit = new Map<string, number>()

// 2026年版スキーマ
const LeadSubmissionSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  employees: z.string().min(1),
  interestedProducts: z.array(z.string()).min(1),
  message: z.string().optional(),
  privacyAgreed: z.boolean(),
  source: z.string().min(1),
  primaryProduct: z.string().min(1),
  rawPid: z.string().nullable().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  diagnosisResult: z.object({
    product: z.string(),
    answers: z.record(z.enum(['yes', 'no'])),
    timestamp: z.number()
  }).optional(),
  simpleDiagnosisResult: z.object({
    product: z.string(),
    score: z.number(),
    timestamp: z.number()
  }).optional(),
  landingPage: z.string().optional(),
  referrer: z.string().optional(),
  pageViews: z.number().optional(),
  timeToConversion: z.number().optional(),
  createdAt: z.string(),
  website: z.string().optional() // honeypot
})

// レガシースキーマ（互換性維持）
const LegacyLeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().min(1),
  phone: z.string().max(100).optional(),
  role: z.string().max(200).optional(),
  budgetPhase: z.enum(['research', 'comparison', 'ready']).optional(),
  primaryProductSlug: z.string().min(1),
  relatedProductSlugs: z.array(z.string().min(1)).optional(),
  source: z.string().min(1),
  articleSlug: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  notes: z.string().optional(),
  website: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)

  // 2026年版スキーマを先に試す
  let payload: LeadSubmission | LeadPayload
  let isNewFormat = false
  
  const newParsed = LeadSubmissionSchema.safeParse(body)
  if (newParsed.success) {
    payload = newParsed.data as LeadSubmission
    isNewFormat = true
  } else {
    const legacyParsed = LegacyLeadSchema.safeParse(body)
    if (!legacyParsed.success) {
      console.error('Validation failed:', newParsed.error, legacyParsed.error)
      throw createError({ statusCode: 400, message: 'Invalid payload' })
    }
    payload = legacyParsed.data as LeadPayload
  }

  const normalizedEmail = payload.email.trim().toLowerCase()
  const ip =
    getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() ||
    getRequestIP(event) ||
    event.node.req.socket.remoteAddress ||
    'unknown'

  const persistMode = process.env.LEADS_PERSIST || 'supabase'

  // Honeypot
  if ('website' in payload && payload.website) {
    return { ok: true }
  }

  const last = rateLimit.get(ip)
  const now = Date.now()
  if (last && now - last < 60_000) {
    throw createError({ statusCode: 429, statusMessage: 'Too Many Requests' })
  }
  rateLimit.set(ip, now)

  // ダミー保存モード
  if (persistMode === 'dummy') {
    try {
      await appendDummyLead(payload, { ip, normalizedEmail, isNewFormat })
    } catch (err) {
      console.warn('[leads] dummy persist failed', err)
    }
    return { ok: true, dummy: true }
  }

  if (!config.supabaseUrl || !config.supabaseServiceKey) {
    throw createError({ statusCode: 500, message: 'Supabase config missing' })
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey)

  // 重複チェック
  const { data: lastLead, error: lastError } = await supabase
    .from('leads')
    .select('created_at')
    .eq('email', normalizedEmail)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!lastError && lastLead?.created_at) {
    const within10min = Date.now() - new Date(lastLead.created_at).getTime() < 10 * 60 * 1000
    if (within10min) {
      return { ok: true, throttled: true }
    }
  }

  // DB保存（フォーマットに応じて変換）
  const dbRecord = isNewFormat 
    ? buildNewFormatRecord(payload as LeadSubmission, normalizedEmail, ip)
    : buildLegacyRecord(payload as LeadPayload, normalizedEmail, ip)

  const { error } = await supabase.from('leads').insert(dbRecord)

  if (error) {
    console.error('Supabase insert error', error)
    throw createError({ statusCode: 500, message: 'Failed to save lead' })
  }

  await Promise.allSettled([
    sendSlackNotification(config.slackLeadWebhook, payload, ip, isNewFormat),
    sendMailNotification(config.mail, payload, isNewFormat)
  ])

  return { ok: true }
})

function buildNewFormatRecord(payload: LeadSubmission, email: string, ip: string) {
  const diagnosis =
    payload.diagnosisResult
      ? { kind: 'full', ...payload.diagnosisResult }
      : payload.simpleDiagnosisResult
        ? { kind: 'simple', ...payload.simpleDiagnosisResult }
        : null

  return {
    name: payload.name,
    email,
    company: payload.company ?? null,
    phone: payload.phone ?? null,
    employees: payload.employees,
    primary_product_slug: payload.primaryProduct,
    related_product_slugs: payload.interestedProducts,
    source: payload.source,
    raw_pid: payload.rawPid ?? null,
    utm_source: payload.utmSource ?? null,
    utm_medium: payload.utmMedium ?? null,
    utm_campaign: payload.utmCampaign ?? null,
    utm_term: payload.utmTerm ?? null,
    utm_content: payload.utmContent ?? null,
    landing_page: payload.landingPage ?? null,
    referrer: payload.referrer ?? null,
    page_views: payload.pageViews ?? null,
    time_to_conversion: payload.timeToConversion ?? null,
    diagnosis_result: diagnosis,
    notes: payload.message ?? null,
    ip
  }
}

function buildLegacyRecord(payload: LeadPayload, email: string, ip: string) {
  return {
    name: payload.name,
    email,
    company: payload.company,
    phone: payload.phone ?? null,
    role: payload.role ?? null,
    budget_phase: payload.budgetPhase ?? null,
    primary_product_slug: payload.primaryProductSlug,
    related_product_slugs: payload.relatedProductSlugs ?? null,
    source: payload.source,
    article_slug: payload.articleSlug ?? null,
    utm_source: payload.utmSource ?? null,
    utm_medium: payload.utmMedium ?? null,
    utm_campaign: payload.utmCampaign ?? null,
    notes: payload.notes ?? null,
    ip
  }
}

async function appendDummyLead(
  payload: LeadSubmission | LeadPayload,
  ctx: { ip: string; normalizedEmail: string; isNewFormat: boolean }
) {
  const dir = join(process.cwd(), '.data')
  const file = join(dir, 'leads.ndjson')
  await fs.mkdir(dir, { recursive: true })
  const record = {
    ...payload,
    email: ctx.normalizedEmail,
    ip: ctx.ip,
    format: ctx.isNewFormat ? '2026' : 'legacy',
    createdAt: new Date().toISOString()
  }
  await fs.appendFile(file, JSON.stringify(record) + '\n', 'utf8')
}

async function sendSlackNotification(
  webhook: string | undefined, 
  payload: LeadSubmission | LeadPayload, 
  ip: string,
  isNewFormat: boolean
) {
  if (!webhook) return
  try {
    const productName = isNewFormat 
      ? (payload as LeadSubmission).primaryProduct
      : (payload as LeadPayload).primaryProductSlug
    
    const blocks = [
      {
        type: 'header',
        text: { type: 'plain_text', text: `🎉 New Lead: ${productName}` }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Name*\n${payload.name}` },
          { type: 'mrkdwn', text: `*Email*\n${payload.email}` },
          { type: 'mrkdwn', text: `*Company*\n${'company' in payload ? payload.company || '-' : '-'}` },
          { type: 'mrkdwn', text: `*Source*\n${payload.source}` }
        ]
      }
    ]

    if (isNewFormat) {
      const newPayload = payload as LeadSubmission
      blocks.push({
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: `Products: ${newPayload.interestedProducts.join(', ')}` },
          { type: 'mrkdwn', text: `Employees: ${newPayload.employees}` },
          { type: 'mrkdwn', text: `Page Views: ${newPayload.pageViews || 1}` }
        ]
      } as any)
      
      if (newPayload.diagnosisResult) {
        blocks.push({
          type: 'context',
          elements: [
            { type: 'mrkdwn', text: `📊 Diagnosis: ${newPayload.diagnosisResult.product}` }
          ]
        } as any)
      }
    }

    await $fetch(webhook, { method: 'POST', body: { text: 'New lead', blocks } })
  } catch (err) {
    console.error('Slack notification failed', err)
  }
}

async function sendMailNotification(
  mailConfig: { host: string; port: number; user: string; pass: string; from: string; to: string },
  payload: LeadSubmission | LeadPayload,
  isNewFormat: boolean
) {
  if (!mailConfig?.host || !mailConfig.user || !mailConfig.pass || !mailConfig.from || !mailConfig.to) {
    return
  }
  try {
    const transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.port === 465,
      auth: { user: mailConfig.user, pass: mailConfig.pass }
    })

    const productName = isNewFormat 
      ? (payload as LeadSubmission).primaryProduct
      : (payload as LeadPayload).primaryProductSlug

    await transporter.sendMail({
      from: mailConfig.from,
      to: mailConfig.to,
      subject: `New Lead: ${productName} / ${payload.name}`,
      text: JSON.stringify(payload, null, 2)
    })
  } catch (err) {
    console.error('Mail notification failed', err)
  }
}
