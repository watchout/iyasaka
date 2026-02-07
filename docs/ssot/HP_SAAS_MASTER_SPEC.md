# HP SaaS マスター仕様書（SSOT）

> **目的**: IYASAKAを「灯台テナント」として最小公開し、その実装をSaaSの雛形に転写するための設計仕様書
> 
> **MVPの合格条件**: IYASAKA と 東海電業社 が同一コードベースで稼働し、6種類のページタイプを公開できる状態

---

## 1. プロダクト概要

### 1.1 コンセプト

**「リード獲得ができるAIEO対応型コンテンツ生成機能付HP SaaS」**

- 中小企業（IT担当者不在）向け
- 問い合わせが増える・信用が上がる・採用にも効くHP
- テンプレート化で業種ごとに型が作れる

### 1.2 フェーズ計画

| フェーズ | 期間 | 目的 | 成果物 |
|---------|------|------|--------|
| **Phase 1** | 0〜2週間 | IYASAKA ソフトローンチ（最小） | 営業に使える状態 + SaaS要件確定 |
| **Phase 2** | 3〜6週間 | SaaSコア構築 | 2社目（東海電業社）が同じ仕組みで立ち上がる |
| **Phase 3** | 7週間〜 | 製品化・拡販 | 業種パック化、他社販売の再現性 |

### 1.3 ターゲット顧客（優先順）

1. **中小企業（IT担当者不在）**: 電気工事・設備・地域B2B
2. **小規模マーケ部門（兼務）のある企業**
3. **スタートアップ**（第3優先）

### 1.4 初期テナント

| テナント | 業種 | 役割 |
|---------|------|------|
| IYASAKA | IT/弱電/AI | 灯台テナント（仕様書） |
| 東海電業社 | 電気工事 | 再現性検証テナント |

---

## 2. ページタイプ定義（6種類）

すべてのテナントは以下6種類のページタイプを持つ。

### 2.1 サービスLP（`service_lp`）

製品・サービスを訴求するランディングページ

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | uuid | ✅ | ページID |
| `tenant_id` | uuid | ✅ | テナントID |
| `slug` | string | ✅ | URLスラッグ（例: `haishin-plus`） |
| `name` | string | ✅ | サービス名 |
| `tagline` | string | ✅ | キャッチコピー（〜30文字） |
| `hero_title` | string | ✅ | ヒーローセクションタイトル |
| `hero_description` | text | ✅ | ヒーロー説明文（〜200文字） |
| `target_audience` | string | ✅ | ターゲット顧客 |
| `pain_points` | json[] | ✅ | 痛み（課題）リスト |
| `solution` | text | ✅ | 解決策の説明 |
| `key_result` | string | ✅ | 主要成果（例: 「60分削減」） |
| `features` | json[] | ✅ | 機能リスト |
| `pricing` | string | - | 価格情報 |
| `timeline` | string | - | 導入期間 |
| `faq` | json[] | - | FAQ（Q/A のペア） |
| `cta_label` | string | ✅ | CTAボタンテキスト |
| `cta_url` | string | ✅ | CTA遷移先URL |
| `seo_title` | string | - | SEOタイトル |
| `seo_description` | string | - | SEO説明文 |
| `og_image` | string | - | OGP画像URL |
| `status` | enum | ✅ | draft / preview / published |
| `published_at` | timestamp | - | 公開日時 |
| `created_at` | timestamp | ✅ | 作成日時 |
| `updated_at` | timestamp | ✅ | 更新日時 |

**pain_points 構造:**
```json
{
  "title": "現場の状況が見えない",
  "description": "ホワイトボードとExcelの二重管理で現場が疲弊"
}
```

**features 構造:**
```json
{
  "icon": "eye",
  "title": "リアルタイム可視化",
  "description": "AIカメラで現場状況を自動把握"
}
```

**faq 構造:**
```json
{
  "question": "導入期間はどのくらいですか？",
  "short_answer": "2週間で稼働開始",
  "detail_answer": "初回ヒアリング後、2週間で稼働開始できます。",
  "evidence_url": null,
  "updated_at": "2026-01-15"
}
```

---

### 2.2 実績・事例（`case_study`）

