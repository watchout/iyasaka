/**
 * AIPlus shindan (AI活用診断) -- リード送信 API
 *
 * 診断完了時のリードデータ + スコアをメール通知する。
 * v1 では DB 保存なし（メール通知のみ）。
 */

import { defineEventHandler, readBody, getRequestHeader, createError, getRequestIP } from 'h3'
import { z } from 'zod'
import nodemailer from 'nodemailer'

// ---------------------------------------------------------------------------
// Rate Limit (IP 毎 60 秒)
// ---------------------------------------------------------------------------

const rateLimit = new Map<string, number>()

// ---------------------------------------------------------------------------
// Zod Schema
// ---------------------------------------------------------------------------

const ShindanSubmissionSchema = z.object({
  company: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  score: z.number().min(0).max(100),
  answers: z.object({
    industry: z.string().min(1),
    employeeSize: z.string().min(1),
    manualTasks: z.array(z.string()),
    monthlyHours: z.number(),
    painPoints: z.array(z.string()),
    improvementGoal: z.string().min(1),
  }),
  source: z.literal('aiplus_shindan'),
  website: z.string().optional(), // honeypot
})

type ShindanSubmission = z.infer<typeof ShindanSubmissionSchema>

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)

  // -- Validation --
  const parsed = ShindanSubmissionSchema.safeParse(body)
  if (!parsed.success) {
    console.error('[aiplus-shindan] Validation failed:', parsed.error.issues)
    throw createError({ statusCode: 400, message: 'Invalid payload' })
  }

  const payload = parsed.data

  // -- Honeypot --
  if (payload.website) {
    return { ok: true }
  }

  // -- Rate Limit --
  const ip =
    getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
    || getRequestIP(event)
    || 'unknown'

  const last = rateLimit.get(ip)
  const now = Date.now()
  if (last && now - last < 60_000) {
    throw createError({ statusCode: 429, statusMessage: 'Too Many Requests' })
  }
  rateLimit.set(ip, now)

  // -- Email Notification --
  const mailConfig = config.mail as {
    host: string
    port: number
    user: string
    pass: string
    from: string
    to: string
  }

  if (mailConfig.host && mailConfig.user) {
    try {
      const transporter = nodemailer.createTransport({
        host: mailConfig.host,
        port: mailConfig.port,
        secure: mailConfig.port === 465,
        auth: {
          user: mailConfig.user,
          pass: mailConfig.pass,
        },
      })

      const emailBody = buildEmailBody(payload)

      await transporter.sendMail({
        from: mailConfig.from,
        to: mailConfig.to,
        subject: `[AI活用診断] ${payload.company} / ${payload.name}様 (スコア: ${payload.score})`,
        text: emailBody,
      })
    } catch (err) {
      // メール送信失敗しても診断結果は返す
      console.error('[aiplus-shindan] Mail send failed:', err)
    }
  }

  return { ok: true }
})

// ---------------------------------------------------------------------------
// Email Body Builder
// ---------------------------------------------------------------------------

function buildEmailBody(payload: ShindanSubmission): string {
  const lines = [
    '=== AIプラス AI活用診断 リード通知 ===',
    '',
    `会社名: ${payload.company}`,
    `お名前: ${payload.name}`,
    `メール: ${payload.email}`,
    `電話:   ${payload.phone || '(未入力)'}`,
    '',
    `スコア: ${payload.score} / 100`,
    '',
    '--- 回答内容 ---',
    `Q1 業種:       ${payload.answers.industry}`,
    `Q2 従業員数:   ${payload.answers.employeeSize}`,
    `Q3 手作業:     ${payload.answers.manualTasks.join(', ')}`,
    `Q4 月間時間:   ${payload.answers.monthlyHours}時間`,
    `Q5 課題:       ${payload.answers.painPoints.join(', ')}`,
    `Q6 改善目標:   ${payload.answers.improvementGoal}`,
    '',
    `送信元: ${payload.source}`,
    `送信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`,
    '',
    '※ このメールはAI活用診断フォームから自動送信されています。',
  ]

  return lines.join('\n')
}
