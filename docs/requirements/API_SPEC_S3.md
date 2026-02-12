# API仕様 S3補完 -- 入出力例・境界値・例外応答・Gherkin

> 対象: POST /api/leads, POST /api/aiplus-shindan
> SSOT 3層: CONTRACT層
> Pre-Code Gate C: S3-E/F/G/H

---

## 1. POST /api/leads（汎用リード送信）

### S3-E: 入出力例（5ケース以上）

**正常系 Case 1 -- 2026年版フォーマット（最小必須）**

```
Request:
  POST /api/leads
  Content-Type: application/json

  {
    "name": "山田太郎",
    "email": "yamada@example.com",
    "employees": "10-29",
    "interestedProducts": ["mieru-plus"],
    "privacyAgreed": true,
    "source": "contact_form",
    "primaryProduct": "mieru-plus",
    "createdAt": "2026-02-12T10:00:00.000Z"
  }

Response:
  200 OK
  { "ok": true }
```

**正常系 Case 2 -- 2026年版フルフィールド（UTM + 診断結果付き）**

```
Request:
  {
    "name": "佐藤花子",
    "email": "sato@company.co.jp",
    "phone": "03-1234-5678",
    "company": "サトウ設備",
    "employees": "30-99",
    "interestedProducts": ["jakuden-plus", "mieru-plus"],
    "message": "弱電設備の保守について相談したい",
    "privacyAgreed": true,
    "source": "product_lp",
    "primaryProduct": "jakuden-plus",
    "rawPid": "jakuden-plus",
    "utmSource": "google",
    "utmMedium": "cpc",
    "utmCampaign": "spring2026",
    "landingPage": "/products/jakuden-plus",
    "referrer": "https://google.com",
    "pageViews": 5,
    "timeToConversion": 180000,
    "diagnosisResult": {
      "product": "jakuden-plus",
      "answers": { "q1": "yes", "q2": "no", "q3": "yes" },
      "timestamp": 1707724800000
    },
    "createdAt": "2026-02-12T10:30:00.000Z"
  }

Response:
  200 OK
  { "ok": true }
```

**異常系 Case 3 -- バリデーション失敗（email 不正）**

```
Request:
  { "name": "田中", "email": "not-an-email", "employees": "1-9",
    "interestedProducts": ["ai-plus"], "privacyAgreed": true,
    "source": "contact_form", "primaryProduct": "ai-plus",
    "createdAt": "2026-02-12T10:00:00.000Z" }

Response:
  400 Bad Request
  { "statusCode": 400, "message": "Invalid payload" }
```

**異常系 Case 4 -- レート制限（同一IP 60秒以内の連続送信）**

```
Request: (2回目の送信、同一IPから60秒以内)
  { ... valid payload ... }

Response:
  429 Too Many Requests
  { "statusCode": 429, "statusMessage": "Too Many Requests" }
```

**異常系 Case 5 -- ハニーポット検出（スパム）**

```
Request:
  { "name": "Bot", "email": "bot@spam.com", "employees": "1-9",
    "interestedProducts": ["ai-plus"], "privacyAgreed": true,
    "source": "contact_form", "primaryProduct": "ai-plus",
    "createdAt": "2026-02-12T10:00:00.000Z",
    "website": "http://spam.example.com" }

Response:
  200 OK
  { "ok": true }
  (DB保存・通知なし、スパムとして静かに破棄)
```

**異常系 Case 6 -- Supabase未設定（設定不備）**

```
Condition: config.supabaseUrl が空

Response:
  500 Internal Server Error
  { "statusCode": 500, "message": "Supabase config missing" }
```

**異常系 Case 7 -- 重複送信（同一メール10分以内）**

```
Condition: 同一メールアドレスから10分以内の再送信

Response:
  200 OK
  { "ok": true, "throttled": true }
  (DB保存なし、静かにスロットル)
```

---

### S3-F: 境界値

| フィールド | 型 | 最小 | 最大 | 必須 | 備考 |
|-----------|-----|------|------|------|------|
| name | string | 1文字 | 制限なし | 必須 | 空文字不可 |
| email | string | RFC5322準拠 | 制限なし | 必須 | Zod email() |
| phone | string | 0文字 | 制限なし | 任意 | |
| company | string | 0文字 | 制限なし | 任意 | |
| employees | string | 1文字 | 制限なし | 必須 | enum想定: "1-9", "10-29", "30-99", "100-299", "300+" |
| interestedProducts | string[] | 1要素 | 制限なし | 必須 | 空配列不可 |
| message | string | 0文字 | 制限なし | 任意 | |
| privacyAgreed | boolean | - | - | 必須 | |
| source | string | 1文字 | 制限なし | 必須 | |
| primaryProduct | string | 1文字 | 制限なし | 必須 | |
| createdAt | string | ISO8601 | ISO8601 | 必須 | |
| website | string | 0文字 | 制限なし | 任意 | ハニーポット |
| pageViews | number | 0 | 制限なし | 任意 | |
| timeToConversion | number | 0 | 制限なし | 任意 | ミリ秒 |

