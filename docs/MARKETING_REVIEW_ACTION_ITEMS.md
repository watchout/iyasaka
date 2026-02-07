# IYASAKA マーケティングレビュー 修正指示書

**作成日**: 2026年1月2日  
**作成者**: マーケティング担当AI  
**対象**: 設計AI / 開発担当  
**優先度**: 🔴 緊急 → 🟡 高 → 🟢 中

---

## 📋 エグゼクティブサマリー

マーケティング視点でHP全体をレビューした結果、**BtoBリード獲得に致命的な問題**が複数発見されました。
以下の修正を優先度順に実施してください。

**致命的問題（公開前に必須対応）**:
1. 会社ページが「近日公開予定」のまま
2. 法務ページ（プライバシーポリシー・利用規約）が未実装
3. 社会的証明の数値に根拠・注釈がない
4. FVと診断説明の時間表記が矛盾

---

## 🔴 Phase 1: 緊急対応（公開ブロッカー）

### 1.1 会社ページの実装

**現状**: `/pages/company/index.vue` が「近日公開予定」のみ

**対応内容**:
既存の `app/data/team.ts` のデータを活用して、以下を実装すること。

```
必須セクション:
1. 会社概要（テーブル形式）
   - 社名
   - 所在地
   - 代表者
   - 設立日
   - 資本金
   - 事業内容
   - 従業員数

2. 代表者プロフィール
   - 写真（プレースホルダー可）
   - 経歴（bio）
   - 資格（qualifications）
   - 実績（achievements）

3. チームメンバー紹介
   - teamMembersデータを活用

4. 数値実績（teamStats）
   - totalProjects: '1,500+'
   - satisfactionRate: '4.8/5.0'
   - successRate: '98%'
   - yearsOfExperience: '20+'
```

**デザイン指示**:
- Neo-Japanesqueデザインシステムに準拠
- bg-washi / bg-sumi のセクション交互配置
- カラーは tailwind.config.ts の設定を使用

**実装ファイル**:
- `pages/company/index.vue` を全面改修

---

### 1.2 プライバシーポリシーページの実装

**現状**: `/privacy` が404（ContactFormからリンクされているが存在しない）

**対応内容**:
`/pages/legal/privacy.vue` を新規作成

```
必須項目:
1. 個人情報の定義
2. 個人情報の収集方法
3. 個人情報の利用目的
4. 第三者への提供
5. 個人情報の管理
6. 開示・訂正・削除の請求
7. お問い合わせ窓口
8. 改定について
9. 制定日・改定日
```

**注意事項**:
- フォームで収集する項目（氏名、メール、電話、会社名、従業員規模）を明記
- Supabaseへの保存、Slack通知、メール送信について言及
- アナリティクス（Plausible）の使用について言及

---

### 1.3 利用規約ページの実装

**現状**: `/terms` が存在しない

**対応内容**:
`/pages/legal/terms.vue` を新規作成

```
必須項目:
1. 本規約について
2. サービス内容
3. 利用条件
4. 禁止事項
5. 免責事項
6. 知的財産権
7. 準拠法・管轄裁判所
8. 改定について
```

---

### 1.4 外部送信規律対応ページの実装

**現状**: 未実装

**対応内容**:
`/pages/legal/external-transmission.vue` を新規作成

```
必須項目（2023年6月施行の電気通信事業法改正対応）:
1. 送信される情報の内容
2. 送信先（Supabase、Plausible等）
3. 利用目的
```

---

### 1.5 FVと診断説明の時間表記統一

**現状の矛盾**:
```
FV・CTA: 「5分で完了」
診断ステップ説明: 「60秒」+「30秒」+「即座」= 約90秒
```

**対応内容**:
以下のいずれかで統一すること。

**オプションA（推奨）: 90秒に統一**
```vue
<!-- pages/index.vue の FV CTA -->
<!-- 変更前 -->
5分で完了：現場の「不」診断を始める

<!-- 変更後 -->
90秒で完了：現場の「不」診断を始める
```

**オプションB: 5分の根拠を明示**
```vue
<!-- 変更後 -->
診断90秒 + 相談申込み = 5分で完了
```

**修正箇所一覧**:
- `pages/index.vue` L150 付近: 「5分診断で」
- `pages/index.vue` L161: 「5分で完了：現場の「不」診断を始める」
- `pages/index.vue` L265: 「5分で完了：診断を始める」
- その他CTAボタン全て

