# SSOT-2: UI State Design

> IYASAKA Webサイト UI状態設計書
> SSOT 3層: CONTRACT層

---

## 完全性チェックリスト

- [x] S2-A: ページ一覧とルーティングが定義されている
- [x] S2-B: レイアウト構造が定義されている
- [x] S2-C: コンポーネント階層が定義されている
- [x] S2-D: 状態管理パターンが定義されている
- [x] S2-E: フォーム状態とバリデーションが定義されている
- [x] S2-F: ストレージ戦略が定義されている

---

## 1. ページ一覧とルーティング

### 1.1 ルーティングマップ

| パス | ページ | レイアウト | 認証 | SEO |
|------|--------|----------|------|-----|
| `/` | トップページ | default | 不要 | index |
| `/about` | 会社概要 | default | 不要 | index |
| `/services` | サービス一覧 | default | 不要 | index |
| `/products/[slug]` | 製品詳細LP | default | 不要 | index |
| `/products/omotenasuai` | OmotenasuAI専用 | default | 不要 | index |
| `/contact` | 問い合わせ | minimal | 不要 | index |
| `/contact/thanks` | 送信完了 | minimal | 不要 | noindex |
| `/faq` | FAQ | default | 不要 | index |
| `/cases` | 導入事例一覧 | default | 不要 | index |
| `/cases/[slug]` | 事例詳細 | default | 不要 | index |
| `/news` | ニュース一覧 | default | 不要 | index |
| `/news/[slug]` | ニュース詳細 | default | 不要 | index |
| `/articles/[...slug]` | 記事詳細 | default | 不要 | index |
| `/diagnosis` | 診断フォーム | default | 不要 | noindex |
| `/diagnosis/result` | 診断結果 | default | 不要 | noindex |
| `/aiplus` | AIプラスLP | lp | 不要 | index |
| `/aiplus/[variant]` | A/Bテストバリアント | lp | 不要 | noindex |
| `/aiplus/shindan` | AI活用診断 | lp | 不要 | noindex |
| `/aiplus/shindan/result` | 診断結果 | lp | 不要 | noindex |
| `/company` | 会社概要（詳細） | default | 不要 | index |
| `/company/story` | 会社ストーリー | default | 不要 | index |
| `/hotel` | ホテル業界向け | default | 不要 | index |
| `/infra` | インフラ | default | 不要 | index |
| `/genba` | 現場向け | default | 不要 | index |
| `/venue` | 施設向け | default | 不要 | index |
| `/downloads` | 資料DL | default | 不要 | index |
| `/press` | プレス | default | 不要 | index |
| `/legal/terms` | 利用規約 | minimal | 不要 | noindex |
| `/legal/privacy` | プライバシー | minimal | 不要 | noindex |
| `/legal/external-transmission` | 外部送信 | minimal | 不要 | noindex |
| `/admin/marketing` | マーケ管理 | minimal | 任意 | noindex |
| `/admin/geo` | GEOターゲティング | minimal | 任意 | noindex |

### 1.2 レイアウト定義

| レイアウト | ファイル | 用途 | 特徴 |
|-----------|---------|------|------|
| `default` | `layouts/default.vue` | 通常ページ | Header + Footer + フルナビゲーション |
| `minimal` | `layouts/minimal.vue` | フォーム・法的ページ | 最小ヘッダー + フッター（ナビなし） |
| `lp` | `layouts/lp.vue` | ランディングページ | LP専用ヘッダー（CTA付き）+ 最小フッター |

---

## 2. コンポーネント階層

### 2.1 共通コンポーネント

```
components/
  Header.vue              -- メインヘッダー（default layout）
  HeaderNav.vue            -- ナビゲーション
  HeaderMobile.vue         -- モバイルハンバーガーメニュー
  Footer.vue               -- サイトフッター
  FooterCta.vue            -- フッターCTAバナー
```

### 2.2 UIコンポーネント

```
components/ui/
  CtaSection.vue           -- CTA共通セクション
  ScrollProgress.vue       -- スクロール進捗バー
  FlowStep.vue             -- フローステップ表示
```

### 2.3 フィーチャーコンポーネント

```
components/
  ContactForm.vue          -- 共通問い合わせフォーム（マルチステップ）
  LeadForm.vue             -- レガシーリードフォーム（後方互換）
  ChatWidget.vue           -- チャットウィジェット
  PainPoint.vue            -- ペインポイント表示カード
```

### 2.4 コンテンツコンポーネント

