<script setup lang="ts">
import LeadForm from '@/components/LeadForm.vue'
import { useAnalytics } from '~/composables/useAnalytics'

const hasSubmitted = ref(false)
const { track } = useAnalytics()

useHead({
  title: '資料ダウンロード | IYASAKA',
  meta: [
    {
      name: 'description',
      content: '配信プラスの「配信トラブル0チェックリスト」など、IYASAKAのサービス資料をダウンロードいただけます。'
    }
  ]
})

const handleSubmitted = () => {
  hasSubmitted.value = true
}
</script>

<template>
  <main class="container mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold mb-6">資料ダウンロード</h1>

    <section id="haishin-demo" class="mb-10 max-w-2xl">
      <h2 class="text-2xl font-semibold mb-4">
        配信プラス「配信トラブル0チェックリスト」ダウンロード
      </h2>
      <p class="mb-4 text-sm text-sumi/80">
        会場準備から本番当日まで、配信トラブルを防ぐためのチェックポイントを1枚にまとめたPDFです。
        メールアドレスをご登録いただくと、すぐにダウンロードリンクが表示されます。
      </p>

      <div class="rounded-2xl border border-sumi/10 bg-white/80 p-6 shadow-sm">
        <div v-if="!hasSubmitted">
          <LeadForm
            primary-product-slug="haishin-plus"
            source="download_checklist"
            @submitted="handleSubmitted"
          />
        </div>
        <div
          v-else
          class="space-y-3"
        >
          <p class="text-sm text-matsuha font-medium">
            ご登録ありがとうございました。以下から資料をダウンロードいただけます。
          </p>
          <NuxtLink
            to="/downloads/haishin-trouble-zero-checklist.pdf"
            target="_blank"
            rel="noopener"
            class="btn-primary inline-flex items-center gap-2 text-sm"
            @click="track('download_click', { product: 'haishin-plus', source: 'download_checklist' })"
          >
            <span>📄</span>
            <span>チェックリストをダウンロードする（PDF）</span>
          </NuxtLink>
          <p class="text-xs text-sumi/70">
            ※ PDFが別タブで開きます。お使いの環境によってはブラウザのダウンロードフォルダに保存されます。
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
