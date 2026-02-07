# Plane x Cursor 完璧ワークフロー

**目的**: Plane APIが制限されている環境で、手動Plane + Cursor自動化を組み合わせた最適なワークフロー

---

## 🎯 ハイブリッドアプローチ

### Phase 1: Plane手動セットアップ（15分・1回のみ）
→ `docs/PLANE_MANUAL_SETUP.md` 参照

### Phase 2: Cursor自動実装 + Planeトラッキング（継続）
→ このワークフロー

---

## 📋 デイリーワークフロー

### 朝（5分）

1. **Planeでタスク確認**
   - https://plane.arrowsworks.com/IYASAKA にアクセス
   - `critical-path` ラベルでフィルタ
   - 今日実装するイシューを **Todo** → **In Progress** に移動

2. **詳細SSOTを確認**
   ```bash
   # 例: [CP1] レイアウト実装
   cat docs/ssot/B1-layout.md
   ```

3. **Cursor実装プロンプトをコピー**
   - SSOTの最後にある「Cursor実装プロンプト」セクション

---

### 実装中（2〜4時間）

#### ステップ1: Cursor Composerで一括実装

1. **Cursor Composer（Cmd/Ctrl + I）を開く**

2. **SSOTのプロンプトを貼り付け**
   ```
   【目的】IYASAKA Webサイトの共通レイアウトを実装
   【対象ファイル】
   - layouts/default.vue
   - components/Header.vue
   ...
   
   【要件】
   1. ヘッダー: ...
   2. フッター: ...
   ...
   ```

3. **Cursorが自動生成 → レビュー → Accept**

4. **動作確認**
   ```bash
   cd /home/arrowsworks/iyasaka
   npm run dev
   # http://localhost:4100 でブラウザ確認
   ```

#### ステップ2: Planeチェックリスト更新

1. Planeイシューを開く
2. 完了した項目にチェック
   - ✅ Header.vue
   - ✅ Footer.vue
   - ✅ ...

3. 実装メモをコメント追加
   ```
   Header実装完了
   - ロゴ: テキストベース
   - ナビ: ドロップダウン機能実装
   - モバイルメニュー: スライドイン動作確認済み
   
   次: Footer実装
   ```

#### ステップ3: コミット（Git連携）

```bash
cd /home/arrowsworks/iyasaka
git add .
git commit -m "[IYASAKA-1] B1: 共通レイアウト実装

- Header.vue: ロゴ/ナビ/CTA実装
- Footer.vue: 4カラムグリッド実装
- HeaderMobile.vue: スライドメニュー実装

Ref: https://plane.arrowsworks.com/.../issues/IYASAKA-1"
```

---

### 完了時（5分）

1. **Planeでステータス変更**
   - **In Progress** → **Review** または **Done**

2. **次のCritical Pathイシューを確認**
   - [CP1] → [CP2] → [CP3] → ...

3. **進捗レポート（週1回）**
   ```markdown
   ## 週次進捗レポート（W1）
   
   ### 完了
   - [CP1] B1: レイアウト実装 ✅
   - [CP2] B2: Home 50% 🔄
   
   ### 課題
   - Hero USP A/B/Cテストの実装方法検討
   
   ### 次週
   - [CP2] Home完了
   - [CP3] フォームAPI着手
   ```

---

## 🔧 便利スクリプト

### 1. 詳細SSOTクイック表示

```bash
# ~/iyasaka-ssot エイリアス作成
echo 'alias iyasaka-ssot="cat /home/arrowsworks/iyasaka/docs/ssot/\$1.md | less"' >> ~/.bashrc
source ~/.bashrc

# 使用例
iyasaka-ssot B1-layout
iyasaka-ssot B2-home
```

### 2. Plane URLクイック開き

```bash
# ~/iyasaka-plane エイリアス
echo 'alias iyasaka-plane="xdg-open https://plane.arrowsworks.com/IYASAKA/issues"' >> ~/.bashrc
source ~/.bashrc

# 使用例
iyasaka-plane
```

### 3. 開発サーバー起動

```bash
# ~/iyasaka-dev エイリアス
echo 'alias iyasaka-dev="cd /home/arrowsworks/iyasaka && npm run dev"' >> ~/.bashrc
source ~/.bashrc

# 使用例
iyasaka-dev
```