```
components/
  CaseCard.vue             -- 導入事例カード
  SolutionCard.vue         -- ソリューションカード
  TestimonialCard.vue      -- お客様の声カード
  ServiceCard.vue          -- サービスカード（トップ用）
  StatCounter.vue          -- アニメーション数値カウンター
  MediaLogoBar.vue         -- メディア掲載ロゴ
  RepresentativeProfile.vue -- メンバープロフィール
```

### 2.5 ドメイン別コンポーネント

```
components/home/
  Hero.vue                 -- トップページヒーロー
  NeoJapanesqueHero.vue    -- 代替ヒーロー（和モダン）
  ServicesSection.vue      -- サービス紹介セクション
  Stats.vue                -- 実績数値セクション
  CasesPreview.vue         -- 事例プレビュー
  Faq.vue                  -- FAQセクション
  ContactSection.vue       -- お問い合わせセクション

components/aiplus/
  LpBody.vue               -- AIプラスLP本体
  shindan/
    StepProgress.vue        -- 診断プログレスバー
    LoadingOverlay.vue      -- 診断中ローディング
    AnswerSummary.vue       -- 回答サマリーチップ
```

---

## 3. 状態管理パターン

### 3.1 アーキテクチャ方針

| 方針 | 詳細 |
|------|------|
| Pinia不使用 | 軽量なcomposableパターンで十分 |
| Reactive State | `reactive()` でオブジェクト、`ref()` でプリミティブ |
| Computed | バリデーション、派生値、推薦結果はcomputed |
| イミュータブル | 配列はスプレッドで更新、直接変更禁止 |
| SSRセーフ | `import.meta.client` ガードでブラウザAPI保護 |

### 3.2 Composable一覧

| ファイル | 責務 | 状態スコープ |
|---------|------|------------|
| `useLeadTracking.ts` | リードライフサイクル管理（UTM, p_id, 診断結果, ペイロード構築） | sessionStorage |
| `useAiplusShindan.ts` | AI活用診断フロー（7問回答、スコア計算、結果永続化） | sessionStorage |
| `useAnalytics.ts` | Plausible イベント送信 | なし（外部送信のみ） |
| `useABTest.ts` | A/Bテストバリアント管理 | localStorage |
| `useScrollAnimation.ts` | GSAP ScrollTriggerアニメーション | なし（DOM操作のみ） |
| `useFloatingCtaVisibility.ts` | フローティングCTA表示制御 | ref（メモリ内） |
| `useFeatureFlags.ts` | フィーチャーフラグ | runtimeConfig |
| `useSmoothScroll.ts` | スムーススクロール | なし |

### 3.3 リードトラッキングフロー

```
ランディング
  |
  v
recordLanding() -- sessionStorageにUTM/p_id/landing_page保存
  |
  v
ページ閲覧（pageViews++）
  |
  v
[診断 or 問い合わせ]
  |
  +-- 診断の場合 ---> saveDiagnosisResult() --> sessionStorage保存
  |                                              |
  |                                              v
  |                                    結果画面 --> CTA
  |                                              |
  +----------------------------------------------+
  |
  v
buildLeadPayload() -- フォームデータ + トラッキングデータ結合
  |
  v
POST /api/leads (or /api/aiplus-shindan)
  |
  v
メール通知 --> Phase 2でDB保存
```

---

## 4. フォーム状態定義

### 4.1 共通問い合わせフォーム（ContactForm.vue）

**ステップ構成**:

| Step | 内容 | 必須項目 |
|------|------|---------|
| 1 | 「不」の共感（ペイン選択） | painPoints[] (1つ以上) |
| 2 | 製品選択 | interestedProducts[] (1つ以上) |
| 3 | 連絡先 | name, email, company |
| 4 | 詳細 | managementMethod, companySize, expectations |
| 5 | 同意・送信 | privacyAgreed |

**型定義**: `app/types/leads.ts` の `ContactFormData`

### 4.2 AI活用診断フォーム（shindan）

**ステップ構成**:

| Step | 質問 | タイプ | 入力型 | 自動進行 |
|------|------|--------|--------|---------|
| Q1 | 業種 | 単一選択 | string | 300ms後 |
| Q2 | 従業員規模 | 単一選択 | string | 300ms後 |
| Q3 | 手作業タスク | 複数選択 | string[] | 手動（次へボタン） |
| Q4 | 月間作業時間 | 単一選択 | number | 300ms後 |
| Q5 | ペインポイント | 複数選択 | string[] | 手動（次へボタン） |
| Q6 | 改善目標 | 単一選択 | string | 300ms後 |
| Q7 | リード情報 | フォーム | object | 手動（送信ボタン） |