---

### 1.6 社会的証明の注釈追加

**現状**:
```javascript
const stats = [
  { value: '60', unit: '分/日', label: '平均業務削減' },
  { value: '80', unit: '%', label: 'トラブル対応時間削減' },
  { value: '35', unit: '%', label: '顧客満足度向上' }
]
```
→ 根拠なしの数値は景品表示法違反（優良誤認）のリスク

**対応内容**:
```vue
<!-- セクション6の数値表示後に追加 -->
<p class="text-center text-xs text-ash mt-8">
  ※ 数値は導入企業へのヒアリング結果に基づく平均値です。
  効果は導入環境により異なります。
</p>
```

**また、顧客の声も以下に修正**:
```vue
<!-- 変更前 -->
<p class="text-sm text-ash">— 建設業A社 代表取締役</p>

<!-- 変更後 -->
<p class="text-sm text-ash">— 建設業 代表取締役（匿名）</p>
```

---

## 🟡 Phase 2: 高優先対応（公開後1週間以内）

### 2.1 サンクスページの実装

**現状**: `/contact/thanks` が未実装（フォーム送信後の遷移先がない）

**対応内容**:
`/pages/contact/thanks.vue` を新規作成

```vue
必須要素:
1. 送信完了メッセージ
   「お問い合わせありがとうございます」
   「2営業日以内に担当者よりご連絡いたします」

2. クロスセル（関連製品レコメンド）
   - 選択した製品に基づく関連製品表示
   - LEAD_CAPTURE_PROTOCOL.md の getRelatedProducts ロジック使用

3. 次のアクション提案
   - 「導入事例を見る」リンク
   - 「会社概要を見る」リンク
   - SNSフォロー導線（あれば）

4. トップへ戻るリンク
```

**実装参考**:
```typescript
// LEAD_CAPTURE_PROTOCOL.md より
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

---

### 2.2 製品LPページの改修

**現状**: `pages/products/[slug].vue` の状態確認が必要

**対応内容**:
1. 製品詳細ページから独立フォームを削除
2. HP#contact への誘導CTAに集約
3. 製品カードからのリンク先を製品LPに変更

**修正箇所**:
```vue
<!-- pages/index.vue セクション5 -->
<!-- 変更前 -->
:to="`/#contact?product=${product.id}`"

<!-- 変更後 -->
:to="`/products/${product.slug}`"
```

**製品LP内のCTA**:
```vue
<NuxtLink 
  :to="`/#contact?product=${product.id}`"
  class="..."
>
  無料で相談する
</NuxtLink>
```

---

### 2.3 FV副CTAの変更

**現状**:
```vue
<NuxtLink to="/cases">導入事例を見る</NuxtLink>
```
→ CV前に事例ページへ離脱するリスク

**対応内容**:
```vue
<!-- 変更後 -->
<NuxtLink 
  to="/#contact"
  class="..."
>
  まずは相談する
</NuxtLink>
```

または、診断を経由しない人向けに:
```vue
<a 
  href="#contact"
  class="..."
>
  診断せずに相談する
</a>
```

---

### 2.4 2026年問題のエビデンス追加

**現状**: 「過去最高水準」など曖昧な表現

**対応内容**:
危機セクションに出典を追加

```javascript
const crises = [
  {
    icon: '👷',
    title: '深刻な人手不足',
    description: '中小企業の人手不足感は68.5%と過去最高水準。「明日から現場が回らない」——その恐怖は、もう現実です。',
    source: '帝国データバンク「人手不足に対する企業の動向調査」2025年' // 追加
  },
  // ...
]
```

**または、セクション下部に出典表記**:
```vue
<p class="text-xs text-ash text-center mt-8">
  ※ 出典：帝国データバンク「人手不足に対する企業の動向調査」、
  中小企業庁「中小企業白書」