---

## 📊 Planeビュー設定

### カンバンボード（デイリー使用）

1. **Board View** を開く
2. **Group by: Priority**
3. **Filter: critical-path ラベル**
4. ドラッグ&ドロップでステータス変更

### リストビュー（週次レビュー）

1. **List View** を開く
2. **Sort: Priority → Due Date**
3. **Filter: Module = Phase B**
4. 完了率を確認

### ガントチャート（マイルストーン管理）

1. **Gantt View** を開く
2. **6週間のタイムライン**
3. Critical Path依存関係を確認
4. 遅延リスクを早期発見

---

## 🎨 Cursor実装Tips

### 1. 複数ファイルを一度に生成

```
【Cursorに指示】
以下のコンポーネントを一括生成:
1. components/Header.vue
2. components/Footer.vue
3. components/HeaderMobile.vue
4. layouts/default.vue

各ファイルの仕様は docs/ssot/B1-layout.md を参照
```

### 2. 既存コードの改善

```
【Cursorに指示】
Header.vueのアクセシビリティを改善:
- aria-label追加
- キーボード操作対応
- focus:ring-2 適用
```

### 3. テストコード生成

```
【Cursorに指示】
Header.vueのVitest単体テストを生成:
- ロゴリンククリックテスト
- モバイルメニュー開閉テスト
- ナビゲーションリンク存在確認
```

---

## 📈 進捗トラッキング

### Planeダッシュボード設定

1. **「Dashboard」** タブを開く
2. ウィジェット追加:
   - **Issues by Priority** - Critical Path進捗
   - **Issues by State** - フェーズ別状況
   - **Completed Issues** - 完了数推移
   - **Pending Issues** - ボトルネック確認

### KPIトラッキング（週次）

```markdown
## Phase B進捗（W2）

| Module | 計画 | 完了 | 進捗率 |
|--------|------|------|--------|
| Layout | 5 | 5 | 100% ✅ |
| Pages  | 12 | 7 | 58% 🔄 |
| 合計   | 17 | 12 | 71% |

**Critical Path**: On Track ✅
**リスク**: なし
**次週目標**: Pages完了（+5イシュー）
```

---

## 🚀 Phase完了チェックリスト

### Phase A完了時
- [ ] 全イシュー **Done**
- [ ] 法務ページ動作確認
- [ ] サイトマップ確定
- [ ] Planeで Phase A Moduleを **Completed**
- [ ] 週次レポート作成

### Phase B完了時
- [ ] 全ページレスポンシブ確認（SP/PC）
- [ ] レイアウト一貫性チェック
- [ ] コンテンツ誤字脱字確認
- [ ] 内部リンク動作確認
- [ ] Lighthouse基本スコア確認
- [ ] Planeで Phase B Modulesを **Completed**
- [ ] フェーズレポート作成

### Phase C完了時
- [ ] フォーム送信テスト（本番環境）
- [ ] SEO全項目チェック
- [ ] セキュリティヘッダ確認
- [ ] Lighthouse 95+ 達成
- [ ] アクセシビリティAA準拠
- [ ] Planeで Phase C Modulesを **Completed**
- [ ] リリース準備完了

---

## 💡 効率化Tips

### 1. SSOTテンプレート活用

新しいページ追加時：
```bash
cp docs/ssot/B2-home.md docs/ssot/B3-services.md
# 編集してCursorに投げる
```

### 2. Plane定型コメント

```
✅ 実装完了
- 動作確認済み
- レスポンシブ対応済み
- アクセシビリティ考慮済み

📝 次タスク: [CP2] Home実装
```

### 3. Cursor履歴を活用

Cursorの「Chat History」から過去の成功パターンを再利用

---

## 🎯 Critical Path実装順序

```
Week 1: [CP1] Layout ✅
Week 2: [CP2] Home → [CP3] Contact+Form
Week 3: [CP4] Services (5ページ)
Week 4: [CP5] SEO
Week 5: 最適化・QA
Week 6: リリース
```

---

**このワークフローで、Plane手動管理 + Cursor自動実装の完璧なハイブリッドが実現します！** 🚀



