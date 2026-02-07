# Agent A: 法務ページ・サンクスページ担当

**作成日**: 2026年1月15日  
**統括**: Cursor AI（設計担当）  
**対象プロジェクト**: `/home/arrowsworks/iyasaka`

---

## 🎯 担当タスク

| # | ファイル | 内容 | 優先度 |
|---|----------|------|--------|
| 1 | `pages/legal/privacy.vue` | プライバシーポリシー | 🔴 必須 |
| 2 | `pages/legal/terms.vue` | 利用規約 | 🔴 必須 |
| 3 | `pages/legal/external-transmission.vue` | 外部送信規律 | 🔴 必須 |
| 4 | `pages/contact/thanks.vue` | サンクスページ | 🔴 必須 |

---

## 📁 参照すべきファイル

作業前に以下を必ず読んでください：

```bash
# 仕様詳細
cat docs/MARKETING_REVIEW_ACTION_ITEMS.md

# サンクスページのクロスセルロジック
cat docs/ssot/LEAD_CAPTURE_PROTOCOL.md

# フォーム仕様
cat docs/ssot/CONTACT_FORM_SPEC.md

# 既存レイアウト確認
cat layouts/default.vue

# 製品データ（サンクスページで使用）
cat app/data/products.ts

# Tailwind設定（カラー等）
cat tailwind.config.ts
```

---

## 📄 1. プライバシーポリシー (`pages/legal/privacy.vue`)

### 必須項目

1. 個人情報の定義
2. 個人情報の収集方法
3. 個人情報の利用目的
4. 第三者への提供
5. 個人情報の管理
6. 開示・訂正・削除の請求
7. お問い合わせ窓口
8. 改定について
9. 制定日・改定日

### 収集する情報（明記必須）

- 氏名
- メールアドレス
- 電話番号（任意）
- 会社名
- 従業員規模
- 役職（任意）

### 外部サービス（言及必須）

- **Supabase**: データ保存
- **Plausible Analytics**: アクセス解析（Cookieレス）
- **Slack**: 社内通知

### デザイン指示

```vue
<template>
  <div class="bg-washi min-h-screen py-20">
    <div class="max-w-3xl mx-auto px-6">
      <h1 class="font-mincho text-3xl text-sumi mb-8">プライバシーポリシー</h1>
      
      <!-- 各セクション -->
      <section class="mb-8">
        <h2 class="font-gothic text-xl text-sumi mb-4">1. 個人情報の定義</h2>
        <p class="text-sumi leading-relaxed">...</p>
      </section>
      
      <!-- 最終更新日 -->
      <p class="text-ash text-sm mt-12">制定日: 2026年1月15日</p>
    </div>
  </div>
</template>
```

---

## 📄 2. 利用規約 (`pages/legal/terms.vue`)

### 必須項目

1. 本規約について
2. サービス内容
3. 利用条件
4. 禁止事項
5. 免責事項
6. 知的財産権
7. 準拠法・管轄裁判所
8. 改定について

### デザイン

プライバシーポリシーと同じレイアウトを使用

---

## 📄 3. 外部送信規律 (`pages/legal/external-transmission.vue`)

### 必須項目（2023年6月施行 電気通信事業法改正対応）

| 送信先 | 送信される情報 | 利用目的 |
|--------|---------------|----------|
| Supabase | お問い合わせ情報 | リード管理・ご連絡 |
| Plausible | ページURL、リファラ | アクセス解析（個人特定なし） |
| Slack | お問い合わせ通知 | 社内対応 |

### デザイン

プライバシーポリシーと同じレイアウト + 表形式で外部送信先を記載

---

## 📄 4. サンクスページ (`pages/contact/thanks.vue`)

### 必須要素

1. **送信完了メッセージ**
   - 「お問い合わせありがとうございます」
   - 「2営業日以内に担当者よりご連絡いたします」

2. **クロスセル（関連製品レコメンド）**
   - URLパラメータ `?product=xxx` から製品IDを取得
   - 関連製品を表示

3. **次のアクション提案**
   - 「導入事例を見る」リンク
   - 「会社概要を見る」リンク
   - 「トップへ戻る」リンク

### クロスセルロジック

