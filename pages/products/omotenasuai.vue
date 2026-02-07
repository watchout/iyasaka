<script setup lang="ts">
import { omotenasuai } from '~/app/data/omotenasuai'

useHead({
  title: omotenasuai.seo.title,
  meta: [{ name: 'description', content: omotenasuai.seo.description }]
})

const faqItems = omotenasuai.faq.map(f => ({
  label: f.q,
  content: f.a
}))
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="container mx-auto px-4 py-12">
      <h1 class="text-3xl md:text-4xl font-bold">
        {{ omotenasuai.hero.title }}
      </h1>
      <p class="mt-3 text-gray-700">
        {{ omotenasuai.hero.sub }}
      </p>
      <div class="mt-6">
        <NuxtLink to="/contact" class="btn-primary">
          {{ omotenasuai.hero.cta.label }}
        </NuxtLink>
      </div>
    </section>

    <!-- 要約カード -->
    <section aria-labelledby="summary-heading" class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 id="summary-heading" class="text-2xl font-semibold mb-8">
          製品要約
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            v-for="p in omotenasuai.products"
            :key="p.slug"
            class="p-6 rounded-2xl border bg-white"
          >
            <h3 class="text-xl font-semibold">
              {{ p.title }}
            </h3>
            <p class="mt-2 text-gray-700">
              {{ p.summary }}
            </p>
            <ul class="mt-4 text-gray-600 list-disc ml-5">
              <li v-for="f in p.keyFeatures" :key="f">{{ f }}</li>
            </ul>
            <div v-if="p.notes?.length" class="mt-3 text-sm text-gray-500">
              <p v-for="n in p.notes" :key="n">・{{ n }}</p>
            </div>
            <div class="mt-6">
              <NuxtLink :to="p.cta.to" class="btn-primary">
                {{ p.cta.label }}
              </NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 比較表 -->
    <section aria-labelledby="compare-heading" class="py-12">
      <div class="container mx-auto px-4">
        <h2 id="compare-heading" class="text-2xl font-semibold mb-6">
          比較表
        </h2>
        <div class="hidden md:block overflow-x-auto">
          <table class="min-w-full border rounded-xl overflow-hidden">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-3 text-left border-r">製品</th>
                <th
                  v-for="col in omotenasuai.comparison.columns"
                  :key="col"
                  class="px-4 py-3 text-left border-r"
                >
                  {{ col }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in omotenasuai.comparison.rows"
                :key="row.product"
                class="border-t"
              >
                <th class="px-4 py-3 text-left border-r font-medium">
                  {{ row.product }}
                </th>
                <td class="px-4 py-3 border-r">{{ row.target }}</td>
                <td class="px-4 py-3 border-r">{{ row.features }}</td>
                <td class="px-4 py-3 border-r">{{ row.prerequisite }}</td>
                <td class="px-4 py-3">
                  <NuxtLink :to="row.cta" class="btn-secondary">相談する</NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- モバイル: カード表示 -->
        <div class="md:hidden space-y-4">
          <article
            v-for="row in omotenasuai.comparison.rows"
            :key="row.product"
            class="p-4 rounded-2xl border"
          >
            <h3 class="text-lg font-semibold">{{ row.product }}</h3>
            <dl class="mt-2 text-sm">
              <div class="mt-1"><dt class="font-medium">対象</dt><dd>{{ row.target }}</dd></div>
              <div class="mt-1"><dt class="font-medium">主機能</dt><dd>{{ row.features }}</dd></div>
              <div class="mt-1"><dt class="font-medium">前提</dt><dd>{{ row.prerequisite }}</dd></div>
            </dl>
            <div class="mt-3">
              <NuxtLink :to="row.cta" class="btn-secondary">相談する</NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 連携マトリクス / フォールバック -->
    <section aria-labelledby="integration-heading" class="py-12 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 id="integration-heading" class="text-2xl font-semibold mb-6">
          連携とフォールバック
        </h2>
        <div class="overflow-x-auto">
          <table class="min-w-full border rounded-xl overflow-hidden bg-white">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-3 text-left border-r">項目</th>
                <th class="px-4 py-3 text-left border-r">AIコンシェルジュ</th>
                <th class="px-4 py-3 text-left border-r">PMS Tsukuyomi</th>
                <th class="px-4 py-3 text-left">CRM</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="m in omotenasuai.integration.matrix"
                :key="m.item"
                class="border-t"
              >
                <th class="px-4 py-3 text-left border-r font-medium">{{ m.item }}</th>
                <td class="px-4 py-3 border-r">{{ m.concierge }}</td>
                <td class="px-4 py-3 border-r">{{ m.tsukuyomi }}</td>
                <td class="px-4 py-3">{{ m.crm }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-4 text-gray-700">
          {{ omotenasuai.integration.fallback }}
        </p>
      </div>
    </section>

    <!-- FAQ -->
    <section aria-labelledby="faq-heading" class="py-12">
      <div class="container mx-auto px-4 max-w-3xl">
        <h2 id="faq-heading" class="text-2xl font-semibold mb-6">
          よくある質問
        </h2>
        <UAccordion :items="faqItems" />
      </div>
    </section>
  </div>
</template>




