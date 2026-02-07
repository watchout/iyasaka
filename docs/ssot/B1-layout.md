# B1. 共通レイアウト構築 SSOT

**優先度**: 🔴 Critical Path #1  
**実装目標**: 2日以内  
**依存**: A1, A2（完了済み）

---

## 📐 レイアウト構成

```
layouts/
├── default.vue          # デフォルトレイアウト
└── minimal.vue          # シンプルレイアウト（法務ページ用）

components/
├── Header.vue           # ヘッダーコンポーネント
├── HeaderNav.vue        # ナビゲーション
├── HeaderMobile.vue     # モバイルメニュー
├── Footer.vue           # フッターコンポーネント
└── FooterCta.vue        # フッター固定CTA
```

---

## 🎨 ヘッダー仕様

### 構成要素
1. **ロゴ** (左)
   - テキスト: "IYASAKA"
   - サブテキスト: "いやさか - 統括パートナー"
   - リンク: `/`
   - サイズ: デスクトップ h-12, モバイル h-10

2. **ナビゲーション** (中央〜右)
   - Home
   - サービス（ドロップダウン）
     - 弱電工事
     - オンサイト保守
     - ホテルDX
     - AI導入支援
     - 動画・配信
     - 農業・地域
   - 事例
   - 料金
   - 会社情報
   - ブログ
   
3. **CTA** (右端)
   - 📞 お問い合わせ (btn-primary)
   - 📄 資料DL (btn-secondary)

### レスポンシブ
- **PC (≥1024px)**: 横並びナビ
- **タブレット (768-1023px)**: 横並び、CTAアイコンのみ
- **モバイル (<768px)**: ハンバーガーメニュー

### スタイル
```vue
<header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-matsuha/20 shadow-sm">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16 md:h-20">
      <!-- ロゴ -->
      <!-- ナビ -->
      <!-- CTA -->
    </div>
  </div>
</header>
```

### アクセシビリティ
- `<nav>` タグ使用
- `aria-label="メインナビゲーション"`
- モバイルメニュー: `aria-expanded="false"` 初期値
- キーボード操作: Tab/Enter/Esc対応
- フォーカス可視: `focus:ring-2 focus:ring-matsuha`

---

## 🎨 フッター仕様

### 構成要素

#### セクション1: 企業情報 (左)
```
IYASAKA（arrowsworks）
不を解消し、事業を"弥栄"へ。

〒344-0038
埼玉県春日部市下蛭田422-5
TEL: 048-872-6822
営業時間: 9:00-18:00（土日祝休）
```

#### セクション2: サービス (中央左)
- 弱電工事
- オンサイト保守
- ホテルDX
- AI導入支援
- 動画・配信
- 農業・地域

#### セクション3: 会社案内 (中央右)
- 会社概要
- 事例
- 料金
- ご利用の流れ
- ブログ
- お問い合わせ

#### セクション4: インパクト (右)
- SAKAE Index
- 人と地域の物語
- 倫理・安全方針
- 資料ダウンロード

### 法務リンク (最下部)
```
プライバシーポリシー | 外部送信規律 | Cookie取扱い | 利用規約 | サイトマップ
© 2025 IYASAKA（arrowsworks）. All rights reserved.
```

### スタイル
```vue
<footer class="bg-sumi text-white">
  <div class="container mx-auto px-4 py-12">
    <!-- 4カラムグリッド -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
      <!-- セクション1-4 -->
    </div>
    
    <!-- 法務リンク -->
    <div class="border-t border-white/20 pt-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70">
        <nav class="flex flex-wrap gap-4">
          <!-- 法務リンク -->
        </nav>
        <p>© 2025 IYASAKA（arrowsworks）.</p>
      </div>
    </div>
  </div>
</footer>
```

---

## 🎨 固定CTA (FooterCta.vue)

### 位置・動作
- **PC**: 右下固定、スクロールで表示/非表示
- **モバイル**: 下部固定バー

### 内容
```
📞 お問い合わせ | 📄 資料DL | 📅 相談予約
```

### スタイル
```vue
<div class="fixed bottom-4 right-4 z-40 hidden lg:block">
  <div class="flex gap-2 bg-white shadow-2xl rounded-full p-2 border border-matsuha/20">
    <button class="btn-primary rounded-full px-6 py-3">
      📞 お問い合わせ
    </button>
    <button class="btn-secondary rounded-full px-6 py-3">
      📄 資料DL
    </button>
  </div>
</div>

<!-- モバイル -->
<div class="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-matsuha/20 shadow-lg">
  <div class="flex justify-around py-3 px-4">
    <button class="flex-1 btn-primary mx-1 py-3">📞 問合せ</button>
    <button class="flex-1 btn-secondary mx-1 py-3">📄 資料</button>
  </div>
</div>
```

---

## 📱 モバイルメニュー (HeaderMobile.vue)

### 開閉動作
- ハンバーガーアイコンクリック → スライドイン（右から）
- オーバーレイクリック / Escキー → 閉じる
- リンククリック → 閉じる

### スタイル
```vue
<Transition name="slide-fade">
  <div v-if="isOpen" class="fixed inset-0 z-50">
    <!-- オーバーレイ -->
    <div class="absolute inset-0 bg-sumi/80 backdrop-blur-sm" @click="close"></div>
    
    <!-- メニュー本体 -->
    <nav class="absolute top-0 right-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto">
      <div class="p-6">
        <!-- 閉じるボタン -->
        <button @click="close" class="absolute top-4 right-4 p-2">×</button>
        
        <!-- ナビゲーションリスト -->
        <ul class="space-y-4 mt-12">
          <li><NuxtLink to="/" class="block py-3 text-lg font-bold border-b">Home</NuxtLink></li>
          <!-- サービスアコーディオン -->
          <!-- その他リンク -->
        </ul>
        
        <!-- CTA -->
        <div class="mt-8 space-y-3">
          <button class="btn-primary w-full">📞 お問い合わせ</button>
          <button class="btn-secondary w-full">📄 資料DL</button>
        </div>
      </div>
    </nav>
  </div>
</Transition>
```

---

## 🎯 実装チェックリスト

### Header.vue
- [ ] ロゴ配置（リンク、alt設定）
- [ ] PCナビゲーション（ドロップダウン機能）
- [ ] CTAボタン（2種類）
- [ ] ハンバーガーアイコン（モバイル）
- [ ] スクロール時の背景変化（オプション）
- [ ] アクセシビリティ対応

### Footer.vue
- [ ] 4カラムグリッド（レスポンシブ）
- [ ] NAP情報正確記載
- [ ] 全リンク正常動作
- [ ] 法務リンク設置
- [ ] Copyright表記

### FooterCta.vue
- [ ] PC固定位置（右下）
- [ ] モバイル固定バー（下部）
- [ ] ボタン動作確認
- [ ] z-index調整

### HeaderMobile.vue
- [ ] スライドアニメーション
- [ ] オーバーレイクリックで閉じる
- [ ] Escキーで閉じる
- [ ] サービスアコーディオン
- [ ] body scroll lock（メニュー開時）

### layouts/default.vue
- [ ] Header配置
- [ ] main領域（pt-16 以上でヘッダー高さ分確保）
- [ ] Footer配置
- [ ] FooterCta配置
- [ ] ページ遷移アニメーション（オプション）

---

## 🎨 Cursor実装プロンプト

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
   - ロゴ「IYASAKA」+ サブテキスト
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
- 各コンポーネントのコード
- layouts/default.vueの実装
- 動作確認方法
```

---

**次の実装**: B2-home.md（Homeページ詳細設計）
