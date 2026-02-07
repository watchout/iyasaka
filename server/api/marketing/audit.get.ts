export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const path = (q.path as string) || '/'
  const goal = (q.goal as string) || 'lead'

  // NuxtのローカルHTMLを取得（dev:4100 前提）
  const target = `http://127.0.0.1:4100${path}`
  const html = await $fetch<string>(target, { method: 'GET' })

  const result = await $fetch('http://127.0.0.1:7321/marketing/audit', {
    method: 'POST',
    body: { html, path, goal }
  })
  return result as any
})



