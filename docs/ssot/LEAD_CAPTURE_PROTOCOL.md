# IYASAKA Lead-Capture Technical Protocol

**作成日**: 2026年1月2日  
**目的**: 各プロダクトLPから統一されたリード獲得フローを構築  
**マスタードキュメント**: [`IYASAKA_2026_MASTER_STRATEGY.md`](./IYASAKA_2026_MASTER_STRATEGY.md)

---

## 1. リード獲得の全体構造（データフロー）

全てのプロダクトLPは「独立した集客装置」として機能しますが、リード（問い合わせ）の出口は「IYASAKA公式サイト（母艦）」へ集約します。

```
┌─────────────────────────────────────────────────────────────────┐
│  Product LPs (Distributed)                                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ ミエルプラス │  │ 弱電プラス  │  │ 配信プラス  │             │
│  │  LP         │  │  LP        │  │  LP        │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                      │
│         └────────────────┴────────────────┘                      │
│                          │                                       │
│                   ?product=xxx                                   │
│                          ↓                                       │
├─────────────────────────────────────────────────────────────────┤
│  Main HP - IYASAKA公式サイト                                     │
│  ┌───────────────────────────────────────────────┐              │
│  │  /#contact                                    │              │
│  │  共通問い合わせフォーム                         │              │
│  │  (製品プリフィル + UTM保持)                    │              │
│  └──────────────────────┬────────────────────────┘              │
│                          │                                       │
├─────────────────────────────────────────────────────────────────┤
│  Data Destination                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Supabase   │  │   Slack     │  │   Email     │             │
│  │  (CRM DB)   │  │  (#lead)    │  │  (自動返信)  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. URLパラメータ設計（共通規格）

### 2.1 基本仕様

- **ベースURL**: `https://iyasaka.co.jp/#contact`
- **必須パラメータ**: `product` (Product ID)
- **オプション**: `utm_source`, `utm_medium`, `utm_campaign`

### 2.2 プロダクトID（product）一覧

各AIは、自らが担当する製品に応じて以下のIDをリンクに使用すること。

| product | 製品名 | 担当 |
|---------|--------|------|
| `mieru-plus` | ミエルプラス | 本体HP |
| `jakuden-plus` | 弱電プラス | 弱電LP |
| `omotenasu-ai` | OmotenasuAI | 本体HP |
| `haishin-plus` | 配信プラス | 配信LP |
| `ai-plus` | AIプラス | 本体HP |
| `dev-os` | dev-OS | 本体HP |

### 2.3 レガシーID（後方互換）

以下のIDは旧仕様です。新規実装では使用しないこと。（※ `dev-os` は公開対象のため `product=dev-os` は使用可）

| 旧ID | 新ID |
|------|------|
| `weak-den` | `jakuden-plus` |
| `mieru-board` | `mieru-plus` |
| `mieru-stock` | `mieru-plus` |
| `mieru-drive` | `mieru-plus` |
| `mieru-file` | `mieru-plus` |
| `haishin` | `haishin-plus` |
| `tagengo` | （製品としては非公開） |
| `omo-ai` | `omotenasu-ai` |
| `ai-plus` | `ai-plus` |

---

## 3. LP側：実装プロトコル

### 3.1 CTAボタンの実装

```html
<!-- 例: 配信プラスLPのCTA -->
<NuxtLink 
  to="/#contact?product=haishin-plus"
  class="cta-button"
  rel="noopener noreferrer"
  data-analytics-id="cta-haishin-lp-main"
>
  収益多角化シミュレーション（設計図発行）
</NuxtLink>
```

### 3.2 UTMパラメータの付与

```typescript
// composables/useLeadTracking.ts
const buildContactUrl = (productId: string, source?: string) => {
  const params = new URLSearchParams({
    product: productId,
    ...(source && { utm_source: source }),
  })
  return `/#contact?${params.toString()}`
}
```

### 3.3 dev-OS 準拠のガバナンス

- リンクには必ず `rel="noopener noreferrer"` を付与すること（セキュリティ確保）
- クリックイベントを計測するための `data-analytics-id` を付与することを推奨
- 外部リンクは target="_blank" を使用

---

## 4. HP側（母艦）：フォーム受信ロジック

### 4.1 パラメータ自動検知機能

URLの `product` を検知し、フォーム内の「興味のある製品」の初期値を自動的に変更する。

```typescript
// composables/useLeadTracking.ts
export function useLeadTracking() {
  const route = useRoute()
  
  const getPrefilledProduct = (): ProductId | null => {
    const productParam = route.query.product as string | undefined
    if (productParam && isValidProductId(productParam)) {
      return productParam as ProductId
    }
    return null
  }
  
  return {
    getPrefilledProduct,
    // ...
  }
}
```

### 4.2 フォームでのプリフィル

```vue
<!-- components/home/ContactSection.vue -->
<script setup lang="ts">
const { getPrefilledProduct } = useLeadTracking()
const selectedProduct = ref(getPrefilledProduct() || '')
</script>

