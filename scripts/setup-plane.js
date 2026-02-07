/**
 * IYASAKA Plane Project Setup Script
 * Usage: node scripts/setup-plane.js
 */

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { loadDotEnv } = require('./_load-env.cjs');

loadDotEnv();

const PLANE_URL = process.env.PLANE_URL || 'https://plane.arrowsworks.com';
const API_KEY = process.env.PLANE_API_KEY || '';

if (!API_KEY) {
  console.error('❌ PLANE_API_KEY が未設定です（.env または環境変数に設定してください）');
  process.exit(1);
}

// Fetch polyfill for Node 18
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function planeAPI(endpoint, method = 'GET', data = null) {
  const url = `${PLANE_URL}/api/v1${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    }
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  console.log(`   📡 ${method} ${endpoint}`);
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error (${response.status}): ${error}`);
  }
  
  return response.json();
}

async function main() {
  console.log('🚀 IYASAKA Planeプロジェクトセットアップ開始\n');
  
  try {
    // 1. ワークスペース取得
    console.log('1️⃣ ワークスペース確認中...');
    const workspaces = await planeAPI('/workspaces/');
    const workspace = workspaces[0];
    console.log(`   ✅ ワークスペース: ${workspace.name} (${workspace.slug})\n`);
    
    const workspaceSlug = workspace.slug;
    
    // 2. プロジェクト作成
    console.log('2️⃣ IYASAKAプロジェクト作成中...');
    const project = await planeAPI(`/workspaces/${workspaceSlug}/projects/`, 'POST', {
      name: 'IYASAKA Web Renewal',
      identifier: 'IYASAKA',
      description: '不を解消し、事業を"弥栄"へ。統括パートナーサイト構築 - Critical Path管理',
      network: 0
    });
    console.log(`   ✅ プロジェクト: ${project.name} (${project.identifier})\n`);
    
    const projectId = project.id;
    
    // 3. ラベル作成
    console.log('3️⃣ ラベル作成中...');
    const labels = [
      { name: 'critical-path', color: '#EF4444', description: 'Critical Path上の最優先タスク' },
      { name: 'frontend', color: '#3B82F6', description: 'フロントエンド実装' },
      { name: 'backend', color: '#10B981', description: 'バックエンド/API' },
      { name: 'content', color: '#F59E0B', description: 'コンテンツ作成' },
      { name: 'seo', color: '#8B5CF6', description: 'SEO関連' },
      { name: 'security', color: '#F97316', description: 'セキュリティ' },
      { name: 'design', color: '#EC4899', description: 'デザイン' },
      { name: 'docs', color: '#6B7280', description: 'ドキュメント' }
    ];
    
    const labelMap = {};
    for (const label of labels) {
      const created = await planeAPI(`/workspaces/${workspaceSlug}/projects/${projectId}/issue-labels/`, 'POST', label);
      labelMap[label.name] = created.id;
      console.log(`   ✅ ${label.name}`);
    }
    console.log('');
    
    // 4. モジュール作成
    console.log('4️⃣ モジュール作成中...');
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const modules = [
      { name: 'Phase A: 基盤・規格', description: '外側（規格・要件）' },
      { name: 'Phase B: Layout', description: '共通レイアウト構築' },
      { name: 'Phase B: Pages', description: 'ページ実装' },
      { name: 'Phase C: Integration', description: 'API連携・フォーム' },
      { name: 'Phase C: Optimization', description: 'SEO・パフォーマンス' },
      { name: 'Phase D: Release', description: 'QA・デプロイ・DNS' }
    ];
    
    const moduleMap = {};
    for (const module of modules) {
      const created = await planeAPI(`/workspaces/${workspaceSlug}/projects/${projectId}/modules/`, 'POST', {
        ...module,
        start_date: startDate,
        target_date: endDate,
        status: 'backlog'
      });
      moduleMap[module.name] = created.id;
      console.log(`   ✅ ${module.name}`);
    }
    console.log('');
    
    // 5. Critical Pathイシュー作成
    console.log('5️⃣ Critical Pathイシュー作成中...');
    
    const issues = [
      {
        name: '[CP1] B1: 共通レイアウト構築',
        description: `## 概要
Header/Footer/Mobile Menu/固定CTA実装

## 詳細SSOT
📄 docs/ssot/B1-layout.md

## チェックリスト
- [ ] Header.vue
- [ ] Footer.vue
- [ ] HeaderMobile.vue
- [ ] FooterCta.vue
- [ ] layouts/default.vue

## 優先度
🔴 Critical Path #1 - すべてのページの基盤`,
        priority: 'urgent',
        labels: ['critical-path', 'frontend'],
        module: 'Phase B: Layout'
      },
      {
        name: '[CP2] B2: Homeページ実装',
        description: `## 概要
Hero/サービスカード5種/事例3件/FAQ

## 詳細SSOT
📄 docs/ssot/B2-home.md (作成予定)

## チェックリスト
- [ ] Hero（USP 3パターン）
- [ ] サービスカード（AI/弱電/OPS/MEDIA/AGRI）
- [ ] 導入事例3件
- [ ] FAQ 5-7問

## 優先度
🔴 Critical Path #2 - ファーストインプレッション`,
        priority: 'urgent',
        labels: ['critical-path', 'frontend', 'content'],
        module: 'Phase B: Pages'
      },
      {
        name: '[CP3] B5+C1: お問い合わせ＆フォームAPI',
        description: `## 概要
お問い合わせページUI + バックエンドAPI実装

## 詳細SSOT
📄 docs/ssot/B5-other-pages.md
📄 docs/ssot/C1-form-crm.md

## チェックリスト
- [ ] /contact ページUI
- [ ] /server/api/contact.post.ts
- [ ] Slack通知（#lead）
- [ ] Notion DB連携
- [ ] Cloudflare Turnstile

## 優先度
🔴 Critical Path #3 - リード獲得の要`,
        priority: 'urgent',
        labels: ['critical-path', 'frontend', 'backend'],
        module: 'Phase C: Integration'
      },
      {
        name: '[CP4] B3: サービスページ5種',
        description: `## 概要
弱電工事/オンサイト保守/ホテルDX/AI導入/動画配信

## 詳細SSOT
📄 docs/ssot/B3-services.md (作成予定)

## チェックリスト
- [ ] /services/low-voltage
- [ ] /services/maintenance
- [ ] /services/hotel
- [ ] /services/ai-dx
- [ ] /services/media

## 優先度
🔴 Critical Path #4 - コンバージョン設計`,
        priority: 'high',
        labels: ['critical-path', 'frontend', 'content'],
        module: 'Phase B: Pages'
      },
      {
        name: '[CP5] C2: SEO・構造化データ',
        description: `## 概要
JSON-LD/OGP/サイトマップ/robots.txt

## 詳細SSOT
📄 docs/ssot/C2-seo.md (作成予定)

## チェックリスト
- [ ] JSON-LD（Organization/LocalBusiness）
- [ ] FAQスキーマ
- [ ] OGP設定
- [ ] サイトマップXML
- [ ] robots.txt

## 優先度
🔴 Critical Path #5 - 検索流入確保`,
        priority: 'high',
        labels: ['critical-path', 'seo'],
        module: 'Phase C: Optimization'
      },
      {
        name: 'A3: 法務ページ実装',
        description: `## 概要
/privacy /external-transmission /cookies /terms

## チェックリスト
- [ ] プライバシーポリシー
- [ ] 外部送信規律
- [ ] Cookie取扱い
- [ ] 利用規約
- [ ] フッターリンク追加`,
        priority: 'high',
        labels: ['frontend', 'docs'],
        module: 'Phase A: 基盤・規格'
      },
      {
        name: 'B4: 導入事例3件',
        description: `## 概要
事例テンプレート + 事例#1-3作成

## チェックリスト
- [ ] 事例テンプレート設計
- [ ] 事例#1: ホテル弱電保守
- [ ] 事例#2: 店舗防犯カメラ
- [ ] 事例#3: 配信システム
- [ ] /cases/[slug] 動的ルート`,
        priority: 'medium',
        labels: ['frontend', 'content'],
        module: 'Phase B: Pages'
      },
      {
        name: 'B5: その他ページ（料金/会社/フロー等）',
        description: `## 概要
/pricing /flow /company /downloads /blog

## チェックリスト
- [ ] 料金・プラン
- [ ] ご利用の流れ
- [ ] 会社情報
- [ ] 資料ダウンロード
- [ ] ブログ一覧`,
        priority: 'medium',
        labels: ['frontend', 'content'],
        module: 'Phase B: Pages'
      },
      {
        name: 'C3: セキュリティヘッダ・CSP',
        description: `## 概要
HSTS/CSP/X-Frame-Options/レート制限

## チェックリスト
- [ ] vercel.json セキュリティヘッダ
- [ ] CSP設定（Report-Only → 本番）
- [ ] /server/api/csp-report.post.ts
- [ ] レート制限（10req/分）
- [ ] .env.sample 作成`,
        priority: 'medium',
        labels: ['backend', 'security'],
        module: 'Phase C: Optimization'
      },
      {
        name: 'C4: Plausible解析導入',
        description: `## 概要
解析基盤（no cookie）+ イベント設定

## チェックリスト
- [ ] Plausible導入
- [ ] カスタムイベント（lead_download/contact/quote）
- [ ] UTM保持プラグイン
- [ ] /thanks サンクスページ
- [ ] 外部送信一覧更新`,
        priority: 'medium',
        labels: ['backend'],
        module: 'Phase C: Optimization'
      },
      {
        name: 'C5: パフォーマンス最適化',
        description: `## 概要
Lighthouse 95+ 達成

## チェックリスト
- [ ] 画像最適化（WebP/遅延読込）
- [ ] フォント最適化
- [ ] コード分割
- [ ] CLS < 0.1
- [ ] LCP < 2.5s`,
        priority: 'medium',
        labels: ['frontend'],
        module: 'Phase C: Optimization'
      },
      {
        name: 'C6: アクセシビリティ対応',
        description: `## 概要
JIS X 8341-3 AA準拠

## チェックリスト
- [ ] コントラスト比 4.5:1
- [ ] 代替テキスト完備
- [ ] キーボード操作対応
- [ ] フォーカス可視化
- [ ] ARIA属性設定
- [ ] セルフチェック完了`,
        priority: 'medium',
        labels: ['frontend'],
        module: 'Phase C: Optimization'
      },
      {
        name: 'D1: Go-Live QA',
        description: `## 概要
全ページQA・フォームテスト

## チェックリスト
- [ ] SP/PC全ページ確認
- [ ] フォーム送信テスト
- [ ] 404/500カスタムページ
- [ ] 法務ページ最終確認
- [ ] NAP情報統一`,
        priority: 'low',
        labels: ['frontend', 'backend'],
        module: 'Phase D: Release'
      },
      {
        name: 'D2: Vercelデプロイ',
        description: `## 概要
本番環境デプロイ・監視設定

## チェックリスト
- [ ] Vercel設定（東京リージョン）
- [ ] 環境変数設定
- [ ] プレビュー確認
- [ ] 本番デプロイ
- [ ] UptimeRobot設定
- [ ] Vercel Analytics有効化`,
        priority: 'low',
        labels: ['backend'],
        module: 'Phase D: Release'
      }
    ];
    
    for (const issue of issues) {
      const created = await planeAPI(`/workspaces/${workspaceSlug}/projects/${projectId}/issues/`, 'POST', {
        name: issue.name,
        description: issue.description,
        priority: issue.priority
      });
      console.log(`   ✅ ${issue.name}`);
      
      // ラベル付与は後で手動で（APIの制限による）
    }
    console.log('');
    
    console.log('✨ セットアップ完了！\n');
    console.log(`🔗 プロジェクトURL: ${PLANE_URL}/${workspaceSlug}/projects/${projectId}/issues`);
    console.log('');
    console.log('📝 次のステップ:');
    console.log('   1. Planeでプロジェクトを確認');
    console.log('   2. イシューにラベル/モジュールを手動で割り当て');
    console.log('   3. Critical Path（[CP1]〜[CP5]）から実装開始！');
    console.log('');
    console.log('🎯 Critical Path順:');
    console.log('   [CP1] レイアウト → [CP2] Home → [CP3] フォーム → [CP4] サービス → [CP5] SEO');
    
  } catch (error) {
    console.error('\n❌ エラーが発生しました:');
    console.error(error.message);
    if (error.stack) {
      console.error('\nスタックトレース:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();



