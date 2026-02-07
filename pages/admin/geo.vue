<script setup lang="ts">
// SSR時の初回表示を速くするため、metrics と gaps の取得は並列化する
const [
  { data: metrics, pending: pendingMetrics, error: metricsError, refresh },
  { data: gaps, pending: pendingGaps, error: gapsError, refresh: refreshGaps }
] = await Promise.all([
  useAsyncData('geo-metrics', () => $fetch('/api/geo/metrics')),
  useAsyncData('geo-gaps', () => $fetch('/api/geo/gaps'))
])

const refreshAll = async () => {
  await Promise.all([refresh(), refreshGaps()])
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-8 space-y-8">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">GEO ダッシュボード</h1>
        <p class="text-sm text-gray-600">
          クエリごとの AI 内可視性（visibility_score）と、記事/LPの「穴」をざっくり把握するための管理画面です。
        </p>
      </div>
      <button
        type="button"
        class="px-3 py-1.5 rounded border text-sm bg-white hover:bg-gray-50"
        @click="refreshAll"
      >
        更新
      </button>
    </header>

    <!-- ステータス -->
    <section class="grid gap-4 md:grid-cols-2">
      <div class="border rounded-lg p-4 bg-white">
        <h2 class="font-semibold mb-2 text-sm">クエリ別スコア（低スコア順）</h2>
        <p v-if="pendingMetrics" class="text-xs text-gray-500">読み込み中...</p>
        <p v-if="metricsError" class="text-xs text-red-600">
          取得エラー: {{ metricsError.message }}
        </p>
        <p v-if="!pendingMetrics && metrics?.items?.length === 0" class="text-xs text-gray-500">
          まだ GEO スナップショットがありません。
        </p>

        <div v-if="metrics?.items?.length" class="mt-2 max-h-80 overflow-auto text-xs">
          <table class="min-w-full border-collapse">
            <thead>
              <tr class="border-b bg-gray-50">
                <th class="px-2 py-1 text-left">クエリ</th>
                <th class="px-2 py-1 text-left">意図</th>
                <th class="px-2 py-1 text-right">スコア</th>
                <th class="px-2 py-1 text-right">前日比</th>
                <th class="px-2 py-1 text-left">best_url</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in metrics.items"
                :key="item.queryId"
                class="border-b hover:bg-gray-50"
              >
                <td class="px-2 py-1 max-w-xs">
                  <div class="truncate" :title="item.query">
                    {{ item.query }}
                  </div>
                </td>
                <td class="px-2 py-1">
                  <span class="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5">
                    {{ item.intent || '-' }}
                  </span>
                </td>
                <td class="px-2 py-1 text-right font-mono">
                  {{ Math.round(item.lastVisibility) }}
                </td>
                <td class="px-2 py-1 text-right font-mono">
                  <span v-if="item.diff === null" class="text-gray-400">-</span>
                  <span v-else :class="item.diff > 0 ? 'text-green-600' : item.diff < 0 ? 'text-red-600' : ''">
                    {{ item.diff > 0 ? '+' : '' }}{{ Math.round(item.diff) }}
                  </span>
                </td>
                <td class="px-2 py-1 text-[11px]">
                  <span class="truncate block" :title="item.bestUrl || ''">
                    {{ item.bestUrl || '-' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="border rounded-lg p-4 bg-white">
        <h2 class="font-semibold mb-2 text-sm">GEO ギャップ（やるべき記事/LPの穴）</h2>
        <p v-if="pendingGaps" class="text-xs text-gray-500">読み込み中...</p>
        <p v-if="gapsError" class="text-xs text-red-600">
          取得エラー: {{ gapsError.message }}
        </p>
        <p v-if="!pendingGaps && gaps?.gaps?.length === 0" class="text-xs text-gray-500">
          いまのところ、BoFU 記事が不足している明確なギャップは検出されていません。
        </p>

        <ul v-if="gaps?.gaps?.length" class="mt-2 space-y-3 text-xs max-h-80 overflow-auto">
          <li
            v-for="gap in gaps.gaps"
            :key="gap.queryId"
            class="border rounded-md p-2 bg-amber-50 border-amber-200"
          >
            <p class="font-semibold text-[11px] text-amber-900">
              {{ gap.query }}
            </p>
            <p class="text-[11px] text-amber-800 mt-0.5">
              intent: {{ gap.intent || 'n/a' }} / visibility: {{ Math.round(gap.visibility) }}
            </p>
            <p class="text-[11px] text-amber-800 mt-0.5">
              LP: <span class="underline">{{ gap.targetLP }}</span>
            </p>
            <div class="mt-1">
              <p class="text-[11px] font-semibold text-amber-900">提案される BoFU 記事案</p>
              <ul class="list-disc pl-4 mt-0.5 text-[11px] space-y-0.5">
                <li
                  v-for="article in gap.suggestedArticles"
                  :key="article.title"
                >
                  <span class="font-medium">{{ article.title }}</span>
                  <span class="text-gray-600">（primaryProduct: {{ article.primaryProduct }}）</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>






