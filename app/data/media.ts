// メディア掲載・プレスリリースデータ（仮データ）
// 社会的証明（Social Proof）と権威性（Authority）を活用

export interface MediaLogo {
  id: string
  name: string
  src: string
  href?: string
  category: 'national' | 'industry' | 'regional'
}

export interface MediaCoverage {
  id: string
  title: string
  outlet: string
  outletLogo?: string
  date: string
  type: 'article' | 'interview' | 'mention' | 'tv'
  url?: string
  excerpt?: string
  featured?: boolean
}

export interface PressRelease {
  id: string
  title: string
  date: string
  category: 'product' | 'partnership' | 'award' | 'company'
  summary: string
  pdfUrl?: string
  slug: string
}

// メディアロゴバー（Hero直下に表示）
export const mediaLogos: MediaLogo[] = [
  {
    id: 'nikkei',
    name: '日本経済新聞',
    src: '/images/media/logo-nikkei.svg',
    category: 'national'
  },
  {
    id: 'itmedia',
    name: 'ITmedia',
    src: '/images/media/logo-itmedia.svg',
    category: 'industry'
  },
  {
    id: 'impress',
    name: 'Impress Watch',
    src: '/images/media/logo-impress.svg',
    category: 'industry'
  },
  {
    id: 'nhk',
    name: 'NHK',
    src: '/images/media/logo-nhk.svg',
    category: 'national'
  },
  {
    id: 'saitama-np',
    name: '埼玉新聞',
    src: '/images/media/logo-saitama-np.svg',
    category: 'regional'
  },
  {
    id: 'av-watch',
    name: 'AV Watch',
    src: '/images/media/logo-avwatch.svg',
    category: 'industry'
  }
]

// メディア掲載実績
export const mediaCoverages: MediaCoverage[] = [
  {
    id: 'coverage-1',
    title: '「止まらない配信」を実現する統括パートナーの挑戦',
    outlet: 'ITmedia ビジネス',
    date: '2024-11-15',
    type: 'article',
    url: '#',
    excerpt: '配信トラブルゼロを目指す取り組みと、現場主義の経営哲学に迫る。',
    featured: true
  },
  {
    id: 'coverage-2',
    title: '地方創生DXの新たな形——IYASAKAの取り組み',
    outlet: '日経地方創生フォーラム',
    date: '2024-09-20',
    type: 'interview',
    url: '#',
    excerpt: '技術導入だけでなく「続く仕組み」を重視するアプローチが注目を集める。',
    featured: true
  },
  {
    id: 'coverage-3',
    title: '会議室配信システム、導入から運用まで一括支援',
    outlet: 'AV Watch',
    date: '2024-08-05',
    type: 'article',
    url: '#',
    excerpt: '配信プラスのJVモデルを詳報。'
  },
  {
    id: 'coverage-4',
    title: '地域企業のDX推進事例として紹介',
    outlet: 'NHK さいたま放送局',
    date: '2024-06-12',
    type: 'tv',
    excerpt: 'おはよう日本 地域版にて5分間の特集。'
  },
  {
    id: 'coverage-5',
    title: '弱電工事の新スタンダード、診断から保守まで',
    outlet: '電設技術',
    date: '2024-04-10',
    type: 'article',
    url: '#'
  },
  {
    id: 'coverage-6',
    title: '地元企業がDX推進で活躍',
    outlet: '埼玉新聞',
    date: '2024-03-22',
    type: 'mention',
    url: '#'
  }
]

// プレスリリース
export const pressReleases: PressRelease[] = [
  {
    id: 'pr-2024-12',
    title: '多言語プラスに新言語追加、対応言語が30言語に拡大',
    date: '2024-12-01',
    category: 'product',
    summary: '既存映像の多言語化サービス「多言語プラス」に新たに10言語を追加し、対応言語を30言語に拡大しました。',
    slug: 'multilingual-plus-30-languages'
  },
  {
    id: 'pr-2024-11',
    title: '地方創生大賞 技術革新部門で優秀賞を受賞',
    date: '2024-11-08',
    category: 'award',
    summary: '地域課題解決における技術活用が評価され、地方創生大賞 技術革新部門で優秀賞を受賞しました。',
    slug: 'local-revitalization-award-2024'
  },
  {
    id: 'pr-2024-10',
    title: '大手イベント会場運営会社とパートナーシップ締結',
    date: '2024-10-15',
    category: 'partnership',
    summary: '全国50会場を運営する大手イベント会場運営会社と配信支援パートナーシップを締結しました。',
    slug: 'event-venue-partnership'
  },
  {
    id: 'pr-2024-09',
    title: '「配信プラス」累計導入500件突破',
    date: '2024-09-01',
    category: 'product',
    summary: '会場向け配信支援サービス「配信プラス」の累計導入件数が500件を突破しました。',
    slug: 'haishin-plus-500-milestone'
  },
  {
    id: 'pr-2024-07',
    title: 'AIプラス正式リリース',
    date: '2024-07-20',
    category: 'product',
    summary: '映像コンテンツのAI要約・チャプター自動生成・切り出しサービス「AIプラス」を正式リリースしました。',
    slug: 'ai-plus-launch'
  },
  {
    id: 'pr-2024-04',
    title: '本社移転のお知らせ',
    date: '2024-04-01',
    category: 'company',
    summary: '事業拡大に伴い、本社を春日部市に移転しました。',
    slug: 'headquarters-relocation'
  }
]

// プレスキット情報
export const pressKit = {
  title: 'プレスキット',
  description: '取材・記事執筆にご利用いただける素材をダウンロードいただけます。',
  items: [
    {
      name: '企業ロゴ（各種フォーマット）',
      description: 'AI, PNG, SVG形式。白背景用・黒背景用',
      downloadUrl: '/downloads/press-kit/logo-pack.zip',
      fileSize: '2.5MB'
    },
    {
      name: '代表者プロフィール写真',
      description: '高解像度写真（横・縦）',
      downloadUrl: '/downloads/press-kit/ceo-photos.zip',
      fileSize: '8.2MB'
    },
    {
      name: '会社概要資料',
      description: 'PDF形式の会社紹介資料',
      downloadUrl: '/downloads/press-kit/company-overview.pdf',
      fileSize: '3.1MB'
    },
    {
      name: 'サービス紹介資料',
      description: '各サービスの概要資料',
      downloadUrl: '/downloads/press-kit/services-overview.pdf',
      fileSize: '4.5MB'
    }
  ],
  contact: {
    department: '広報担当',
    email: 'press@iyasaka.co.jp',
    phone: '048-872-6822',
    note: '取材のご依頼は、上記連絡先までお気軽にお問い合わせください。'
  }
}