**型定義**: `app/types/aiplus-shindan.ts` の `ShindanAnswers`, `ShindanLeadData`

**スコア設計**: 全員60-85に収まる設計
- 60-69: やや高い（黄）
- 70-79: 高い（橙）
- 80-85: 非常に高い（赤）

### 4.3 バリデーション戦略

| レイヤー | 方法 | 適用箇所 |
|---------|------|---------|
| クライアント | computed (`canProceed`) | 各ステップの「次へ」ボタン活性化 |
| サーバー | Zod スキーマ | APIエンドポイントで入力検証 |
| スパム防止 | ハニーポット (`website` field) | フォーム送信時 |
| レート制限 | IP毎60秒 | APIエンドポイント |

---

## 5. ストレージ戦略

### 5.1 sessionStorage（タブスコープ）

| キー | 用途 | 保存タイミング | 消費タイミング |
|------|------|--------------|--------------|
| `iyasaka_aiplus_shindan` | 診断結果 | calculateResults() | result.vueのonMounted |
| `iyasaka_diagnosis_result` | 一般診断結果 | saveDiagnosisResult() | result.vue表示時 |
| `iyasaka_simple_diagnosis` | 簡易診断結果 | LP内診断完了時 | 問い合わせフォーム参照 |
| `iyasaka_landing_page` | 流入ページURL | recordLanding() | buildLeadPayload() |
| `iyasaka_session_start` | セッション開始時刻 | recordLanding() | timeToConversion算出 |
| `iyasaka_first_product` | 初回閲覧製品 | recordLanding() | buildLeadPayload() |
| `iyasaka_utm_params` | UTMパラメータ | recordLanding() | buildLeadPayload() |
| `iyasaka_page_views` | ページ閲覧数 | ページ遷移時 | buildLeadPayload() |

### 5.2 localStorage（永続）

| キー | 用途 | 保存タイミング |
|------|------|--------------|
| `ab_variant_[id]` | A/Bテストバリアント | 初回バリアント割り当て時 |

### 5.3 SSR安全ルール

```
全ストレージアクセスは以下のガードで保護:

if (import.meta.client) {
  // sessionStorage / localStorage 操作
}

onBeforeRouteLeave でのブラウザAPI:
if (import.meta.client) {
  window.confirm(...)  // SSRで未定義のため必須
}
```

---

## 6. アニメーション・インタラクション

### 6.1 GSAP ScrollTrigger

| エフェクト | 関数 | 用途 |
|-----------|------|------|
| fadeIn | `useScrollAnimation().fadeIn()` | セクション表示アニメーション |
| scaleIn | `useScrollAnimation().scaleIn()` | カード・画像のスケール表示 |
| parallax | `useScrollAnimation().parallax()` | 背景パララックス |
| splitText | `useScrollAnimation().splitText()` | テキスト文字送り |

### 6.2 フローティングCTA

| 状態 | 条件 |
|------|------|
| 非表示 | スクロール位置 < しきい値 |
| 表示 | スクロール位置 > しきい値 AND 上方向スクロール |
| 非表示 | 下方向スクロール中 |

### 6.3 診断フォームトランジション

| トランジション | 方向 | duration |
|-------------|------|----------|
| slide | 次の質問 -> 左スライド | CSS transition |
| slide-reverse | 前の質問 -> 右スライド | CSS transition |
| 自動進行 | 単一選択後 | 300ms delay |

---

## 7. データフロー図

### 7.1 製品データ

```
app/data/products.ts
  |
  +-- pages/products/[slug].vue      (動的ルーティング)
  +-- components/ServiceCard.vue     (トップページ)
  +-- components/home/ServicesSection.vue
  +-- composables/useLeadTracking.ts (p_id -> 製品マッピング)
```

### 7.2 ブランドデータ

```
app/data/brand.ts
  |
  +-- app/utils/ld.ts     (JSON-LD生成)
  +-- app/utils/seo.ts    (SEOメタ生成)
  +-- components/Footer.vue (会社情報)
```

### 7.3 AIプラス診断データ

```
app/data/aiplus-shindan.ts
  |
  +-- composables/useAiplusShindan.ts  (状態管理)
  |     |
  |     +-- pages/aiplus/shindan/index.vue  (フォームUI)
  |     +-- pages/aiplus/shindan/result.vue (結果表示)
  |
  +-- server/api/aiplus-shindan.post.ts (リード送信)
```

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 変更者 |
|------|-----------|---------|-------|
| 2026-02-12 | 1.0.0 | コードベースから抽出・初版作成 | Framework Discovery |
