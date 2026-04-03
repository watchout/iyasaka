# IYASAKA コピー自動進化システム — 仕様書

バージョン: 1.0.0
作成日: 2026-04-03
ステータス: CEO承認待ち

---

## 1. 概要 — このシステムが解決する「不」

「どのコピーが効くか分からないまま、勘で決めている。」

このシステムは、コピー（見出し、説明文、CTA）を複数パターン同時に表示し、
効果を自動計測し、良いパターンを自動的に残し、悪いパターンを淘汰する。
さらに、蓄積されたデータから新しいコピーをAIが生成する。

人間が「A案 vs B案どっち？」と悩む時間をゼロにする。

---

## 2. 全体アーキテクチャ

```
┌──────────────────────────────────────────────────────┐
│                    コピー生成層                        │
│                                                      │
│  顧客の声DB ──→ Claude API ──→ コピー候補（3-5本）    │
│                    ↑                                  │
│              コピーガイドライン                         │
│              （禁止事項フィルター）                      │
└──────────────┬───────────────────────────────────────┘
               ↓
┌──────────────────────────────────────────────────────┐
│                    配信・表示層                        │
│                                                      │
│  コピープール ──→ ランダム選択 ──→ HP各セクション表示   │
│  （パターンID付与）   ↑                               │
│                 重み付けアルゴリズム                     │
│                 （初期: 均等 → 成績順に偏重）           │
└──────────────┬───────────────────────────────────────┘
               ↓
┌──────────────────────────────────────────────────────┐
│                    計測・収集層                        │
│                                                      │
│  GA4 カスタムイベント                                  │
│  ├── copy_impression（表示）                          │
│  ├── copy_click（クリック / スクロール停止）            │
│  ├── chat_start（チャット開始）                        │
│  ├── lp_transition（LP遷移）                          │
│  └── conversion（診断完了 / 相談予約）                  │
│                                                      │
│  各イベントに pattern_id, section_id を付与             │
└──────────────┬───────────────────────────────────────┘
               ↓
┌──────────────────────────────────────────────────────┐
│                    分析・最適化層                      │
│                                                      │
│  日次バッチ:                                          │
│  ├── パターン別CVR算出                                │
│  ├── 統計的有意性チェック（χ²検定）                    │
│  ├── 勝者/敗者判定                                    │
│  └── 重み更新 or パターン淘汰                          │
│                                                      │
│  週次バッチ:                                          │
│  ├── 敗退パターンの原因分析（AI）                      │
│  ├── 新パターン生成指示（AI）                          │
│  └── レポート生成 → CEO通知                            │
└──────────────────────────────────────────────────────┘
```

---

## 3. コピープール設計

### 3-1. プール構造

```
copy_pool/
├── hero/                    ← ヒーローセクション
│   ├── main_copy/           ← メインコピー（A/Bテスト対象）
│   │   ├── pattern_001.json
│   │   ├── pattern_002.json
│   │   └── ...
│   └── sub_copy/            ← サブコピー
│       ├── pattern_001.json
│       └── ...
├── section_hotel/           ← ホテルセクション
│   ├── headline/
│   ├── description/
│   └── cta/
├── section_jakuden/         ← 弱電セクション
├── section_haishin/         ← 配信セクション
├── section_genba/           ← 現場DXセクション
├── section_aiplus/          ← AIプラスセクション
└── ending/                  ← エンディングCTA
```

### 3-2. パターンJSONフォーマット

```json
{
  "id": "hero_main_001",
  "section": "hero",
  "slot": "main_copy",
  "text": "AIで会社を回す。その仕組みを、あなたにも。",
  "source": "c-suite-session-20260403",
  "source_type": "strategy_meeting",
  "created_at": "2026-04-03T00:00:00Z",
  "status": "active",
  "weight": 50,
  "stats": {
    "impressions": 0,
    "clicks": 0,
    "chat_starts": 0,
    "lp_transitions": 0,
    "conversions": 0,
    "ctr": null,
    "cvr": null
  },
  "metadata": {
    "target_persona": "AI導入を検討中の中小企業経営者",
    "intent": "IYASAKAがAI組織であることを伝え、興味を引く",
    "guideline_check": "passed",
    "prohibited_words_check": "passed"
  }
}
```

### 3-3. パターンのライフサイクル

```
draft → review → active → (measuring) → winner / retired

draft:    AI生成直後。禁止事項フィルター前
review:   フィルター通過。人間レビュー待ち
active:   公開中。計測開始
winner:   統計的に優位と判定。重み増加
retired:  統計的に劣位と判定。非表示。原因分析対象
```

