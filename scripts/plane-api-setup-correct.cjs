/**
 * Plane API完全自動セットアップ（正しいエンドポイント版）
 * 
 * 使い方: node scripts/plane-api-setup-correct.cjs
 */

const https = require('https');
const { loadDotEnv } = require('./_load-env.cjs');

loadDotEnv();

const PLANE_URL = process.env.PLANE_URL || 'https://plane.arrowsworks.com';
const WORKSPACE_SLUG = process.env.PLANE_WORKSPACE_SLUG || 'co';
const API_KEY = process.env.PLANE_API_KEY || '';

if (!API_KEY) {
  console.error('❌ PLANE_API_KEY が未設定です（.env または環境変数に設定してください）');
  process.exit(1);
}

function apiRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, PLANE_URL);
    const options = {
      method,
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body));
          } catch {
            resolve(body);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });
    
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function main() {
  console.log('🚀 IYASAKA Planeプロジェクト自動セットアップ\n');
  
  try {
    // 1. プロジェクト作成
    console.log('1️⃣ IYASAKAプロジェクト作成中...');
    const project = await apiRequest('POST', `/api/v1/workspaces/${WORKSPACE_SLUG}/projects/`, {
      name: 'IYASAKA Web Renewal',
      identifier: 'IYASAKA',
      description: '不を解消し、事業を"弥栄"へ。統括パートナーサイト構築',
      network: 2
    });
    console.log(`   ✅ プロジェクト作成: ${project.name} (${project.identifier})`);
    console.log(`   Project ID: ${project.id}\n`);
    
    const projectId = project.id;
    
    // 2. ラベル作成
    console.log('2️⃣ ラベル作成中...');
    const labels = [
      { name: 'critical-path', color: '#EF4444' },
      { name: 'frontend', color: '#3B82F6' },
      { name: 'backend', color: '#10B981' },
      { name: 'content', color: '#F59E0B' },
      { name: 'seo', color: '#8B5CF6' },
      { name: 'security', color: '#F97316' }
    ];
    
    for (const label of labels) {
      try {
        await apiRequest('POST', `/api/v1/workspaces/${WORKSPACE_SLUG}/projects/${projectId}/labels/`, label);
        console.log(`   ✅ ${label.name}`);
      } catch (e) {
        console.log(`   ⚠️  ${label.name} スキップ`);
      }
    }
    console.log('');
    
    // 3. Critical Pathイシュー作成
    console.log('3️⃣ Critical Pathイシュー作成中...');
    const issues = [
      {
        name: '[CP1] B1: 共通レイアウト構築',
        description: 'Header/Footer/Mobile Menu実装\n\n詳細: docs/ssot/B1-layout.md',
        priority: 'urgent'
      },
      {
        name: '[CP2] B2: Homeページ実装',
        description: 'Hero/サービスカード/事例/FAQ\n\n詳細: docs/ssot/B2-home.md',
        priority: 'urgent'
      },
      {
        name: '[CP3] お問い合わせ＆フォームAPI',
        description: '/contact + フォームAPI\n\nSlack/Notion連携',
        priority: 'urgent'
      },
      {
        name: '[CP4] サービスページ5種',
        description: '弱電/保守/ホテル/AI/動画',
        priority: 'high'
      },
      {
        name: '[CP5] SEO・構造化データ',
        description: 'JSON-LD/OGP/サイトマップ',
        priority: 'high'
      }
    ];
    
    for (const issue of issues) {
      try {
        await apiRequest('POST', `/api/v1/workspaces/${WORKSPACE_SLUG}/projects/${projectId}/issues/`, issue);
        console.log(`   ✅ ${issue.name}`);
      } catch (e) {
        console.log(`   ⚠️  ${issue.name}: ${e.message}`);
      }
    }
    console.log('');
    
    console.log('✨ セットアップ完了！\n');
    console.log(`🔗 プロジェクトURL: ${PLANE_URL}/${WORKSPACE_SLUG}/projects/${projectId}/issues`);
    console.log('');
    console.log('📝 次のステップ:');
    console.log('   1. Planeでプロジェクトを確認');
    console.log('   2. [CP1] レイアウト実装開始');
    console.log('   3. docs/QUICK_START.md に従って開発');
    
  } catch (error) {
    console.error('\n❌ エラー:', error.message);
    process.exit(1);
  }
}

main();

