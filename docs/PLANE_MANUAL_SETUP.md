# IYASAKA Plane手動セットアップガイド

**所要時間**: 15〜20分  
**URL**: https://plane.arrowsworks.com

---

## 📝 ステップ1: プロジェクト作成（3分）

1. https://plane.arrowsworks.com にアクセス
2. **「+ New Project」** または **「新規プロジェクト」** をクリック
3. 以下を入力：
   - **Name**: `IYASAKA Web Renewal`
   - **Identifier**: `IYASAKA`
   - **Description**: `不を解消し、事業を"弥栄"へ。統括パートナーサイト構築`
   - **Network**: `Private`
4. **「Create Project」** をクリック

---

## 🏷️ ステップ2: ラベル作成（5分）

プロジェクト内で **「Settings」→「Labels」** に移動し、以下を作成：

| ラベル名 | 色 | 説明 |
|---------|-----|------|
| `critical-path` | 🔴 赤 (#EF4444) | Critical Path上の最優先タスク |
| `frontend` | 🔵 青 (#3B82F6) | フロントエンド実装 |
| `backend` | 🟢 緑 (#10B981) | バックエンド/API |
| `content` | 🟡 黄 (#F59E0B) | コンテンツ作成 |
| `seo` | 🟣 紫 (#8B5CF6) | SEO関連 |
| `security` | 🟠 オレンジ (#F97316) | セキュリティ |
| `design` | 🩷 ピンク (#EC4899) | デザイン |
| `docs` | ⚫ グレー (#6B7280) | ドキュメント |

---

## 📦 ステップ3: モジュール作成（3分）

**「Modules」** タブで以下を作成：

### Module 1: Phase A - 基盤・規格
- **Name**: `Phase A: 基盤・規格`
- **Description**: `外側（規格・要件）`
- **Start Date**: 今日
- **Target Date**: +1週間

### Module 2: Phase B - Layout
- **Name**: `Phase B: Layout`
- **Description**: `共通レイアウト構築`
- **Start Date**: +1週間
- **Target Date**: +2週間

### Module 3: Phase B - Pages
- **Name**: `Phase B: Pages`
- **Description**: `ページ実装`
- **Start Date**: +1週間
- **Target Date**: +3週間

### Module 4: Phase C - Integration
- **Name**: `Phase C: Integration`
- **Description**: `API連携・フォーム`
- **Start Date**: +3週間
- **Target Date**: +5週間

### Module 5: Phase C - Optimization
- **Name**: `Phase C: Optimization`
- **Description**: `SEO・パフォーマンス`
- **Start Date**: +4週間
- **Target Date**: +5週間

### Module 6: Phase D - Release
- **Name**: `Phase D: Release`
- **Description**: `QA・デプロイ・DNS`
- **Start Date**: +5週間
- **Target Date**: +6週間

---

## 🎯 ステップ4: Critical Pathイシュー作成（10分）

**「Issues」** タブで **「New Issue」** をクリックし、以下を順次作成：

### [CP1] B1: 共通レイアウト構築
```
Priority: 🔴 Urgent
Labels: critical-path, frontend
Module: Phase B: Layout

Description:
Header/Footer/Mobile Menu/固定CTA実装

詳細SSOT: docs/ssot/B1-layout.md

チェックリスト:
□ Header.vue
□ Footer.vue
□ HeaderMobile.vue
□ FooterCta.vue
□ layouts/default.vue

優先度: Critical Path #1 - すべてのページの基盤
```

### [CP2] B2: Homeページ実装
```
Priority: 🔴 Urgent
Labels: critical-path, frontend, content
Module: Phase B: Pages

Description:
Hero/サービスカード5種/事例3件/FAQ

詳細SSOT: docs/ssot/B2-home.md (作成予定)

チェックリスト:
□ Hero（USP 3パターン）
□ サービスカード（AI/弱電/OPS/MEDIA/AGRI）
□ 導入事例3件
□ FAQ 5-7問

優先度: Critical Path #2 - ファーストインプレッション
```

### [CP3] B5+C1: お問い合わせ＆フォームAPI
```
Priority: 🔴 Urgent
Labels: critical-path, frontend, backend
Module: Phase C: Integration

Description:
お問い合わせページUI + バックエンドAPI実装

詳細SSOT:
- docs/ssot/B5-other-pages.md (作成予定)
- docs/ssot/C1-form-crm.md (作成予定)

チェックリスト:
□ /contact ページUI
□ /server/api/contact.post.ts
□ Slack通知（#lead）
□ Notion DB連携
□ Cloudflare Turnstile

優先度: Critical Path #3 - リード獲得の要
```

### [CP4] B3: サービスページ5種
```
Priority: 🔥 High
Labels: critical-path, frontend, content
Module: Phase B: Pages

Description:
弱電工事/オンサイト保守/ホテルDX/AI導入/動画配信

詳細SSOT: docs/ssot/B3-services.md (作成予定)

チェックリスト:
□ /services/low-voltage
□ /services/maintenance
□ /services/hotel
□ /services/ai-dx
□ /services/media

優先度: Critical Path #4 - コンバージョン設計
```

### [CP5] C2: SEO・構造化データ
```
Priority: 🔥 High
Labels: critical-path, seo
Module: Phase C: Optimization

Description:
JSON-LD/OGP/サイトマップ/robots.txt

詳細SSOT: docs/ssot/C2-seo.md (作成予定)

チェックリスト:
□ JSON-LD（Organization/LocalBusiness）
□ FAQスキーマ
□ OGP設定
□ サイトマップXML
□ robots.txt

優先度: Critical Path #5 - 検索流入確保
```

---

## 🎨 ステップ5: その他イシュー作成（オプション）

余裕があれば以下も作成：

### A3: 法務ページ実装
```
Priority: High
Labels: frontend, docs
Module: Phase A: 基盤・規格

Description:
/privacy /external-transmission /cookies /terms

チェックリスト:
□ プライバシーポリシー
□ 外部送信規律
□ Cookie取扱い
□ 利用規約
□ フッターリンク追加
```

### B4: 導入事例3件
```
Priority: Medium
Labels: frontend, content
Module: Phase B: Pages

Description:
事例テンプレート + 事例#1-3作成

チェックリスト:
□ 事例テンプレート設計
□ 事例#1: ホテル弱電保守
□ 事例#2: 店舗防犯カメラ
□ 事例#3: 配信システム
□ /cases/[slug] 動的ルート
```

### その他
- B5: その他ページ（料金/会社/フロー等）
- C3: セキュリティヘッダ・CSP
- C4: Plausible解析導入
- C5: パフォーマンス最適化
- C6: アクセシビリティ対応
- D1: Go-Live QA
- D2: Vercelデプロイ

---

## 📊 ステップ6: ビュー設定（2分）

### カンバンボード設定
1. **「Board」** ビューに切り替え
2. 列を以下に設定：
   - Backlog
   - Todo
   - In Progress
   - Review
   - Done
3. グループ化: **Priority** または **Module**

### リストビュー設定
1. **「List」** ビューに切り替え
2. ソート: **Priority** → **Due Date**
3. フィルター: **Labels** で `critical-path` を選択

---

## ✅ セットアップ完了チェック

- [x] プロジェクト「IYASAKA」作成
- [x] ラベル8種類作成
- [x] モジュール6個作成
- [x] Critical Pathイシュー5個作成（[CP1]〜[CP5]）
- [x] ボードビュー確認
- [x] リストビューで `critical-path` フィルタ確認

---

## 🚀 次のアクション

1. **[CP1] レイアウト** から実装開始
2. イシューを **Todo** → **In Progress** に移動
3. `docs/ssot/B1-layout.md` を参照して実装
4. 完了したら **Done** に移動、次のCritical Pathへ

---

## 💡 Plane活用Tips

### デイリーワークフロー
- 朝: `critical-path` ラベルで今日のタスク確認
- 作業開始: イシューを **In Progress** に
- 完了: チェックリストを更新 → **Done** に移動

### コメント活用
- 実装中の気づき・メモ
- 詰まった箇所の記録
- レビュー依頼

### リンク活用
- イシューに関連SSOTへのリンク
- 実装ファイルへのGitHubリンク（将来）
- 参考URLの記録

---

**準備完了！Critical Path #1の実装を開始しましょう！** 🚀



