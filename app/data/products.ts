/**
 * IYASAKA プロダクト・ポートフォリオ（2026年版）
 * パターンC改良版：CVR地点HP集約型
 * 
 * 5つの「プラス」製品 + dev-OS基盤
 */

// ===== 型定義 =====

export type ProductId = 
  | 'mieru-plus'      // ミエルプラス（入口製品A）
  | 'jakuden-plus'    // 弱電プラス（入口製品B）
  | 'omotenasu-ai'    // OmotenasuAI（業種特化）
  | 'haishin-plus'    // 配信プラス（JV/収益化）
  | 'ai-plus'         // AIプラス（伴走/定着）
  | 'dev-os'          // dev-OS（技術基盤）

export type ProductPriority = 'primary' | 'secondary' | 'tertiary'

// ===== カテゴリ定義（3つの変換動詞） =====

export type ProductCategory = 'organize' | 'connect' | 'nurture'

export interface CategoryInfo {
  name: string
  english: string
  icon: string
  color: string
  description: string
}

export const categories: Record<ProductCategory, CategoryInfo> = {
  organize: {
    name: '整える',
    english: 'Foundation',
    icon: '🔧',
    color: '#3182ce',
    description: '現場の足元と知恵の土台を整え、挑戦できる状態を創る'
  },
  connect: {
    name: 'つなぐ',
    english: 'Expansion',
    icon: '🔗',
    color: '#319795',
    description: '閉ざされていた価値を外部や世界と接続し、可能性を拡張する'
  },
  nurture: {
    name: '育てる',
    english: 'Evolution',
    icon: '🌱',
    color: '#38a169',
    description: '運用を通じて文化を育て、次世代へ続く循環を創る'
  }
}

// ===== 痛み（不）の定義 =====

export interface PainPoint {
  id: string
  label: string
  category: ProductCategory
  recommendedProducts: ProductId[]
}

export const painPoints: PainPoint[] = [
  {
    id: 'invisible',
    label: '現場の状況が見えない、把握できない',
    category: 'organize',
    recommendedProducts: ['mieru-plus', 'jakuden-plus']
  },
  {
    id: 'stop-fear',
    label: 'システムや設備が止まったら終わりという恐怖',
    category: 'organize',
    recommendedProducts: ['jakuden-plus', 'mieru-plus']
  },
  {
    id: 'manual-burden',
    label: '手作業・二重管理で疲弊している',
    category: 'organize',
    recommendedProducts: ['mieru-plus', 'ai-plus']
  },
  {
    id: 'revenue-stagnant',
    label: '収益源を多角化したいが投資リスクが怖い',
    category: 'connect',
    recommendedProducts: ['haishin-plus', 'omotenasu-ai']
  },
  {
    id: 'communication-gap',
    label: '情報発信・コミュニケーションがうまくいかない',
    category: 'connect',
    recommendedProducts: ['haishin-plus', 'ai-plus']
  },
  {
    id: 'staff-shortage',
    label: '人手不足で接客・対応の質が落ちている',
    category: 'nurture',
    recommendedProducts: ['omotenasu-ai', 'ai-plus']
  },
  {
    id: 'tool-unused',
    label: 'DXツールを導入したが使われていない',
    category: 'nurture',
    recommendedProducts: ['ai-plus', 'mieru-plus']
  },
  {
    id: 'knowledge-loss',
    label: 'ベテランの知識・ノウハウが継承できない',
    category: 'nurture',
    recommendedProducts: ['ai-plus', 'omotenasu-ai']
  }
]

export interface ProductEntry {
  id: ProductId
  slug: string
  name: string
  title?: string  // nameの別名（フォーム用）
  subtitle: string
  priority: ProductPriority
  category: ProductCategory  // 3つの変換動詞
  
  // ナラティブ（不→光）
  pain?: string   // 不の短縮形
  light?: string  // 光の短縮形
  
  // ターゲット
  target: string
  targetDetail?: string
  
  // 痛み・解決・効果
  strongestPain: string
  commonPains: string[]
  solution: string
  solutionDetail?: string
  
  // 成果（数値）
  keyResult: string
  keyResultValue?: string
  
  // 導入情報
  timeline: string
  pricing: string
  requirements?: string
  
  // 競合差分
  competitorWeakness: string
  ourDifference: string
  
