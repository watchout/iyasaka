<script setup lang="ts">
/**
 * AIプラス Calendly予約完了ページ
 * /aiplus/booking-complete
 *
 * Calendly管理画面で予約完了後のリダイレクト先をこのURLに設定する。
 * GA4 + Plausible に calendly_booking_complete イベントを送信。
 */

definePageMeta({ layout: 'lp' })

useHead({ titleTemplate: '%s' })
useSeoMeta({
  title: 'ご予約ありがとうございます | AIプラス',
  description: 'AI活用相談の面談予約が完了しました。',
  robots: 'noindex, nofollow',
})

const { trackCalendlyBooking } = useAnalytics()

onMounted(() => {
  trackCalendlyBooking()
})
</script>

<template>
  <main class="min-h-screen bg-gradient-to-b from-washi to-white">
    <!-- メインセクション -->
    <section class="py-16 md:py-24">
      <div class="max-w-3xl mx-auto px-4 text-center">
        <!-- 完了アイコン -->
        <div class="mb-8">
          <div
            class="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg"
          >
            <span class="text-4xl">✅</span>
          </div>
        </div>

        <!-- メッセージ -->
        <h1 class="text-3xl md:text-4xl font-bold text-deep-sumi mb-4">
          ご予約ありがとうございます
        </h1>

        <p class="text-lg text-sumi mb-2">
          面談の日時が確定しました。<br />
          Calendlyから<strong class="text-akatsuki">確認メール</strong>が届きますのでご確認ください。
        </p>

        <p class="text-sumi/80 mt-4">
          当日は、診断結果と御社専用レポートをもとに<br />
          具体的なAI活用プランをご提案いたします。
        </p>

        <!-- 面談の流れ -->
        <div class="mt-10 max-w-md mx-auto text-left">
          <h2 class="text-lg font-bold text-deep-sumi mb-4 text-center">
            📋 面談当日の流れ（30分）
          </h2>
          <div class="space-y-4">
            <div class="flex gap-3 items-start">
              <div
                class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0"
              >
                1
              </div>
              <div>
                <p class="font-medium text-deep-sumi">御社の現状ヒアリング</p>
                <p class="text-sm text-sumi/70">診断結果をもとに、課題を深掘りします（10分）</p>
              </div>
            </div>
            <div class="flex gap-3 items-start">
              <div
                class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0"
              >
                2
              </div>
              <div>
                <p class="font-medium text-deep-sumi">AI活用プランのご提案</p>
                <p class="text-sm text-sumi/70">御社に最適なAI導入ステップをご説明します（15分）</p>
              </div>
            </div>
            <div class="flex gap-3 items-start">
              <div
                class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0"
              >
                3
              </div>
              <div>
                <p class="font-medium text-deep-sumi">ご質問・次のステップ</p>
                <p class="text-sm text-sumi/70">気になる点を何でもお聞きください（5分）</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 安心メッセージ -->
        <div class="mt-10 p-4 bg-emerald-50 rounded-xl border border-emerald-200 inline-block">
          <p class="text-sm text-emerald-800">
            🔒 営業電話は一切いたしません。面談後に契約の義務もありません。<br />
            聞いてみて「今じゃない」と思ったら、それでもOKです。
          </p>
        </div>

        <!-- トップへ戻る -->
        <div class="mt-12">
          <NuxtLink
            to="/aiplus"
            class="inline-flex items-center gap-2 text-ash hover:text-akatsuki transition-colors"
          >
            ← AIプラスに戻る
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