<template>
  <select v-model="selectedProduct" id="inquiry_product">
    <option value="">製品を選択してください</option>
    <option 
      v-for="product in products" 
      :key="product.id" 
      :value="product.id"
    >
      {{ product.name }}
    </option>
  </select>
</template>
```

### 4.3 隠しフィールド（Hidden Fields）

解析用に、どの `product` から来たのかを隠しフィールドに保持し、送信データに含める。

```html
<input type="hidden" name="origin_product_id" :value="selectedProduct">
<input type="hidden" name="utm_source" :value="utmSource">
<input type="hidden" name="utm_medium" :value="utmMedium">
<input type="hidden" name="utm_campaign" :value="utmCampaign">
```

---

## 5. サンクスページとリターゲティング

### 5.1 サンクスページ設計

問い合わせ完了後の「サンクスページ」では、**「IYASAKAの他製品」**をレコメンドするセクションを設ける。

```typescript
// pages/contact/thanks.vue
const getRelatedProducts = (submittedProductId: ProductId) => {
  const recommendations: Record<ProductId, ProductId[]> = {
    'mieru-plus': ['jakuden-plus', 'ai-plus'],
    'jakuden-plus': ['mieru-plus', 'haishin-plus'],
    'omotenasu-ai': ['mieru-plus', 'ai-plus'],
    'haishin-plus': ['jakuden-plus', 'omotenasu-ai'],
    'ai-plus': ['mieru-plus', 'omotenasu-ai'],
  }
  return recommendations[submittedProductId] || []
}
```

### 5.2 クロスセルコピー例

| 送信製品 | クロスセルコピー |
|----------|-----------------|
| ミエルプラス | 「現場を整えた後は、インフラも守りませんか？（弱電プラス）」 |
| 弱電プラス | 「インフラが安定したら、収益多角化を（配信プラス）」 |
| 配信プラス | 「収益が安定したら、人手不足解消を（OmotenasuAI）」 |

---

## 6. データ保存仕様

### 6.1 Supabase テーブル設計

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 基本情報
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  
  -- 問い合わせ内容
  product_id TEXT NOT NULL,        -- 興味のある製品
  message TEXT,
  
  -- 診断情報
  diagnosis_result TEXT,           -- 診断で推奨された製品
  diagnosis_answers JSONB,         -- 診断回答（q1-q5）
  
  -- トラッキング情報
  origin_product_id TEXT,          -- 流入元製品
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  
  -- ステータス
  status TEXT DEFAULT 'new',       -- new, contacted, qualified, converted
  notes TEXT
);

-- インデックス
CREATE INDEX idx_leads_product ON leads(product_id);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_status ON leads(status);
```

### 6.2 API エンドポイント

```typescript
// server/api/leads.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // 1. バリデーション（Zod）
  const validated = leadSchema.parse(body)
  
  // 2. Supabaseに保存
  const { data, error } = await supabase
    .from('leads')
    .insert(validated)
    .select()
    .single()
  
  // 3. Slack通知
  await sendSlackNotification(data)
  
  // 4. メール自動返信
  await sendAutoReplyEmail(validated.email, validated.name)
  
  return { success: true, id: data.id }
})
```

---

## 7. 各プロダクトAIへの最終念押しプロンプト

```
【技術実装命令】
本プロジェクトにおける「リード獲得フロー」はIYASAKA共通プロトコルに従います。

1. 全てのCTAリンクは `/#contact?product=[担当プロダクトID]` 形式で作成してください。
2. リンク先はIYASAKA公式サイトの共通フォームに集約し、LP側で独自のフォームは作成しないでください。
3. このフローにより、顧客データがIYASAKAの「弥栄循環（エコシステム）」に正しく統合されることを保証してください。
4. 実装の整合性は dev-OS のガバナンス基準に照らしてチェックしてください。
```

---

## 8. 関連ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [`IYASAKA_2026_MASTER_STRATEGY.md`](./IYASAKA_2026_MASTER_STRATEGY.md) | マスタードキュメント |
| [`CONTACT_FORM_SPEC.md`](./CONTACT_FORM_SPEC.md) | フォーム詳細仕様 |
| [`BRAND_MASTER_PROTOCOL.md`](./BRAND_MASTER_PROTOCOL.md) | ブランドガイドライン |

---

**次のアクション**: `server/api/leads.post.ts` の実装