  // CTA
  primaryCta: {
    label: string
    description?: string
  }
  
  // FAQ（AEO最適化）
  faq: { q: string; a: string }[]
  
  // 診断用の質問
  diagnosisQuestion: string
  
  // 表示制御
  homeFeatured: boolean
  homeOrder: number
  
  // メタ情報
  lastUpdated: string
}

// ===== 製品データ（指示書準拠） =====

export const products: ProductEntry[] = [
  // ========== ミエルプラス（入口製品A）==========
  {
    id: 'mieru-plus',
    slug: 'mieru-plus',
    name: 'ミエルプラス',
    title: 'ミエルプラス',
    subtitle: '現場情報の自動可視化',
    priority: 'primary',
    category: 'organize',
    pain: '現場が見えない不安',
    light: '一目で確信できる安心',
    
    target: '従業員3〜100人規模の中小企業（建設・製造・物流・多店舗展開）',
    targetDetail: '現場の状況が見えないことに不安を感じている経営者・管理者',
    
    strongestPain: '「現場の状況が見えない」不安。管理のための管理による疲弊。',
    commonPains: [
      'ホワイトボードとExcelの二重管理で現場が疲弊',
      '遠隔地の現場状況が把握できず、移動時間が無駄',
      '「今誰が何をしているか」が分からず、指示が遅れる'
    ],
    
    solution: '現場情報の自動可視化。AI+カメラで「探す・確認する時間を1日平均60分削減」。',
    solutionDetail: '人が手入力する必要なし。作業の進捗を自動で把握。スマホから遠隔確認。',
    
    keyResult: '1日平均60分の業務削減',
    keyResultValue: '60分',
    
    timeline: '初回ヒアリング後2週間で稼働開始',
    pricing: '月額3万円〜（規模により変動）',
    requirements: 'カメラ設置（既存ネットワーク活用可）',
    
    competitorWeakness: 'Excel/ホワイトボードは「入力」が負担で続かない。汎用グループウェアは現場が使いこなせず形骸化。',
    ourDifference: '「現場の動作（AI）」を起点に入力を極小化。中小企業特化で使いやすさ重視。',
    
    primaryCta: {
      label: '5分で完了：現場の『滞り』診断',
      description: '現場の課題を特定し、最適な解決策を提案します'
    },
    
    faq: [
      { q: 'ミエルプラスの導入期間はどのくらいですか？', a: '初回ヒアリング後、2週間で稼働開始できます。既存のネットワーク環境を活用できる場合、さらに短縮可能です。' },
      { q: 'どのような業種に向いていますか？', a: '建設業、製造業、物流業、多店舗展開の小売業など、複数拠点の管理が必要な業種に最適です。従業員3〜100人規模の中小企業での導入実績が豊富です。' },
      { q: '既存の管理システムと連携できますか？', a: 'はい、API連携により多くの管理システムと統合できます。詳細は無料診断時にご相談ください。' },
      { q: '初期費用はかかりますか？', a: 'カメラ設置費用が別途かかりますが、既存カメラの活用も可能です。月額3万円〜でご利用いただけます。' },
      { q: 'トレーニングは必要ですか？', a: '直感的なUIのため、特別なトレーニングなしでお使いいただけます。導入時に操作説明を行います。' }
    ],
    
    diagnosisQuestion: '「現場の状況が見えない」不安がありますか？',
    
    homeFeatured: true,
    homeOrder: 1,
    lastUpdated: new Date().toISOString()
  },

  // ========== 弱電プラス（入口製品B）==========
  {
    id: 'jakuden-plus',
    slug: 'jakuden-plus',
    name: '弱電プラス',
    title: '弱電プラス',
    subtitle: '弱電工事・電気工事・保守',
    priority: 'primary',
    category: 'organize',
    pain: '止まったら終わりという恐怖',
    light: '24時間つながる安心',
    
    target: '中小規模の店舗・オフィス・施設（弱電/電気の工事・改修・保守が必要）',
    targetDetail: 'IT担当者が不在で、設備トラブル時に誰に頼めばいいか分からない企業',
    
    strongestPain: '「止まったら経営が止まる」インフラへの恐怖。専門家不在の孤独。',
    commonPains: [
      '電気設備のトラブル時に「誰に頼めばいいか分からない」',
      '資格保持者（電気工事士）が社内におらず不安',
      '見積のたびに高額請求され、予算が読めない'
    ],
    
    solution: '弱電・電気工事と保守を一体で。「トラブル発生から30分以内の一次回答、24時間以内の駆けつけ」を約束。',
    solutionDetail: '24時間365日対応可能。月額固定で予算が読める。予防保守と改修提案で、未然防止と再発防止まで支援します。',
    
    keyResult: 'トラブル対応30分以内',
    keyResultValue: '30分',
    
    timeline: '契約後即日サポート開始',
    pricing: '月額固定（拠点数により変動）',
    requirements: '不要（既存設備の診断から開始）',
    
    competitorWeakness: '都度見積の工事屋は「直して終わり」で予防なし。情シス不在の自力運用は「止まってから慌てる」悪循環。',
    ourDifference: 'サブスクによる「常に繋がっている安心（予防と即応）」。資格保持者が24/365でバックアップ。',
    
    primaryCta: {
      label: '止まらないインフラ無料診断（5項目チェック）',
      description: '現在の設備状況を診断し、リスクを可視化します'
    },
    
    faq: [
      { q: '対応エリアはどこですか？', a: '関東一円を中心にサポートしています。時間外・当日枠は別料金で対応可能です。' },
      { q: '対象外の設備はありますか？', a: '非常放送・防災設備は対象外です。ネットワーク/監視カメラ/サイネージ/映像音響/BGM/共聴が対象となります。' },
      { q: '月額費用の目安を教えてください', a: '拠点数や設備規模により変動しますが、1拠点あたり月額1万円〜が目安です。詳細は無料診断でお見積りします。' },
      { q: '既存の保守契約がありますが、乗り換えできますか？', a: 'はい、可能です。既存契約の内容を確認し、スムーズな移行プランをご提案します。' },
      { q: '深夜のトラブルにも対応できますか？', a: 'はい、24時間365日対応可能です。深夜・休日も30分以内に一次対応いたします。' }
    ],
    
    diagnosisQuestion: 'システムやインフラが「止まったら終わり」という恐怖はありますか？',
    
    homeFeatured: true,
    homeOrder: 2,
    lastUpdated: new Date().toISOString()
  },

  // ========== OmotenasuAI（業種特化ソリューション）==========
  {
    id: 'omotenasu-ai',
    slug: 'omotenasu-ai',
    name: 'OmotenasuAI',
    title: 'OmotenasuAI',
    subtitle: 'ホテルAI（客室AIコンシェルジュ / PMS / CRM）',
    priority: 'secondary',
    category: 'nurture',
    pain: '人手不足で接客の質が低下',
    light: 'AIがおもてなしを進化',
    
    target: '宿泊施設（ホテル・旅館）',
    targetDetail: '人手不足で接客の質を下げられない、深夜対応でスタッフが疲弊している施設',
    
    strongestPain: '接客の質を下げられない人手不足。深夜対応によるスタッフの疲弊。',
    commonPains: [
      '深夜・早朝の問い合わせ対応でスタッフが疲弊',
      '多言語対応が追いつかず、インバウンド需要を逃す',
      '同じ質問への回答に時間を取られ、本来の接客ができない'
    ],
    
    solution: 'ホテルAI（客室AIコンシェルジュ / AIホテルPMS / AIホテルCRM）。深夜・定型問い合わせの80%を自動化し、接客の余裕を創出。',
    solutionDetail: '客室対応を入口に、PMS/CRMまで一気通貫で連携。「お客様個別の状況」に合わせたおもてなしと再来促進を支援します。',
    
    keyResult: '深夜問い合わせ80%自動化',
    keyResultValue: '80%',
    
    timeline: '初期設定2週間、学習期間1ヶ月',
    pricing: '月額制 + 初期設定費',
    requirements: '既存PMS/CRMとAPI接続（未整備でも段階導入可）',
    
    competitorWeakness: '汎用チャットボットは定型FAQのみ、個別対応不可。翻訳機はその場しのぎでCRMと未連携。',
    ourDifference: 'PMS/CRM連携で「お客様個別の状況」に合わせたおもてなし自動化。ホテル業界に特化した設計。',
    
    primaryCta: {
      label: '7日間の館内QA自動化トライアル',
      description: '実際の問い合わせデータで効果を実証します'
    },
    
    faq: [
      { q: 'どのPMSと連携できますか？', a: '主要なPMS（TL-リンカーン、手間いらず、OPERA等）との連携実績があります。詳細はお問い合わせください。' },
      { q: '多言語対応は可能ですか？', a: 'はい、日本語・英語・中国語・韓国語など主要言語に対応しています。追加言語も随時対応可能です。' },
      { q: '導入までにどのくらいかかりますか？', a: '初期設定に2週間、その後1ヶ月の学習期間で本格稼働となります。' },
      { q: 'スタッフへの教育は必要ですか？', a: '操作は直感的ですが、導入時に2時間程度の説明会を実施します。' },
      { q: '既存のチャットボットからの移行は可能ですか？', a: 'はい、既存のFAQデータを移行し、スムーズに切り替えできます。' }
    ],
    
    diagnosisQuestion: '人手不足で接客・対応の質が下がっていませんか？',
    
    homeFeatured: true,
    homeOrder: 3,
    lastUpdated: new Date().toISOString()
  },

  // ========== 配信プラス（JV/収益化ソリューション）==========
  {
    id: 'haishin-plus',
    slug: 'haishin-plus',
    name: '配信プラス',
    title: '配信プラス',
    subtitle: '動画配信のJV/外注/スクール',
    priority: 'secondary',
    category: 'connect',
    pain: '価格競争の閉塞感',
    light: '配信で新たな収益源',
    
    target: '貸し会議室・ホールの運営者',
    targetDetail: '価格競争で利益率が低下し、新たな収益源を探している施設オーナー',
    
    strongestPain: '「ただの箱貸し」による単価下落と価格競争の閉塞感。',
    commonPains: [
      '価格競争で利益率が年々低下',
      '配信設備への投資リスクが怖くて踏み出せない',
      '設備を導入しても「使い方が分からない」と言われる'
    ],
    
    solution: '動画配信のJV事業・外注・スクールを一体で。「90分で、客単価を+5,000円引き上げる収益設計図」を提示。',
    solutionDetail: '投資リスクをIYASAKAと分担（JV型）。外注で単発〜継続運用にも対応し、スクールで内製化も支援します。',
    
    keyResult: '客単価+5,000円',
    keyResultValue: '+5,000円',
    
    timeline: '初回設計3週間、設置1週間',
    pricing: 'JV型（売上シェア）/外注（スポット・月額）/スクール',
    requirements: '配信機材設置、ネットワーク整備',
    
    competitorWeakness: '高額な外注配信会社は1回30万円の見積で躊躇。単発の機材レンタルは操作が複雑で顧客満足度低下。内製は属人化しやすい。',
    ourDifference: 'JVでリスクを分担しつつ、外注・スクールまで含めて「続く運用」を設計。収益化まで伴走します。',
    
    primaryCta: {
      label: '収益多角化シミュレーション（設計図発行）',
      description: '現在の稼働率と収益から、配信付加後の収益増をシミュレーション'
    },
    
    faq: [
      { q: 'JV型とはどういう契約ですか？', a: '初期投資をIYASAKAが負担し、売上の一部をシェアする形式です。リスクを分担できるのが特徴です。' },
      { q: '配信の運用も任せられますか？', a: 'はい、機材の操作からイベント当日のサポートまで一括で対応可能です。' },
      { q: '既存の会議室設備を活用できますか？', a: 'はい、既存の設備を診断し、必要最小限の追加投資で配信対応可能にします。' },
      { q: '集客のサポートはありますか？', a: '配信対応会議室としての告知・集客支援も行います。' },
      { q: 'どのくらいの収益増が見込めますか？', a: '立地・規模により異なりますが、平均で客単価+5,000円、月間売上20-30%増の実績があります。' }
    ],
    
    diagnosisQuestion: '収益源を多角化したいが、投資リスクが怖いですか？',
    
    homeFeatured: true,
    homeOrder: 4,
    lastUpdated: new Date().toISOString()
  },

  // ========== AIプラス（独自AIシステム開発）==========
  {
    id: 'ai-plus',
    slug: 'ai-plus',
    name: 'AIプラス',
    title: 'AIプラス',
    subtitle: 'カスタムAI構築・保守',
    priority: 'secondary',
    category: 'nurture',
    pain: 'ツールが定着しない',
    light: 'AIが血肉化し自走する組織',
    
    target: '既製品では解決できない独自の業務課題を持つ企業',
    targetDetail: '自社専用のAIシステムを構築したいが、開発リソース・知見がない企業',
    
    strongestPain: '「うちの業務は特殊だから、パッケージでは対応できない」という閉塞感。',
    commonPains: [
      '既製品のAIツールでは自社の業務フローに合わない',
      '自社でAI開発するリソースも知見もない',
      '外注したいが、品質やセキュリティが不安'
    ],
    
    solution: '御社専用のAIシステムを、独自の品質管理基盤上で構築・保守。OmotenasuAI・ミエルプラスを開発した実績あるチームが担当。',
    solutionDetail: '独自の品質保証体制付き。止まらない・壊れない・進化するAIを、開発〜保守までオーダーメイドで伴走します。',

    keyResult: '御社専用AIを高品質で',
    keyResultValue: 'オーダーメイド',
    
    timeline: '要件定義1ヶ月、開発3〜6ヶ月（規模による）',
    pricing: '個別見積（要件定義後）',
    requirements: '課題の明確化、社内担当者のアサイン',
    
    competitorWeakness: '汎用SaaSはカスタマイズに限界。フリーランス外注は品質・保守が不安。大手SIerは高額すぎる。',
    ourDifference: 'OmotenasuAI等の開発実績で証明された技術力。独自の品質保証体制。中小企業に適正な価格。',
    
    primaryCta: {
      label: '独自AI開発の相談をする',
      description: '御社の課題をヒアリングし、AIで解決できるかを診断します'
    },
    
    faq: [
      { q: 'どんなAIが開発できますか？', a: '業務自動化AI、データ分析AI、顧客対応AI、予測AIなど、業務課題に応じて設計します。OmotenasuAI（ホテル向けAIコンシェルジュ）やミエルプラス（現場可視化AI）の開発実績があります。' },
      { q: '開発期間はどのくらいですか？', a: '要件の複雑さにより異なりますが、要件定義1ヶ月、開発3〜6ヶ月が目安です。MVP（最小機能版）を先に構築し、段階的に拡張することも可能です。' },
      { q: '保守・運用も依頼できますか？', a: 'はい、24時間365日の監視・自動復旧を含む保守プランをご用意しています。' },
      { q: '費用の目安を教えてください', a: '要件により大きく異なるため、まずはヒアリングさせてください。中小企業に適正な価格設定を心がけています。' },
      { q: '既存システムとの連携は可能ですか？', a: 'はい、API連携により既存の基幹システム、CRM、PMSなどとの統合が可能です。' }
    ],
    
    diagnosisQuestion: '既製品では解決できない、御社独自の課題がありますか？',
    
    homeFeatured: true,
    homeOrder: 5,
    lastUpdated: new Date().toISOString()
  },

  // ========== dev-OS（技術基盤）==========
  {
    id: 'dev-os',
    slug: 'dev-os',
    name: 'dev-OS',
    title: 'dev-OS',
    subtitle: 'SSOTベースAI開発SaaS',
    priority: 'tertiary',
    category: 'organize',
    pain: 'AI開発の品質が不安',
    light: '確信を持てるAI基盤',
    
    target: 'AI開発を継続運用するチーム（内製/外注の品質を担保したい）',
    targetDetail: 'SSOT（仕様の正本）を軸に、品質・セキュリティ・運用を監査する開発SaaS',
    
    strongestPain: 'AI開発の品質管理が後回しになり、運用後にトラブル頻発',
    commonPains: [
      'AIが生成するコードの品質が担保できない',
      'セキュリティ検証が不十分で運用後に問題発覚',
      '開発速度を優先すると品質が犠牲になる'
    ],
    
    solution: 'AIが書いたコードを「自動テスト」「セキュリティ検証」「性能チェック」で即座に監査し、問題を開発段階で100%検出。',
    solutionDetail: '運用後もシステムを24時間365日監視し、異常を検知した瞬間に自動修正。「止まらない」「壊れない」安心の運用継続を保証。',
    
    keyResult: '問題を開発段階で100%検出',
    keyResultValue: '100%',
    
    timeline: '要件定義後に個別見積',
    pricing: '個別見積（チーム規模・監査範囲により）',
    
    competitorWeakness: '多くのAI開発ツールは「速さ」を重視するが、品質管理が後回しでトラブル頻発',
    ourDifference: '高速開発と高品質の両立。運用開始後も安心してご利用いただける。',
    
    primaryCta: {
      label: 'dev-OS導入相談',
      description: '現在のAI開発プロセスを伺い、dev-OSによる改善提案を行います'
    },
    
    faq: [
      { q: 'dev-OSとは何ですか？', a: 'AIが生成するコードを自動検証し、バグや不整合を事前に防ぐIYASAKA独自の開発基盤です。' },
      { q: '単体で導入できますか？', a: '現在はIYASAKA製品に標準搭載されています。単体導入については個別にご相談ください。' },
      { q: 'どのような保証がありますか？', a: '止まらない（24/7監視）、壊れない（自動修正）、進化する（継続改善）の3つを保証します。' }
    ],
    
    diagnosisQuestion: 'AI開発の品質に不安がありますか？',
    
    homeFeatured: false,
    homeOrder: 99,
    lastUpdated: new Date().toISOString()
  }
]

