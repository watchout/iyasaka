/**
 * Create "management" issues in a Plane project (batch).
 *
 * Usage:
 *   node scripts/plane-create-management-issues.cjs --project-id <PROJECT_ID> [--workspace co] [--base-url https://plane.arrowsworks.com]
 *
 * Notes:
 * - Reads `PLANE_API_KEY` from `.env` (via scripts/_load-env.cjs) or environment variables.
 * - This script is intentionally non-destructive (no delete/update). Run once per project.
 */
/* eslint-disable no-console */
const https = require('node:https')
const { loadDotEnv } = require('./_load-env.cjs')
 
// Load .env (if present) so `node scripts/*.cjs` works without manual export
loadDotEnv()

const DEFAULT_PLANE_URL = 'https://plane.arrowsworks.com'
const DEFAULT_WORKSPACE_SLUG = 'co'
 
function parseArgs(argv) {
  const args = { _: [] }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith('--')) {
      args._.push(a)
      continue
    }
    const key = a.slice(2)
    const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true'
    args[key] = val
  }
  return args
}
 
function apiRequest({ baseUrl, apiKey, method, pathname, data }) {
  return new Promise((resolve, reject) => {
    const url = new URL(pathname, baseUrl)
    const req = https.request(
      url,
      {
        method,
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json'
        }
      },
      (res) => {
        let body = ''
        res.on('data', (c) => (body += c))
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(body))
            } catch {
              resolve(body)
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${body}`))
          }
        })
      }
    )
    req.on('error', reject)
    if (data) req.write(JSON.stringify(data))
    req.end()
  })
}
 
function buildIssues() {
  // 社名変更（2026-03-30）に向けた初期タスク一式（経営プロジェクト向け）
  return [
    {
      name: '[NC-00][Urgent][Due:2026-02-07] 社名変更プロジェクト計画（全体設計）',
      priority: 'urgent',
      description: [
        '## 目的',
        '2026-03-30 社名変更（有限会社アローズワークス → 有限会社IYASAKA）を“事故ゼロ”で実行する。',
        '',
        '## 成果物',
        '- 全体マイルストーン（D-60/D-30/D-7/D-day/D+30）',
        '- 役割分担（法務/IT/広報/営業/会計）',
        '- 対象システム棚卸し（Web/メール/会計/契約/各SaaS）',
        '- リスクとロールバック方針',
        '',
        '## チェックリスト',
        '- [ ] 社名の正式表記（和文/カナ/英文）確定',
        '- [ ] 旧社名併記の期間・表記ルール確定',
        '- [ ] 主要ステークホルダー一覧（顧客/仕入/行政/金融）',
        '- [ ] 切替当日の意思決定者（最終Go/No-Go）確定',
        '',
        '## 前提',
        '- 現在: arrowsworks.com（有限会社アローズワークス）',
        '- 変更後: iyasaka.co（有限会社IYASAKA）',
        '- 変更日: 2026-03-30'
      ].join('\n')
    },
    {
      name: '[BRAND-01][Urgent][Due:2026-02-07] 正規表記ルール確定（旧社名/新社名/ドメイン）',
      priority: 'urgent',
      description: [
        '## 目的',
        '社名変更までの“併記期間”を含め、全媒体の正規表記を一本化する。',
        '',
        '## 決めること',
        '- 現行表記の採用可否（例: 「IYASAKA（運営：有限会社アローズワークス）」）',
        '- 変更日以降の表記（「有限会社IYASAKA」単独）',
        '- ドメイン方針（arrowsworks.com → iyasaka.co）',
        '',
        '## チェックリスト',
        '- [ ] Webの会社概要/フッター/法務ページの表記',
        '- [ ] メール署名',
        '- [ ] 見積/請求/契約',
        '- [ ] SNS/各種アカウント'
      ].join('\n')
    },
    {
      name: '[LEGAL-01][High][Due:2026-02-10] 登記手続き要件確認（司法書士/必要書類/日程）',
      priority: 'high',
      description: [
        '## 目的',
        '登記変更（商号変更）に必要な要件・必要書類・手続き順を確定する。',
        '',
        '## チェックリスト',
        '- [ ] 司法書士（または担当者）決定',
        '- [ ] 必要書類一覧化（議事録/定款/委任状 等）',
        '- [ ] 申請スケジュール確定（提出日/登記完了見込み）',
        '- [ ] 変更後の商号表記（登記上の表記）確定',
        '- [ ] 手数料/登録免許税/実費見積の把握'
      ].join('\n')
    },
    {
      name: '[LEGAL-02][High][Due:2026-03-10] 登記書類ドラフト作成（議事録/定款変更/委任状）',
      priority: 'high',
      description: [
        '## 目的',
        '登記申請に必要な書類をドラフト→レビュー→確定する。',
        '',
        '## チェックリスト',
        '- [ ] 定款（商号）変更案',
        '- [ ] 議事録（必要な体裁で）',
        '- [ ] 委任状（司法書士手続きの場合）',
        '- [ ] 押印/署名の準備（実印・印鑑証明 等）'
      ].join('\n')
    },
    {
      name: '[IT-01][High][Due:2026-03-05] iyasaka.co 本番インフラ設計（DNS/証明書/デプロイ）',
      priority: 'high',
      description: [
        '## 目的',
        '新ドメインで安定運用できる状態を作る。',
        '',
        '## チェックリスト',
        '- [ ] DNS設計（A/AAAA/CNAME/TXT）',
        '- [ ] TLS/証明書（自動更新）',
        '- [ ] 本番デプロイ手段の確定（現状に合わせる）',
        '- [ ] 障害時の連絡/復旧手順'
      ].join('\n')
    },
    {
      name: '[IT-02][High][Due:2026-03-15] メール移行（@iyasaka.co）: SPF/DKIM/DMARC + 転送',
      priority: 'high',
      description: [
        '## 目的',
        '社名変更後の連絡が滞らないよう、メール到達性と移行手順を固める。',
        '',
        '## チェックリスト',
        '- [ ] 主要アドレス作成（例: info@iyasaka.co / sales@iyasaka.co）',
        '- [ ] SPF/DKIM/DMARC 設定',
        '- [ ] arrowsworks.com からの転送（期間・運用）',
        '- [ ] 署名テンプレ（旧社名併記期間含む）'
      ].join('\n')
    },
    {
      name: '[SEO-01][High][Due:2026-03-15] 301リダイレクトマップ作成（arrowsworks.com → iyasaka.co）',
      priority: 'high',
      description: [
        '## 目的',
        '検索評価とユーザー導線を途切れさせない。',
        '',
        '## チェックリスト',
        '- [ ] 旧→新URLを原則1対1で対応表作成',
        '- [ ] 重要URL（/contact /company /services /products /articles 等）の確認',
        '- [ ] クエリパラメータ（p_id 等）の保持方針',
        '- [ ] 302禁止（原則301）'
      ].join('\n')
    },
    {
      name: '[WEB-01][High][Due:2026-03-25] Webサイトの社名・ドメイン切替（構造化データ含む）',
      priority: 'high',
      description: [
        '## 目的',
        'サイト上の実在性情報（Organization/LocalBusiness）と法務表示を新社名へ整合させる。',
        '',
        '## チェックリスト',
        '- [ ] 会社概要ページ（社名/住所/電話/代表/沿革）',
        '- [ ] フッターNAP/法務リンク',
        '- [ ] JSON-LD（Organization/LocalBusiness/Breadcrumb）',
        '- [ ] canonical/OGP/siteUrl（NUXT_PUBLIC_SITE_URL）',
        '- [ ] 社名変更予定の注記（〜2026-03-30）をどこに残すか'
      ].join('\n')
    },
    {
      name: '[FIN-01][High][Due:2026-03-20] 請求書/見積書/契約書テンプレの社名更新',
      priority: 'high',
      description: [
        '## 目的',
        '新社名での取引が止まらないよう、対外文書を更新する。',
        '',
        '## チェックリスト',
        '- [ ] 見積書テンプレ更新',
        '- [ ] 請求書テンプレ更新',
        '- [ ] 契約書ひな形（当事者表記/捺印欄/振込先表記）更新',
        '- [ ] 旧社名併記が必要な期間の記載ルール',
        '- [ ] 取引先向け案内（書面）テンプレ作成'
      ].join('\n')
    },
    {
      name: '[OPS-01][High][Due:2026-03-25] 取引先/顧客への社名変更通知（リスト作成→送付）',
      priority: 'high',
      description: [
        '## 目的',
        '重要先に漏れなく周知し、支払い・発注・連絡の混乱を防ぐ。',
        '',
        '## チェックリスト',
        '- [ ] 通知対象リスト（顧客/仕入/パートナー/金融/行政/プラットフォーム）',
        '- [ ] 通知文面（メール/書面）確定',
        '- [ ] 送付方法（メール/郵送/ポータル）決定',
        '- [ ] 返信・問い合わせ対応窓口の設置',
        '- [ ] 送付ログ（いつ/誰に/何を）を残す'
      ].join('\n')
    },
    {
      name: '[MKT-01][Medium][Due:2026-03-10] 社名変更の告知計画（FAQ/タイミング/チャネル）',
      priority: 'medium',
      description: [
        '## 目的',
        '対外コミュニケーションを整理し、問い合わせ増/混乱を防ぐ。',
        '',
        '## チェックリスト',
        '- [ ] 告知文（短文/長文）',
        '- [ ] FAQ（契約/請求/振込/メール）',
        '- [ ] 告知チャネル（サイト/メール/SNS/紙）',
        '- [ ] 告知タイミング（D-30/D-7/D+1）'
      ].join('\n')
    },
    {
      name: '[RUNBOOK-01][High][Due:2026-03-23] 切替当日Runbook（手順/担当/ロールバック）',
      priority: 'high',
      description: [
        '## 目的',
        '2026-03-30 当日の実行手順を固定し、判断の迷いを無くす。',
        '',
        '## チェックリスト',
        '- [ ] 当日スケジュール（時間割）',
        '- [ ] 担当者（法務/IT/広報/営業）',
        '- [ ] Go/No-Go 条件',
        '- [ ] ロールバック手順（DNS/リダイレクト/メール）'
      ].join('\n')
    },
    {
      name: '[DRYRUN-01][High][Due:2026-03-23] D-7 リハーサル（メール/サイト/リダイレクト/計測）',
      priority: 'high',
      description: [
        '## 目的',
        '本番切替の前に一度“通し”で確認する。',
        '',
        '## チェックリスト',
        '- [ ] 主要URLのリダイレクト動作',
        '- [ ] メール送受信/到達性（SPF/DKIM/DMARC）',
        '- [ ] 問い合わせフォーム送信→通知（Slack/メール）',
        '- [ ] 計測（Plausibleイベント/ゴール）'
      ].join('\n')
    },
    {
      name: '[LEGAL-04][Medium][Due:2026-04-10] 税務/社保/行政などの変更届（提出と控え保管）',
      priority: 'medium',
      description: [
        '## 目的',
        '社名変更後に必要な届出を漏れなく行う。',
        '',
        '## チェックリスト',
        '- [ ] 税務関連（税務署/都道府県/市区町村）',
        '- [ ] 社会保険/労務（該当する場合）',
        '- [ ] 許認可/契約/口座名義変更（必要範囲）',
        '- [ ] 提出控えを一箇所に保管'
      ].join('\n')
    },
    {
      name: '[OPS-02][Medium][Due:2026-04-15] 各種アカウントの社名/ドメイン更新（SaaS/登録情報）',
      priority: 'medium',
      description: [
        '## 目的',
        '運用上の“名義ズレ”を解消し、請求や権限の事故を防ぐ。',
        '',
        '## 対象例',
        '- Plane / Supabase / Vercel / Slack / Google Business Profile / 各種決済',
        '',
        '## チェックリスト',
        '- [ ] 組織名（Company Name）更新',
        '- [ ] 連絡先メール（@iyasaka.co）へ切替',
        '- [ ] 請求先名義の更新',
        '- [ ] 旧ドメインの転送/権限の整理'
      ].join('\n')
    },
    {
      name: '[POST-01][Medium][Due:2026-04-30] D+30 監視（404/SEO/計測/メール到達）',
      priority: 'medium',
      description: [
        '## 目的',
        '移行後の“取りこぼし”を潰して安定化させる。',
        '',
        '## チェックリスト',
        '- [ ] 404ログ確認→リダイレクト追加',
        '- [ ] 検索のインデックス状況/重複URLの解消',
        '- [ ] 流入/CVの連続性確認（Plausible等）',
        '- [ ] メール到達性の確認（迷惑判定/未達）'
      ].join('\n')
    }
  ]
}
 
async function main() {
  const args = parseArgs(process.argv)
  const baseUrl = args['base-url'] || DEFAULT_PLANE_URL
  const workspace = args.workspace || DEFAULT_WORKSPACE_SLUG
  const projectId = args['project-id']
  const dryRun = args['dry-run'] === 'true'
 
  if (!projectId) {
    console.error('ERROR: --project-id is required')
    process.exit(2)
  }
 
  const apiKey = process.env.PLANE_API_KEY || ''
 
  if (!apiKey) {
    console.error('ERROR: Plane API key not found. Set PLANE_API_KEY env var.')
    process.exit(2)
  }
 
  const issues = buildIssues()
 
  if (dryRun) {
    console.log(JSON.stringify({ ok: true, dryRun: true, count: issues.length, issues: issues.map((i) => i.name) }, null, 2))
    return
  }
 
  // Auth check (do not print sensitive info)
  await apiRequest({ baseUrl, apiKey, method: 'GET', pathname: '/api/v1/users/me/' })
 
  let ok = 0
  let ng = 0
  const created = []
 
  for (const issue of issues) {
    try {
      const res = await apiRequest({
        baseUrl,
        apiKey,
        method: 'POST',
        pathname: `/api/v1/workspaces/${workspace}/projects/${projectId}/issues/`,
        data: { name: issue.name, description: issue.description, priority: issue.priority }
      })
      ok++
      created.push({ id: res.id, name: issue.name })
      console.log(`OK: ${issue.name}`)
    } catch (e) {
      ng++
      console.log(`NG: ${issue.name}`)
      console.log(`   ${String(e.message || e)}`)
    }
  }
 
  console.log(JSON.stringify({ ok: ng === 0, created: ok, failed: ng, total: ok + ng }, null, 2))
}
 
main().catch((e) => {
  console.error(String(e?.message || e))
  process.exit(1)
})