**レート制限境界**: 同一IP毎に60,000ms（60秒）
**重複検出境界**: 同一メール毎に600,000ms（10分）

---

### S3-G: 例外応答

| HTTP | 条件 | レスポンス | 副作用 |
|------|------|-----------|--------|
| 200 | 正常送信 | `{ ok: true }` | DB保存 + Slack + メール通知 |
| 200 | ハニーポット検出 | `{ ok: true }` | なし（静かに破棄） |
| 200 | 重複スロットル | `{ ok: true, throttled: true }` | なし |
| 200 | ダミーモード | `{ ok: true, dummy: true }` | .data/leads.ndjsonに追記 |
| 400 | Zodバリデーション失敗 | `{ statusCode: 400, message: "Invalid payload" }` | なし |
| 429 | レート制限 | `{ statusCode: 429, statusMessage: "Too Many Requests" }` | なし |
| 500 | Supabase設定不備 | `{ statusCode: 500, message: "Supabase config missing" }` | なし |
| 500 | DB保存失敗 | `{ statusCode: 500, message: "Failed to save lead" }` | なし |

**通知失敗時**: Slack/メール送信失敗はPromise.allSettledで吸収。レスポンスに影響しない。

---

### S3-H: Gherkin シナリオ

```gherkin
Feature: リード送信 API (POST /api/leads)

  Scenario: 正常なリード送信
    Given 有効なリードデータが準備されている
    And privacyAgreed が true である
    And interestedProducts に1つ以上の製品IDがある
    When POST /api/leads にリクエストする
    Then レスポンスステータスは 200 である
    And レスポンスボディに { "ok": true } が含まれる
    And leadsテーブルにレコードが1件追加される

  Scenario: メールアドレスが不正
    Given email が "invalid-email" である
    When POST /api/leads にリクエストする
    Then レスポンスステータスは 400 である
    And leadsテーブルにレコードは追加されない

  Scenario: 同一IPから60秒以内に2回送信
    Given 1回目のリクエストが成功している
    And 60秒が経過していない
    When 同一IPから POST /api/leads にリクエストする
    Then レスポンスステータスは 429 である

  Scenario: ハニーポットフィールドが入力されている
    Given website フィールドに値が設定されている
    When POST /api/leads にリクエストする
    Then レスポンスステータスは 200 である
    And leadsテーブルにレコードは追加されない
    And 通知は送信されない

  Scenario: 同一メールから10分以内の再送信
    Given 同一メールアドレスで10分以内に送信済みである
    When POST /api/leads にリクエストする
    Then レスポンスステータスは 200 である
    And レスポンスボディに { "ok": true, "throttled": true } が含まれる
    And leadsテーブルにレコードは追加されない

  Scenario: メール通知が失敗しても結果は返る
    Given メールサーバーが応答しない
    When 有効なリードデータで POST /api/leads にリクエストする
    Then レスポンスステータスは 200 である
    And leadsテーブルにレコードは追加される
```

---

## 2. POST /api/aiplus-shindan（AI活用診断リード送信）

### S3-E: 入出力例（5ケース以上）

**正常系 Case 1 -- 最小必須フィールド**

```
Request:
  POST /api/aiplus-shindan
  Content-Type: application/json

  {
    "company": "テスト株式会社",
    "name": "山田太郎",
    "email": "yamada@test.co.jp",
    "score": 72,
    "answers": {
      "industry": "construction",
      "employeeSize": "10-29",
      "manualTasks": ["scheduling", "inventory"],
      "monthlyHours": 40,
      "painPoints": ["visibility", "handover"],
      "improvementGoal": "efficiency"
    },
    "source": "aiplus_shindan"
  }

Response:
  200 OK
  { "ok": true }
```

**正常系 Case 2 -- 全フィールド（電話番号付き）**

```
Request:
  {
    "company": "サトウ建設",
    "name": "佐藤一郎",
    "email": "sato@construction.co.jp",
    "phone": "048-1234-5678",
    "score": 83,
    "answers": {
      "industry": "manufacturing",
      "employeeSize": "30-99",
      "manualTasks": ["scheduling", "inventory", "reporting", "communication"],
      "monthlyHours": 60,
      "painPoints": ["visibility", "handover", "cost"],
      "improvementGoal": "cost_reduction"
    },
    "source": "aiplus_shindan"
  }

Response:
  200 OK
  { "ok": true }
```

**異常系 Case 3 -- 必須フィールド欠落（company 空）**

