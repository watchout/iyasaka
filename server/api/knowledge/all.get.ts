export default defineEventHandler(async () => {
  const r = await $fetch('http://127.0.0.1:7321/knowledge/all', { method: 'GET' })
  return r as any
})



