/**
 * ROADMAP.mdの全タスクをPlaneに同期
 */

const https = require('https');
const { loadDotEnv } = require('./_load-env.cjs');

// Load .env (if present) so `node scripts/*.cjs` works without manual export
loadDotEnv();

const PLANE_URL = process.env.PLANE_URL || 'https://plane.arrowsworks.com';
const WORKSPACE_SLUG = process.env.PLANE_WORKSPACE_SLUG || 'co';
const PROJECT_ID = process.env.PLANE_PROJECT_ID || '8665022d-c448-4580-b328-1922ccbf336a';
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
  console.log('🚀 ROADMAP全タスクをPlaneに同期\n');
  
  const allIssues = [
    // Phase A
    {
      name: 'A3: 法務ページ実装',
      description: '/privacy /external-transmission /cookies /terms\n\nチェックリスト:\n- [ ] プライバシーポリシー\n- [ ] 外部送信規律\n- [ ] Cookie取扱い\n- [ ] 利用規約\n- [ ] フッターリンク追加',
      priority: 'high'
    },
    {
      name: 'A4: サイトマップ・情報設計確定',
      description: '全ページURL設計と内部リンク構造\n\n詳細: docs/ssot/A4-sitemap.md',
      priority: 'medium'
    },
    
    // Phase B
    {
      name: 'B4: 導入事例3件作成',
      description: '事例テンプレート + 事例#1-3\n\nチェックリスト:\n- [ ] 事例テンプレート設計\n- [ ] 事例#1: ホテル弱電保守\n- [ ] 事例#2: 店舗防犯カメラ\n- [ ] 事例#3: 配信システム\n- [ ] /cases/[slug] 動的ルート',
      priority: 'medium'
    },
    {
      name: 'B5: その他ページ（料金/会社/フロー等）',
      description: '/pricing /flow /company /downloads /blog\n\nチェックリスト:\n- [ ] 料金・プラン\n- [ ] ご利用の流れ\n- [ ] 会社情報\n- [ ] 資料ダウンロード\n- [ ] ブログ一覧',
      priority: 'medium'
    },
    
    // Phase C
    {
      name: 'C3: セキュリティヘッダ・CSP',
      description: 'HSTS/CSP/X-Frame-Options/レート制限\n\nチェックリスト:\n- [ ] vercel.json セキュリティヘッダ\n- [ ] CSP設定（Report-Only → 本番）\n- [ ] /server/api/csp-report.post.ts\n- [ ] レート制限（10req/分）\n- [ ] .env.sample 作成',
      priority: 'medium'
    },
    {
      name: 'C4: Plausible解析導入',
      description: '解析基盤（no cookie）+ イベント設定\n\nチェックリスト:\n- [ ] Plausible導入\n- [ ] カスタムイベント（lead_download/contact/quote）\n- [ ] UTM保持プラグイン\n- [ ] /thanks サンクスページ\n- [ ] 外部送信一覧更新',
      priority: 'medium'
    },
    {
      name: 'C5: パフォーマンス最適化',
      description: 'Lighthouse 95+ 達成\n\nチェックリスト:\n- [ ] 画像最適化（WebP/遅延読込）\n- [ ] フォント最適化\n- [ ] コード分割\n- [ ] CLS < 0.1\n- [ ] LCP < 2.5s',
      priority: 'medium'
    },
    {
      name: 'C6: アクセシビリティ対応',
      description: 'JIS X 8341-3 AA準拠\n\nチェックリスト:\n- [ ] コントラスト比 4.5:1\n- [ ] 代替テキスト完備\n- [ ] キーボード操作対応\n- [ ] フォーカス可視化\n- [ ] ARIA属性設定\n- [ ] セルフチェック完了',
      priority: 'medium'
    },
    
    // Phase D
    {
      name: 'D1: Go-Live QA',
      description: '全ページQA・フォームテスト\n\nチェックリスト:\n- [ ] SP/PC全ページ確認\n- [ ] フォーム送信テスト\n- [ ] 404/500カスタムページ\n- [ ] 法務ページ最終確認\n- [ ] NAP情報統一',
      priority: 'low'
    },
    {
      name: 'D2: Vercelデプロイ',
      description: '本番環境デプロイ・監視設定\n\nチェックリスト:\n- [ ] Vercel設定（東京リージョン）\n- [ ] 環境変数設定\n- [ ] プレビュー確認\n- [ ] 本番デプロイ\n- [ ] UptimeRobot設定\n- [ ] Vercel Analytics有効化',
      priority: 'low'
    },
    {
      name: 'D3: ドメイン・DNS移行',
      description: 'arrowsworks.com DNS切り替え\n\nチェックリスト:\n- [ ] 301リダイレクトマップ\n- [ ] GBP更新\n- [ ] メールアドレス更新\n- [ ] 90日観測期間',
      priority: 'low'
    }
  ];
  
  let successCount = 0;
  let failCount = 0;
  
  console.log(`📝 ${allIssues.length}個のタスクを作成中...\n`);
  
  for (const issue of allIssues) {
    try {
      await apiRequest('POST', `/api/v1/workspaces/${WORKSPACE_SLUG}/projects/${PROJECT_ID}/issues/`, issue);
      console.log(`   ✅ ${issue.name}`);
      successCount++;
    } catch (e) {
      console.log(`   ❌ ${issue.name}: ${e.message}`);
      failCount++;
    }
  }
  
  console.log('');
  console.log('✨ 同期完了！\n');
  console.log(`📊 結果:`);
  console.log(`   成功: ${successCount}個`);
  console.log(`   失敗: ${failCount}個`);
  console.log(`   合計: ${successCount + failCount}個`);
  console.log('');
  console.log(`🔗 プロジェクトURL: ${PLANE_URL}/${WORKSPACE_SLUG}/projects/${PROJECT_ID}/issues`);
}

main();
