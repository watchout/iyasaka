/**
 * IYASAKA 会社情報・チームデータ
 * マーケティング視点での会社概要
 */

// 会社基本情報
export const companyInfo = {
  name: '有限会社IYASAKA',
  nameReading: 'いやさか',
  postalCode: '〒344-0043',
  address: '埼玉県春日部市下蛭田422-5',
  phone: '048-872-6822',
  representative: '金子 裕司',
  established: '2006年4月26日',
  business: [
    '弱電事業（弱電工事・電気工事）',
    'ホテルAI（客室AIコンシェルジュ / AIホテルPMS / AIホテルCRM）',
    '配信プラス（動画配信のJV事業 / 動画配信の外注事業 / 配信スクール事業）',
    'ミエルプラス（現場をDXとAIで見える化：ミエルボード / ミエルストック / ミエルドライブ）',
    'AIプラス（カスタム型AIシステム構築・保守）',
    'dev-OS（SSOTベースAI開発SaaS）',
  ],
}

// 代表者プロフィール
export interface TeamMember {
  id: string
  name: string
  role: string
  title?: string
  avatar: string
  bio: string
  message?: string
  qualifications?: string[]
  achievements?: string[]
  socialLinks?: {
    linkedin?: string
    twitter?: string
    note?: string
  }
}

export const representative: TeamMember = {
  id: 'kaneko-yuji',
  name: '金子 裕司',
  role: '代表取締役',
  title: 'Founder & CEO',
  avatar: '/images/team/representative.jpg',
  bio: `2006年の創業以来、「現場の"不"を"光"に変える」という信念のもと、
中小企業のDX支援に取り組んでまいりました。

現場で働く皆様が抱える「見えない」「止まる」「人がいない」という不安。
これらを解決することで、本業に集中できる環境を創り出すことが、私たちの使命です。

大企業向けの高額なシステムではなく、中小企業の皆様が「使える」「続けられる」
ソリューションを提供し続けてまいります。`,
  message: '「不」を「光」に変える。その循環こそが、弥栄（いやさか）。',
}

// 沿革・ストーリー
export interface MilestoneItem {
  year: string
  month?: string
  title: string
  description: string
  icon?: string
}

export const milestones: MilestoneItem[] = [
  {
    year: '2006',
    month: '4月',
    title: '有限会社IYASAKA設立',
    description: '埼玉県春日部市にて創業。地域の中小企業向けにIT支援サービスを開始。',
    icon: '🏢'
  },
  {
    year: '2010',
    title: '弱電設備保守事業開始',
    description: '「止まったら終わり」という現場の声に応え、24時間365日対応の保守サービスを開始。',
    icon: '⚡'
  },
  {
    year: '2018',
    title: '現場可視化ソリューション開発',
    description: '「現場が見えない」という経営者の悩みを解決する、ミエルプラスシリーズを開発。',
    icon: '👁️'
  },
  {
    year: '2023',
    title: 'AI事業開始',
    description: 'ChatGPT登場を機に、中小企業向けAI導入支援「AIプラス」を開始。',
    icon: '🤖'
  },
  {
    year: '2024',
    title: '5つのプラスソリューション体系化',
    description: '「整える・つなぐ・育てる」の3本柱で、中小企業DXを包括的に支援する体制を確立。',
    icon: '🎯'
  },
  {
    year: '2026',
    title: '2026年問題への取り組み強化',
    description: '深刻化する人手不足・IT格差に対応するため、伴走型支援を強化。',
    icon: '🚀'
  }
]

// 私たちの価値観（Why IYASAKA）
export interface ValueItem {
  title: string
  description: string
  icon: string
}

export const values: ValueItem[] = [
  {
    title: '現場ファースト',
    description: '机上の空論ではなく、現場で本当に使えるソリューションを。',
    icon: '🔧'
  },
  {
    title: 'リスク分担',
    description: '高額投資ではなく、JV・サブスク・伴走型でリスクを共に。',
    icon: '🤝'
  },
  {
    title: '定着まで伴走',
    description: '「導入して終わり」ではなく、成果が出るまで現場で密着。',
    icon: '🏃'
  },
  {
    title: '地域密着',
    description: '関東一円を中心に、顔の見える関係でサポート。',
    icon: '📍'
  }
]

// 実績統計
export const teamStats = {
  totalProjects: '1,500+',
  satisfactionRate: '4.8/5.0',
  successRate: '98%',
  yearsOfExperience: '18+',  // 2006年創業から
}

// チームメンバー（必要に応じて追加）
export const teamMembers: TeamMember[] = []
