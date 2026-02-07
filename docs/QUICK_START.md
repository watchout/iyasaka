# IYASAKA Web開発 クイックスタート

**今すぐ始める3ステップ** ⚡

---

## ステップ1: Planeセットアップ（15分）

### A. プロジェクト作成
1. https://plane.arrowsworks.com を開く
2. **「+ New Project」**
3. 入力:
   - Name: `IYASAKA Web Renewal`
   - Identifier: `IYASAKA`
   - Description: `不を解消し、事業を"弥栄"へ`
4. **Create**

### B. ラベル作成（コピペで5分）
**Settings → Labels** で以下を順番にコピペ:

```
critical-path | #EF4444 | Critical Path上の最優先タスク
frontend | #3B82F6 | フロントエンド実装
backend | #10B981 | バックエンド/API
content | #F59E0B | コンテンツ作成
seo | #8B5CF6 | SEO関連
security | #F97316 | セキュリティ
design | #EC4899 | デザイン
docs | #6B7280 | ドキュメント
```

### C. Critical Pathイシュー5個作成

#### [CP1] B1: レイアウト構築
```
Priority: Urgent
Labels: critical-path, frontend

Header/Footer/Mobile Menu実装
詳細: docs/ssot/B1-layout.md

□ Header.vue
□ Footer.vue
□ HeaderMobile.vue
□ FooterCta.vue
□ layouts/default.vue
```

#### [CP2] B2: Homeページ
```
Priority: Urgent
Labels: critical-path, frontend, content

Hero/サービスカード/事例/FAQ
詳細: docs/ssot/B2-home.md (作成予定)

□ Hero（USP 3パターン）
□ サービスカード5種
□ 導入事例3件
□ FAQ 5-7問
```

#### [CP3] お問い合わせ＆API
```
Priority: Urgent
Labels: critical-path, frontend, backend

/contact + フォームAPI

□ /contact ページUI
□ /server/api/contact.post.ts
□ Slack通知
□ Notion連携
□ Turnstile導入
```

#### [CP4] サービスページ5種
```
Priority: High
Labels: critical-path, frontend, content

弱電/保守/ホテル/AI/動画

□ /services/low-voltage
□ /services/maintenance
□ /services/hotel
□ /services/ai-dx
□ /services/media
```

#### [CP5] SEO・構造化データ
```
Priority: High
Labels: critical-path, seo

JSON-LD/OGP/サイトマップ

□ JSON-LD
□ FAQスキーマ
□ OGP設定
□ サイトマップXML
□ robots.txt
```

---

## ステップ2: 開発環境起動（1分）

```bash
cd /home/arrowsworks/iyasaka
npm run dev
```

→ http://localhost:4100 で確認

---

## ステップ3: [CP1]レイアウト実装開始（30分）

### A. SSOTを確認
```bash
cat docs/ssot/B1-layout.md
```

### B. Cursor Composerで実装

1. **Cmd/Ctrl + I** でComposer開く

2. **以下をコピペ**:
```
【目的】IYASAKA Webサイトの共通レイアウトを実装
【対象ファイル】
- layouts/default.vue
- components/Header.vue
- components/HeaderNav.vue
- components/HeaderMobile.vue
- components/Footer.vue
- components/FooterCta.vue

【要件】
1. ヘッダー:
   - 固定ヘッダー（bg-white/95, backdrop-blur）
   - ロゴ「IYASAKA」+ サブテキスト「いやさか - 統括パートナー」
   - PCナビ: Home/サービス(ドロップダウン)/事例/料金/会社/ブログ
   - CTA: お問い合わせ(btn-primary)/資料DL(btn-secondary)
   - モバイル: ハンバーガーメニュー

2. フッター:
   - 4カラム: 企業情報/サービス/会社案内/インパクト
   - NAP: 〒344-0038 埼玉県春日部市下蛭田422-5, TEL: 048-872-6822
   - 法務リンク: プライバシー/外部送信/Cookie/利用規約/サイトマップ
   - bg-sumi, text-white

3. 固定CTA:
   - PC: 右下固定(z-40)
   - モバイル: 下部固定バー
   - ボタン: 📞問合せ | 📄資料

4. アクセシビリティ:
   - nav aria-label
   - キーボード操作対応
   - focus:ring-2 focus:ring-matsuha

5. カラー:
   - matsuha(#2F6F4F), sumi(#1E1E1E), shu(#EB6101), kinari(#F4F1EA)

【出力】
全コンポーネント実装 + 動作確認方法
```

3. **Accept** → ブラウザで確認

### C. Planeで進捗更新

1. Plane [CP1]イシューを開く
2. チェックリストに✅
3. **Todo** → **In Progress** → **Done**

---

## 🎯 今後の流れ

```
Week 1: [CP1] Layout ← 今ここ！
Week 2: [CP2] Home → [CP3] Contact+Form
Week 3: [CP4] Services
Week 4: [CP5] SEO
Week 5: 最適化
Week 6: リリース
```

---

## 📚 参考ドキュメント

- **全体ロードマップ**: `docs/ROADMAP.md`
- **Plane完全ガイド**: `docs/PLANE_MANUAL_SETUP.md`
- **Cursor連携ワークフロー**: `docs/PLANE_CURSOR_WORKFLOW.md`
- **B1レイアウト詳細**: `docs/ssot/B1-layout.md`

---

**準備完了！今すぐ [CP1] の実装を開始しましょう！** 🚀
