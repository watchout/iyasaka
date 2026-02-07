export const homeData = {
  hero: {
    h1: "配信プラスで、会場の収益化を加速。",
    sub: "会議室・ホールの現場設計×JVスキーム。運用が続く“しくみ”からつくる。",
    badges: ["関東一円", "月–金 9:00–17:00", "非常放送/防災は対象外"],
    cta: {
      primary: { label: "JVの相談をする", to: "/contact?type=venue" },
      secondary: { label: "3分デモ資料", to: "/downloads#haishin-demo" }
    },
    og: {
      title: "IYASAKA | 配信プラス",
      description: "配信の収益化と止めない運用。"
    }
  },

  entrances: {
    forVenue: [
      { slug: "haishin-plus", label: "配信プラス", desc: "JVで配信収益をつくる" },
      { slug: "multilingual-plus", label: "多言語プラス", desc: "再撮影なしで多言語化" },
      { slug: "ai-plus", label: "AIプラス", desc: "要約/チャプター/切り出し" }
    ],
    forSI: [
      { slug: "onsite-support", label: "オンサイト保守プラス", desc: "一次切り分け→是正→受入試験" },
      { slug: "white-label-l2-l3", label: "白ラベル技術支援", desc: "無署名/NDAで裏方請負" },
      { slug: "weak-current", label: "弱電プラス", desc: "工事は条件付き受注" }
    ]
  },

  pains: [
    { t: "開始が遅れる", d: "入場後に“映らない/鳴らない”。機材・配線・人の段取りを最適化。" },
    { t: "相性問題", d: "会場設備×配信要件の相性を事前に潰すチェックリスト運用。" },
    { t: "運営が続かない", d: "SOPと教育、JV座組で“人が変わっても回る”状態に。" },
    { t: "音の課題", d: "無線マイク帯域/増幅/残響まで含めた受入試験で数値合否。" },
    { t: "多言語対応", d: "既存素材を再生成して多言語へ。短納期で国際対応。" }
  ],

  proof: {
    metrics: [
      { label: "施工/導入", value: "1,500", unit: "件+" },
      { label: "満足度", value: "4.8", unit: "/5.0" },
      { label: "成功率", value: "98", unit: "%" }
    ]
    // logos: 後日差し替え
  },

  plansTeaser: [
    { name: "Starter", point: "小規模から試す", note: "オンサイト保守プラスの連携可" },
    { name: "Growth", point: "継続配信の体制化", note: "SOP/教育を同梱" },
    { name: "Pro", point: "収益最適化", note: "JV座組の設計" }
  ],

  onsite: {
    summary: "オンサイト保守プラス：関東一円｜月–金 9–17。非常放送/防災は対象外。",
    cta: { label: "保守を相談", to: "/contact?type=onsite" }
  },

  addons: [
    {
      slug: "multilingual-plus",
      label: "多言語プラス",
      cta: { label: "多言語の相談", to: "/contact?type=multilingual" }
    },
    {
      slug: "ai-plus",
      label: "AIプラス",
      cta: { label: "AI活用の相談", to: "/contact?type=ai" }
    }
  ],

  partner: {
    summary: "白ラベル技術支援（L2/L3）：ノンポーチ/無署名/NDAで裏方請負。",
    cta: { label: "パートナー相談", to: "/contact?type=partner" }
  },

  weakcurrent: {
    note: "工事は“獲得装置”。無料/低額診断→本工事は条件付き受注。",
    cta: { label: "工事の相談", to: "/contact?type=works" }
  },

  flow: [
    { step: "相談", d: "要件/体制/会場をヒアリング" },
    { step: "設計", d: "SOP/座組み/計測と教育を設計" },
    { step: "開始", d: "現場導入→ABで最適化" }
  ],

  faq: [
    {
      q: "対応エリア・時間は？",
      a: "関東一円、月–金 9:00–17:00（時間外/当日枠は別料金）"
    },
    {
      q: "対象外は？",
      a: "非常放送/防災は対象外です。"
    }
  ],

  finalCta: {
    primary: { label: "今すぐ相談する", to: "/contact?type=venue" },
    secondary: { label: "デモ資料を見る", to: "/downloads#haishin-demo" }
  }
};
