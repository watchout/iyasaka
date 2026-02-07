# IYASAKA 本番環境変数設定ガイド

**最終更新**: 2026年1月14日  
**対象**: ソフトローンチ準備

---

## 📋 必須環境変数一覧

### 🔴 必須（リード保存に必要）

| 変数名 | 説明 | 取得方法 |
|--------|------|----------|
| `SUPABASE_URL` | SupabaseプロジェクトURL | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_KEY` | Supabaseサービスロールキー | Supabase Dashboard → Settings → API → service_role |

### 🟡 推奨（通知機能）

| 変数名 | 説明 | 取得方法 |
|--------|------|----------|
| `SLACK_LEAD_WEBHOOK` | Slack Incoming Webhook URL | Slack App → Incoming Webhooks |

### 🟢 オプション（メール通知）

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `LEAD_MAIL_HOST` | SMTPホスト | `smtp.gmail.com` |
| `LEAD_MAIL_PORT` | SMTPポート | `587` |
| `LEAD_MAIL_USER` | SMTPユーザー | `noreply@iyasaka.co.jp` |
| `LEAD_MAIL_PASS` | SMTPパスワード | App Password |
| `LEAD_MAIL_FROM` | 送信元アドレス | `noreply@iyasaka.co.jp` |
| `LEAD_MAIL_TO` | 通知先アドレス | `sales@iyasaka.co.jp` |

### 🔵 公開設定

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `NUXT_PUBLIC_SITE_URL` | 本番サイトURL | `https://iyasaka.co` |

---

## 🛠 設定手順

### Step 1: Supabase設定

1. [Supabase Dashboard](https://supabase.com/dashboard) にログイン
2. プロジェクトを選択（または新規作成）
3. **Settings → API** に移動
4. 以下をコピー:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` (secret) → `SUPABASE_SERVICE_KEY`

5. **SQL Editor** で以下を実行:

```sql
-- leads テーブル作成（未作成の場合）
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  employees TEXT,
  message TEXT,
  primary_product TEXT,
  interested_products TEXT[],
  source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer TEXT,
  landing_page TEXT,
  diagnosis_result JSONB,
  privacy_agreed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_primary_product ON public.leads(primary_product);
```

---

### Step 2: Slack Webhook設定

1. [Slack API](https://api.slack.com/apps) にアクセス
2. **Create New App → From scratch**
3. App名: `IYASAKA Lead Notifier`
4. Workspace: 対象ワークスペースを選択
5. **Features → Incoming Webhooks** を有効化
6. **Add New Webhook to Workspace**
7. 投稿先チャンネル（例: `#lead`）を選択
8. Webhook URLをコピー → `SLACK_LEAD_WEBHOOK`

---

### Step 3: メール設定（オプション）

#### Gmail の場合

1. Googleアカウント → セキュリティ → 2段階認証を有効化
2. **アプリパスワード** を生成
3. 以下を設定:

```env
LEAD_MAIL_HOST=smtp.gmail.com
LEAD_MAIL_PORT=587
LEAD_MAIL_USER=your-email@gmail.com
LEAD_MAIL_PASS=xxxx-xxxx-xxxx-xxxx  # アプリパスワード
LEAD_MAIL_FROM=your-email@gmail.com
LEAD_MAIL_TO=sales@iyasaka.co.jp
```

#### SendGrid の場合

```env
LEAD_MAIL_HOST=smtp.sendgrid.net
LEAD_MAIL_PORT=587
LEAD_MAIL_USER=apikey
LEAD_MAIL_PASS=SG.xxxxxxxxxxxx  # API Key
LEAD_MAIL_FROM=noreply@iyasaka.co.jp
LEAD_MAIL_TO=sales@iyasaka.co.jp
```

#### さくらインターネット の場合 ★IYASAKA推奨

```env
LEAD_MAIL_HOST=iyasaka.co.sakura.ne.jp
LEAD_MAIL_PORT=587
LEAD_MAIL_USER=info@iyasaka.co
LEAD_MAIL_PASS=xxxxxxxx  # さくらのメールパスワード
LEAD_MAIL_FROM=info@iyasaka.co
LEAD_MAIL_TO=info@iyasaka.co
```

> **注意**: さくらインターネットのSMTPホストは `ドメイン.sakura.ne.jp` または `初期ドメイン.sakura.ne.jp` 形式

---

## 📁 .env ファイルテンプレート

```env
# ===========================================
# IYASAKA 本番環境変数
# ===========================================

# --- Supabase（必須）---
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# --- Slack通知（推奨）---
SLACK_LEAD_WEBHOOK=https://hooks.slack.com/services/T.../B.../xxxx

# --- メール通知（オプション）---
# LEAD_MAIL_HOST=smtp.gmail.com
# LEAD_MAIL_PORT=587
# LEAD_MAIL_USER=
# LEAD_MAIL_PASS=
# LEAD_MAIL_FROM=
# LEAD_MAIL_TO=

# --- サイトURL ---
NUXT_PUBLIC_SITE_URL=https://iyasaka.co

# --- 開発用（本番では不要）---
# DISABLE_CONTENT_WS=1
```

---

## ✅ 設定確認方法

### 1. Supabase接続確認

```bash
curl -s http://localhost:4100/iyasaka/api/health/supabase
# 期待: {"ok":true,"message":"Supabase is connected"}
```

### 2. リードAPI確認

```bash
curl -X POST http://localhost:4100/iyasaka/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name":"テスト太郎",
    "email":"test@example.com",
    "employees":"1-10",
    "interestedProducts":["mieru-plus"],
    "privacyAgreed":true,
    "source":"test",
    "primaryProduct":"mieru-plus"
  }'
# 期待: {"ok":true}
```

### 3. Slack通知確認

リードAPIテスト後、Slackチャンネルに通知が届くことを確認

---

## 🚨 トラブルシューティング

### Supabase接続エラー

```
Could not find the table 'public.leads'
```
→ SQLエディターでテーブル作成SQLを実行

### Slack通知が届かない

1. Webhook URLが正しいか確認
2. チャンネルがアーカイブされていないか確認
3. サーバーログでエラーを確認

### メール送信エラー

1. SMTPポートが開いているか確認（587/465）
2. アプリパスワードが正しいか確認
3. 送信元ドメインのSPF/DKIM設定を確認

---

## 📊 Vercel本番デプロイ時の設定

Vercel Dashboardで環境変数を設定:

1. **Project Settings → Environment Variables**
2. 上記の変数を追加（Production環境）
3. **Redeploy** を実行

---

**次のステップ**: [ソフトローンチチェックリスト](./SOFTLAUNCH_CHECKLIST.md)
