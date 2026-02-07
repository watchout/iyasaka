<script setup lang="ts">
/**
 * IYASAKA 問い合わせページ
 * AIEO対応: BreadcrumbList スキーマ出力
 * エモーショナルな「不」から始まるリード獲得フロー
 */
import { breadcrumbLd } from '~/app/utils/ld'

// パンくずリスト JSON-LD
const breadcrumb = breadcrumbLd([
  { name: 'ホーム', path: '/' },
  { name: 'お問い合わせ', path: '/contact' }
])

useHead({
  title: 'お問い合わせ | IYASAKA - 不を光へ',
  meta: [
    {
      name: 'description',
      content: 'IYASAKAへのお問い合わせ。現場の「不」を「光」に変えるソリューションをご提案します。'
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumb)
    }
  ]
})

// OGP
useServerSeoMeta({
  ogTitle: 'お問い合わせ | IYASAKA',
  ogDescription: '現場の「不」を「光」に変えるソリューションをご提案します。',
  ogType: 'website'
})
</script>

<template>
  <main class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- ヒーローセクション -->
    <section class="py-16 md:py-24">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          今ある「不」を、<br class="md:hidden">
          <span class="text-accent">未来の「光」</span>へ。
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          IYASAKAは、現場に潜む課題を仕組みと現場力で解決し、<br class="hidden md:inline">
          ともに弥栄（いやさか）する循環を実装するチームです。
        </p>
      </div>
    </section>
    
    <!-- フォームセクション -->
    <section class="pb-24">
      <div class="max-w-2xl mx-auto px-4">
        <div class="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-100">
          <ContactForm />
        </div>
        
        <!-- 営業時間 -->
        <div class="mt-8 text-center text-sm text-gray-500">
          <p>📞 営業時間：月〜金 9:00–17:00（祝日除く）</p>
          <p class="mt-1">担当者より2営業日以内にご連絡いたします</p>
        </div>
      </div>
    </section>
    
    <!-- 信頼の証 -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-sm font-medium text-gray-500 mb-6">IYASAKAが選ばれる理由</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div class="text-4xl mb-3">🔧</div>
            <h3 class="font-bold text-gray-900 mb-2">整える</h3>
            <p class="text-sm text-gray-600">
              現場の足元と知恵の土台を整え、挑戦できる状態を創る
            </p>
          </div>
          <div>
            <div class="text-4xl mb-3">🔗</div>
            <h3 class="font-bold text-gray-900 mb-2">つなぐ</h3>
            <p class="text-sm text-gray-600">
              閉ざされていた価値を外部や世界と接続し、可能性を拡張する
            </p>
          </div>
          <div>
            <div class="text-4xl mb-3">🌱</div>
            <h3 class="font-bold text-gray-900 mb-2">育てる</h3>
            <p class="text-sm text-gray-600">
              運用を通じて文化を育て、次世代へ続く循環を創る
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.text-accent {
  color: #ff9e00;
}
</style>