---

## 4. 表示ロジック（配信層）

### 4-1. 重み付けランダム選択

```
初期状態（パターン3本の場合）:
  pattern_001: weight=33
  pattern_002: weight=33
  pattern_003: weight=34

2週間後（データ蓄積後）:
  pattern_001: weight=60（勝者 → 重み増加）
  pattern_002: weight=30（中間）
  pattern_003: weight=10（敗者 → 重み減少、一定以下で retired）
```

### 4-2. 表示時のデータ付与

```html
<!-- サーバーサイドで選択、クライアントにdata属性で付与 -->
<section
  data-section="hotel"
  data-slot="headline"
  data-pattern-id="hotel_headline_003"
  data-copy-version="v2"
>
  <h2>スタッフが足りない。でもサービスは落とせない。</h2>
</section>
```

### 4-3. Nuxt 3 実装（サーバーサイド）

```
リクエスト受信
  ↓
各セクション × 各スロットでパターンを重み付き選択
  ↓
選択されたパターンIDをcookieに記録（セッション単位の一貫性）
  ↓
SSRでHTMLに埋め込み → レスポンス
```

同一セッション内では同じパターンを表示し続ける（途中で変わると体験が不自然）。
次回訪問時に再抽選。

---

## 5. データ収集（計測層）

### 5-1. GA4 カスタムイベント定義

| イベント名 | トリガー | パラメータ |
|-----------|---------|-----------|
| copy_impression | セクションがビューポートに50%以上表示されて1秒以上滞留 | section_id, slot, pattern_id, timestamp |
| copy_engagement | セクション内で3秒以上滞留 or スクロール停止 | section_id, pattern_id, dwell_time |
| chat_start | チャットパネルを開いた | section_id, pattern_id, agent_role |
| chat_message | チャットでメッセージ送信 | section_id, pattern_id, message_count |
| lp_transition | LP（aiplus等）への遷移クリック | source_section, source_pattern_id, destination |
| cta_click | CTA ボタンクリック（診断/相談/資料DL） | section_id, pattern_id, cta_type |
| diagnosis_start | 診断ページで最初の質問に回答 | source_pattern_id, referrer_section |
| diagnosis_complete | 診断を最後まで完了 | source_pattern_id, score |
| consultation_book | Calendly で相談予約完了 | source_pattern_id |

### 5-2. イベント送信コード（クライアントサイド）

```javascript
// Intersection Observer で表示検知
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
      const el = entry.target;
      const timer = setTimeout(() => {
        gtag('event', 'copy_impression', {
          section_id: el.dataset.section,
          slot: el.dataset.slot,
          pattern_id: el.dataset.patternId,
        });
      }, 1000); // 1秒以上表示で発火

      // 3秒以上で engagement
      const engTimer = setTimeout(() => {
        gtag('event', 'copy_engagement', {
          section_id: el.dataset.section,
          pattern_id: el.dataset.patternId,
          dwell_time: 3,
        });
      }, 3000);

      el._timers = [timer, engTimer];
    } else {
      // ビューポートから外れたらタイマークリア
      if (entry.target._timers) {
        entry.target._timers.forEach(clearTimeout);
      }
    }
  });
}, { threshold: 0.5 });
```

### 5-3. データ保存先

```
主: GA4（Googleアナリティクス 4）
  → BigQuery Export で生データをBigQueryに蓄積
  → 日次バッチで分析

副: 自前DB（PostgreSQL / Supabase）
  → 最小限のイベントログ（pattern_id, event_type, timestamp）
  → GA4が使えない場合のフォールバック
  → リアルタイムダッシュボード用
```

---

## 6. 分析ロジック（分析層）

### 6-1. 主要KPI

| KPI | 定義 | 計算式 |
|-----|------|--------|
| 表示数 | copy_impression の発火回数 | COUNT(copy_impression) |
| エンゲージメント率 | 3秒以上滞留した割合 | copy_engagement / copy_impression |
| チャット開始率 | 表示後にチャットを開いた割合 | chat_start / copy_impression |
| LP遷移率 | 表示後にLPに遷移した割合 | lp_transition / copy_impression |
| 最終CVR | 表示→診断完了 or 相談予約 | conversion / copy_impression |

### 6-2. 日次バッチ分析（cron: 毎朝6時）

