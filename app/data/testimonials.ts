// 顧客の声データ（仮データ）
// 社会的証明（Social Proof）を最大化

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  company: string
  industry: string
  avatar?: string
  rating?: number
  service?: string
  featured?: boolean
}

export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    quote: '配信トラブルがゼロになっただけでなく、新たな収益源にもなった。もっと早く相談すればよかった。',
    author: '山田 太郎',
    role: '運営部長',
    company: '東京カンファレンスセンター',
    industry: 'イベント・会場',
    avatar: '/images/testimonials/avatar-1.jpg',
    rating: 5,
    service: '配信プラス',
    featured: true
  },
  {
    id: 'testimonial-2',
    quote: '外国人のお客様から感謝の声をいただける。AIコンシェルジュが夜間対応してくれるので、スタッフの負担も減りました。',
    author: '佐藤 花子',
    role: '総支配人',
    company: 'リゾートホテルグループ',
    industry: 'ホテル・宿泊',
    avatar: '/images/testimonials/avatar-2.jpg',
    rating: 5,
    service: '多言語プラス',
    featured: true
  },
  {
    id: 'testimonial-3',
    quote: '議会がぐっと身近になったと住民の方から言っていただける。他市からの視察も増えています。',
    author: '鈴木 一郎',
    role: '情報政策課 課長',
    company: 'K市役所',
    industry: '行政・公共',
    avatar: '/images/testimonials/avatar-3.jpg',
    rating: 5,
    service: '配信プラス',
    featured: true
  },
  {
    id: 'testimonial-4',
    quote: '突発故障が激減して、生産計画が立てやすくなった。データに基づく保守で安心感が違います。',
    author: '田中 浩二',
    role: '製造部長',
    company: '製造業M社',
    industry: '製造業',
    avatar: '/images/testimonials/avatar-4.jpg',
    rating: 5,
    service: 'オンサイト保守プラス'
  },
  {
    id: 'testimonial-5',
    quote: '教員のITスキルに関係なく、全員が同じクオリティで配信できるようになった。学生からの評価も上がりました。',
    author: '高橋 美香',
    role: '教務部長',
    company: 'S学園',
    industry: '教育',
    avatar: '/images/testimonials/avatar-5.jpg',
    rating: 4,
    service: '配信プラス'
  },
  {
    id: 'testimonial-6',
    quote: '地元の農産物をネットで売り始めてから、売上が3倍に。撮影からECまで全部お任せできるのがありがたい。',
    author: '中村 正',
    role: '代表',
    company: '農事組合法人 N',
    industry: '農業',
    avatar: '/images/testimonials/avatar-6.jpg',
    rating: 5,
    service: '動画制作'
  }
]

// 満足度統計（アンカリング効果に活用）
export const satisfactionStats = {
  overallRating: 4.8,
  totalReviews: 156,
  recommendationRate: 98,
  repeatRate: 94,
  npsScore: 72,
  breakdown: {
    '5stars': 78,
    '4stars': 18,
    '3stars': 3,
    '2stars': 1,
    '1star': 0
  }
}






