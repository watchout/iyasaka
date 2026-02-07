# IYASAKA LP構造仕様書
**作成日**: 2026-01-12  
**作成者**: マーケティング担当AI  
**対象**: 設計AI・開発AI全員  
**ステータス**: SSOT（Single Source of Truth）

---

## 🎯 目的

IYASAKA HPの**LP構造とマーケティング導線**を明確化し、AI間の認識齟齬を防止する。

---

## 📊 LP構造（2層構造）

### レイヤー1: 業種別LP（メイン導線）

| パス | 業種 | 中心製品 | キーメッセージ |
|------|------|----------|----------------|
| `/hotel/` | ホテル・旅館 | OmotenasuAI + ミエルプラス | 深夜対応の孤独を解決 |
| `/genba/` | 建設・製造・物流 | ミエルプラス + 弱電プラス | 現場の「今」を見える化 |
| `/venue/` | 貸会議室・イベント | 配信プラス + 弱電プラス | JV型で投資リスクゼロ |
| `/infra/` | オフィス・施設 | 弱電プラス + AIプラス | 弱電のかかりつけ医 |

**特徴**:
- 業種の**深層ペイン（経営者の孤独）**を訴求
- 複数製品の**組み合わせ提案**
- 業種特化の**FAQ・導入効果**

---

### レイヤー2: 製品ページ（サブ導線）

| パス | 製品名 | 役割 |
|------|--------|------|
| `/products/mieru-plus` | ミエルプラス | 製品詳細・仕様・FAQ |
| `/products/jakuden-plus` | 弱電プラス | 製品詳細・仕様・FAQ |
| `/products/haishin-plus` | 配信プラス | 製品詳細・仕様・FAQ |
| `/products/omotenasu-ai` | OmotenasuAI | 製品詳細・仕様・FAQ |
| `/products/ai-plus` | AIプラス | 製品詳細・仕様・FAQ |

**特徴**:
- 業種LPから「詳細を知りたい人」が遷移
- 製品単体の**技術仕様・料金・FAQ**を詳述
- 最終CTAは**HP#contact**に誘導

---

## 🔀 導線設計

```
ユーザー
    │
    ├─【検索流入】→ 業種LP（/hotel/ 等）→ 問い合わせ
    │                    ↓
    │              詳細知りたい → 製品ページ → 問い合わせ
    │
    ├─【直接流入】→ TOP（/）
    │                ↓
    │          診断（/diagnosis/）
    │                ↓
    │          業種選択 → ペイン選択 → 緊急度
    │                ↓
    │          結果ページ → 業種LP or 問い合わせ
    │
    └─【指名検索】→ 製品ページ → 問い合わせ
```

---

## 📝 ナビゲーション仕様

### ヘッダー「ソリューション」ドロップダウン

```
ソリューション
├── 🏢 業種で選ぶ
│   ├── ホテル・旅館        → /hotel/
│   ├── 建設・製造・物流    → /genba/
│   ├── 貸会議室・イベント  → /venue/
│   └── オフィス・施設      → /infra/
│
└── 📦 製品一覧
    ├── ミエルプラス    → /products/mieru-plus
    ├── 弱電プラス      → /products/jakuden-plus
    ├── 配信プラス      → /products/haishin-plus
    ├── OmotenasuAI     → /products/omotenasu-ai
    └── AIプラス        → /products/ai-plus
```

---

## 📐 各LPの必須セクション

### 業種別LP（/hotel/, /genba/, /venue/, /infra/）

1. **ヒーロー**: 業種特化のペイン訴求コピー + 主CTA
2. **共感セクション**: 「こんなお悩みありませんか？」4項目
3. **ソリューション**: 2製品の組み合わせ提案
4. **導入効果**: 3つの数値（出典注釈付き）
5. **FAQ**: 5項目
6. **CTA**: 問い合わせ誘導（#contact）

### 製品ページ（/products/[slug]）

1. **ヒーロー**: 製品名 + strongestPain + 主CTA
2. **課題解決**: commonPains リスト
3. **ソリューション**: solution + solutionDetail
4. **導入効果**: keyResult
5. **導入情報**: timeline, pricing, requirements
6. **差別化**: competitorWeakness vs ourDifference
7. **FAQ**: 製品固有のFAQ
8. **業種LP誘導**: 「業種別の詳しい解決策」リンク
9. **CTA**: 問い合わせ誘導（#contact）

---

## 🔗 リンク規則

| リンク先 | 正しいパス | 注意 |
|----------|------------|------|
| 問い合わせ | `/#contact?product=xxx` | パラメータでフォーム初期値設定 |
| 業種LP | `/hotel/`, `/genba/` 等 | 末尾スラッシュあり |
| 製品ページ | `/products/mieru-plus` 等 | 末尾スラッシュなし |
| 診断 | `/diagnosis/` | 末尾スラッシュあり |

---

## ⚠️ 禁止事項

1. **製品ページを単独のCVR地点にしない**  
   → 必ず `/#contact` に誘導

2. **業種LPと製品ページの内容を重複させない**  
   → 業種LP=ペイン訴求、製品=仕様詳細

3. **数値を出典なしで掲載しない**  
   → 「※ 導入企業へのヒアリング結果に基づく平均値です」を必ず付記

4. **旧パス `/contact?p_id=xxx` を使わない**  
   → 新パス `/#contact?product=xxx` に統一

---

## 📁 ファイル構成

```
pages/
├── index.vue              # トップページ（8セクション構成）
├── hotel/
│   └── index.vue          # ホテル業種LP
├── genba/
│   └── index.vue          # 建設・製造・物流LP
├── venue/
│   └── index.vue          # 貸会議室LP
├── infra/
│   └── index.vue          # オフィス・施設LP
├── products/
│   └── [slug].vue         # 製品詳細ページ（動的ルート）
├── diagnosis/
│   ├── index.vue          # 業種ベース診断
│   └── result.vue         # 診断結果
├── company/
│   └── index.vue          # 会社情報
└── legal/
    ├── privacy.vue        # プライバシーポリシー
    ├── terms.vue          # 利用規約
    └── external-transmission.vue  # 外部送信規律
```

---

## 🔄 データソース

| データ | ファイル | 用途 |
|--------|----------|------|
| 製品情報 | `app/data/products.ts` | 製品ページ、業種LP内製品カード |
| ナビゲーション | `app/navigation.ts` | ヘッダー、フッター |
| 会社情報 | `app/data/team.ts` | 会社ページ |
| 深層ペイン | `docs/ssot/PRODUCT_PAIN_POINTS.md` | LP作成時の参照 |

---

## ✅ チェックリスト（新LP作成時）

- [ ] 業種の深層ペインを `PRODUCT_PAIN_POINTS.md` から参照
- [ ] ヒーローコピーは「経営者の孤独」を訴求
- [ ] 数値には必ず出典注釈
- [ ] CTAは `/#contact?product=xxx` 形式
- [ ] 製品詳細は製品ページにリンク（LP内で詳述しない）
- [ ] モバイル表示を確認

---

**この仕様書は全AI担当者の共通認識として扱ってください。**
