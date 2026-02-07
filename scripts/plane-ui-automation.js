/**
 * Plane UI自動化スクリプト
 * Playwright使用してPlane UIを操作し、プロジェクト・イシューを自動作成
 * 
 * 使い方:
 * 1. Planeログイン情報を環境変数に設定
 * 2. node scripts/plane-ui-automation.js
 */

const { chromium } = require('playwright');

const PLANE_URL = 'https://plane.arrowsworks.com';
const PROJECT_DATA = {
  name: 'IYASAKA Web Renewal',
  identifier: 'IYASAKA',
  description: '不を解消し、事業を"弥栄"へ。統括パートナーサイト構築'
};

const LABELS = [
  { name: 'critical-path', color: '#EF4444' },
  { name: 'frontend', color: '#3B82F6' },
  { name: 'backend', color: '#10B981' },
  { name: 'content', color: '#F59E0B' },
  { name: 'seo', color: '#8B5CF6' },
  { name: 'security', color: '#F97316' },
  { name: 'design', color: '#EC4899' },
  { name: 'docs', color: '#6B7280' }
];

const CRITICAL_ISSUES = [
  {
    title: '[CP1] B1: 共通レイアウト構築',
    description: `Header/Footer/Mobile Menu実装

詳細: docs/ssot/B1-layout.md

チェックリスト:
- [ ] Header.vue
- [ ] Footer.vue
- [ ] HeaderMobile.vue
- [ ] FooterCta.vue
- [ ] layouts/default.vue`,
    priority: 'urgent',
    labels: ['critical-path', 'frontend']
  },
  {
    title: '[CP2] B2: Homeページ実装',
    description: `Hero/サービスカード/事例/FAQ

詳細: docs/ssot/B2-home.md (作成予定)

チェックリスト:
- [ ] Hero（USP 3パターン）
- [ ] サービスカード5種
- [ ] 導入事例3件
- [ ] FAQ 5-7問`,
    priority: 'urgent',
    labels: ['critical-path', 'frontend', 'content']
  },
  {
    title: '[CP3] お問い合わせ＆フォームAPI',
    description: `/contact + フォームAPI

チェックリスト:
- [ ] /contact ページUI
- [ ] /server/api/contact.post.ts
- [ ] Slack通知
- [ ] Notion連携
- [ ] Turnstile導入`,
    priority: 'urgent',
    labels: ['critical-path', 'frontend', 'backend']
  },
  {
    title: '[CP4] サービスページ5種',
    description: `弱電/保守/ホテル/AI/動画

チェックリスト:
- [ ] /services/low-voltage
- [ ] /services/maintenance
- [ ] /services/hotel
- [ ] /services/ai-dx
- [ ] /services/media`,
    priority: 'high',
    labels: ['critical-path', 'frontend', 'content']
  },
  {
    title: '[CP5] SEO・構造化データ',
    description: `JSON-LD/OGP/サイトマップ

チェックリスト:
- [ ] JSON-LD
- [ ] FAQスキーマ
- [ ] OGP設定
- [ ] サイトマップXML
- [ ] robots.txt`,
    priority: 'high',
    labels: ['critical-path', 'seo']
  }
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🚀 Plane UI自動化開始\n');
  
  // ログイン情報確認
  const email = process.env.PLANE_EMAIL || 'kaneko@arrowsworks.com';
  const password = process.env.PLANE_PASSWORD;
  
  if (!password) {
    console.error('❌ エラー: PLANE_PASSWORD環境変数が設定されていません');
    console.log('\n使い方:');
    console.log('  export PLANE_EMAIL="your-email@example.com"');
    console.log('  export PLANE_PASSWORD="your-password"');
    console.log('  node scripts/plane-ui-automation.js');
    process.exit(1);
  }
  
  const browser = await chromium.launch({
    headless: false, // デバッグ用にブラウザ表示
    slowMo: 500 // 操作を見やすくする
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // 1. Planeログイン
    console.log('1️⃣ Planeにログイン中...');
    await page.goto(PLANE_URL);
    await page.waitForLoadState('networkidle');
    
    // メールアドレス入力
    await page.fill('input[name="email"], input[type="email"]', email);
    await page.fill('input[name="password"], input[type="password"]', password);
    await page.click('button[type="submit"]');
    
    console.log('   ✅ ログイン成功\n');
    await sleep(2000);
    
    // 2. プロジェクト作成
    console.log('2️⃣ プロジェクト作成中...');
    
    // 「New Project」ボタンをクリック
    await page.click('text=/.*new project.*/i');
    await sleep(1000);
    
    // プロジェクト情報入力
    await page.fill('input[name="name"]', PROJECT_DATA.name);
    await page.fill('input[name="identifier"]', PROJECT_DATA.identifier);
    await page.fill('textarea[name="description"]', PROJECT_DATA.description);
    
    // 作成ボタンクリック
    await page.click('button[type="submit"]:has-text("Create")');
    
    console.log(`   ✅ プロジェクト作成: ${PROJECT_DATA.name}\n`);
    await sleep(2000);
    
    // 3. ラベル作成
    console.log('3️⃣ ラベル作成中...');
    
    // Settings → Labels
    await page.click('text=/.*settings.*/i');
    await sleep(1000);
    await page.click('text=/.*labels.*/i');
    await sleep(1000);
    
    for (const label of LABELS) {
      try {
        await page.click('text=/.*new label.*/i, button:has-text("New")');
        await sleep(500);
        
        await page.fill('input[name="name"], input[placeholder*="Label"]', label.name);
        await page.fill('input[type="color"], input[name="color"]', label.color);
        
        await page.click('button[type="submit"]:has-text("Create"), button:has-text("Save")');
        console.log(`   ✅ ラベル: ${label.name}`);
        await sleep(500);
      } catch (e) {
        console.log(`   ⚠️  ラベル ${label.name} スキップ (既存または作成エラー)`);
      }
    }
    console.log('');
    
    // 4. Issuesに戻る
    console.log('4️⃣ Critical Pathイシュー作成中...');
    await page.click('text=/.*issues.*/i');
    await sleep(1000);
    
    // 5. Critical Pathイシュー作成
    for (const issue of CRITICAL_ISSUES) {
      try {
        // New Issueボタンクリック
        await page.click('text=/.*new issue.*/i, button:has-text("New")');
        await sleep(500);
        
        // タイトル入力
        await page.fill('input[name="name"], input[placeholder*="Title"], input[placeholder*="Issue"]', issue.title);
        
        // 説明入力
        await page.fill('textarea[name="description"], textarea[placeholder*="Description"]', issue.description);
        
        // Priority設定
        await page.click(`text=/.*${issue.priority}.*/i`);
        
        // 作成
        await page.click('button[type="submit"]:has-text("Create")');
        console.log(`   ✅ ${issue.title}`);
        await sleep(1000);
      } catch (e) {
        console.log(`   ⚠️  ${issue.title} 作成エラー: ${e.message}`);
      }
    }
    console.log('');
    
    console.log('✨ セットアップ完了！\n');
    console.log(`🔗 プロジェクトURL: ${PLANE_URL}/${PROJECT_DATA.identifier.toLowerCase()}/issues`);
    console.log('');
    console.log('📝 次のステップ:');
    console.log('   1. Planeでプロジェクトを確認');
    console.log('   2. イシューの優先順位を調整');
    console.log('   3. Critical Path [CP1]から実装開始！');
    
  } catch (error) {
    console.error('\n❌ エラーが発生しました:');
    console.error(error.message);
    console.error('\nスクリーンショット保存中...');
    await page.screenshot({ path: '/tmp/plane-automation-error.png', fullPage: true });
    console.error('スクリーンショット: /tmp/plane-automation-error.png');
  } finally {
    await sleep(3000); // 結果確認時間
    await browser.close();
  }
}

main().catch(console.error);



