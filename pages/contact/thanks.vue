<script setup lang="ts">
/**
 * IYASAKA サンクスページ
 * 問い合わせ完了後のクロスセル・レコメンド
 */
import { 
  products, 
  getProductById,
  type ProductId,
  type ProductEntry
} from '~/app/data/products'

const route = useRoute()

// 問い合わせした製品
const productId = computed(() => (route.query.product || route.query.p_id) as ProductId | undefined)
const product = computed(() => productId.value ? getProductById(productId.value) : null)

// レコメンドロジック（現在の製品IDに基づく）
const recommendations = computed((): ProductEntry[] => {
  const recommendationMap: Record<ProductId, ProductId[]> = {
    'mieru-plus': ['jakuden-plus', 'ai-plus', 'haishin-plus'],
    'jakuden-plus': ['mieru-plus', 'omotenasu-ai', 'ai-plus'],
    'omotenasu-ai': ['haishin-plus', 'ai-plus', 'mieru-plus'],
    'haishin-plus': ['omotenasu-ai', 'ai-plus', 'jakuden-plus'],
    'ai-plus': ['mieru-plus', 'jakuden-plus', 'dev-os'],
    'dev-os': ['ai-plus', 'mieru-plus', 'jakuden-plus']
  }
  
  const defaultRecs: ProductId[] = ['mieru-plus', 'jakuden-plus', 'ai-plus']
  const ids = productId.value 
    ? (recommendationMap[productId.value] || defaultRecs)
    : defaultRecs
  
  return ids
    .map(id => getProductById(id))
    .filter((p): p is ProductEntry => p !== undefined)
    .slice(0, 3)
})

// ナラティブメッセージ
const narrativeMessage = computed(() => {
  if (!product.value) return null
  
  // 製品に基づいたメッセージ
  const messages: Partial<Record<ProductId, string>> = {
    'mieru-plus': '現場を「見える化」した後は、さらなる効率化へ',
    'jakuden-plus': '設備が「止まらない」安心の次は、成長の加速へ',
    'omotenasu-ai': 'おもてなしを自動化した後は、更なる収益向上へ',
    'haishin-plus': '配信で「つながった」後は、現場の効率化へ',
    'ai-plus': 'AIを活用した後は、現場全体のDXへ',
    'dev-os': '技術基盤を整えた後は、各種ソリューションへ'
  }
  
  return messages[product.value.id] || 'こちらもおすすめです'
})

useHead({
  title: 'お問い合わせありがとうございます | IYASAKA',
  meta: [
    { name: 'robots', content: 'noindex' }
  ]
})
</script>

<template>
  <main class="min-h-screen bg-gradient-to-b from-washi to-white">
    <!-- メインセクション -->
    <section class="py-16 md:py-24">
      <div class="max-w-3xl mx-auto px-4 text-center">
        <!-- 完了アイコン -->
        <div class="mb-8">
          <div class="w-20 h-20 mx-auto bg-gradient-to-br from-akatsuki to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
            <span class="text-4xl">✨</span>
          </div>
        </div>
        
        <!-- メッセージ -->
        <h1 class="text-3xl md:text-4xl font-bold text-deep-sumi mb-4">
          お問い合わせありがとうございます
        </h1>
        
        <p class="text-lg text-sumi mb-2">
          担当者より<strong class="text-akatsuki">2営業日以内</strong>にご連絡いたします。
        </p>
        
        <p class="text-sumi/80">
          「不」を「光」へ変えるお手伝い、楽しみにしております。
        </p>
        
        <!-- 問い合わせ製品の表示 -->
        <div v-if="product" class="mt-8 p-4 bg-white rounded-xl border border-ash/20 inline-block">
          <p class="text-sm text-ash mb-1">お問い合わせいただいた製品</p>
          <p class="font-bold text-deep-sumi">
            {{ product.name }}
          </p>
          <p class="text-sm text-sumi/70">{{ product.subtitle }}</p>
        </div>
      </div>
    </section>
    
    <!-- クロスセル・レコメンド -->
    <section class="py-16 bg-washi/50">
      <div class="max-w-4xl mx-auto px-4">
        <div class="text-center mb-10">
          <p class="text-lg text-akatsuki font-medium mb-2">💡</p>
          <h2 class="text-2xl font-bold text-deep-sumi mb-2">
            {{ narrativeMessage || 'こちらもおすすめです' }}
          </h2>
          <p class="text-sumi/80">
            IYASAKAの「弥栄」は、ひとつの解決から循環が始まります
          </p>
        </div>
        
        <div class="grid gap-6 md:grid-cols-3">
          <NuxtLink
            v-for="rec in recommendations"
            :key="rec.id"
            :to="`/#contact?product=${rec.id}`"
            class="block bg-white rounded-xl p-6 border border-ash/20 hover:border-akatsuki hover:shadow-lg transition-all group"
          >
            <!-- 製品名 -->
            <h3 class="font-bold text-deep-sumi mb-1 group-hover:text-akatsuki transition-colors">
              {{ rec.name }}
            </h3>
            <p class="text-sm text-ash mb-3">{{ rec.subtitle }}</p>
            
            <!-- 痛み → 解決 -->
            <div class="text-sm">
              <p class="text-sumi/70 mb-1">
                <span class="text-red-400">●</span> {{ rec.strongestPain }}
              </p>
              <p class="text-sumi">
                <span class="text-akatsuki">●</span> {{ rec.solution }}
              </p>
            </div>
            
            <!-- CTA -->
            <div class="mt-4 text-sm text-akatsuki font-medium group-hover:underline">
              詳しく相談する →
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
    
    <!-- お役立ち資料 -->
    <section class="py-16">
      <div class="max-w-3xl mx-auto px-4 text-center">
        <h2 class="text-xl font-bold text-deep-sumi mb-6">📚 お役立ち資料</h2>
        
        <div class="grid gap-4 md:grid-cols-2">
          <NuxtLink
            to="/company/story"
            class="block p-4 bg-white rounded-xl border border-ash/20 hover:border-akatsuki transition-colors text-left"
          >
            <h3 class="font-medium text-deep-sumi mb-1">IYASAKAの考える「弥栄」とは</h3>
            <p class="text-sm text-ash">社名に込めた想いと未来のビジョン</p>
          </NuxtLink>
          
          <NuxtLink
            to="/cases"
            class="block p-4 bg-white rounded-xl border border-ash/20 hover:border-akatsuki transition-colors text-left"
          >
            <h3 class="font-medium text-deep-sumi mb-1">現場DXの成功事例集</h3>
            <p class="text-sm text-ash">「不」が「光」に変わった現場の物語</p>
          </NuxtLink>
        </div>
        
        <!-- トップへ戻る -->
        <div class="mt-12">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 text-ash hover:text-akatsuki transition-colors"
          >
            ← トップページに戻る
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
