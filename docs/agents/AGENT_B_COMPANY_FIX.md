# Agent B: 会社概要ページ・トップページ修正担当

**作成日**: 2026年1月15日  
**統括**: Cursor AI（設計担当）  
**対象プロジェクト**: `/home/arrowsworks/iyasaka`

---

## 🎯 担当タスク

| # | ファイル | 内容 | 優先度 |
|---|----------|------|--------|
| 1 | `pages/company/index.vue` | 会社概要ページ作成 | 🔴 必須 |
| 2 | `pages/index.vue` | CTAボタン最適化 | 🟡 推奨 |
| 3 | `components/Footer.vue` | フッターリンク確認 | 🟢 確認 |

---

## 📁 参照すべきファイル

作業前に以下を必ず読んでください：

```bash
# 仕様詳細
cat docs/MARKETING_REVIEW_ACTION_ITEMS.md

# LP構造
cat docs/ssot/LP_STRUCTURE_SPECIFICATION.md

# デザイントークン
cat tailwind.config.ts

# 既存トップページ
cat pages/index.vue

# 既存フッター
cat components/Footer.vue

# ナビゲーション定義
cat app/navigation.ts
```

---

## 📄 1. 会社概要ページ (`pages/company/index.vue`)

### 必須セクション

1. **会社情報**
   - 社名
   - 代表者
   - 設立年（または創業年）
   - 所在地
   - 事業内容

2. **ミッション・ビジョン**
   - IYASAKAの理念
   - 目指す未来

3. **CTA**
   - お問い合わせへの導線

### デザイン指示

```vue
<template>
  <div class="bg-washi min-h-screen">
    <!-- ヒーロー -->
    <section class="py-20 bg-gradient-to-b from-sumi to-deep-sumi text-washi">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h1 class="font-mincho text-4xl md:text-5xl mb-6">
          会社概要
        </h1>
        <p class="text-washi/80 text-lg">
          地域企業のDXを支援するテクノロジーカンパニー
        </p>
      </div>
    </section>
    
    <!-- 会社情報 -->
    <section class="py-16">
      <div class="max-w-3xl mx-auto px-6">
        <h2 class="font-gothic text-2xl text-sumi mb-8 text-center">会社情報</h2>
        <table class="w-full">
          <tbody>
            <tr class="border-b border-ash/20">
              <th class="py-4 text-left text-ash font-normal w-1/3">社名</th>
              <td class="py-4 text-sumi">株式会社IYASAKA</td>
            </tr>
            <tr class="border-b border-ash/20">
              <th class="py-4 text-left text-ash font-normal">代表者</th>
              <td class="py-4 text-sumi">（代表者名）</td>
            </tr>
            <tr class="border-b border-ash/20">
              <th class="py-4 text-left text-ash font-normal">設立</th>
              <td class="py-4 text-sumi">（設立年月）</td>
            </tr>
            <tr class="border-b border-ash/20">
              <th class="py-4 text-left text-ash font-normal">所在地</th>
              <td class="py-4 text-sumi">（住所）</td>
            </tr>
            <tr class="border-b border-ash/20">
              <th class="py-4 text-left text-ash font-normal">事業内容</th>
              <td class="py-4 text-sumi">
                <ul class="list-disc list-inside space-y-1">
                  <li>DX支援コンサルティング</li>
                  <li>AI・自動化ソリューション開発</li>
                  <li>システムインテグレーション</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    
    <!-- ミッション -->
    <section class="py-16 bg-kinari">
      <div class="max-w-3xl mx-auto px-6 text-center">
        <h2 class="font-gothic text-2xl text-sumi mb-8">私たちの使命</h2>
        <p class="font-mincho text-xl text-sumi leading-relaxed mb-4">
          「技術の力で、地域企業を"弥栄"へ」
        </p>
        <p class="text-ash leading-relaxed">
          IYASAKAは「弥栄（いやさか）」＝ますます栄えることを願い、<br class="hidden md:inline">
          地域企業のデジタル変革を伴走支援するテクノロジーカンパニーです。
        </p>
      </div>
    </section>
    
    <!-- CTA -->
    <section class="py-16">
      <div class="max-w-2xl mx-auto px-6 text-center">
        <h2 class="font-gothic text-2xl text-sumi mb-4">
          お気軽にご相談ください
        </h2>
        <p class="text-ash mb-8">
          DXに関するお悩み、まずはお聞かせください。
        </p>
        <NuxtLink 
          to="/#contact" 
          class="inline-flex items-center gap-2 px-8 py-4 bg-akatsuki text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          無料相談する
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '会社概要 | IYASAKA',
  description: 'IYASAKAは地域企業のDXを支援するテクノロジーカンパニーです。AI・自動化ソリューションで、あなたのビジネスを"弥栄"へ導きます。'
})
</script>
```

### 注意事項

- 会社情報（代表者、設立年、住所）は **プレースホルダー** で作成
- 後でユーザーが実データを入力できるようにコメントを残す

---

## 📄 2. トップページCTA最適化 (`pages/index.vue`)

### 確認・修正ポイント

1. **FV（ファーストビュー）**
   - 主CTA: 「無料で相談する」→ `#contact` へスクロール ✅
   - 副CTA: 「すぐに相談する」→ `#contact` へスクロール（既に修正済みか確認）

2. **製品カード（Section 5）**
   - リンク先: `/products/{slug}` へ（既に修正済みか確認）

3. **診断結果CTA**
   - 別ページなので本タスク対象外

### 確認方法

```bash
# 現在のトップページ確認
cat pages/index.vue | grep -A5 "副CTA"
cat pages/index.vue | grep -A5 "NuxtLink.*products"
```

---

## 📄 3. フッターリンク確認 (`components/Footer.vue`)

### 確認項目

- [ ] 「プライバシーポリシー」→ `/legal/privacy`
- [ ] 「利用規約」→ `/legal/terms`
- [ ] 「外部送信規律」→ `/legal/external-transmission`
- [ ] 「会社概要」→ `/company`

### 修正方法（必要な場合）

`app/navigation.ts` の `legalLinks` を確認・修正

---

## ✅ 完了条件

- [ ] `/company` が200で表示される
- [ ] 会社情報テーブルが正しく表示される
- [ ] CTAボタンが `/#contact` に遷移する
- [ ] フッターから会社概要へリンクできる
- [ ] トップページのCTAが正しく動作する

---

## 🔗 確認URL

```
http://160.251.209.16/iyasaka/company
http://160.251.209.16/iyasaka/
http://160.251.209.16/iyasaka/#contact
```

---

## 📞 完了報告

作業完了後、統括（Cursor AI）に以下を報告してください：

1. 作成・修正したファイル一覧
2. 各ページの表示確認結果
3. 会社情報のプレースホルダー箇所
4. 発生した問題・懸念点

---

**作業開始**: このファイルを読んだら、上記タスクを順番に実装してください。
