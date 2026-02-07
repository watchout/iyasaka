<script setup lang="ts">
/**
 * IYASAKA 共通問い合わせフォーム
 * エモーショナルな「不」の選択から始まり、適切なソリューションへ導く
 */
import { 
  products, 
  categories, 
  painPoints, 
  getProductById,
  type ProductId, 
  type ProductCategory,
  type PainPoint
} from '~/app/data/products'

const route = useRoute()
const router = useRouter()

const { getProductFromParams, buildLeadPayload } = useLeadTracking()

type SelectedProduct = ProductId | 'undecided' | ''

// URLパラメータ（product / p_id）から初期値を取得（後方互換あり）
const initialProductId = computed(() => getProductFromParams().productId || undefined)

// フォームステップ管理
const currentStep = ref(1)
const totalSteps = 4

// フォームデータ
const form = reactive({
  // Step 1: 「不」の選択
  selectedPains: [] as string[],
  
  // Step 2: 製品選択
  selectedProduct: (initialProductId.value || '') as SelectedProduct,
  
  // Step 3: 基本情報
  name: '',
  email: '',
  company: '',
  phone: '',
  
  // Step 4: 詳細ヒアリング
  currentMethod: '', // 現在の管理方法
  companySize: '',   // 従業員規模
  expectation: '',   // 期待する効果
  
  // 自由記述
  message: '',
  
  // 同意
  consent: false,
  
  // ハニーポット
  website: ''
})

// 選択された「不」に基づく推奨製品
const recommendedProducts = computed(() => {
  if (form.selectedPains.length === 0) return []
  
  const productScores = new Map<ProductId, number>()
  
  form.selectedPains.forEach(painId => {
    const pain = painPoints.find(p => p.id === painId)
    if (pain) {
      pain.recommendedProducts.forEach((productId, index) => {
        const currentScore = productScores.get(productId) || 0
        productScores.set(productId, currentScore + (3 - index)) // 順位に応じたスコア
      })
    }
  })
  
  return Array.from(productScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => getProductById(id))
    .filter(Boolean)
})

// 選択された製品のカテゴリ
const selectedProductCategory = computed((): ProductCategory | null => {
  if (!form.selectedProduct || form.selectedProduct === 'undecided') return null
  const product = getProductById(form.selectedProduct)
  return product?.category || null
})

// カテゴリ別製品
const productsByCategory = computed(() => {
  return {
    organize: products.filter(p => p.category === 'organize'),
    connect: products.filter(p => p.category === 'connect'),
    nurture: products.filter(p => p.category === 'nurture')
  }
})

// フォーム送信
const submitting = ref(false)
const submitted = ref(false)
const errorMessage = ref('')

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1:
      return form.selectedPains.length > 0
    case 2:
      return form.selectedProduct !== ''
    case 3:
      return form.name.trim() !== '' && form.email.trim() !== '' && form.consent
    case 4:
      return true
    default:
      return false
  }
})

