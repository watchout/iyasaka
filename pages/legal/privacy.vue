<script setup lang="ts">
/**
 * プライバシーポリシー
 * AIEO対応: BreadcrumbList スキーマ出力
 */
import { companyInfo } from '~/app/data/team'
import { breadcrumbLd } from '~/app/utils/ld'

// パンくずリスト JSON-LD
const breadcrumb = breadcrumbLd([
  { name: 'ホーム', path: '/' },
  { name: 'プライバシーポリシー', path: '/legal/privacy' }
])

useSeoMeta({
  title: 'プライバシーポリシー｜IYASAKA',
  description: '有限会社IYASAKAのプライバシーポリシー（個人情報保護方針）をご確認いただけます。',
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
        プライバシーポリシー
      </h1>
      
      <div class="prose prose-lg max-w-none text-sumi/80">
        <p class="text-sm text-ash mb-8">最終更新日：2026年1月8日</p>
        
        <p>
          {{ companyInfo.name }}（以下「当社」といいます）は、お客様の個人情報の保護を重要な責務と認識し、
          以下のとおりプライバシーポリシーを定め、個人情報の適切な取り扱いに努めます。
        </p>

        <h2>1. 個人情報の定義</h2>
        <p>
          本ポリシーにおいて「個人情報」とは、生存する個人に関する情報であって、
          当該情報に含まれる氏名、メールアドレス、電話番号、その他の記述等により
          特定の個人を識別できるものをいいます。
        </p>

        <h2>2. 個人情報の収集</h2>
        <p>当社は、以下の方法により個人情報を収集することがあります。</p>
        <ul>
          <li>お問い合わせフォームからのご連絡</li>
          <li>資料ダウンロードのお申し込み</li>
          <li>サービスのお申し込み・ご契約</li>
          <li>お電話・メールでのお問い合わせ</li>
        </ul>
        <p>収集する情報の例：</p>
        <ul>
          <li>お名前</li>
          <li>メールアドレス</li>
          <li>電話番号</li>
          <li>会社名・団体名</li>
          <li>従業員規模</li>
          <li>お問い合わせ内容</li>
        </ul>

        <h2>3. 個人情報の利用目的</h2>
        <p>当社は、収集した個人情報を以下の目的で利用します。</p>
        <ul>
          <li>お問い合わせへの回答・対応</li>
          <li>サービスの提供・運営</li>
          <li>サービスに関するご案内・情報提供</li>
          <li>アンケート・調査へのご協力依頼</li>
          <li>サービス改善のための分析</li>
          <li>法令に基づく対応</li>
        </ul>

        <h2>4. 第三者への提供</h2>
        <p>
          当社は、以下の場合を除き、お客様の個人情報を第三者に提供することはありません。
        </p>
        <ul>
          <li>お客様の同意がある場合</li>
          <li>法令に基づく場合</li>
          <li>人の生命、身体または財産の保護のために必要な場合</li>
          <li>業務委託先に対して、利用目的の達成に必要な範囲で提供する場合</li>
        </ul>

        <h2>5. 個人情報の管理</h2>
        <p>
          当社は、個人情報の漏洩、滅失、毀損を防止するため、適切なセキュリティ対策を講じます。
          また、個人情報を取り扱う従業員に対して、適切な監督を行います。
        </p>

        <h2>6. 業務委託先への提供</h2>
        <p>
          当社は、利用目的の達成に必要な範囲において、以下の業務委託先に個人情報を提供することがあります。
        </p>
        <ul>
          <li>データベース管理：Supabase（米国）</li>
          <li>アクセス解析：Plausible Analytics（EU）</li>
          <li>業務連絡：Slack Technologies（米国）</li>
        </ul>
        <p>
          各委託先とは適切な契約を締結し、個人情報の適切な管理を義務付けています。
        </p>

        <h2>7. 開示・訂正・削除の請求</h2>
        <p>
          お客様は、当社が保有する個人情報について、開示・訂正・削除を請求することができます。
          ご請求の際は、下記のお問い合わせ窓口までご連絡ください。
        </p>

        <h2>8. Cookieの使用について</h2>
        <p>
          当サイトでは、サービス向上のためCookieを使用しています。
          Cookieはブラウザの設定により無効化することができますが、
          一部のサービスが正常に動作しなくなる場合があります。
        </p>

        <h2>9. アクセス解析について</h2>
        <p>
          当サイトでは、Plausible Analyticsを使用してアクセス解析を行っています。
          Plausible Analyticsは個人を特定する情報を収集せず、
          プライバシーに配慮した解析ツールです。
        </p>

        <h2>10. 本ポリシーの変更</h2>
        <p>
          当社は、法令の改正その他必要に応じて、本ポリシーを変更することがあります。
          変更後のポリシーは、当サイトに掲載した時点で効力を生じます。
        </p>

        <h2>11. お問い合わせ窓口</h2>
        <p>本ポリシーに関するお問い合わせは、下記までご連絡ください。</p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="mb-1"><strong>{{ companyInfo.name }}</strong></p>
          <p class="mb-1">{{ companyInfo.postalCode }} {{ companyInfo.address }}</p>
          <p class="mb-1">TEL: {{ companyInfo.phone }}</p>
          <p>個人情報保護管理者：{{ companyInfo.representative }}</p>
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