</p>
```

---

## 🟢 Phase 3: 中優先対応（公開後1ヶ月以内）

### 3.1 メディア向けページの実装

**対応内容**:
`/pages/press/index.vue` を新規作成

```
必須要素:
1. 取材可能テーマリスト
2. プレスキット（ロゴダウンロード）
3. 取材対応フロー
4. お問い合わせ先（広報担当）
```

---

### 3.2 創業ストーリーページの実装

**対応内容**:
`/pages/company/story.vue` を新規作成
`app/data/story.ts` を新規作成

```
ストーリー構成:
1. 創業前（何をしていたか）
2. 創業のきっかけ（転機）
3. 挫折・困難
4. 乗り越えた方法
5. 現在と未来
```

---

### 3.3 事例ページの実名化準備

**対応内容**:
- 最低1件の実名許可取得（営業対応）
- 許可取得後、`app/data/cases.ts` を更新

```typescript
// 変更前
clientName: '東京カンファレンスセンター（仮名）',

// 変更後
clientName: '〇〇株式会社',
clientLogo: '/images/cases/client-logo-real.png',
```

---

### 3.4 製品データとコンテンツの整合性修正

**発見した不整合**:
- 事例データに「多言語プラス」「オンサイト保守プラス」が存在
- `products.ts` には未定義

**対応内容**:
以下のいずれかで対応

**オプションA**: 事例データから未定義製品を削除
**オプションB**: products.ts に製品を追加（非公開設定で）

```typescript
// products.ts に追加（homeFeatured: false で非公開）
{
  id: 'multilingual-plus',
  name: '多言語プラス',
  homeFeatured: false,
  // ...
}
```

---

### 3.5 カラー定義の統一

**発見した不整合**:
- `BRAND_NARRATIVE.md`: `#ff9e00`（夜明けの光）
- `2026_MASTER_STRATEGY.md`: `#FF6B35`（暁光オレンジ）

**対応内容**:
`tailwind.config.ts` の `akatsuki` カラーを正として統一し、ドキュメントを更新

```css
/* 正（tailwind.config.ts）*/
--color-akatsuki: #FF6B35;
```

`BRAND_NARRATIVE.md` を更新:
```markdown
--color-accent: #FF6B35;  /* 暁光オレンジ（CTA） */
```

---

## 📁 ファイル作成・修正一覧

### 新規作成

| ファイル | Phase | 優先度 |
|----------|-------|--------|
| `/pages/company/index.vue` | 1 | 🔴 緊急 |
| `/pages/legal/privacy.vue` | 1 | 🔴 緊急 |
| `/pages/legal/terms.vue` | 1 | 🔴 緊急 |
| `/pages/legal/external-transmission.vue` | 1 | 🔴 緊急 |
| `/pages/contact/thanks.vue` | 2 | 🟡 高 |
| `/pages/press/index.vue` | 3 | 🟢 中 |
| `/pages/company/story.vue` | 3 | 🟢 中 |
| `/app/data/story.ts` | 3 | 🟢 中 |

### 修正

| ファイル | 修正内容 | Phase |
|----------|----------|-------|
| `/pages/index.vue` | 時間表記統一、社会的証明注釈、副CTA変更 | 1-2 |
| `/app/data/cases.ts` | 製品名整合性修正 | 3 |
| `/docs/ssot/BRAND_NARRATIVE.md` | カラー定義統一 | 3 |

---

## ✅ チェックリスト

### Phase 1 完了条件
- [ ] `/pages/company/index.vue` が正常に表示される
- [ ] `/pages/legal/privacy.vue` が正常に表示される
- [ ] `/pages/legal/terms.vue` が正常に表示される
- [ ] ContactFormのプライバシーポリシーリンクが404にならない
- [ ] 全CTAの時間表記が統一されている
- [ ] 社会的証明セクションに注釈が追加されている

### Phase 2 完了条件
- [ ] フォーム送信後、サンクスページに遷移する
- [ ] 製品カードから製品LPに遷移できる
- [ ] 製品LPからHP#contactに誘導される

### Phase 3 完了条件
- [ ] メディア向けページが公開されている
- [ ] 創業ストーリーが公開されている
- [ ] 最低1件の実名事例が掲載されている

---

## 📚 参照ドキュメント

- `docs/ssot/IYASAKA_2026_MASTER_STRATEGY.md` - 戦略マスター
- `docs/ssot/BRAND_MASTER_PROTOCOL.md` - ブランドガイドライン
- `docs/ssot/LEAD_CAPTURE_PROTOCOL.md` - リード獲得技術プロトコル
- `docs/MARKETING_REQUIREMENTS.md` - マーケティング要件書
- `app/data/team.ts` - チームデータ（会社ページ実装時に使用）

---

**作成完了**: 2026年1月2日  
**次のアクション**: Phase 1 の緊急対応から着手してください



