-- GEO / AIEO 計測用テーブル定義（Supabase / PostgreSQL 向け）

-- 1. クエリ定義テーブル
create table if not exists geo_queries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  text text not null, -- 例: '埼玉 無農薬 さつまいも 通販'
  intent text,        -- 'info' | 'compare' | 'convert' など
  target_type text not null, -- 'article' | 'product'
  target_slug text not null, -- content/articles or products.ts の slug
  enabled boolean not null default true
);

create index if not exists idx_geo_queries_target
  on geo_queries (target_type, target_slug);

-- 2. AI からの回答スナップショット
create table if not exists geo_snapshots (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  query_id uuid not null references geo_queries (id) on delete cascade,
  engine text not null, -- 'chatgpt', 'perplexity', 'ai_overviews' など
  raw_answer jsonb not null
);

create index if not exists idx_geo_snapshots_query_engine
  on geo_snapshots (query_id, engine);

-- 3. メトリクス（Presence / Visibility など）
create table if not exists geo_metrics (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid not null references geo_snapshots (id) on delete cascade,
  presence boolean not null,
  self_mentions integer not null default 0,
  other_mentions integer not null default 0,
  visibility_score double precision not null default 0
);

create index if not exists idx_geo_metrics_snapshot
  on geo_metrics (snapshot_id);






