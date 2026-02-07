# Cursor実装プロンプト：Phase 1 Week 1 Day 3-4

**タスク**: トラッキングシステム実装  
**期間**: Day 3-4  
**難易度**: 中  
**前提**: Day 1-2（HP診断システム）完了

---

## 🎯 実装目標

リード獲得の全フローをトラッキングし、診断結果・流入元・製品IDを正確に記録する。

---

## 📋 実装タスク

### 1. composables/useLeadTracking.ts の強化

#### 現状
- 基本的なプリフィル機能とペイロード構築

#### 追加機能
- セッショントラッキング（ページ遷移追跡）
- UTMパラメータ解析
- 診断結果の自動取得
- ローカルストレージでの永続化

#### 実装コード

```typescript
// composables/useLeadTracking.ts
import { type ProductId } from '~/app/data/products'

interface TrackingData {
  sessionId: string
  firstVisit: string
  lastVisit: string
  pageViews: string[]
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  referrer?: string
  diagnosisCompleted: boolean
  diagnosisResult?: {
    product: ProductId | 'general'
    answers: Record<string, 'yes' | 'no'>
    timestamp: number
  }
}

interface LeadPayload {
  name: string
  email: string
  phone?: string
  company?: string
  employees: string
  interestedProducts: ProductId[]
  message: string
  privacyAgreed: boolean
  // トラッキング情報
  tracking: {
    sessionId: string
    source: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    referrer?: string
    diagnosisCompleted: boolean
    diagnosisProduct?: string
    pageViews: number
    firstVisit: string
    landingPage: string
  }
}

export function useLeadTracking() {
  const route = useRoute()
  const STORAGE_KEY = 'iyasaka_tracking'
  
  // セッションID生成
  const generateSessionId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }
  
  // トラッキングデータ取得
  const getTrackingData = (): TrackingData | null => {
    if (!process.client) return null
    
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return null
      }
    }
    return null
  }
  
  // トラッキングデータ保存
  const saveTrackingData = (data: TrackingData): void => {
    if (!process.client) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
  
  // トラッキング初期化（ページロード時に呼び出し）
  const initTracking = (): void => {
    if (!process.client) return
    
    let data = getTrackingData()
    const now = new Date().toISOString()
    const currentPath = route.fullPath
    
    if (!data) {
      // 新規セッション
      data = {
        sessionId: generateSessionId(),
        firstVisit: now,
        lastVisit: now,
        pageViews: [currentPath],
        referrer: document.referrer || undefined,
        diagnosisCompleted: false
      }
      
      // UTMパラメータ取得
      const utmSource = route.query.utm_source as string
      const utmMedium = route.query.utm_medium as string
      const utmCampaign = route.query.utm_campaign as string
      
      if (utmSource) data.utmSource = utmSource
      if (utmMedium) data.utmMedium = utmMedium
      if (utmCampaign) data.utmCampaign = utmCampaign
    } else {
      // 既存セッション更新
      data.lastVisit = now
      if (!data.pageViews.includes(currentPath)) {
        data.pageViews.push(currentPath)
      }
    }
    
    // 診断結果チェック
    const diagnosisResult = sessionStorage.getItem('diagnosis_result')
    if (diagnosisResult) {
      try {
        data.diagnosisResult = JSON.parse(diagnosisResult)
        data.diagnosisCompleted = true
      } catch {
        // パースエラー無視
      }
    }
    
    saveTrackingData(data)
  }
  
  // プリフィル製品取得
  const getPrefilledProduct = (): ProductId | null => {
    // 1. URLパラメータから
    const queryProduct = route.query.product as string
    if (queryProduct) return queryProduct as ProductId
    
    // 2. 診断結果から
    if (process.client) {
      const diagnosisResult = sessionStorage.getItem('diagnosis_result')
      if (diagnosisResult) {
        try {
          const result = JSON.parse(diagnosisResult)
          if (result.product && result.product !== 'general') {
            return result.product as ProductId
          }
        } catch {
          // パースエラー無視
        }
      }
    }
    
    return null
  }
  
  // 流入元取得
  const getSource = (): string => {
    // URLパラメータ優先
    const querySource = route.query.source as string
    if (querySource) return querySource
    
    // 診断完了フラグ
    if (route.query.diagnosis === 'completed') return 'diagnosis'
    
    // トラッキングデータから
    const data = getTrackingData()
    if (data?.utmSource) return data.utmSource
    
    // リファラー判定
    if (data?.referrer) {
      if (data.referrer.includes('google')) return 'google'
      if (data.referrer.includes('yahoo')) return 'yahoo'
      if (data.referrer.includes('bing')) return 'bing'
      return 'referral'
    }
    
    return 'direct'
  }
  
  // リードペイロード構築
  const buildLeadPayload = (formData: {
    name: string
    email: string
    phone?: string
    company?: string
    employees: string
    interestedProducts: ProductId[]
    message: string
    privacyAgreed: boolean
  }): LeadPayload => {
    const trackingData = getTrackingData()
    
    return {
      ...formData,
      tracking: {
        sessionId: trackingData?.sessionId || generateSessionId(),
        source: getSource(),
        utmSource: trackingData?.utmSource,
        utmMedium: trackingData?.utmMedium,
        utmCampaign: trackingData?.utmCampaign,
        referrer: trackingData?.referrer,
        diagnosisCompleted: trackingData?.diagnosisCompleted || false,
        diagnosisProduct: trackingData?.diagnosisResult?.product,
        pageViews: trackingData?.pageViews?.length || 1,
        firstVisit: trackingData?.firstVisit || new Date().toISOString(),
        landingPage: trackingData?.pageViews?.[0] || route.fullPath
      }
    }
  }
  
  // 診断結果保存
  const saveDiagnosisResult = (product: ProductId | 'general', answers: Record<string, 'yes' | 'no'>): void => {
    if (!process.client) return
    
    const result = {
      product,
      answers,
      timestamp: Date.now()
    }
    
    sessionStorage.setItem('diagnosis_result', JSON.stringify(result))
    
    // トラッキングデータも更新
    const data = getTrackingData()
    if (data) {
      data.diagnosisResult = result
      data.diagnosisCompleted = true
      saveTrackingData(data)
    }
  }
  
  // トラッキングクリア（デバッグ用）
  const clearTracking = (): void => {
    if (!process.client) return
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem('diagnosis_result')
  }
  
  return {
    initTracking,
    getPrefilledProduct,
    getSource,
    buildLeadPayload,
    saveDiagnosisResult,
    clearTracking,
    getTrackingData
  }
}
```