```
Request:
  { "company": "", "name": "Test", "email": "t@t.com", "score": 70,
    "answers": { "industry": "it", "employeeSize": "1-9",
    "manualTasks": [], "monthlyHours": 20, "painPoints": [],
    "improvementGoal": "efficiency" }, "source": "aiplus_shindan" }

Response:
  400 Bad Request
  { "statusCode": 400, "message": "Invalid payload" }
```

**異常系 Case 4 -- レート制限**

```
Condition: 同一IPから60秒以内の2回目送信

Response:
  429 Too Many Requests
  { "statusCode": 429, "statusMessage": "Too Many Requests" }
```

**異常系 Case 5 -- ハニーポット検出**

```
Request:
  { ... valid payload ..., "website": "http://spam.example.com" }

Response:
  200 OK
  { "ok": true }
  (メール通知なし)
```

**異常系 Case 6 -- スコア範囲外**

```
Request:
  { ... valid payload ..., "score": 150 }

Response:
  400 Bad Request
  { "statusCode": 400, "message": "Invalid payload" }
```

**異常系 Case 7 -- source が aiplus_shindan 以外**

```
Request:
  { ... valid payload ..., "source": "other_source" }

Response:
  400 Bad Request
  { "statusCode": 400, "message": "Invalid payload" }
```

---

### S3-F: 境界値

| フィールド | 型 | 最小 | 最大 | 必須 | 備考 |
|-----------|-----|------|------|------|------|
| company | string | 1文字 | 制限なし | 必須 | 空文字不可 |
| name | string | 1文字 | 制限なし | 必須 | 空文字不可 |
| email | string | RFC5322 | 制限なし | 必須 | Zod email() |
| phone | string | 0文字 | 制限なし | 任意 | |
| score | number | 0 | 100 | 必須 | min(0).max(100) |
| source | literal | - | - | 必須 | "aiplus_shindan" のみ許可 |
| website | string | 0文字 | 制限なし | 任意 | ハニーポット |
| answers.industry | string | 1文字 | 制限なし | 必須 | |
| answers.employeeSize | string | 1文字 | 制限なし | 必須 | |
| answers.manualTasks | string[] | 0要素 | 制限なし | 必須 | 空配列許可 |
| answers.monthlyHours | number | 制限なし | 制限なし | 必須 | |
| answers.painPoints | string[] | 0要素 | 制限なし | 必須 | 空配列許可 |
| answers.improvementGoal | string | 1文字 | 制限なし | 必須 | |

**レート制限境界**: 同一IP毎に60,000ms（60秒）

---

### S3-G: 例外応答

| HTTP | 条件 | レスポンス | 副作用 |
|------|------|-----------|--------|
| 200 | 正常送信 | `{ ok: true }` | メール通知 |
| 200 | ハニーポット検出 | `{ ok: true }` | なし（静かに破棄） |
| 400 | Zodバリデーション失敗 | `{ statusCode: 400, message: "Invalid payload" }` | なし |
| 429 | レート制限 | `{ statusCode: 429, statusMessage: "Too Many Requests" }` | なし |

**メール送信失敗時**: try/catch で吸収。200を返す。ログのみ出力。

---

### S3-H: Gherkin シナリオ

```gherkin
Feature: AI活用診断リード送信 API (POST /api/aiplus-shindan)

  Scenario: 正常な診断結果送信
    Given 全7問の回答とリード情報が入力されている
    And source が "aiplus_shindan" である
    And score が 0-100 の範囲内である
    When POST /api/aiplus-shindan にリクエストする
    Then レスポンスステータスは 200 である
    And レスポンスボディに { "ok": true } が含まれる
    And メール通知が送信される

  Scenario: 必須フィールドが空
    Given company が空文字である
    When POST /api/aiplus-shindan にリクエストする
    Then レスポンスステータスは 400 である
    And メール通知は送信されない

  Scenario: スコアが範囲外（101以上）
    Given score が 101 である
    When POST /api/aiplus-shindan にリクエストする
    Then レスポンスステータスは 400 である

  Scenario: ハニーポットフィールドが入力されている
    Given website フィールドに値が設定されている
    When POST /api/aiplus-shindan にリクエストする
    Then レスポンスステータスは 200 である
    And メール通知は送信されない

  Scenario: 同一IPから60秒以内に2回送信
    Given 1回目のリクエストが成功している
    And 60秒が経過していない
    When 同一IPから POST /api/aiplus-shindan にリクエストする
    Then レスポンスステータスは 429 である

  Scenario: メールサーバーが応答しなくても結果は返る
    Given メールサーバーの設定が不正である
    When 有効なデータで POST /api/aiplus-shindan にリクエストする
    Then レスポンスステータスは 200 である
    And レスポンスボディに { "ok": true } が含まれる
```

---

## 変更履歴

| 日付 | 変更内容 | 変更者 |
|------|---------|-------|
| 2026-02-12 | 初版作成（既存実装から抽出） | Framework Audit |
