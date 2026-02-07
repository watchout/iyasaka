// OmotenasuAI まとめページ用 SSOT（草案）
// - 外部URL未定のため、CTAは当面 /contact に統一
// - 3製品（AIコンシェルジュ / PMS Tsukuyomi / CRM）を1ページで要約
// - 連携マトリクス（PMS/清掃/決済）と手動フォールバック運用を明示

export const omotenasuai = {
  seo: {
    title: 'OmotenasuAI 製品まとめ | IYASAKA',
    description:
      'AIコンシェルジュ・PMS「Tsukuyomi」・CRM/会員の要点を1ページで比較。連携・運用・フォールバックを現場基準で解説。',
  },
  hero: {
    title: '客室体験と運用を、AIで一気通貫',
    sub: 'AIコンシェルジュ / PMS「Tsukuyomi」 / CRM を組み合わせ、案内・注文・運用・再来を最適化',
    cta: { primary: '/contact', label: '連携の相談をする' },
  },
  products: [
    {
      slug: 'ai-concierge',
      title: 'AIコンシェルジュ',
      summary:
        '客室の「聞きたい・頼みたい」を逃さず、会話から注文へ直結。24/7・多言語・販促ABで収益最大化。',
      targets: ['ホテル', '旅館', '宿泊複合施設'],
      keyFeatures: ['会話型案内・注文', 'クーポン/キャンペーン', '多言語', '簡易レポート'],
      cta: { to: '/contact', label: 'デモ/要件相談' },
    },
    {
      slug: 'pms-tsukuyomi',
      title: 'PMS「Tsukuyomi」',
      summary:
        '現場運用に寄り添うPMS。段階公開/並走期間を前提に、予約・在庫・料金・清掃・会員を一元化。',
      targets: ['小〜中規模ホテル', 'レジャー施設'],
      keyFeatures: ['予約/在庫/料金', 'HK（清掃）', '会員', '外部連携'],
      notes: ['段階公開・移行並走・対象顧客を明示', '当面はWaitlist誘導（/contact?type=pms）'],
      cta: { to: '/contact?type=pms', label: 'Waitlist相談' },
    },
    {
      slug: 'crm',
      title: 'CRM / 会員',
      summary:
        '再来と直販を加速。初期は「メンバー施策スターター（3セグメント×3オファー）」から開始し運用定着へ。',
      targets: ['ホテル', '旅館'],
      keyFeatures: ['プロファイル/タグ', 'セグメント配信', 'クーポン', '簡易CDP'],
      cta: { to: '/contact?type=crm', label: '施策設計を相談' },
    },
  ],
  comparison: {
    columns: ['対象', '主機能', '前提', 'CTA'],
    rows: [
      {
        product: 'AIコンシェルジュ',
        target: '客室（TV/タブレット）',
        features: '案内・注文・クーポン・多言語',
        prerequisite: 'PMS連携 任意（推奨）',
        cta: '/contact',
      },
      {
        product: 'PMS「Tsukuyomi」',
        target: '予約/在庫/料金/清掃/会員',
        features: '一元管理・段階公開・並走移行',
        prerequisite: '既存からの計画移行',
        cta: '/contact?type=pms',
      },
      {
        product: 'CRM/会員',
        target: '会員/セグメント/オファー',
        features: 'タグ・配信・クーポン・簡易CDP',
        prerequisite: 'API/CSV データ流通',
        cta: '/contact?type=crm',
      },
    ],
  },
  integration: {
    matrix: [
      { item: 'PMS', concierge: '任意/推奨', tsukuyomi: 'ネイティブ', crm: 'API/CSV' },
      { item: '清掃（HK）', concierge: '任意（通知/起票）', tsukuyomi: 'ネイティブ', crm: '—' },
      { item: '決済', concierge: '注文→決済連携（任意）', tsukuyomi: 'ゲートウェイ連携', crm: '—' },
    ],
    fallback:
      '非連携時は「手動起票/CSV反映/日次棚卸」で運用可能。障害時はキュー蓄積→復旧後リプレイ（運用SOPで明示）。',
  },
  faq: [
    {
      q: 'PMS連携は必須ですか？',
      a: '必須ではありません。非連携時は手動起票/CSV反映などのフォールバック運用を準備します。',
    },
    {
      q: '段階公開の進め方を教えてください（Tsukuyomi）',
      a: '現状棚卸→並走期間→完全切替の3段階で進めます。クリティカル機能から優先し、影響最小で移行します。',
    },
    {
      q: 'CRMはどこから始めるべきですか？',
      a: '初期は「メンバー施策スターター（3セグ×3オファー）」で開始し、効果検証しながら拡張します。',
    },
    {
      q: '対応エリアは？',
      a: '関東一円を基本とし、スコープに応じて全国対応可能です（事前調整）。',
    },
  ],
  notes: ['外部URL未定 → 外部302は無効化', 'CTAは当面 /contact に統一', '対応エリア: 関東一円'],
} as const;

export type OmotenasuAISummary = typeof omotenasuai;




