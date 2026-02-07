/**
 * Minimal .env loader (no dependencies).
 *
 * - Loads `${process.cwd()}/.env` if present
 * - Does NOT override existing process.env by default
 * - Supports spaces around "=" and quoted values
 */
const fs = require('node:fs')
const path = require('node:path')

function stripQuotes(value) {
  const v = value.trim()
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1)
  }
  return v
}

function loadDotEnv(options = {}) {
  const override = options.override === true

  const candidates = options.path
    ? [options.path]
    : [
        path.join(process.cwd(), '.env'),
        path.join(process.cwd(), '..', '.env')
      ]

  for (const envPath of candidates) {
    try {
      const text = fs.readFileSync(envPath, 'utf8')
      for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim()
        if (!line || line.startsWith('#')) continue
        const idx = line.indexOf('=')
        if (idx < 0) continue
        const key = line.slice(0, idx).trim()
        const val = stripQuotes(line.slice(idx + 1))
        if (!key) continue
        if (!override && process.env[key] !== undefined) continue
        process.env[key] = val
      }
      return true
    } catch {
      // try next candidate
    }
  }

  return false
}

module.exports = { loadDotEnv }