導入事例・成功事例ページ

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | uuid | ✅ | |
| `tenant_id` | uuid | ✅ | |
| `slug` | string | ✅ | URLスラッグ |
| `title` | string | ✅ | 事例タイトル |
| `client_name` | string | ✅ | 顧客名（匿名可） |
| `client_industry` | string | ✅ | 業種 |
| `client_scale` | string | - | 規模（従業員数など） |
| `challenge` | text | ✅ | 導入前の課題（Before） |
| `solution` | text | ✅ | 提供したソリューション |
| `result` | text | ✅ | 導入後の成果（After） |
| `metrics` | json[] | - | 数値成果（KPI） |
| `testimonial` | text | - | お客様の声 |
| `testimonial_author` | string | - | 声の発言者 |
| `related_service` | uuid | - | 関連サービスLP ID |
| `featured_image` | string | - | メイン画像URL |
| `gallery` | string[] | - | 画像ギャラリー |
| `status` | enum | ✅ | draft / preview / published |
| `published_at` | timestamp | - | |
| `created_at` | timestamp | ✅ | |
| `updated_at` | timestamp | ✅ | |

**metrics 構造:**
```json
{
  "label": "業務時間削減",
  "before": "8時間/日",
  "after": "2時間/日",
  "improvement": "75%削減"
}
```

---

### 2.3 FAQ（`faq`）

よくある質問ページ（AIEO対応必須）

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | uuid | ✅ | |
| `tenant_id` | uuid | ✅ | |
| `category` | string | ✅ | カテゴリ（サービス/料金/導入など） |
| `question` | string | ✅ | 質問文 |
| `short_answer` | string | ✅ | 短い回答（〜50文字、Answer Engine用） |
| `detail_answer` | text | ✅ | 詳細回答 |
| `evidence_url` | string | - | 根拠となるURL |
| `related_service` | uuid | - | 関連サービスLP ID |
| `sort_order` | int | ✅ | 表示順 |
| `status` | enum | ✅ | draft / preview / published |
| `updated_at` | timestamp | ✅ | **AIEO必須: 更新日を明示** |

**AIEO要件:**
- `short_answer` は AI検索エンジンが引用しやすい形式（端的・断定的）
- `updated_at` を必ず表示し、情報の鮮度を示す
- JSON-LD（FAQPage）を自動生成

---

### 2.4 会社・代表（`company`）

会社概要・代表者プロフィールページ

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | uuid | ✅ | |
| `tenant_id` | uuid | ✅ | |
| `company_name` | string | ✅ | 会社名 |
| `company_name_kana` | string | - | 会社名（カナ） |
| `representative` | string | ✅ | 代表者名 |
| `representative_title` | string | ✅ | 役職（代表取締役など） |
| `representative_bio` | text | ✅ | 代表者プロフィール |
| `representative_photo` | string | - | 代表者写真URL |
| `founding_year` | int | ✅ | 創業年 |
| `incorporation_year` | int | - | 法人設立年 |
| `postal_code` | string | ✅ | 郵便番号 |
| `address` | string | ✅ | 住所 |
| `phone` | string | ✅ | 電話番号 |
| `email` | string | - | メールアドレス |
| `capital` | string | - | 資本金 |
| `employees` | string | - | 従業員数 |
| `business_description` | text | ✅ | 事業内容 |
| `certifications` | string[] | - | 資格・認定 |
| `bank_info` | string | - | 取引銀行 |
| `mission` | text | - | ミッション |
| `vision` | text | - | ビジョン |
| `values` | json[] | - | バリュー |
| `history` | json[] | - | 沿革 |
| `status` | enum | ✅ | draft / preview / published |

**history 構造:**
```json
{
  "year": 2020,
  "month": 4,
  "event": "有限会社IYASAKA 設立"
}
```

---

### 2.5 お知らせ・PR（`news`）

