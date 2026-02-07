// 導入事例データ（仮データ）
// ストーリーテリング効果とBefore/Afterコントラストを活用

export interface CaseStudy {
  id: string
  slug: string
  title: string
  clientName: string
  clientLogo?: string
  industry: string
  location: string
  services: string[]
  featured: boolean
  thumbnail: string
  heroImage?: string
  summary: string
  
  // Before/After（コントラスト効果）
  challenge: {
    title: string
    points: string[]
  }
  solution: {
    title: string
    points: string[]
  }
  results: {
    title: string
    metrics: {
      label: string
      before?: string
      after: string
      improvement?: string
    }[]
  }
  
  // ストーリー詳細
  story?: {
    background: string
    process: string
    outcome: string
  }
  
  // 顧客の声（社会的証明）
  testimonial?: {
    quote: string
    author: string
    role: string
    avatar?: string
  }
  
  // タイムライン
  timeline?: {
    phase: string
    duration: string
    description: string
  }[]
  
  publishedAt: string
  updatedAt?: string
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'case-1',
    slug: 'conference-center-tokyo',
    title: '配信トラブルゼロを実現——大手カンファレンスセンターの挑戦',
    clientName: '東京カンファレンスセンター（仮名）',
    industry: 'イベント・会場運営',
    location: '東京都',
    services: ['配信プラス', 'オンサイト保守プラス'],
    featured: true,
    thumbnail: '/images/cases/case-1-thumb.jpg',
    heroImage: '/images/cases/case-1-hero.jpg',
    summary: '年間500件超のイベントを開催する大規模カンファレンスセンター。配信トラブルが頻発し、顧客満足度が低下していた課題を、配信プラスの導入とSOP整備で解決。',
    
    challenge: {
      title: '導入前の課題',
      points: [
        '配信開始が遅れる事案が月平均5件発生',
        '機材トラブルで配信が中断するケースが続出',
        '担当者によって対応品質にばらつき',
        '顧客からのクレームが増加傾向'
      ]
    },
    
    solution: {
      title: '実施した施策',
      points: [
        '全会議室の配信環境を診断・最適化',
        '標準運用手順書（SOP）を策定',
        'スタッフ向けトレーニングプログラムを実施',
        '24時間リモート監視体制を構築'
      ]
    },
    
    results: {
      title: '導入効果',
      metrics: [
        { label: '配信トラブル', before: '月5件', after: '0件', improvement: '100%削減' },
        { label: '開始遅延', before: '平均8分', after: '0分', improvement: '完全解消' },
        { label: '顧客満足度', before: '3.2/5.0', after: '4.7/5.0', improvement: '47%向上' },
        { label: '配信収益', after: '月額120万円増', improvement: '新規収益源確立' }
      ]
    },
    
    testimonial: {
      quote: '配信トラブルがゼロになっただけでなく、新たな収益源にもなった。もっと早く相談すればよかった。',
      author: '山田 太郎',
      role: '運営部長',
      avatar: '/images/cases/testimonial-1.jpg'
    },
    
    timeline: [
      { phase: '診断・設計', duration: '2週間', description: '全会議室の現状調査と改善計画策定' },
      { phase: '機材最適化', duration: '3週間', description: '機材入替・配線整理・設定調整' },
      { phase: 'SOP策定', duration: '2週間', description: '標準運用手順書の作成' },
      { phase: 'トレーニング', duration: '1週間', description: 'スタッフ向け実地研修' },
      { phase: '運用開始', duration: '継続', description: '24時間サポート体制で本番運用' }
    ],
    
