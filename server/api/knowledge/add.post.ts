export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const r = await $fetch('http://127.0.0.1:7321/knowledge/add', {
    method: 'POST',
    body
  })
  return r as any
})