ニュース・プレスリリースページ

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | uuid | ✅ | |
| `tenant_id` | uuid | ✅ | |
| `slug` | string | ✅ | URLスラッグ |
| `title` | string | ✅ | タイトル |
| `category` | enum | ✅ | news / press / update / event |
| `summary` | string | ✅ | 要約（〜100文字） |
| `body` | text | ✅ | 本文（Markdown可） |
| `featured_image` | string | - | アイキャッチ画像 |
| `external_url` | string | - | 外部リンク（PRTimesなど） |
| `is_featured` | boolean | ✅ | トップ表示フラグ |
| `status` | enum | ✅ | draft / preview / published |
| `published_at` | timestamp | ✅ | 公開日時 |
| `created_at` | timestamp | ✅ | |
| `updated_at` | timestamp | ✅ | |

---

### 2.6 問い合わせフォーム（`contact_form`）

リード獲得フォームの設定

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | uuid | ✅ | |
| `tenant_id` | uuid | ✅ | |
| `name` | string | ✅ | フォーム名（内部用） |
| `type` | enum | ✅ | contact / download / diagnosis |
| `title` | string | ✅ | フォームタイトル |
| `description` | text | - | 説明文 |
| `fields` | json[] | ✅ | フォームフィールド定義 |
| `submit_label` | string | ✅ | 送信ボタンテキスト |
| `thanks_message` | text | ✅ | 送信完了メッセージ |
| `thanks_redirect` | string | - | 完了後リダイレクトURL |
| `notification_email` | string | - | 通知先メールアドレス |
| `notification_slack` | string | - | Slack Webhook URL |
| `is_active` | boolean | ✅ | 有効/無効 |
| `created_at` | timestamp | ✅ | |
| `updated_at` | timestamp | ✅ | |

**fields 構造:**
```json
{
  "name": "company",
  "type": "text",
  "label": "会社名",
  "required": true,
  "placeholder": "株式会社〇〇",
  "validation": null
}
```

**フィールドタイプ:**
- `text`: テキスト入力
- `email`: メールアドレス
- `phone`: 電話番号
- `textarea`: 複数行テキスト
- `select`: ドロップダウン
- `radio`: ラジオボタン
- `checkbox`: チェックボックス
- `hidden`: 隠しフィールド

---

## 3. データモデル

### 3.1 ER図（概要）

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   tenants   │────<│    users    │     │   media     │
└─────────────┘     └─────────────┘     └─────────────┘
       │                                       │
       │  ┌────────────────────────────────────┘
       │  │
       ▼  ▼
┌─────────────────────────────────────────────────────┐
│                      pages                          │
│  (service_lp / case_study / faq / company / news)   │
└─────────────────────────────────────────────────────┘
       │
       │
       ▼
┌─────────────┐     ┌─────────────┐
│    leads    │     │contact_forms│
└─────────────┘     └─────────────┘
```

### 3.2 テナント（`tenants`）

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 基本情報
  name VARCHAR(255) NOT NULL,           -- テナント名（会社名）
  slug VARCHAR(100) UNIQUE NOT NULL,    -- URLスラッグ（例: iyasaka, tokai-dengyo）
  
  -- ドメイン設定
  custom_domain VARCHAR(255),           -- カスタムドメイン（例: iyasaka.co.jp）
  subdomain VARCHAR(100),               -- サブドメイン（例: tokai.hpsaas.jp）
  
  -- プラン・課金
  plan VARCHAR(50) NOT NULL DEFAULT 'starter',  -- starter / growth / pro
  plan_started_at TIMESTAMP,
  plan_expires_at TIMESTAMP,
  stripe_customer_id VARCHAR(255),
  
  -- 設定
  settings JSONB DEFAULT '{}',          -- テナント固有設定
  brand_colors JSONB,                   -- ブランドカラー設定
  
  -- 状態
  status VARCHAR(20) NOT NULL DEFAULT 'active',  -- active / suspended / deleted
  
  -- タイムスタンプ
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- RLS ポリシー
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
```

### 3.3 ユーザー（`users`）

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  
  -- 認証情報（Supabase Auth連携）
  auth_id UUID UNIQUE,                  -- Supabase Auth の user.id
  email VARCHAR(255) NOT NULL,
  
  -- プロフィール
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  
  -- 権限
  role VARCHAR(50) NOT NULL DEFAULT 'editor',  -- owner / admin / editor / viewer
  
  -- 状態
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  last_login_at TIMESTAMP,
  
  -- タイムスタンプ
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE(tenant_id, email)
);

