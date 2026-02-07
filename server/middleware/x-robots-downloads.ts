import { getRequestURL, setHeader } from 'h3'

export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  // /iyasaka/downloads/*.pdf に対応（Nitro側では baseURL 適用後のパスが入る想定）
  if (url.pathname.includes('/downloads/') && url.pathname.endsWith('.pdf')) {
    setHeader(event, 'X-Robots-Tag', 'noindex, nofollow, noarchive')
    setHeader(event, 'Cache-Control', 'public, max-age=86400')
    setHeader(event, 'Content-Disposition', 'inline')
  }
})



