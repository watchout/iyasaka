/**
 * IYASAKA ナビゲーション定義
 * LP_STRUCTURE_SPECIFICATION.md 準拠
 */

export interface NavItem {
  label: string
  to?: string
  children?: NavItem[]
}

// ヘッダーナビゲーション
export const headerNav: NavItem[] = [
  {
    label: 'ソリューション',
    children: [
      {
        label: '業種で選ぶ',
        children: [
          { label: 'ホテル・宿泊業', to: '/hotel' },
          { label: 'インフラ・設備', to: '/infra' },
          { label: '会議室・ホール', to: '/venue' },
          { label: '建設・製造・現場', to: '/genba' }
        ]
      },
      {
        label: '製品一覧',
        children: [
          { label: 'ミエルプラス', to: '/products/mieru-plus' },
          { label: '弱電プラス', to: '/products/jakuden-plus' },
          { label: 'OmotenasuAI', to: '/products/omotenasu-ai' },
          { label: '配信プラス', to: '/products/haishin-plus' },
          { label: 'AIプラス', to: '/products/ai-plus' },
          { label: 'dev-OS', to: '/products/dev-os' }
        ]
      }
    ]
  },
  {
    label: '導入事例',
    to: '/cases'
  },
  {
    label: '会社情報',
    children: [
      { label: '会社概要', to: '/company' },
      { label: 'ストーリー', to: '/company/story' },
      { label: 'お知らせ', to: '/news' },
      { label: 'プレスリリース', to: '/press' }
    ]
  },
  {
    label: '診断',
    to: '/diagnosis'
  }
]

// フッターセクション（Footer.vue用）
export const footerSections = {
  // 整える（Organize）
  organize: [
    { label: '弱電プラス', to: '/products/jakuden-plus' },
    { label: 'ミエルプラス', to: '/products/mieru-plus' },
    { label: 'dev-OS', to: '/products/dev-os' },
    { label: 'インフラ・設備', to: '/infra' }
  ],
  // つなぐ（Connect）
  connect: [
    { label: '配信プラス', to: '/products/haishin-plus' },
    { label: 'OmotenasuAI', to: '/products/omotenasu-ai' },
    { label: 'ホテル・宿泊業', to: '/hotel' },
    { label: '会議室・ホール', to: '/venue' }
  ],
  // 育てる（Nurture）
  nurture: [
    { label: 'AIプラス', to: '/products/ai-plus' },
    { label: '診断', to: '/diagnosis' },
    { label: '導入事例', to: '/cases' }
  ],
  // 会社案内
  company: [
    { label: '会社概要', to: '/company' },
    { label: 'ストーリー', to: '/company/story' },
    { label: 'お知らせ', to: '/news' },
    { label: 'プレスリリース', to: '/press' }
  ],
  // リソース
  resources: [
    { label: 'お問い合わせ', to: '/contact' },
    { label: '資料ダウンロード', to: '/downloads' }
  ]
}

// 法務リンク
export const legalLinks = [
  { label: 'プライバシーポリシー', to: '/legal/privacy' },
  { label: '利用規約', to: '/legal/terms' },
  { label: '外部送信規律', to: '/legal/external-transmission' }
]