// ===== ユーティリティ関数 =====

export const getProductById = (id: ProductId): ProductEntry | undefined => {
  return products.find(p => p.id === id)
}

export const getProductBySlug = (slug: string): ProductEntry | undefined => {
  return products.find(p => p.slug === slug)
}

export const getPrimaryProducts = (): ProductEntry[] => {
  return products.filter(p => p.priority === 'primary')
}

export const getFeaturedProducts = (): ProductEntry[] => {
  return products
    .filter(p => p.homeFeatured)
    .sort((a, b) => a.homeOrder - b.homeOrder)
}

export const getProductsByCategory = (category: ProductCategory): ProductEntry[] => {
  return products.filter(p => p.category === category)
}

export const getProductOptions = (): { value: ProductId; label: string }[] => {
  return products
    .filter(p => p.homeFeatured)
    .sort((a, b) => a.homeOrder - b.homeOrder)
    .map(p => ({ value: p.id, label: p.name }))
}

// ===== 診断ロジック =====

export interface DiagnosisAnswer {
  q1: 'yes' | 'no'  // ミエルプラス
  q2: 'yes' | 'no'  // 弱電プラス
  q3: 'yes' | 'no'  // OmotenasuAI
  q4: 'yes' | 'no'  // 配信プラス
  q5: 'yes' | 'no'  // AIプラス
}

