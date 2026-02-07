<script setup lang="ts">
/**
 * 外部送信規律に基づく公表事項
 * AIEO対応: BreadcrumbList スキーマ出力
 * 2023年6月施行の電気通信事業法改正対応
 */
import { companyInfo } from '~/app/data/team'
import { breadcrumbLd } from '~/app/utils/ld'

// パンくずリスト JSON-LD
const breadcrumb = breadcrumbLd([
  { name: 'ホーム', path: '/' },
  { name: '外部送信規律に基づく公表事項', path: '/legal/external-transmission' }
])

useSeoMeta({
  title: '外部送信規律に基づく公表事項｜IYASAKA',
  description: '電気通信事業法に基づき、当サイトから外部に送信される情報について公表しています。',
})

// 構造化データ
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumb)
    }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-washi py-20">
    <div class="max-w-3xl mx-auto px-6">
      <h1 class="text-3xl font-gothic font-bold text-deep-sumi mb-8">
        外部送信規律に基づく公表事項
      </h1>
      
      <div class="prose prose-lg max-w-none text-sumi/80">
        <p class="text-sm text-ash mb-8">最終更新日：2026年1月8日</p>
        
        <p>
          {{ companyInfo.name }}（以下「当社」といいます）は、2023年6月16日に施行された
          改正電気通信事業法に基づき、当サイトから外部に送信される利用者情報について、
          以下のとおり公表します。
        </p>

        <h2>1. 外部送信される情報の概要</h2>
        <p>
          当サイトでは、サービス向上およびお客様への適切な情報提供のため、
          以下の情報を外部サービスに送信しています。
        </p>

        <h2>2. 送信先サービス一覧</h2>

        <h3>2-1. Plausible Analytics（アクセス解析）</h3>
        <table class="min-w-full">
          <tbody>
            <tr>
              <th class="text-left bg-gray-50 p-2">送信先事業者</th>
              <td class="p-2">Plausible Insights OÜ（エストニア）</td>
            </tr>
            <tr>
              <th class="text-left bg-gray-50 p-2">送信される情報</th>
              <td class="p-2">
                ページURL、リファラ、国・地域（IPアドレスから推定、IPアドレス自体は保存されません）、
                デバイス種別、ブラウザ種別、OS
              </td>
            </tr>
            <tr>
              <th class="text-left bg-gray-50 p-2">利用目的</th>
              <td class="p-2">
                サイトの利用状況の把握、サービス改善のための統計分析
              </td>
            </tr>
            <tr>
              <th class="text-left bg-gray-50 p-2">プライバシーポリシー</th>
              <td class="p-2">
                <a href="https://plausible.io/privacy" target="_blank" rel="noopener noreferrer" class="text-akatsuki">
                  https://plausible.io/privacy
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="text-sm text-ash">
          ※ Plausible Analyticsは、Cookieを使用せず、個人を特定する情報を収集しないプライバシーに配慮した解析ツールです。
        </p>

        <h3 class="mt-8">2-2. Supabase（データベース）</h3>
        <table class="min-w-full">
          <tbody>
            <tr>
              <th class="text-left bg-gray-50 p-2">送信先事業者</th>
              <td class="p-2">Supabase, Inc.（米国）</td>
            </tr>
            <tr>
              <th class="text-left bg-gray-50 p-2">送信される情報</th>
              <td class="p-2">
                お問い合わせフォームに入力された情報（氏名、メールアドレス、電話番号、会社名、お問い合わせ内容等）
              </td>
            </tr>
            <tr>
              <th class="text-left bg-gray-50 p-2">利用目的</th>
              <td class="p-2">
                お問い合わせ情報の保存・管理、お客様への回答・対応
              </td>
            </tr>
            <tr>
              <th class="text-left bg-gray-50 p-2">プライバシーポリシー</th>
              <td class="p-2">
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" class="text-akatsuki">
                  https://supabase.com/privacy
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        <h3 class="mt-8">2-3. Slack（業務連絡）</h3>
        <table class="min-w-full">
          <tbody>
            <tr>
              <th class="text-left bg-gray-50 p-2">送信先事業者</th>
              <td class="p-2">Slack Technologies, LLC（米国）</td>
            </tr>
            <tr>
              <th class="text-left bg-gray-50 p-2">送信される情報</th>
              <td class="p-2">
                お問い合わせ受付時の通知情報（お問い合わせ内容の概要）
              </td>
            </tr>
            <tr>
              <th class="text-left bg-gray-50 p-2">利用目的</th>
              <td class="p-2">
                お問い合わせの迅速な社内共有・対応
              </td>
            </tr>
            <tr>
              <th class="text-left bg-gray-50 p-2">プライバシーポリシー</th>
              <td class="p-2">
                <a href="https://slack.com/privacy-policy" target="_blank" rel="noopener noreferrer" class="text-akatsuki">
                  https://slack.com/privacy-policy
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        <h3 class="mt-8">2-4. Vercel（ホスティング）</h3>
        <table class="min-w-full">
          <tbody>
            <tr>
              <th class="text-left bg-gray-50 p-2">送信先事業者</th>
              <td class="p-2">Vercel Inc.（米国）</td>
            </tr>
            <tr>
              <th class="text-left bg-gray-50 p-2">送信される情報</th>
              <td class="p-2">
                アクセスログ（IPアドレス、アクセス日時、リクエスト内容）
              </td>
            </tr>
            <tr>
              <th class="text-left bg-gray-50 p-2">利用目的</th>
              <td class="p-2">
                ウェブサイトの配信・運用、セキュリティ対策
              </td>
            </tr>
            <tr>
              <th class="text-left bg-gray-50 p-2">プライバシーポリシー</th>
              <td class="p-2">
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" class="text-akatsuki">
                  https://vercel.com/legal/privacy-policy
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        <h2 class="mt-8">3. オプトアウトについて</h2>
        <p>
          上記の情報送信を望まない場合は、ブラウザの設定でJavaScriptを無効にするか、
          当サイトの利用をお控えください。ただし、一部の機能が正常に動作しなくなる場合があります。
        </p>

        <h2>4. お問い合わせ</h2>
        <p>本公表事項に関するお問い合わせは、下記までご連絡ください。</p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="mb-1"><strong>{{ companyInfo.name }}</strong></p>
          <p class="mb-1">{{ companyInfo.postalCode }} {{ companyInfo.address }}</p>
          <p>TEL: {{ companyInfo.phone }}</p>
        </div>

        <p class="text-sm text-ash mt-8">
          制定日：2024年12月1日<br>
          改定日：2026年1月8日
        </p>
      </div>
      
      <div class="mt-12">
        <NuxtLink 
          to="/"
          class="inline-flex items-center gap-2 text-akatsuki hover:underline"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          トップページに戻る
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
