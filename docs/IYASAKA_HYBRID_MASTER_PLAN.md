# IYASAKA ハイブリッド実装計画【統合マスタードキュメント】

**作成日**: 2026年1月2日  
**更新日**: 2026年1月2日  
**方針**: オプションC - 既存60%活用 + 2026戦略70%反映 + Apple風50%  
**目標**: 4週間で本番公開  

---

## 🎯 プロジェクト全体像

```
┌─────────────────────────────────────────────────────────────────┐
│  IYASAKA Hybrid Implementation (既存 + 2026戦略)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  【既存を活用】                【2026戦略を追加】                  │
│  ・Nuxt 3基盤（45%完了）      ・診断導線型HP                      │
│  ・Supabase連携              ・CV地点HP#contact集約               │
│  ・製品LP（5製品）           ・URLパラメータトラッキング           │
│  ・記事システム              ・Apple風エフェクト（厳選）           │
│  ・GEOシステム（80%）        ・製品LP情報提供特化                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 目標KPI

| 指標 | 目標値 |
|------|--------|
| CVR（診断開始率） | **8%以上** |
| リード獲得数 | **月間150件以上** |
| Lighthouse Score | **90以上（全デバイス）** |

---

## 📅 4週間実装スケジュール

### **Phase 1: CV地点統合 + 最低限Apple風（Week 1-2）**

#### Week 1: HP改修 + トラッキング基盤

| Day | タスク | 状態 |
|-----|--------|------|
| **Day 1-2** | HP診断システム実装 | ✅ **完了** |
| **Day 3-4** | トラッキングシステム | 📋 次のステップ |
| **Day 5** | Apple風エフェクト基盤 | 📋 未着手 |

#### Week 2: 製品LP改修 + エフェクト追加

| Day | タスク | 状態 |
|-----|--------|------|
| **Day 1-2** | 製品LP改修 | 📋 未着手 |
| **Day 3-4** | Apple風エフェクト追加 | 📋 未着手 |
| **Day 5** | 統合テスト | 📋 未着手 |

---

### **Phase 2: 信頼性強化（Week 3）**

| Day | タスク | 状態 |
|-----|--------|------|
| **Day 1-2** | 代表者プロフィール + 創業ストーリー | 📋 未着手 |
| **Day 3-4** | 顧客事例拡充 + メディアロゴバー | 📋 未着手 |
| **Day 5** | メディア向けページ | 📋 未着手 |

---

### **Phase 3: 法務 + 最適化（Week 4）**

| Day | タスク | 状態 |
|-----|--------|------|
| **Day 1-2** | 法務ページ | 📋 未着手 |
| **Day 3-4** | パフォーマンス最適化 | 📋 未着手 |
| **Day 5** | 全体QA | 📋 未着手 |

---

### **Phase 4: 本番デプロイ + 運用開始（Week 5-6）**

| 期間 | タスク | 状態 |
|------|--------|------|
| **Week 5** | デプロイ準備 + 本番公開 | 📋 未着手 |
| **Week 6** | 運用開始 + A/Bテスト | 📋 未着手 |

---

## ✅ 完了済みタスク詳細

### Phase 1 Week 1 Day 1-2: HP診断システム実装 ✅

**完了日**: 2026年1月2日

| ファイル | 内容 | 状態 |
|----------|------|------|
| `pages/diagnosis/index.vue` | 5問診断ページ | ✅ 新規作成 |
| `pages/diagnosis/result.vue` | 診断結果ページ | ✅ 新規作成 |
| `pages/index.vue` | HP（8セクション構成） | ✅ 既存維持 |
| `components/home/ContactSection.vue` | 問い合わせフォーム | ✅ 既存維持 |
| `composables/useLeadTracking.ts` | リードトラッキング | ✅ 既存維持 |

**動作確認URL**:
- HP: http://160.251.209.16:3001/iyasaka/
- 診断: http://160.251.209.16:3001/iyasaka/diagnosis
- 診断結果: http://160.251.209.16:3001/iyasaka/diagnosis/result

---

## 💻 技術スタック

### 既存（保持）
- Nuxt 3 + Tailwind CSS
- Supabase (PostgreSQL)
- @nuxt/content
- Plausible Analytics
- PM2 + Nginx

### 追加
- GSAP 3.12.5
- Lenis (スムーススクロール)
- SplitType (テキスト分割)
- セッションストレージ（トラッキング）

---

## 📁 ファイル構成（診断システム）

```
pages/
├── index.vue                 # HP（8セクション構成）
├── diagnosis/
│   ├── index.vue             # 5問診断
│   └── result.vue            # 診断結果
components/
├── home/
│   └── ContactSection.vue    # HP内統合問い合わせフォーム
composables/
├── useLeadTracking.ts        # リードトラッキング
├── useScrollAnimation.ts     # スクロールアニメーション
plugins/
├── smooth-scroll.client.ts   # Lenis + GSAP
```

---

## 🔗 関連ドキュメント

- [MASTER_IMPLEMENTATION_PLAN.md](./MASTER_IMPLEMENTATION_PLAN.md) - 詳細実装計画
- [ROADMAP.md](./ROADMAP.md) - ロードマップ
- [ssot/IYASAKA_2026_MASTER_STRATEGY.md](./ssot/IYASAKA_2026_MASTER_STRATEGY.md) - 2026戦略
- [ssot/LEAD_CAPTURE_PROTOCOL.md](./ssot/LEAD_CAPTURE_PROTOCOL.md) - リード獲得プロトコル

---

## 📝 Cursor実装プロンプト

各フェーズのCursor実装プロンプトは以下に保存：

- [x] Phase 1 Week 1 Day 1-2 ✅ 完了
- [ ] Phase 1 Week 1 Day 3-4 → 次に生成
- [ ] Phase 1 Week 1 Day 5
- [ ] Phase 1 Week 2
- [ ] Phase 2
- [ ] Phase 3
- [ ] Phase 4


