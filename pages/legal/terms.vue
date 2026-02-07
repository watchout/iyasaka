<script setup lang="ts">
/**
 * 利用規約
 * AIEO対応: BreadcrumbList スキーマ出力
 */
import { companyInfo } from '~/app/data/team'
import { breadcrumbLd } from '~/app/utils/ld'

// パンくずリスト JSON-LD
const breadcrumb = breadcrumbLd([
  { name: 'ホーム', path: '/' },
  { name: '利用規約', path: '/legal/terms' }
])

useSeoMeta({
  title: '利用規約｜IYASAKA',
  description: '有限会社IYASAKAのウェブサイト利用規約をご確認いただけます。',
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
        利用規約
      </h1>
      
      <div class="prose prose-lg max-w-none text-sumi/80">
        <p class="text-sm text-ash mb-8">最終更新日：2026年1月8日</p>
        
        <p>
          この利用規約（以下「本規約」といいます）は、{{ companyInfo.name }}（以下「当社」といいます）が
          運営するウェブサイト（以下「本サイト」といいます）の利用条件を定めるものです。
          本サイトをご利用いただく際は、本規約に同意いただいたものとみなします。
        </p>

        <h2>第1条（適用）</h2>
        <p>
          本規約は、本サイトの利用に関する当社とユーザーとの間の一切の関係に適用されます。
        </p>

        <h2>第2条（本サイトの内容）</h2>
        <p>本サイトでは、以下のサービス・情報を提供しています。</p>
        <ul>
          <li>当社のサービス・製品に関する情報</li>
          <li>お問い合わせ・資料請求の受付</li>
          <li>導入事例・ブログ記事等のコンテンツ</li>
          <li>その他、当社が提供する各種情報</li>
        </ul>

        <h2>第3条（禁止事項）</h2>
        <p>ユーザーは、本サイトの利用にあたり、以下の行為を行ってはなりません。</p>
        <ul>
          <li>法令または公序良俗に違反する行為</li>
          <li>犯罪行為に関連する行為</li>
          <li>当社または第三者の知的財産権、肖像権、プライバシー等を侵害する行為</li>
          <li>当社または第三者を誹謗中傷し、名誉を毀損する行為</li>
          <li>本サイトのサーバーまたはネットワークに過度な負荷をかける行為</li>
          <li>本サイトの運営を妨害する行為</li>
          <li>不正アクセスまたはこれを試みる行為</li>
          <li>虚偽の情報を入力・送信する行為</li>
          <li>その他、当社が不適切と判断する行為</li>
        </ul>

        <h2>第4条（知的財産権）</h2>
        <p>
          本サイトに掲載されているコンテンツ（文章、画像、動画、ロゴ、デザイン等）の
          著作権その他の知的財産権は、当社または正当な権利者に帰属します。
          ユーザーは、当社の事前の書面による承諾なく、これらを複製、転載、改変、
          配布等することはできません。
        </p>

        <h2>第5条（免責事項）</h2>
        <ol>
          <li>
            当社は、本サイトに掲載されている情報の正確性、完全性、有用性等について、
            いかなる保証も行いません。
          </li>
          <li>
            当社は、本サイトの利用に起因してユーザーに生じた損害について、
            当社に故意または重大な過失がある場合を除き、一切の責任を負いません。
          </li>
          <li>
            当社は、本サイトからリンクされている外部サイトの内容について、
            一切の責任を負いません。
          </li>
          <li>
            当社は、本サイトのサービスの中断、停止、終了等によりユーザーに生じた損害について、
            一切の責任を負いません。
          </li>
        </ol>

        <h2>第6条（サービスの変更・中断・終了）</h2>
        <p>
          当社は、ユーザーへの事前の通知なく、本サイトの内容を変更し、
          またはサービスを中断・終了することができます。
        </p>

        <h2>第7条（本規約の変更）</h2>
        <p>
          当社は、必要に応じて本規約を変更することができます。
          変更後の規約は、本サイトに掲載した時点で効力を生じます。
          変更後に本サイトを利用された場合、変更後の規約に同意いただいたものとみなします。
        </p>

        <h2>第8条（準拠法・管轄裁判所）</h2>
        <p>
          本規約の解釈および適用は、日本法に準拠するものとします。
          本サイトの利用に関して紛争が生じた場合は、さいたま地方裁判所を
          第一審の専属的合意管轄裁判所とします。
        </p>

        <h2>第9条（お問い合わせ）</h2>
        <p>本規約に関するお問い合わせは、下記までご連絡ください。</p>
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