-- RLS: テナント内のユーザーのみ参照可能
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tenant users" ON users
  FOR SELECT USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

### 3.4 ページ（`pages`）

全ページタイプを統一テーブルで管理（Single Table Inheritance）

```sql
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  
  -- ページタイプ
  page_type VARCHAR(50) NOT NULL,       -- service_lp / case_study / faq / company / news
  
  -- 共通フィールド
  slug VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  
  -- コンテンツ（タイプごとに構造が異なる）
  content JSONB NOT NULL DEFAULT '{}',
  
  -- SEO
  seo_title VARCHAR(100),
  seo_description VARCHAR(300),
  og_image VARCHAR(500),
  canonical_url VARCHAR(500),
  
  -- AIEO
  structured_data JSONB,                -- JSON-LD 自動生成用
  aieo_score INT,                       -- AIEO スコア（0-100）
  
  -- 公開状態
  status VARCHAR(20) NOT NULL DEFAULT 'draft',  -- draft / preview / published
  published_at TIMESTAMP,
  
  -- メタ
  author_id UUID REFERENCES users(id),
  sort_order INT DEFAULT 0,
  
  -- タイムスタンプ
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  UNIQUE(tenant_id, page_type, slug)
);

-- インデックス
CREATE INDEX idx_pages_tenant_type ON pages(tenant_id, page_type);
CREATE INDEX idx_pages_status ON pages(status);

-- RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pages belong to tenant" ON pages
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

### 3.5 リード（`leads`）

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  form_id UUID REFERENCES contact_forms(id),
  
  -- 連絡先
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  
  -- フォームデータ
  form_data JSONB NOT NULL DEFAULT '{}',
  
  -- トラッキング
  source VARCHAR(100),                  -- フォーム種別（contact / download / diagnosis）
  landing_page VARCHAR(500),
  referrer VARCHAR(500),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_term VARCHAR(100),
  utm_content VARCHAR(100),
  
  -- 診断結果（診断フォームの場合）
  diagnosis_result JSONB,
  
  -- スコアリング
  lead_score INT DEFAULT 0,
  
  -- 対応状態
  status VARCHAR(50) NOT NULL DEFAULT 'new',  -- new / contacted / qualified / converted / lost
  assigned_to UUID REFERENCES users(id),
  notes TEXT,
  
  -- メタ
  ip_address VARCHAR(50),
  user_agent TEXT,
  
  -- タイムスタンプ
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_leads_tenant ON leads(tenant_id);
CREATE INDEX idx_leads_email ON leads(tenant_id, email);
CREATE INDEX idx_leads_created ON leads(tenant_id, created_at DESC);

-- RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leads belong to tenant" ON leads
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

### 3.6 メディア（`media`）

```sql
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  
  -- ファイル情報
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes BIGINT NOT NULL,
  
  -- ストレージ
  storage_path VARCHAR(500) NOT NULL,   -- Supabase Storage パス
  public_url VARCHAR(500) NOT NULL,
  
  -- メタデータ
  alt_text VARCHAR(255),
  caption TEXT,
  
  -- 画像の場合
  width INT,
  height INT,
  
  -- タイムスタンプ
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Media belong to tenant" ON media
  FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

### 3.7 問い合わせフォーム設定（`contact_forms`）

```sql
CREATE TABLE contact_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  
  -- 基本設定
  name VARCHAR(255) NOT NULL,           -- 内部名
  form_type VARCHAR(50) NOT NULL,       -- contact / download / diagnosis
  
  -- 表示設定
  title VARCHAR(255) NOT NULL,
  description TEXT,
  submit_label VARCHAR(100) NOT NULL DEFAULT '送信する',
  
  -- フィールド定義
  fields JSONB NOT NULL DEFAULT '[]',
  
  -- 完了後の動作
  thanks_message TEXT NOT NULL,
  thanks_redirect VARCHAR(500),
  
  -- 通知設定
  notification_emails TEXT[],
  slack_webhook VARCHAR(500),
  
  -- 状態
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- タイムスタンプ
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 4. 公開フローと権限

### 4.1 公開ステータス

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  draft   │────>│ preview  │────>│published │
│ (下書き) │     │(プレビュー)│     │ (公開)   │
└──────────┘     └──────────┘     └──────────┘
     ▲                                  │
     └──────────────────────────────────┘
              (非公開に戻す)
```

