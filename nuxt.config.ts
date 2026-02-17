// https://nuxt.com/docs/api/configuration/nuxt-config
const hmrHost = process.env.VITE_HMR_HOST || ''
const hmrProtocol = (process.env.VITE_HMR_PROTOCOL || '').toLowerCase()
const hmrPort = process.env.VITE_HMR_PORT ? Number(process.env.VITE_HMR_PORT) : undefined
const hmrClientPort = process.env.VITE_HMR_CLIENT_PORT
  ? Number(process.env.VITE_HMR_CLIENT_PORT)
  : undefined

// リモート経由(dev)で @nuxt/content のWSが localhost に向いて失敗→再接続ループし、
// 体感が重くなるケースがあるため、必要なら env でwatch(=WS含む) を切れるようにする。
const disableContentWatch =
  process.env.DISABLE_CONTENT_WS === '1' || process.env.NUXT_CONTENT_WATCH === 'false'

const hmr =
  hmrHost || hmrPort || hmrClientPort
    ? {
        // Nginx配下(80/443)から dev server(4100) を触ると、デフォルトのHMRが別ポートに飛んで失敗し
        // ブラウザ側がリトライし続けて体感が重くなることがある。
        // 必要なときだけ env で上書きして使う（未設定ならNuxt/Viteのデフォルトに任せる）。
        // https配下では wss が必要（mixed content回避）
        protocol: (hmrProtocol === 'wss' ? 'wss' : 'ws') as const,
        host: hmrHost || undefined,
        port: hmrPort,
        clientPort: hmrClientPort
      }
    : undefined

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  // Vue 3.5+ で SSR の async context が正しく伝播するように有効化。
  // これがないと useNuxtApp() が production ビルドで instance unavailable になる。
  experimental: {
    asyncContext: true
  },

  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || '',
    slackLeadWebhook: process.env.SLACK_LEAD_WEBHOOK || '',
    brevoApiKey: process.env.BREVO_API_KEY || '',
    brevoSenderEmail: process.env.BREVO_SENDER_EMAIL || '',
    brevoSenderName: process.env.BREVO_SENDER_NAME || '',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    geoSnapshotToken: process.env.GEO_SNAPSHOT_TOKEN || '',
    geo: {
      maxQueriesPerRun: Number(process.env.GEO_MAX_QUERIES_PER_RUN || '20'),
      maxQueriesPerDay: Number(process.env.GEO_MAX_QUERIES_PER_DAY || '200'),
      maxTokensPerRun: Number(process.env.GEO_MAX_TOKENS_PER_RUN || '50000'),
      maxRetries: Number(process.env.GEO_MAX_RETRIES || '4')
    },
    mail: {
      host: process.env.LEAD_MAIL_HOST || '',
      port: process.env.LEAD_MAIL_PORT ? Number(process.env.LEAD_MAIL_PORT) : 587,
      user: process.env.LEAD_MAIL_USER || '',
      pass: process.env.LEAD_MAIL_PASS || '',
      from: process.env.LEAD_MAIL_FROM || '',
      to: process.env.LEAD_MAIL_TO || ''
    },
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com',
      ga4Id: process.env.NUXT_PUBLIC_GA4_ID || '',
      gadsId: process.env.NUXT_PUBLIC_GADS_ID || '',
      calendlyUrl: process.env.NUXT_PUBLIC_CALENDLY_URL || '',
    }
  },

  // ポート設定
  devServer: {
    port: 4100,
    host: '0.0.0.0' // リモートアクセスを許可
  },

  // モジュール
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxt/content'
  ],

  // Tailwind CSS設定
  css: ['~/assets/css/main.css'],

  // i18n設定
  i18n: {
    locales: [
      { code: 'ja', iso: 'ja-JP', name: '日本語' }
    ],
    defaultLocale: 'ja',
    vueI18n: './i18n.config.ts'
  },

  // アプリ設定
  // ドメイン直下（iyasaka.co）では '/' を使う。
  // IP直アクセス（/iyasaka/ パス）時は環境変数で上書き可能。
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'IYASAKA（arrowsworks） | 不を解消し、事業を"弥栄"へ。統括パートナー',
      meta: [
        { name: 'description', content: '弱電×AI×ホテルDXを横断し、予防保全で"止まる前"に手を打つ。現場が止まらない統括パートナー、IYASAKA。' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      // GA4: conditionally injected only when ID is configured
      script: [
        ...(process.env.NUXT_PUBLIC_GA4_ID
          ? [
              {
                src: `https://www.googletagmanager.com/gtag/js?id=${process.env.NUXT_PUBLIC_GA4_ID}`,
                async: true,
              },
              {
                children: [
                  'window.dataLayer = window.dataLayer || [];',
                  'function gtag(){dataLayer.push(arguments);}',
                  "gtag('js', new Date());",
                  `gtag('config', '${process.env.NUXT_PUBLIC_GA4_ID}');`,
                  ...(process.env.NUXT_PUBLIC_GADS_ID
                    ? [`gtag('config', '${process.env.NUXT_PUBLIC_GADS_ID}');`]
                    : []),
                ].join('\n'),
              },
            ]
          : []),
      ],
    }
  },

  // ルーティング設定 / Nitro
  nitro: {
    // prerender: {
    //   routes: ['/']
    // },
    experimental: {
      // Node.js v18互換性の向上
      wasm: false
    },
    // Supabase クライアントはバンドラにインラインさせ、解決を安定化させる
    externals: {
      inline: ['@supabase/supabase-js']
    },
    // Vue 3.5 + Nuxt 3.10 で @__PURE__ アノテーションにより
    // useNuxtApp / tryUseNuxtApp がツリーシェイクで除去される問題の回避
    rollupConfig: {
      output: {
        generatedCode: {
          constBindings: true
        }
      },
      treeshake: {
        annotations: false
      }
    }
  },

  // TypeScript設定
  typescript: {
    typeCheck: false,
    strict: false
  },

  // Node.js v18互換性のためのポリフィル / Vite設定
  vite: {
    define: {
      'global.File': 'File',
      'global.Blob': 'Blob',
      'global.FormData': 'FormData'
    },
    server: {
      // ポートが埋まっていると別ポートに自動退避してしまい、Nginxのproxy先や
      // ブラウザ側の接続がズレて「遅い/繋がらない」の原因になるため固定する
      strictPort: true,
      hmr
    },
    vue: {
      script: {
        propsDestructure: true,
        defineModel: true,
        fs: {
          strict: false,
          allow: ['.']
        }
      }
    },
    // Supabase クライアントを SSR バンドルから除外し、Node 側解決に寄せる
    ssr: {
      noExternal: ['@supabase/supabase-js']
    }
  },

  // Nuxt Content設定
  content: {
    documentDriven: false,
    watch: !disableContentWatch,
    highlight: {
      theme: 'github-dark'
    }
  }
})