---

### 2. components/ContactForm.vue の改修（または ContactSection.vue への統合）

ContactSection.vueは既に実装済みなので、トラッキング初期化を追加します。

#### 実装コード（ContactSection.vue への追加）

```vue
<script setup lang="ts">
// 既存のインポートに追加
const { initTracking, getPrefilledProduct, buildLeadPayload, getSource } = useLeadTracking()

// onMountedに追加
onMounted(() => {
  // トラッキング初期化
  initTracking()
  
  // プリフィル処理
  const prefilledProduct = getPrefilledProduct()
  if (prefilledProduct && products.some(p => p.id === prefilledProduct)) {
    form.interestedProducts = [prefilledProduct]
  }
})

// 送信処理内でbuildLeadPayloadを使用（既に実装済み）
</script>
```

---

### 3. app.vue または layouts/default.vue でのグローバルトラッキング

#### 実装コード

```vue
<!-- layouts/default.vue に追加 -->
<script setup lang="ts">
const { initTracking } = useLeadTracking()

onMounted(() => {
  initTracking()
})

// ルート変更時にもトラッキング
const route = useRoute()
watch(() => route.fullPath, () => {
  initTracking()
})
</script>
```

---

### 4. server/api/leads.post.ts の改修

#### 実装コード

```typescript
// server/api/leads.post.ts
import { serverSupabaseClient } from '#supabase/server'

interface LeadPayload {
  name: string
  email: string
  phone?: string
  company?: string
  employees: string
  interestedProducts: string[]
  message: string
  privacyAgreed: boolean
  tracking: {
    sessionId: string
    source: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
    referrer?: string
    diagnosisCompleted: boolean
    diagnosisProduct?: string
    pageViews: number
    firstVisit: string
    landingPage: string
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LeadPayload>(event)
  
  // バリデーション
  if (!body.name || !body.email || !body.employees || !body.interestedProducts?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: '必須項目が不足しています'
    })
  }
  
  // メールフォーマットチェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'メールアドレスの形式が不正です'
    })
  }
  
  try {
    const client = await serverSupabaseClient(event)
    
    // リード保存
    const { data: lead, error: leadError } = await client
      .from('leads')
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        company: body.company || null,
        employees: body.employees,
        interested_products: body.interestedProducts,
        message: body.message || '',
        privacy_agreed: body.privacyAgreed,
        // トラッキング情報
        session_id: body.tracking.sessionId,
        source: body.tracking.source,
        utm_source: body.tracking.utmSource || null,
        utm_medium: body.tracking.utmMedium || null,
        utm_campaign: body.tracking.utmCampaign || null,
        referrer: body.tracking.referrer || null,
        diagnosis_completed: body.tracking.diagnosisCompleted,
        diagnosis_product: body.tracking.diagnosisProduct || null,
        page_views: body.tracking.pageViews,
        first_visit: body.tracking.firstVisit,
        landing_page: body.tracking.landingPage,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (leadError) {
      console.error('Lead insert error:', leadError)
      throw createError({
        statusCode: 500,
        statusMessage: 'データベースエラー'
      })
    }
    
    // 通知送信（Slack/メール）は別途実装
    // await sendNotification(lead)
    
    return {
      success: true,
      leadId: lead.id
    }
  } catch (error) {
    console.error('Lead submission error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'サーバーエラー'
    })
  }
})
```