```python
# 擬似コード
for section in sections:
    for slot in section.slots:
        patterns = get_active_patterns(section, slot)
        
        for pattern in patterns:
            stats = query_ga4_bigquery(
                pattern_id=pattern.id,
                date_range="last_7_days"
            )
            pattern.update_stats(stats)
        
        # 統計的有意性チェック
        if has_enough_data(patterns, min_impressions=100):
            winner, loser = chi_squared_test(patterns, metric="cvr")
            
            if winner and confidence >= 0.95:
                winner.weight = min(winner.weight + 10, 80)
                loser.weight = max(loser.weight - 10, 5)
                
                if loser.weight <= 5:
                    loser.status = "retired"
                    trigger_replacement_generation(loser)
```

### 6-3. 統計的有意性の判定

```
検定方法: χ²（カイ二乗）検定
対象指標: 最終CVR（conversion / impression）
有意水準: p < 0.05（95%信頼度）
最小サンプル数: 各パターン100 impressions以上

判定ルール:
  - p < 0.05 で差あり → 勝者の重みを+10、敗者を-10
  - p >= 0.05 → まだ判断不能。データ蓄積を継続
  - 敗者のweightが5以下 → retired（淘汰）
  - 4週間で有意差が出ない → 両方維持、新パターン追加
```

### 6-4. 週次レポート（cron: 毎週月曜 9時）

```
生成内容:
  - セクション別の勝者/敗者一覧
  - 各パターンのCVR推移グラフ
  - 今週 retired になったパターンとその原因分析（AI生成）
  - 新しく追加されたパターン
  - 全体CVRの週次推移

配信先:
  - CEO（Telegram / メール）
  - 自前ダッシュボード（Nuxt 3 管理画面）
```

---

## 7. 自動最適化（反映層）

### 7-1. 重み更新の自動反映

```
日次バッチ → weight更新 → DBに保存
  ↓
次のリクエストから新しいweightで選択される
  ↓
人間の操作は不要
```

### 7-2. パターン淘汰 → 新パターン自動生成

```
retired判定
  ↓
敗因分析（Claude API）:
  - 勝者パターンとの差分を分析
  - 「なぜこのパターンは効かなかったか」をレポート
  ↓
新パターン生成（Claude API）:
  - 勝者パターンの要素を取り入れる
  - 顧客の声DB から新しい素材を取得
  - コピーガイドラインを適用
  - 3本生成 → 禁止事項フィルター → 1-2本がactiveに
  ↓
人間レビュー（任意）:
  - 自動で active にするか、review で人間確認を挟むかは設定可能
  - Phase 1: 人間レビュー必須
  - Phase 2: 禁止事項フィルター通過なら自動 active
```

### 7-3. 顧客の声の自動取り込み

```
AIチャットBotのログ
  ↓
日次バッチで新しい顧客発言を抽出
  ↓
業種・課題カテゴリで分類
  ↓
コピー素材として 顧客の声DB に追加
  ↓
次回の新パターン生成時に素材として使用
```

---

## 8. ダッシュボード仕様

### 8-1. 管理画面（Nuxt 3 内 /admin/copy）

```
┌─────────────────────────────────────────────┐
│ コピー最適化ダッシュボード                     │
├─────────────────────────────────────────────┤
│                                             │
│ 全体CVR推移（折れ線グラフ・週次）              │
│ [============================] 現在: 3.2%    │
│                                             │
├─────────────────────────────────────────────┤
│ セクション別パフォーマンス                     │
│                                             │
│ ヒーロー  [■■■■■■□□□□] CVR 4.1%  3パターン  │
│ ホテル    [■■■■□□□□□□] CVR 2.8%  4パターン  │
│ 弱電      [■■■■■□□□□□] CVR 3.5%  3パターン  │
│ 配信      [■■■□□□□□□□] CVR 2.1%  4パターン  │
│ 現場DX    [■■■■■■□□□□] CVR 4.0%  3パターン  │
│ AIプラス  [■■■■□□□□□□] CVR 2.9%  3パターン  │
│                                             │
├─────────────────────────────────────────────┤
│ 最近の変動                                   │
│                                             │
│ 🏆 hero_main_002 が勝者判定（p=0.03）        │
│ 🪦 hotel_headline_001 が retired（CVR 0.8%）│
│ 🆕 jakuden_desc_004 が新規追加               │
│                                             │
├─────────────────────────────────────────────┤
│ パターン詳細（クリックで展開）                  │
│                                             │
│ ▼ ヒーロー メインコピー                       │
│   001: 「AIで会社を回す...」    CVR 4.1% 🏆  │
│   002: 「この会社の社員は...」  CVR 3.8%     │
│                                             │
│ ▼ ホテル ヘッドライン                         │
│   001: 「スタッフが足りない...」CVR 2.8%     │
│   002: 「問い合わせの7割は...」 CVR 3.2% 🏆  │
│   003: 「深夜の外国語対応...」  CVR 1.9% ⚠️  │
│                                             │
├─────────────────────────────────────────────┤
│ [新パターン手動追加] [レポートDL] [設定]       │
└─────────────────────────────────────────────┘
```

