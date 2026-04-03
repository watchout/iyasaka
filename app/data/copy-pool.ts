export interface CopyPattern {
  id: string
  section: string
  slot: string
  text: string
  source: string
  status: 'active' | 'winner' | 'retired'
  weight: number
}

export const copyPool: Record<string, CopyPattern[]> = {
  'hero/main_copy': [
    {
      id: 'hero_main_001',
      section: 'hero',
      slot: 'main_copy',
      text: 'この街は、AIが動かしている。',
      source: 'initial-launch',
      status: 'active',
      weight: 50
    },
    {
      id: 'hero_main_002',
      section: 'hero',
      slot: 'main_copy',
      text: 'AIで会社を回す。その仕組みを、あなたにも。',
      source: 'c-suite-session-20260403',
      status: 'active',
      weight: 50
    }
  ],
  'hero/sub_copy': [
    {
      id: 'hero_sub_001',
      section: 'hero',
      slot: 'sub_copy',
      text: 'あなたの業種と悩みを教えてください',
      source: 'initial-launch',
      status: 'active',
      weight: 50
    },
    {
      id: 'hero_sub_002',
      section: 'hero',
      slot: 'sub_copy',
      text: '業種を選ぶだけで、AI活用のヒントが見つかります',
      source: 'c-suite-session-20260403',
      status: 'active',
      weight: 50
    }
  ],
  'section_hotel/headline': [
    {
      id: 'hotel_headline_001',
      section: 'section_hotel',
      slot: 'headline',
      text: '深夜2時、フロントに誰もいない。でもお客様は待っている。',
      source: 'initial-launch',
      status: 'active',
      weight: 50
    },
    {
      id: 'hotel_headline_002',
      section: 'section_hotel',
      slot: 'headline',
      text: '問い合わせの7割は、AIが即答できる内容だった。',
      source: 'c-suite-session-20260403',
      status: 'active',
      weight: 50
    }
  ],
  'section_infra/headline': [
    {
      id: 'infra_headline_001',
      section: 'section_infra',
      slot: 'headline',
      text: 'ネットが繋がらない。カメラが映らない。誰に電話すればいい？',
      source: 'initial-launch',
      status: 'active',
      weight: 50
    },
    {
      id: 'infra_headline_002',
      section: 'section_infra',
      slot: 'headline',
      text: '壊れてから電話する時代は、もう終わった。',
      source: 'c-suite-session-20260403',
      status: 'active',
      weight: 50
    }
  ],
  'section_venue/headline': [
    {
      id: 'venue_headline_001',
      section: 'section_venue',
      slot: 'headline',
      text: '隣の会議室は配信で月100万稼いでいる。あなたの会議室は？',
      source: 'initial-launch',
      status: 'active',
      weight: 50
    },
    {
      id: 'venue_headline_002',
      section: 'section_venue',
      slot: 'headline',
      text: '会議室が空いている時間、収益もゼロのままですか？',
      source: 'c-suite-session-20260403',
      status: 'active',
      weight: 50
    }
  ],
  'section_genba/headline': [
    {
      id: 'genba_headline_001',
      section: 'section_genba',
      slot: 'headline',
      text: 'ホワイトボードに書いてあることは、もう3時間前の話だ。',
      source: 'initial-launch',
      status: 'active',
      weight: 50
    },
    {
      id: 'genba_headline_002',
      section: 'section_genba',
      slot: 'headline',
      text: '現場で起きていることを、事務所からリアルタイムで見られたら。',
      source: 'c-suite-session-20260403',
      status: 'active',
      weight: 50
    }
  ],
  'section_ai/headline': [
    {
      id: 'ai_headline_001',
      section: 'section_ai',
      slot: 'headline',
      text: 'AI、気になるけど誰に聞けばいいかわからない。',
      source: 'initial-launch',
      status: 'active',
      weight: 50
    },
    {
      id: 'ai_headline_002',
      section: 'section_ai',
      slot: 'headline',
      text: '「うちにAIは早い」——本当にそうですか？',
      source: 'c-suite-session-20260403',
      status: 'active',
      weight: 50
    }
  ],
  'footer/mission': [
    {
      id: 'footer_mission_001',
      section: 'footer',
      slot: 'mission',
      text: '今ある「不」を、未来の「光」へ。',
      source: 'initial-launch',
      status: 'active',
      weight: 50
    },
    {
      id: 'footer_mission_002',
      section: 'footer',
      slot: 'mission',
      text: '現場の痛みを知っているから、技術だけでは終わらない。',
      source: 'c-suite-session-20260403',
      status: 'active',
      weight: 50
    }
  ],
  'ending/main_copy': [
    {
      id: 'ending_main_001',
      section: 'ending',
      slot: 'main_copy',
      text: 'AIが、動いている。',
      source: 'initial-launch',
      status: 'active',
      weight: 50
    },
    {
      id: 'ending_main_002',
      section: 'ending',
      slot: 'main_copy',
      text: 'あなたの会社でも、AIを動かしませんか。',
      source: 'c-suite-session-20260403',
      status: 'active',
      weight: 50
    }
  ]
}
