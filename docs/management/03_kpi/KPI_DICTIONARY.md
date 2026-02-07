# KPI辞書（定義の正本）

## 目的

この辞書は「同じ言葉で同じ数字を見る」ための正本です。  
会議で議論が噛み合わない場合は、まずここを更新して統一します。

## 原則

- KPIは **定義 / 計測方法 / 更新頻度 / オーナー** を必ずセットで持つ
- 可能な限り **自動集計（Supabase/Analytics）**、難しいものは **手入力** で先に回す
- 「無料先行予約」の判定は `06_pipeline/PIPELINE_DEFINITION.md` に従う

## KPI一覧（3ヶ月の中核）

| KPI | 表示名 | 定義 | 計測/算出 | データソース | 更新 | オーナー |
|---|---|---|---|---|---|---|
| KPI_01 | FreeReservation | 無料先行予約の件数 | `PIPELINE`で予約判定=Yesの件数 | 手入力（週次） | 週次 | Biz |
| KPI_02 | FirstCallHeld | 初回商談の実施件数 | 実施した初回商談の件数 | カレンダー/手入力 | 週次 | Biz |
| KPI_03 | FirstCallScheduled | 初回商談の予定件数 | 予定が確定した初回商談の件数 | カレンダー/手入力 | 週次 | Biz |
| KPI_04 | QualifiedLead | 有効リード件数 | 条件を満たす見込み顧客（連絡可能・痛みあり） | 手入力 | 週次 | Biz |
| KPI_05 | Lead | リード件数 | 連絡先が取れた見込み顧客（入口） | Supabase + 手入力 | 週次 | Biz |
| KPI_06 | ContactSubmit | フォーム送信数 | 問い合わせ送信の件数 | Supabase（leads行数） | 週次 | Ops |

## 行動KPI（Input）

| KPI | 表示名 | 定義 | 計測/算出 | データソース | 更新 | オーナー |
|---|---|---|---|---|---|---|
| KPI_I1 | Outreach | 新規接触/打診数 | 紹介依頼/提携打診/アウトバウンドなど「こちらから最初に打った数」 | 手入力 | 日次/週次 | Biz |
| KPI_I2 | FollowUp | フォロー/再接触数 | 既存リードへの返信/再打診/次アクション調整の件数 | 手入力 | 日次/週次 | Biz |
| KPI_I3 | ProposalSent | 提案/資料送付数 | 提案書/見積/設計図/資料を送った件数 | 手入力 | 日次/週次 | Biz |
| KPI_I4 | ContentOutput | コンテンツ出力数 | 事例/記事/提案資料など「営業に使える出力物」の本数 | 手入力 | 日次/週次 | Biz/Ops |

## 係数（率）KPI

| KPI | 表示名 | 定義 | 計測/算出 | データソース | 更新 |
|---|---|---|---|---|---|
| KPI_R1 | ReservationRate | 予約率 | KPI_01 / KPI_02 | 手入力 | 週次 |
| KPI_R2 | FirstCallShowRate | 初回商談の実施率 | KPI_02 / KPI_03 | 手入力 | 週次 |
| KPI_R3 | FirstCallScheduleRate | 初回商談の設定率 | KPI_03 / KPI_04 | 手入力 | 週次 |
| KPI_R4 | QualifiedLeadRate | 有効リード率 | KPI_04 / KPI_05 | 手入力 | 週次 |

## プロダクトKPI（ホテルAIトライアル）

7日トライアルの「成功」を、営業で使える形で計測する。

| KPI | 表示名 | 定義 | 計測/算出 | データソース | 更新 | オーナー |
|---|---|---|---|---|---|---|
| KPI_H1 | StaffTimeSavedPerDay | スタッフ対応時間の削減（分/日） | トライアル前後で「問い合わせ対応に使った時間」を比較（分/日） | 手入力（現場ヒアリング/簡易ログ） | 週次 | Biz/CS |

## データソースの定義

### Supabase（leads）

- 対象: `leads` テーブル
- 備考: フォーム送信は `server/api/leads.post.ts` 経由で保存される
- 目安: `created_at` で週次集計する

### 手入力（スコアカード/ログ）

自動化できなくても、まずは **WBRで毎週更新** できる形にする。

- `04_scorecards/WEEKLY_SCORECARD.md`
- `07_execution/EXECUTION_LOG.md`

## 用語（パイプライン）

ステージ定義・判定基準は `06_pipeline/PIPELINE_DEFINITION.md` を参照する。