const nextStep = () => {
  if (currentStep.value < totalSteps && canProceed.value) {
    currentStep.value++
    // Step 2で推奨製品があれば自動選択
    if (currentStep.value === 2 && recommendedProducts.value.length > 0 && !form.selectedProduct) {
      form.selectedProduct = recommendedProducts.value[0]?.id || ''
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const onSubmit = async () => {
  if (submitting.value) return
  if (!form.consent) {
    errorMessage.value = '個人情報の取扱いへの同意が必要です。'
    return
  }
  
  // ハニーポット検知
  if (form.website) {
    submitted.value = true
    return
  }
  
  submitting.value = true
  errorMessage.value = ''
  
  // 2026年版リードスキーマに合わせて必須項目を揃える
  if (!form.companySize) {
    submitting.value = false
    errorMessage.value = '従業員規模を選択してください。'
    return
  }

  const selectedProductId: ProductId =
    form.selectedProduct && form.selectedProduct !== 'undecided'
      ? form.selectedProduct
      : 'mieru-plus'

  const selectedPainLabels = form.selectedPains
    .map((painId) => {
      if (painId === 'other') return 'その他（自由相談）'
      return painPoints.find(p => p.id === painId)?.label || painId
    })
    .filter(Boolean)

  const messageParts = [
    selectedPainLabels.length > 0 ? `選択した「不」: ${selectedPainLabels.join(' / ')}` : null,
    form.currentMethod ? `現在の状況: ${form.currentMethod}` : null,
    form.expectation ? `期待する効果: ${form.expectation}` : null,
    form.message ? `自由記述: ${form.message}` : null,
  ].filter((v): v is string => Boolean(v))

  const basePayload = buildLeadPayload({
    name: form.name.trim(),
    email: form.email.trim(),
    company: form.company.trim() || undefined,
    phone: form.phone || undefined,
    employees: form.companySize,
    interestedProducts: [selectedProductId],
    message: messageParts.join('\n'),
    privacyAgreed: form.consent,
  })

  // チャネルは tracking.source に残しつつ、ページ起点も識別できるようにする
  const payload = {
    ...basePayload,
    source: `contact_page:${basePayload.source}`,
  }
  
  try {
    await $fetch('/api/leads', {
      method: 'POST',
      body: payload
    })
    
    submitted.value = true
    
    // サンクスページへリダイレクト
    router.push({
      path: '/contact/thanks',
      query: {
        product: selectedProductId
      }
    })
  } catch (err) {
    console.error(err)
    errorMessage.value = '送信に失敗しました。時間をおいて再度お試しください。'
  } finally {
    submitting.value = false
  }
}

// 初期化時にp_idがあれば製品を選択してStep 2から開始
onMounted(() => {
  if (initialProductId.value) {
    form.selectedProduct = initialProductId.value
    // 対応する「不」も自動選択
    const product = getProductById(initialProductId.value)
    if (product) {
      const relatedPains = painPoints.filter(p => 
        p.recommendedProducts.includes(initialProductId.value!)
      )
      form.selectedPains = relatedPains.map(p => p.id)
    }
  }
})
</script>

<template>
  <div class="contact-form">
    <!-- プログレスバー -->
    <div class="mb-8">
      <div class="flex justify-between text-sm text-gray-500 mb-2">
        <span>ステップ {{ currentStep }} / {{ totalSteps }}</span>
        <span>{{ Math.round((currentStep / totalSteps) * 100) }}%</span>
      </div>
      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
        />
      </div>
    </div>
    
    <!-- ハニーポット（スパム対策） -->
    <div class="sr-only" aria-hidden="true">
      <label>
        ウェブサイト
        <input v-model="form.website" type="text" name="website" autocomplete="off" tabindex="-1">
      </label>
    </div>
    
    <form @submit.prevent="onSubmit">
      <!-- Step 1: 「不」の共感 -->
      <div v-show="currentStep === 1" class="space-y-6">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            今、どんな「不」を抱えていますか？
          </h2>
          <p class="text-gray-600">
            当てはまるものを選んでください（複数選択可）
          </p>
        </div>
        
        <div class="grid gap-3">
          <label 
            v-for="pain in painPoints" 
            :key="pain.id"
            class="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
            :class="[
              form.selectedPains.includes(pain.id)
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <input
              v-model="form.selectedPains"
              type="checkbox"
              :value="pain.id"
              class="mt-0.5 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
            >
            <div>
              <span class="font-medium text-gray-900">{{ pain.label }}</span>
              <span 
                class="ml-2 text-xs px-2 py-0.5 rounded-full"
                :style="{ 
                  backgroundColor: categories[pain.category].color + '20',
                  color: categories[pain.category].color
                }"
              >
                {{ categories[pain.category].name }}
              </span>
            </div>
          </label>
          
          <!-- その他 -->
          <label 
            class="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
            :class="[
              form.selectedPains.includes('other')
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <input
              v-model="form.selectedPains"
              type="checkbox"
              value="other"
              class="mt-0.5 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
            >
            <span class="font-medium text-gray-900">その他（自由相談）</span>
          </label>
        </div>
      </div>
      
      <!-- Step 2: 製品選択 -->
      <div v-show="currentStep === 2" class="space-y-6">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            あなたの「不」に応えるソリューション
          </h2>
          <p class="text-gray-600">
            興味のあるサービスを選んでください
          </p>
        </div>
        
        <!-- 推奨製品（選択した「不」に基づく） -->
        <div v-if="recommendedProducts.length > 0" class="mb-8">
          <h3 class="text-sm font-medium text-primary mb-3 flex items-center gap-2">
            <span class="text-lg">✨</span>
            おすすめ
          </h3>
          <div class="grid gap-3">
            <label 
              v-for="product in recommendedProducts" 
              :key="product?.id"
              class="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
              :class="[
                form.selectedProduct === product?.id
                  ? 'border-primary bg-primary/5'
                  : 'border-primary/30 hover:border-primary/50'
              ]"
            >
              <input
                v-model="form.selectedProduct"
                type="radio"
                :value="product?.id"
                class="mt-0.5 h-5 w-5 border-gray-300 text-primary focus:ring-primary"
              >
              <div>
                <span class="font-medium text-gray-900">{{ product?.title }}</span>
                <span class="text-gray-500 text-sm ml-2">{{ product?.subtitle }}</span>
                <p class="text-sm text-gray-600 mt-1">{{ product?.pain }} → {{ product?.light }}</p>
              </div>
            </label>
          </div>
        </div>
        
        <!-- カテゴリ別製品一覧 -->
        <div v-for="(catProducts, catKey) in productsByCategory" :key="catKey" class="mb-6">
          <h3 
            class="text-sm font-medium mb-3 flex items-center gap-2"
            :style="{ color: categories[catKey].color }"
          >
            <span>{{ categories[catKey].icon }}</span>
            【{{ categories[catKey].name }}】{{ categories[catKey].english }}
          </h3>
          <div class="grid gap-2">
            <label 
              v-for="product in catProducts" 
              :key="product.id"
              class="flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all"
              :class="[
                form.selectedProduct === product.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <input
                v-model="form.selectedProduct"
                type="radio"
                :value="product.id"
                class="mt-0.5 h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              >
              <div>
                <span class="font-medium text-gray-900 text-sm">{{ product.title }}</span>
                <span class="text-gray-500 text-xs ml-2">{{ product.subtitle }}</span>
              </div>
            </label>
          </div>
        </div>
        
        <!-- まだ決めていない -->
        <label 
          class="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
          :class="[
            form.selectedProduct === 'undecided'
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          <input
            v-model="form.selectedProduct"
            type="radio"
            value="undecided"
            class="mt-0.5 h-5 w-5 border-gray-300 text-primary focus:ring-primary"
          >
          <span class="font-medium text-gray-900">まだ決めていない / 相談したい</span>
        </label>
      </div>
      
      <!-- Step 3: 基本情報 -->
      <div v-show="currentStep === 3" class="space-y-6">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            ご連絡先をお聞かせください
          </h2>
          <p class="text-gray-600">
            担当者より2営業日以内にご連絡いたします
          </p>
        </div>
        
        <div class="grid gap-4 md:grid-cols-2">
          <label class="block">
            <span class="text-sm font-medium text-gray-700">
              お名前 <span class="text-red-500">*</span>
            </span>
            <input
              v-model="form.name"
              type="text"
              required
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="山田 太郎"
            >
          </label>
          
          <label class="block">
            <span class="text-sm font-medium text-gray-700">
              会社名
            </span>
            <input
              v-model="form.company"
              type="text"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="株式会社〇〇"
            >
          </label>
        </div>
        
        <div class="grid gap-4 md:grid-cols-2">
          <label class="block">
            <span class="text-sm font-medium text-gray-700">
              メールアドレス <span class="text-red-500">*</span>
            </span>
            <input
              v-model="form.email"
              type="email"
              required
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="yamada@example.com"
            >
          </label>
          
          <label class="block">
            <span class="text-sm font-medium text-gray-700">
              電話番号
            </span>
            <input
              v-model="form.phone"
              type="tel"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="03-1234-5678"
            >
          </label>
        </div>
        
        <!-- 同意チェック -->
        <div class="pt-4 border-t">
          <label class="flex items-start gap-3">
            <input
              v-model="form.consent"
              type="checkbox"
              required
              class="mt-0.5 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
            >
            <span class="text-sm text-gray-600">
              <NuxtLink to="/legal/privacy" class="text-primary underline" target="_blank">
                プライバシーポリシー
              </NuxtLink>
              に同意します <span class="text-red-500">*</span>
            </span>
          </label>
        </div>
      </div>
      
      <!-- Step 4: 詳細ヒアリング + 自由記述 -->
      <div v-show="currentStep === 4" class="space-y-6">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            もう少し詳しく教えてください
          </h2>
          <p class="text-gray-600">
            （任意）より的確なご提案のためにお聞かせください
          </p>
        </div>
        
        <!-- カテゴリ別ヒアリング -->
        <div v-if="selectedProductCategory" class="space-y-4">
          <!-- 整える -->
          <div v-if="selectedProductCategory === 'organize'" class="space-y-4">
            <label class="block">
              <span class="text-sm font-medium text-gray-700">現在の管理方法</span>
              <select 
                v-model="form.currentMethod"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="">選択してください</option>
                <option value="paper">紙・ホワイトボード</option>
                <option value="excel">Excel・スプレッドシート</option>
                <option value="system">既存システムあり（乗り換え検討）</option>
                <option value="none">特に管理していない</option>
              </select>
            </label>
          </div>
          
          <!-- つなぐ -->
          <div v-if="selectedProductCategory === 'connect'" class="space-y-4">
            <label class="block">
              <span class="text-sm font-medium text-gray-700">配信・発信について</span>
              <select 
                v-model="form.currentMethod"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="">選択してください</option>
                <option value="event">イベントやセミナーを配信したい</option>
                <option value="internal">社内向けの情報発信を強化したい</option>
                <option value="global">海外向けにコンテンツを展開したい</option>
                <option value="archive">既存の動画資産を活用したい</option>
              </select>
            </label>
          </div>
          
          <!-- 育てる -->
          <div v-if="selectedProductCategory === 'nurture'" class="space-y-4">
            <label class="block">
              <span class="text-sm font-medium text-gray-700">AI活用について</span>
              <select 
                v-model="form.currentMethod"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="">選択してください</option>
                <option value="tried">ChatGPT等を試したが定着しない</option>
                <option value="hospitality">接客の質を均一化・向上させたい</option>
                <option value="data">データを活かした意思決定をしたい</option>
                <option value="idea">業務効率化のアイデアが欲しい</option>
              </select>
            </label>
          </div>
        </div>
        
        <!-- 従業員規模 -->
        <label class="block">
          <span class="text-sm font-medium text-gray-700">従業員規模</span>
          <select 
            v-model="form.companySize"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="">選択してください</option>
            <option value="1-10">1〜10名</option>
            <option value="11-50">11〜50名</option>
            <option value="51-100">51〜100名</option>
            <option value="101+">101名以上</option>
          </select>
        </label>
        
        <!-- 期待する効果 -->
        <label class="block">
          <span class="text-sm font-medium text-gray-700">最も期待する効果</span>
          <select 
            v-model="form.expectation"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option value="">選択してください</option>
            <option value="time">時間の創出</option>
            <option value="sales">売上向上</option>
            <option value="satisfaction">顧客満足度向上</option>
            <option value="burden">スタッフの負担軽減</option>
          </select>
        </label>
        
        <!-- 自由記述 -->
        <label class="block">
          <span class="text-sm font-medium text-gray-700">
            その他、お聞きになりたいこと
          </span>
          <textarea
            v-model="form.message"
            rows="4"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="現在の状況や課題、ご質問などをご自由にお書きください"
          />
        </label>
      </div>
      
      <!-- ナビゲーションボタン -->
      <div class="mt-8 flex justify-between items-center">
        <button
          v-if="currentStep > 1"
          type="button"
          class="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          @click="prevStep"
        >
          ← 戻る
        </button>
        <div v-else />
        
        <button
          v-if="currentStep < totalSteps"
          type="button"
          class="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!canProceed"
          @click="nextStep"
        >
          次へ →
        </button>
        
        <button
          v-else
          type="submit"
          class="px-8 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
          :disabled="submitting"
        >
          <span v-if="!submitting">
            「不」を「光」に変える相談をする
          </span>
          <span v-else class="flex items-center gap-2">
            <span class="animate-spin">⏳</span>
            送信中...
          </span>
        </button>
      </div>
      
      <!-- エラーメッセージ -->
      <p v-if="errorMessage" class="mt-4 text-center text-red-600 text-sm" role="alert">
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>

<style scoped>
.contact-form {
  --color-primary: #1a365d;
  --color-primary-dark: #0f2341;
  --color-accent: #ff9e00;
  --color-accent-dark: #cc7e00;
}

input[type="text"],
input[type="email"],
input[type="tel"],
select,
textarea {
  @apply px-4 py-3;
}
</style>



