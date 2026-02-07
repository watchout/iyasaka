export default defineEventHandler(async (event) => {
  const q = getQuery(event).q as string | undefined
  const r = await $fetch(`http://127.0.0.1:7321/knowledge/search`, {
    method: 'GET',
    query: { q: q || '' }
  })
  return r as any
})



