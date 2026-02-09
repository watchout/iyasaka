// PM2 Ecosystem - Production Configuration
// VPS上で ecosystem.config.cjs として使用する。
// コピー後、環境に応じて env の値を調整すること。
//
// Usage:
//   cp ecosystem.config.example.cjs ecosystem.config.cjs
//   # .env に必要な値を入れた上で:
//   pm2 start ecosystem.config.cjs
//
module.exports = {
  apps: [
    {
      name: 'iyasaka-nuxt',
      script: '.output/server/index.mjs',
      cwd: '/home/arrowsworks/iyasaka',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 4100,
        HOST: '127.0.0.1',
        NITRO_PORT: 4100,
        NITRO_HOST: '127.0.0.1'
      },
      // .env ファイルからシークレットを読み込む
      // PM2 は dotenv を自動読み込みしないため、
      // deploy スクリプト側で source 済みにするか
      // node -r dotenv/config を使う運用でもよい。
      max_memory_restart: '512M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/home/arrowsworks/iyasaka/logs/error.log',
      out_file: '/home/arrowsworks/iyasaka/logs/out.log',
      merge_logs: true
    }
  ]
}
