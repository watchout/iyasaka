// GEO スナップショット取得用の簡易CLIスクリプト
// 例:
//   GEO_SNAPSHOT_TOKEN=xxxx node scripts/geo-snapshot.mjs

const endpoint =
  process.env.GEO_SNAPSHOT_ENDPOINT || 'http://localhost:4100/iyasaka/api/geo/snapshot'
const token = process.env.GEO_SNAPSHOT_TOKEN || ''

async function main() {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'x-geo-snapshot-token': token } : {})
      },
      body: JSON.stringify({})
    })

    const text = await res.text()

    if (!res.ok) {
      console.error('[geo-snapshot] request failed', res.status, text)
      process.exit(1)
    }

    console.log('[geo-snapshot] success')
    console.log(text)
  } catch (e) {
    console.error('[geo-snapshot] error', e)
    process.exit(1)
  }
}

main()






