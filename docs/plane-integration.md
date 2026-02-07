# IYASAKA x Plane連携実装

## 🔗 接続情報

- **PlaneURL**: https://plane.arrowsworks.com
- **プロジェクト**: IYASAKA Web Renewal
- **連携方法**: Plane API

---

## 📊 自動作成する構造

### 1. プロジェクト: IYASAKA
- 識別子: `IYASAKA`
- 説明: 不を解消し、事業を"弥栄"へ。統括パートナーサイト構築

### 2. Cycles（6週間スプリント）
- Sprint 1 (W1): Phase A - 基盤・法務
- Sprint 2-3 (W2-3): Phase B - コンテンツ実装
- Sprint 4-5 (W4-5): Phase C - 最適化
- Sprint 6 (W6): Phase D - リリース

### 3. Modules
- Module A: 基盤・規格
- Module B-Layout: 共通レイアウト
- Module B-Pages: ページ実装
- Module C-Integration: API連携
- Module C-Optimization: 最適化
- Module D: リリース

### 4. Labels
- critical-path (赤)
- frontend (青)
- backend (緑)
- content (黄)
- seo (紫)
- security (オレンジ)

---

## 🎯 ROADMAPからのイシュー生成

### Phase A: 外側（規格・要件）

**A1. プロジェクト基盤** ✅ 完了
- [x] Nuxt 3初期化
- [x] モジュール導入
- [x] ディレクトリ構造

**A2. ブランド基調** ✅ 完了  
- [x] 日本の伝統色定義
- [x] タイポグラフィ設定

**A3. 法務ページ** 🔴 Critical
- [ ] /privacy
- [ ] /external-transmission
- [ ] /cookies
- [ ] /terms

**A4. サイトマップ確定** 🔴 Critical
- [ ] URL設計
- [ ] 内部リンク構造

### Phase B: 内側（コンテンツ）

**B1. レイアウト** 🔴 Critical Path #1
- [ ] Header.vue
- [ ] Footer.vue
- [ ] HeaderMobile.vue
- [ ] FooterCta.vue
- [ ] layouts/default.vue

**B2. Homeページ** 🔴 Critical Path #2
- [ ] Hero（USP 3パターン）
- [ ] サービスカード5種
- [ ] 導入事例3件
- [ ] FAQ 5-7問

**B3. サービスページ** 🔴 Critical Path #4
- [ ] /services/low-voltage
- [ ] /services/maintenance
- [ ] /services/hotel
- [ ] /services/ai-dx
- [ ] /services/media

**B4. 導入事例**
- [ ] 事例テンプレート
- [ ] 事例#1-3作成
- [ ] /cases/[slug]

**B5. その他ページ**
- [ ] /contact 🔴 Critical Path #3
- [ ] /pricing
- [ ] /flow
- [ ] /company
- [ ] /downloads
- [ ] /blog

### Phase C: 実装（開発）

**C1. フォームAPI** 🔴 Critical Path #3
- [ ] contact.post.ts
- [ ] Slack連携
- [ ] Notion連携
- [ ] Turnstile導入

**C2. SEO** 🔴 Critical Path #5
- [ ] JSON-LD
- [ ] OGP
- [ ] サイトマップXML

**C3. セキュリティ**
- [ ] セキュリティヘッダ
- [ ] CSP設定
- [ ] レート制限

**C4. 解析**
- [ ] Plausible導入
- [ ] イベント設定
- [ ] /thanks

**C5. パフォーマンス**
- [ ] 画像最適化
- [ ] Lighthouse 95+

**C6. アクセシビリティ**
- [ ] JIS X 8341-3 AA
- [ ] コントラスト確認

### Phase D: リリース

**D1. Go-Live**
- [ ] 全ページQA
- [ ] フォームテスト

**D2. デプロイ**
- [ ] Vercel設定
- [ ] 本番デプロイ

**D3. DNS移行**
- [ ] 301リダイレクト
- [ ] GBP更新

---

## 🚀 次のステップ

1. Planeにログイン
2. IYASAKAプロジェクト作成
3. 上記構造を手動またはAPI経由で作成
4. Cursor実装時にPlaneイシューを参照

---
