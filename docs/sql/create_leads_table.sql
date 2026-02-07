-- IYASAKA Leads Table (2026年版)
-- Supabaseで実行するSQL

-- テーブル作成
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 基本情報
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  employees TEXT,
  role TEXT,
  
  -- 製品情報
  primary_product_slug TEXT NOT NULL,
  related_product_slugs TEXT[],
  raw_pid TEXT,
  
  -- マーケティング情報
  source TEXT NOT NULL,
  article_slug TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  landing_page TEXT,
  referrer TEXT,
  
  -- 行動データ
  page_views INTEGER,
  time_to_conversion INTEGER,
  budget_phase TEXT,
  
  -- 診断結果
  diagnosis_result JSONB,
  
  -- その他
  notes TEXT,
  ip TEXT,
  
  -- ステータス
  status TEXT DEFAULT 'new',
  assigned_to TEXT,
  
  -- タイムスタンプ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_primary_product ON leads(primary_product_slug);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);

-- RLSポリシー（サービスロール用）
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- サービスロールは全権限
DROP POLICY IF EXISTS "Service role has full access" ON leads;
CREATE POLICY "Service role has full access" ON leads
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- updated_atの自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 完了メッセージ
SELECT 'leads table created successfully' as message;