### 8-2. 設定画面

```
自動化レベル:
  ○ Phase 1: 全パターン人間レビュー必須
  ● Phase 2: フィルター通過なら自動active（現在）
  ○ Phase 3: 生成→テスト→淘汰まで完全自動

最小サンプル数: [100] impressions
有意水準: [0.05]
淘汰閾値（weight下限）: [5]
1スロットの最大パターン数: [5]
日次バッチ時刻: [06:00]
週次レポート送信先: [ceo@iyasaka.co]
```

---

## 9. 実装フェーズ

### Phase 1: 手動A/Bテスト（1-2週間）

- [ ] コピープールJSON作成（ヒーロー2パターン + 各セクション2-3パターン）
- [ ] Nuxt 3 でパターン選択ロジック実装（重み付きランダム）
- [ ] GA4 カスタムイベント設定（copy_impression, cta_click, lp_transition）
- [ ] data属性でpattern_idをDOMに埋め込み
- [ ] セッション内の一貫性（cookieでパターン固定）
- [ ] 手動でGA4レポートを確認して判断

### Phase 2: 半自動最適化（2-4週間）

- [ ] BigQuery Export 設定（GA4 → BigQuery）
- [ ] 日次バッチスクリプト（Python / Node.js on Mac mini）
- [ ] χ²検定ロジック実装
- [ ] 重み自動更新 → DB反映
- [ ] 管理ダッシュボード（/admin/copy）構築
- [ ] 週次レポート自動生成 + CEO通知

### Phase 3: 完全自動進化（1-2ヶ月後）

- [ ] 敗因分析の自動化（Claude API）
- [ ] 新パターン自動生成（Claude API + 顧客の声DB）
- [ ] 禁止事項フィルターの自動チェック
- [ ] 顧客の声DB への自動取り込み（チャットログから）
- [ ] 画像パターンとコピーパターンのクロス分析
- [ ] Anyword予測スコアの導入検討

---

## 10. コスト見積もり

| 項目 | Phase 1 | Phase 2 | Phase 3 |
|------|---------|---------|---------|
| GA4 | 無料 | 無料 | 無料 |
| BigQuery | — | 月$5-10（少量データ） | 月$10-20 |
| Claude API（分析・生成） | — | 月$5-10 | 月$20-30 |
| 開発工数 | 2-3日 | 1-2週間 | 2-4週間 |
| 合計月額 | ≈ ¥0 | ≈ ¥2,000 | ≈ ¥5,000-8,000 |

---

## 11. リスクと対策

| リスク | 影響 | 対策 |
|--------|------|------|
| サンプル数不足 | 有意差が出ない | 最低100 impressions/パターン。トラフィックが少ない場合はテスト期間を延長 |
| 季節変動 | CVRの変化がコピーではなく季節要因 | 同一期間の比較のみ。年間トレンドは別途分析 |
| 新しさバイアス | 新パターンが目新しさで一時的に高CVR | 最低2週間の計測期間。短期の急上昇で判定しない |
| フィルター漏れ | 禁止事項を含むコピーが公開 | Phase 1-2は人間レビュー必須。Phase 3は複数フィルターの多重チェック |
| GA4のデータ遅延 | リアルタイム分析ができない | 日次バッチで十分。リアルタイムが必要な場合は自前DBをフォールバックに |
| パターン数の爆発 | 管理が複雑化 | 1スロットの最大パターン数を5に制限。retiredは自動アーカイブ |

---

## 12. 将来の拡張

### 画像 × コピーのクロス最適化

```
現状: 画像とコピーは独立してA/Bテスト
将来: 「画像パターンAの時にコピーパターンBが最も効く」のような
      組み合わせの最適化（多腕バンディットアルゴリズム）
```

### パーソナライゼーション

```
現状: 全訪問者に同じ確率で表示
将来: リファラー、検索キーワード、地域、時間帯に応じて
      最適なパターンを選択
      例: 「ホテル AI」で検索して来た人にはホテル系コピーの重みを上げる
```

### マルチチャネル統合

```
現状: HPのコピーのみ対象
将来: ブログ記事のタイトル、SNS投稿文、広告コピーも
      同じ仕組みに乗せる
      HP/ブログ/SNS/広告で一貫したデータ駆動の最適化
```