---

### 5. Supabaseテーブル定義（参考）

```sql
-- leadsテーブルの拡張
ALTER TABLE leads ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'direct';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS referrer TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS diagnosis_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS diagnosis_product TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS page_views INTEGER DEFAULT 1;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS first_visit TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS landing_page TEXT;
```

---

## ✅ 実装チェックリスト

Day 3-4完了時に以下を確認：

```
□ useLeadTracking.ts が強化されている
  □ セッショントラッキングが動作する
  □ UTMパラメータが解析される
  □ 診断結果が自動取得される
  □ ローカルストレージに保存される

□ ContactSection.vue でトラッキングが統合されている
  □ initTracking()が呼び出される
  □ プリフィルが動作する
  □ 送信時にトラッキング情報が含まれる

□ layouts/default.vue でグローバルトラッキングが動作する
  □ ページ遷移時にトラッキングが更新される

□ server/api/leads.post.ts が改修されている
  □ トラッキング情報を受け取れる
  □ Supabaseに保存できる

□ 以下の導線でトラッキングが機能する
  □ 直接アクセス → HP → 診断 → 結果 → #contact
  □ UTM付きURL → HP → #contact
  □ 製品LP → HP#contact?product=xxx
```

---

## 🚨 注意事項

1. **プライバシー配慮**
   - 個人を特定できる情報はトラッキングしない
   - IPアドレスは保存しない
   - GDPRに準拠

2. **パフォーマンス**
   - ローカルストレージは同期操作なので軽量に
   - 大量のデータを保存しない

3. **エラーハンドリング**
   - トラッキング失敗でもフォーム送信は成功させる
   - try-catchで適切に処理

---

## 📝 次のステップ

Day 5で以下を実装：
- Apple風エフェクト基盤
- スムーススクロール設定
- Hero Sectionアニメーション

---