```typescript
// app/data/products.ts から getRelatedProducts を参照
const recommendations: Record<string, string[]> = {
  'mieru-plus': ['jakuden-plus', 'ai-plus'],
  'jakuden-plus': ['mieru-plus', 'haishin-plus'],
  'omotenasu-ai': ['mieru-plus', 'ai-plus'],
  'haishin-plus': ['jakuden-plus', 'omotenasu-ai'],
  'ai-plus': ['mieru-plus', 'omotenasu-ai'],
}
```

### 実装例

```vue
<script setup lang="ts">
import { products, getProductById } from '~/app/data/products'

const route = useRoute()
const productId = computed(() => route.query.product as string || '')
const product = computed(() => productId.value ? getProductById(productId.value) : null)

// 関連製品
const relatedProductIds = computed(() => {
  const recommendations: Record<string, string[]> = {
    'mieru-plus': ['jakuden-plus', 'ai-plus'],
    'jakuden-plus': ['mieru-plus', 'haishin-plus'],
    'omotenasu-ai': ['mieru-plus', 'ai-plus'],
    'haishin-plus': ['jakuden-plus', 'omotenasu-ai'],
    'ai-plus': ['mieru-plus', 'omotenasu-ai'],
  }
  return productId.value ? recommendations[productId.value] || [] : []
})

const relatedProducts = computed(() => 
  relatedProductIds.value.map(id => getProductById(id)).filter(Boolean)
)

// SEO: noindex
useSeoMeta({
  robots: 'noindex, nofollow'
})
</script>

<template>
  <div class="bg-washi min-h-screen py-20">
    <div class="max-w-2xl mx-auto px-6 text-center">
      <!-- 完了アイコン -->
      <div class="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <span class="text-4xl">✓</span>
      </div>
      
      <!-- メッセージ -->
      <h1 class="font-mincho text-3xl text-sumi mb-4">
        お問い合わせありがとうございます
      </h1>
      <p class="text-ash mb-8">
        2営業日以内に担当者よりご連絡いたします。
      </p>
      
      <!-- お問い合わせ内容（製品がある場合） -->
      <div v-if="product" class="bg-white p-6 rounded-lg shadow-sm mb-8">
        <p class="text-sm text-ash mb-2">お問い合わせ製品</p>
        <p class="font-gothic text-lg text-sumi">{{ product.name }}</p>
      </div>
      
      <!-- 関連製品レコメンド -->
      <div v-if="relatedProducts.length > 0" class="mb-12">
        <h2 class="font-gothic text-lg text-sumi mb-4">こちらもおすすめです</h2>
        <div class="grid gap-4">
          <NuxtLink 
            v-for="rp in relatedProducts" 
            :key="rp.id"
            :to="`/products/${rp.slug}`"
            class="block bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition text-left"
          >
            <p class="font-gothic text-sumi">{{ rp.name }}</p>
            <p class="text-sm text-ash">{{ rp.tagline }}</p>
          </NuxtLink>
        </div>
      </div>
      
      <!-- 次のアクション -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink to="/cases" class="text-akatsuki hover:underline">
          導入事例を見る →
        </NuxtLink>
        <NuxtLink to="/company" class="text-akatsuki hover:underline">
          会社概要を見る →
        </NuxtLink>
        <NuxtLink to="/" class="text-ash hover:underline">
          トップへ戻る
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
```

---

## ✅ 完了条件

- [ ] `/legal/privacy` が200で表示される
- [ ] `/legal/terms` が200で表示される
- [ ] `/legal/external-transmission` が200で表示される
- [ ] `/contact/thanks` が200で表示される
- [ ] `/contact/thanks?product=mieru-plus` で関連製品が表示される
- [ ] フッターからのリンクが正常動作
- [ ] サンクスページに `noindex` が設定されている

---

## 🔗 確認URL

```
http://160.251.209.16/iyasaka/legal/privacy
http://160.251.209.16/iyasaka/legal/terms
http://160.251.209.16/iyasaka/legal/external-transmission
http://160.251.209.16/iyasaka/contact/thanks
http://160.251.209.16/iyasaka/contact/thanks?product=mieru-plus
```

---

## 📞 完了報告

作業完了後、統括（Cursor AI）に以下を報告してください：

1. 作成したファイル一覧
2. 各ページの表示確認結果
3. 発生した問題・懸念点

---

**作業開始**: このファイルを読んだら、上記タスクを順番に実装してください。
