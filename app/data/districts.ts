export interface District {
  id: string
  name: string
  nameEn: string
  icon: string
  tagline: string
  pain: string
  aiAdvisor: string
  product: string
  productDescription: string
  lpPath: string
  shindanPath: string
  newsExamples: string[]
  imagePatterns: number
}

export const districts: District[] = [
  {
    id: 'hotel',
    name: 'ホテル',
    nameEn: 'Hotel District',
    icon: 'hotel',
    tagline: '深夜2時、フロントに誰もいない。でもお客様は待っている。',
    pain: '人手不足とおもてなしの両立',
    aiAdvisor: 'AIコンシェルジュ',
    product: 'OmotenasuAI',
    productDescription: '客室AIコンシェルジュ / PMS / CRM',
    lpPath: '/hotel',
    shindanPath: '/aiplus/shindan',
    newsExamples: [
      'ホテル業界のAIチェックイン導入率が前年比3倍に',
      'AIコンシェルジュ導入ホテルの顧客満足度が15%向上',
      '深夜帯の問い合わせ対応をAIが90%カバーする時代に'
    ],
    imagePatterns: 4
  },
  {
    id: 'infra',
    name: '弱電',
    nameEn: 'Infrastructure District',
    icon: 'bolt',
    tagline: 'ネットが繋がらない。カメラが映らない。誰に電話すればいい？',
    pain: '設備トラブルの即時対応',
    aiAdvisor: 'AI技術者',
    product: '弱電プラス',
    productDescription: '工事・保守 / 3連サイネージ',
    lpPath: '/infra',
    shindanPath: '/aiplus/shindan',
    newsExamples: [
      'AI異常検知で設備故障の80%を事前察知する時代に',
      'スマートビル管理AIの導入コストが3年で半減',
      '中小オフィスのネットワーク監視AI導入率が急上昇'
    ],
    imagePatterns: 4
  },
  {
    id: 'venue',
    name: '配信/イベント',
    nameEn: 'Streaming District',
    icon: 'video',
    tagline: '隣の会議室は配信で月100万稼いでいる。あなたの会議室は？',
    pain: '配信による収益多角化',
    aiAdvisor: 'AI配信ディレクター',
    product: '配信プラス',
    productDescription: 'JV型 / 外注 / スクール',
    lpPath: '/venue',
    shindanPath: '/aiplus/shindan',
    newsExamples: [
      'ハイブリッド配信の市場規模が2025年比で1.5倍に',
      'AI自動字幕・翻訳で配信の多言語対応が標準化',
      '中小企業の自社配信スタジオ保有率が10%を突破'
    ],
    imagePatterns: 4
  },
  {
    id: 'genba',
    name: '現場DX',
    nameEn: 'Field DX District',
    icon: 'clipboard',
    tagline: 'ホワイトボードに書いてあることは、もう3時間前の話だ。',
    pain: '現場情報のリアルタイム可視化',
    aiAdvisor: 'AI現場監督',
    product: 'ミエルプラス',
    productDescription: '現場可視化 / WBS',
    lpPath: '/genba',
    shindanPath: '/aiplus/shindan',
    newsExamples: [
      '製造業のAI外観検査導入率が中小企業で初めて10%超え',
      '建設現場のデジタルツイン導入が加速',
      'AI工程管理で工期遅延を30%削減した事例が続出'
    ],
    imagePatterns: 4
  },
  {
    id: 'ai',
    name: 'AI',
    nameEn: 'AI District',
    icon: 'cpu',
    tagline: 'AI、気になるけど誰に聞けばいいかわからない。',
    pain: 'AI導入の第一歩',
    aiAdvisor: 'CAIO（最高AI責任者）',
    product: 'AIプラス',
    productDescription: 'カスタムAI構築・保守',
    lpPath: '/aiplus',
    shindanPath: '/aiplus/shindan',
    newsExamples: [
      '中小企業のAI導入率が前年比2倍。最も効果が出ているのは経理業務',
      'AI導入の初期費用が5年前の1/10に。月額5万円からのAI活用時代',
      '従業員50人以下の企業でもAI活用で年間500時間の業務削減を実現'
    ],
    imagePatterns: 4
  }
]

export function getDistrictById(id: string): District | undefined {
  return districts.find(d => d.id === id)
}