| ステータス | 説明 | 閲覧可能者 |
|-----------|------|-----------|
| `draft` | 下書き（編集中） | 管理画面内のみ |
| `preview` | プレビュー（確認用URL発行） | プレビューURL知っている人 |
| `published` | 公開 | 全員 |

### 4.2 権限ロール

| ロール | 説明 | ページ閲覧 | ページ編集 | ページ公開 | リード閲覧 | 設定変更 | ユーザー管理 |
|--------|------|-----------|-----------|-----------|-----------|---------|-------------|
| `viewer` | 閲覧者 | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `editor` | 編集者 | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| `admin` | 管理者 | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| `owner` | オーナー | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### 4.3 公開フロー

```
[Editor] ────> draft ────> preview ────> [Admin/Owner] ────> published
                │              │                                │
                │              │                                │
                ▼              ▼                                ▼
           保存のみ      プレビューURL         sitemap.xml に追加
           公開不可      確認可能              JSON-LD 生成
                                              OGP 有効化
```

---

## 5. AIEO（AI検索エンジン最適化）仕様

### 5.1 自動生成する構造化データ

| ページタイプ | JSON-LD タイプ |
|-------------|---------------|
| service_lp | `Product`, `Service`, `FAQPage` |
| case_study | `Article`, `Review` |
| faq | `FAQPage` |
| company | `Organization`, `LocalBusiness` |
| news | `NewsArticle`, `BlogPosting` |

### 5.2 AIEO 必須要件

1. **更新日の明示**: すべてのページに `updated_at` を表示
2. **短い回答**: FAQの `short_answer` は50文字以内で断定的に
3. **構造化データ**: ページタイプに応じたJSON-LDを自動挿入
4. **正規URL**: `canonical_url` を必ず設定
5. **サイトマップ**: 公開ページは自動的に sitemap.xml に追加

---

## 6. テナント別URL設計

### 6.1 URL構造

```
# サブドメイン方式（デフォルト）
https://{tenant_slug}.hpsaas.jp/
https://{tenant_slug}.hpsaas.jp/services/{service_slug}
https://{tenant_slug}.hpsaas.jp/cases/{case_slug}
https://{tenant_slug}.hpsaas.jp/faq
https://{tenant_slug}.hpsaas.jp/company
https://{tenant_slug}.hpsaas.jp/news/{news_slug}
https://{tenant_slug}.hpsaas.jp/contact

# カスタムドメイン方式
https://iyasaka.co.jp/
https://tokai-dengyo.co.jp/
```

### 6.2 管理画面URL

```
https://admin.hpsaas.jp/
https://admin.hpsaas.jp/{tenant_slug}/pages
https://admin.hpsaas.jp/{tenant_slug}/leads
https://admin.hpsaas.jp/{tenant_slug}/settings
```

---

## 7. 実装優先順位

### Phase 1（0〜2週間）: IYASAKA ソフトローンチ

**目標**: 営業に使える状態 + SaaS要件の確定

- [ ] 現行IYASAKAを「テナント0」として位置付け
- [ ] 6種類のページが公開されている状態を確認
- [ ] フォーム→リード保存の動作確認
- [ ] 計測（フォームCV、主要ページ閲覧、流入元）

### Phase 2（3〜6週間）: SaaSコア

**目標**: 東海電業社が同じ仕組みで立ち上がる

- [ ] `tenants` テーブル + RLS 設定
- [ ] `pages` テーブル（6タイプ対応）
- [ ] 管理画面（最小: ページ一覧・編集・公開）
- [ ] リード一覧・CSV出力
- [ ] 東海電業社をテナントとして追加・公開

### Phase 3（7週間〜）: 製品化

- [ ] 業種パック（電気工事テンプレート）
- [ ] AIコンテンツ生成（オプション）
- [ ] Stripe課金連携
- [ ] オンボーディングフロー

---

## 8. 変更履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|---------|
| 2026-01-16 | 1.0.0 | 初版作成 |

---

*このドキュメントはHP SaaSの設計における唯一の正本（SSOT）です。*
