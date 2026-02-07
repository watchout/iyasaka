<script setup lang="ts">
import { getProductById, type ProductId, products } from '@/app/data/products'

const route = useRoute()
const { getPrefilledProduct } = useLeadTracking()

// クエリパラメータから結果を取得
const productId = computed<ProductId | null>(() => {
  const fromQuery = (route.query.product || route.query.p_id) as string | undefined
  if (fromQuery) return fromQuery as ProductId
  return getPrefilledProduct()
})
const product = computed(() => (productId.value ? getProductById(productId.value) : undefined))
const reason = computed(() => {
  if (!productId.value) return ''
  // answersがない場合はデフォルトの理由を返す
  return `あなたの課題に対して、${product.value?.name}が最適です。${product.value?.solution}`
})

// 他の製品
const otherProducts = computed(() => {
  return products
    .filter(p => p.id !== productId.value && p.homeFeatured)
    .slice(0, 3)
})

// SEO
useSeoMeta({
  title: () => product.value ? `診断結果: ${product.value.name} | IYASAKA` : '診断結果 | IYASAKA',
  description: () => product.value?.solution || ''
})
</script>

<template>
  <div class="min-h-screen bg-washi">
    <!-- ヘッダー -->
    <section class="bg-gradient-to-br from-washi via-washi to-ash/30 py-12">
      <div class="container mx-auto px-4">
        <nav class="mb-6 text-sm text-sumi/60">
          <NuxtLink to="/" class="hover:text-akatsuki">ホーム</NuxtLink>
          <span class="mx-2">/</span>
          <NuxtLink to="/diagnosis" class="hover:text-akatsuki">診断</NuxtLink>
          <span class="mx-2">/</span>
          <span>結果</span>
        </nav>
        <h1 class="font-mincho text-3xl md:text-4xl text-sumi">
          診断結果
        </h1>
      </div>
    </section>

    <div class="container mx-auto px-4 py-12">
      <div v-if="product" class="max-w-3xl mx-auto">
        <!-- メイン結果 -->
        <div class="bg-white rounded-lg shadow-soft p-8 mb-8">
          <p class="text-akatsuki font-bold mb-2">あなたにおすすめ</p>
          <h2 class="font-mincho text-3xl md:text-4xl text-sumi mb-4">
            {{ product.name }}
          </h2>
          <p class="text-sumi/60 mb-6">{{ product.subtitle }}</p>
          
          <!-- 成果 -->
          <div class="inline-flex items-center gap-3 px-6 py-3 bg-akatsuki/10 rounded-lg mb-8">
            <span class="text-3xl font-bold text-akatsuki">{{ product.keyResultValue }}</span>
            <span class="text-sumi">{{ product.keyResult }}</span>
          </div>
          
          <!-- 理由 -->
          <div class="p-6 bg-ash/30 rounded-lg mb-8">
            <p class="text-sm text-sumi/60 mb-2">なぜこの製品がおすすめなのか</p>
            <p class="text-sumi">{{ reason }}</p>
          </div>
          
          <!-- ソリューション詳細 -->
          <div class="mb-8">
            <h3 class="font-bold text-lg text-sumi mb-4">解決策</h3>
            <p class="text-sumi/80 mb-4">{{ product.solution }}</p>
            <p v-if="product.solutionDetail" class="text-sumi/60 text-sm">
              {{ product.solutionDetail }}
            </p>
          </div>
          
          <!-- 導入情報 -->
          <div class="grid md:grid-cols-3 gap-4 mb-8">
            <div class="p-4 bg-ash/20 rounded">
              <p class="text-xs text-sumi/60 mb-1">導入期間</p>
              <p class="font-medium text-sumi text-sm">{{ product.timeline }}</p>
            </div>
            <div class="p-4 bg-ash/20 rounded">
              <p class="text-xs text-sumi/60 mb-1">料金</p>
              <p class="font-medium text-sumi text-sm">{{ product.pricing }}</p>
            </div>
            <div v-if="product.requirements" class="p-4 bg-ash/20 rounded">
              <p class="text-xs text-sumi/60 mb-1">必要なもの</p>
              <p class="font-medium text-sumi text-sm">{{ product.requirements }}</p>
            </div>
          </div>
        </div>

        <!-- プライマリCTA（強調） -->
        <div class="bg-gradient-to-r from-akatsuki to-akatsuki/80 rounded-lg p-8 text-center text-white mb-8">
          <h3 class="font-mincho text-2xl md:text-3xl mb-4">
            無料で相談する
          </h3>
          <p class="text-white/80 mb-2">
            {{ product.primaryCta.description }}
          </p>
          <p class="text-white/60 text-sm mb-6">
            2営業日以内にご連絡いたします
          </p>
          <NuxtLink 
            :to="`/#contact?product=${product.id}`"
            class="inline-flex items-center gap-2 px-10 py-5 bg-white text-akatsuki rounded-button font-bold text-lg hover:bg-white/90 transition-colors shadow-lg"
          >
            今すぐ相談する
            <span class="text-2xl">→</span>
          </NuxtLink>
        </div>

        <!-- セカンダリCTA（テキストリンク） -->
        <div class="flex flex-wrap justify-center gap-6 text-sm mb-12">
          <NuxtLink 
            :to="`/products/${product.slug}`"
            class="text-sumi/70 hover:text-akatsuki underline underline-offset-4"
          >
            詳細を見る
          </NuxtLink>
          <NuxtLink 
            to="/cases"
            class="text-sumi/70 hover:text-akatsuki underline underline-offset-4"
          >
            導入事例を見る
          </NuxtLink>
          <NuxtLink 
            to="/diagnosis"
            class="text-sumi/70 hover:text-akatsuki underline underline-offset-4"
          >
            もう一度診断する
          </NuxtLink>
        </div>

        <!-- 他の製品 -->
        <div>
          <h3 class="font-bold text-lg text-sumi mb-6 text-center">
            他の製品も検討する
          </h3>
          <div class="grid md:grid-cols-3 gap-4">
            <NuxtLink 
              v-for="p in otherProducts" 
              :key="p.id"
              :to="`/products/${p.slug}`"
              class="p-4 bg-white rounded-lg shadow-soft hover:shadow-md transition-all group text-center"
            >
              <h4 class="font-bold text-sumi group-hover:text-akatsuki transition-colors mb-1">
                {{ p.name }}
              </h4>
              <p class="text-xs text-sumi/60">{{ p.subtitle }}</p>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 製品が見つからない場合 -->
      <div v-else class="max-w-xl mx-auto text-center py-12">
        <p class="text-sumi/60 mb-8">
          診断結果が見つかりませんでした。
        </p>
        <NuxtLink 
          to="/diagnosis"
          class="inline-flex items-center gap-2 px-6 py-3 bg-akatsuki text-white rounded-button font-bold hover:bg-akatsuki/90 transition-colors"
        >
          診断をやり直す
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
