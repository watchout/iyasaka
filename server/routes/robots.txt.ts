import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  const lines = [
    'User-agent: *',
    'Allow: /',
    '',
    // downloads/*.pdf については X-Robots-Tag ヘッダで制御済み
    'Sitemap: https://example.com/iyasaka/sitemap.xml',
    ''
  ]

  return lines.join('\n')
})