export const diagnosisQuestions = [
  {
    id: 'q1',
    text: '「現場の状況が見えない」不安がありますか？',
    product: 'mieru-plus' as ProductId
  },
  {
    id: 'q2',
    text: 'システムやインフラが「止まったら終わり」という恐怖はありますか？',
    product: 'jakuden-plus' as ProductId
  },
  {
    id: 'q3',
    text: '人手不足で接客・対応の質が下がっていませんか？',
    product: 'omotenasu-ai' as ProductId
  },
  {
    id: 'q4',
    text: '収益源を多角化したいが、投資リスクが怖いですか？',
    product: 'haishin-plus' as ProductId
  },
  {
    id: 'q5',
    text: 'AIやDXツールを導入したが、使われていませんか？',
    product: 'ai-plus' as ProductId
  }
]

export const diagnose = (answers: DiagnosisAnswer): ProductId => {
  // 最初の「はい」を優先
  if (answers.q1 === 'yes') return 'mieru-plus'
  if (answers.q2 === 'yes') return 'jakuden-plus'
  if (answers.q3 === 'yes') return 'omotenasu-ai'
  if (answers.q4 === 'yes') return 'haishin-plus'
  if (answers.q5 === 'yes') return 'ai-plus'
  
  // 全てNoの場合は総合相談（ミエルプラスを推奨）
  return 'mieru-plus'
}

export const getDiagnosisReason = (productId: ProductId, answers: DiagnosisAnswer): string => {
  const product = getProductById(productId)
  if (!product) return ''
  
  return `「${product.diagnosisQuestion.replace('？', '')}」というお悩みに対して、${product.name}が最適です。${product.solution}`
}
