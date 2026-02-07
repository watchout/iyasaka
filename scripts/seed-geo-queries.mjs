#!/usr/bin/env node

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ 環境変数 SUPABASE_URL / SUPABASE_SERVICE_KEY が設定されていません');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
  console.log('=== 🌱 GEO Queries 初期データ投入 ===\n');

  // 既存の誤紐づけクエリを無効化
  console.log('1️⃣ 既存の誤紐づけクエリを無効化...');
  const { error: disableError } = await supabase
    .from('geo_queries')
    .update({ enabled: false })
    .eq('text', '埼玉 無農薬 さつまいも 通販');

  if (disableError) {
    console.error('⚠️  無効化エラー（既に無い可能性）:', disableError.message);
  } else {
    console.log('✅ 誤紐づけクエリを無効化しました\n');
  }

  // 初期クエリを読み込み
  console.log('2️⃣ 初期クエリを読み込み...');
  const queries = JSON.parse(readFileSync('./scripts/initial-geo-queries.json', 'utf-8'));
  console.log(`✅ ${queries.length}件のクエリを読み込みました\n`);

  // 一括投入
  console.log('3️⃣ Supabaseに一括投入...');
  const { data, error } = await supabase
    .from('geo_queries')
    .insert(queries)
    .select();

  if (error) {
    console.error('❌ 投入エラー:', error);
    process.exit(1);
  }

  console.log(`✅ ${data.length}件のクエリを投入しました\n`);

  // 投入内容のサマリ
  console.log('=== 📊 投入サマリ ===\n');

  const summary = queries.reduce((acc, q) => {
    const key = `${q.target_slug} (${q.intent})`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  Object.entries(summary)
    .sort((a, b) => b[1] - a[1])
    .forEach(([key, count]) => {
      console.log(`  ${key}: ${count}件`);
    });

  console.log('\n🎉 初期データ投入完了！');
  console.log('\n次のステップ:');
  console.log('  1. 小バッチテスト実行（20件程度）');
  console.log('  2. /admin/geo でダッシュボード確認');
  console.log('  3. 低スコア項目からBoFU記事選定');
}

main().catch(console.error);


