    publishedAt: '2024-10-15'
  },
  
  {
    id: 'case-2',
    slug: 'hotel-group-dx',
    title: '多言語対応で外国人宿泊客満足度が劇的向上',
    clientName: 'リゾートホテルグループ（仮名）',
    industry: 'ホテル・宿泊業',
    location: '神奈川県・静岡県',
    services: ['多言語プラス', 'AIプラス', 'おもてなすAI'],
    featured: true,
    thumbnail: '/images/cases/case-2-thumb.jpg',
    heroImage: '/images/cases/case-2-hero.jpg',
    summary: '5施設を展開するリゾートホテルグループ。インバウンド需要回復に伴う多言語対応の課題を、多言語プラスとAIコンシェルジュで解決。',
    
    challenge: {
      title: '導入前の課題',
      points: [
        '外国人宿泊客からの問い合わせに対応できない',
        '館内案内や食事メニューの多言語化が追いつかない',
        '通訳スタッフの採用コストが高騰',
        '口コミ評価が言語対応で低評価に'
      ]
    },
    
    solution: {
      title: '実施した施策',
      points: [
        '既存映像コンテンツを15言語に多言語化',
        'AIコンシェルジュを各施設に導入',
        'デジタルサイネージで多言語案内を表示',
        'スタッフ向け多言語対応マニュアルを整備'
      ]
    },
    
    results: {
      title: '導入効果',
      metrics: [
        { label: '対応言語数', before: '日英のみ', after: '15言語', improvement: '13言語追加' },
        { label: '問い合わせ対応率', before: '45%', after: '98%', improvement: '53pt向上' },
        { label: '口コミ評価', before: '3.8', after: '4.6', improvement: '0.8pt向上' },
        { label: '通訳コスト', before: '月80万円', after: '月15万円', improvement: '81%削減' }
      ]
    },
    
    testimonial: {
      quote: '外国人のお客様から「こんなに対応が良いとは思わなかった」と感謝の声をいただいています。',
      author: '佐藤 花子',
      role: '総支配人',
      avatar: '/images/cases/testimonial-2.jpg'
    },
    
    publishedAt: '2024-09-20'
  },
  
  {
    id: 'case-3',
    slug: 'local-government-dx',
    title: '行政DXで住民サービス向上と業務効率化を両立',
    clientName: '埼玉県 K市（仮名）',
    industry: '行政・公共',
    location: '埼玉県',
    services: ['配信プラス', 'AI導入支援'],
    featured: true,
    thumbnail: '/images/cases/case-3-thumb.jpg',
    heroImage: '/images/cases/case-3-hero.jpg',
    summary: '人口8万人の地方都市。議会中継のオンライン化と住民向け動画コンテンツのAI要約で、情報アクセシビリティを向上。',
    
    challenge: {
      title: '導入前の課題',
      points: [
        '議会中継を見る住民が少ない',
        '長時間動画で必要な情報にたどり着けない',
        '字幕対応ができていない',
        '職員の動画編集負荷が高い'
      ]
    },
    
    solution: {
      title: '実施した施策',
      points: [
        '議会中継のリアルタイム配信環境を構築',
        'AIによる自動要約・チャプター生成を導入',
        '自動字幕生成で聴覚障害者対応',
        '職員向けの簡易編集ツールを提供'
      ]
    },
    
    results: {
      title: '導入効果',
      metrics: [
        { label: '視聴者数', before: '月200人', after: '月2,500人', improvement: '12.5倍' },
        { label: '平均視聴時間', before: '5分', after: '18分', improvement: '3.6倍' },
        { label: '動画編集時間', before: '8時間/本', after: '30分/本', improvement: '94%削減' },
        { label: '住民満足度', after: '4.3/5.0', improvement: '新規指標として設定' }
      ]
    },
    
    testimonial: {
      quote: '議会がぐっと身近になったと住民の方から言っていただける。自治体DXの好事例として他市からの視察も増えています。',
      author: '鈴木 一郎',
      role: '情報政策課 課長',
      avatar: '/images/cases/testimonial-3.jpg'
    },
    
    publishedAt: '2024-08-10'
  },
  
  {
    id: 'case-4',
    slug: 'manufacturing-remote-support',
    title: 'リモートサポート体制構築で保守コスト40%削減',
    clientName: '製造業 M社（仮名）',
    industry: '製造業',
    location: '群馬県',
    services: ['オンサイト保守プラス', '弱電プラス'],
    featured: false,
    thumbnail: '/images/cases/case-4-thumb.jpg',
    summary: '工場内の弱電設備保守を外部委託。リモート監視と計画保守で、突発故障を大幅削減。',
    
    challenge: {
      title: '導入前の課題',
      points: [
        '突発的な設備故障で生産ラインが停止',
        '保守担当者の高齢化・人手不足',
        '夜間・休日対応のコストが高い',
        '故障原因の特定に時間がかかる'
      ]
    },
    
    solution: {
      title: '実施した施策',
      points: [
        'IoTセンサーによる設備監視を導入',
        '異常予兆検知で計画保守へ移行',
        'リモート診断で一次対応を効率化',
        '保守履歴のデータベース化'
      ]
    },
    
    results: {
      title: '導入効果',
      metrics: [
        { label: '突発故障', before: '年12件', after: '年2件', improvement: '83%削減' },
        { label: 'ライン停止時間', before: '年48時間', after: '年4時間', improvement: '92%削減' },
        { label: '保守コスト', before: '年1,200万円', after: '年720万円', improvement: '40%削減' },
        { label: '対応時間', before: '平均4時間', after: '平均1時間', improvement: '75%短縮' }
      ]
    },
    
    publishedAt: '2024-07-15'
  },
  
  {
    id: 'case-5',
    slug: 'education-hybrid-lecture',
    title: 'ハイブリッド授業環境の構築で学習機会を拡大',
    clientName: '私立大学 S学園（仮名）',
    industry: '教育',
    location: '東京都',
    services: ['配信プラス', 'AIプラス'],
    featured: false,
    thumbnail: '/images/cases/case-5-thumb.jpg',
    summary: '対面とオンラインを両立するハイブリッド授業環境を全教室に導入。録画のAI要約で復習効率も向上。',
    
    challenge: {
      title: '導入前の課題',
      points: [
        'オンライン参加の学生に音声が届かない',
        '教室によって配信品質にばらつき',
        '教員のITスキルに依存した運用',
        '録画が活用されていない'
      ]
    },
    
    solution: {
      title: '実施した施策',
      points: [
        '全50教室の配信環境を標準化',
        'ワンタッチ操作の統一インターフェース',
        '教員向け操作マニュアル・研修',
        '録画のAI要約・チャプター自動生成'
      ]
    },
    
    results: {
      title: '導入効果',
      metrics: [
        { label: '配信品質スコア', before: '3.1/5.0', after: '4.6/5.0', improvement: '48%向上' },
        { label: '学生満足度', before: '62%', after: '91%', improvement: '29pt向上' },
        { label: '録画視聴率', before: '15%', after: '78%', improvement: '63pt向上' },
        { label: '教員負担感', before: '高い', after: '低い', improvement: '大幅軽減' }
      ]
    },
    
    publishedAt: '2024-06-01'
  }
]

// フィルタリング用のカテゴリ
export const caseCategories = [
  { id: 'all', label: 'すべて' },
  { id: 'event', label: 'イベント・会場' },
  { id: 'hotel', label: 'ホテル・宿泊' },
  { id: 'public', label: '行政・公共' },
  { id: 'manufacturing', label: '製造業' },
  { id: 'education', label: '教育' }
]

// 事例からサービスへのマッピング
export const serviceLabels: Record<string, string> = {
  '配信プラス': 'haishin-plus',
  '多言語プラス': 'multilingual-plus',
  'AIプラス': 'ai-plus',
  'オンサイト保守プラス': 'onsite-plus',
  '弱電プラス': 'weakcurrent-plus',
  'おもてなすAI': 'omotenasuai',
  'AI導入支援': 'ai-consulting'
}






