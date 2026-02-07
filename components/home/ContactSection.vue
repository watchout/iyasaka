<script setup lang="ts">
/**
 * ContactSection - HP内統合問い合わせフォーム
 * パターンC改良版：CVR地点HP集約型
 * 
 * 機能:
 * - URLパラメータ（?product=xxx）でプリフィル
 * - 診断結果からプリフィル
 * - 最短ステップでリード獲得
 */
import { products, getProductById, type ProductId } from '~/app/data/products'

const route = useRoute()
const router = useRouter()
const { getPrefilledProduct, buildLeadPayload } = useLeadTracking()

// 製品オプション（Featured製品のみ）
const productOptions = computed(() => {
  return products
    .filter(p => p.homeFeatured)
    .sort((a, b) => a.homeOrder - b.homeOrder)
    .map(p => ({ value: p.id, label: p.name, subtitle: p.subtitle }))
})

// フォームデータ
const form = reactive({
  name: '',
  email: '',
  phone: '',
  company: '',
  employees: '',
  interestedProducts: [] as ProductId[],
  message: '',
  privacyAgreed: false,
  // ハニーポット
  website: ''
})

// プリフィル処理
onMounted(() => {
  const prefilledProduct = getPrefilledProduct()
  if (prefilledProduct && products.some(p => p.id === prefilledProduct)) {
    form.interestedProducts = [prefilledProduct]
  }
})

// URLパラメータ変更時のプリフィル（product / p_id 両対応）
watch(() => [route.query.product, route.query.p_id], ([newProduct, newPid]) => {
  const candidate = (newProduct || newPid) as string | undefined
  if (candidate && products.some(p => p.id === candidate)) {
    if (!form.interestedProducts.includes(candidate as ProductId)) {
      form.interestedProducts = [candidate as ProductId]
    }
  }
})

// 従業員規模オプション
const employeeOptions = [
  { value: '1-10', label: '1〜10名' },
  { value: '11-50', label: '11〜50名' },
  { value: '51-100', label: '51〜100名' },
  { value: '101+', label: '101名以上' },
]

// 送信状態
const submitting = ref(false)
const submitted = ref(false)
const errorMessage = ref('')

// バリデーション
const isValid = computed(() => {
  return (
    form.name.trim() !== '' &&
    form.email.trim() !== '' &&
    form.employees !== '' &&
    form.interestedProducts.length > 0 &&
    form.privacyAgreed
  )
})

// 送信処理
const onSubmit = async () => {
  if (submitting.value || !isValid.value) return
  
  // ハニーポット検知
  if (form.website) {
    submitted.value = true
    return
  }
  
  submitting.value = true
  errorMessage.value = ''
  
  try {
    const payload = buildLeadPayload({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone || undefined,
      company: form.company || undefined,
      employees: form.employees,
      interestedProducts: form.interestedProducts,
      message: form.message || '',
      privacyAgreed: form.privacyAgreed
    })
    
    await $fetch('/api/leads', {
      method: 'POST',
      body: payload
    })
    
    submitted.value = true
    
    // サンクスページへ
    router.push({
      path: '/contact/thanks',
      query: {
        product: form.interestedProducts[0]
      }
    })
  } catch (err) {
    console.error(err)
    errorMessage.value = '送信に失敗しました。時間をおいて再度お試しください。'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section 
    id="contact" 
    class="py-section bg-gradient-to-b from-washi to-white scroll-mt-20"
  >
    <div class="max-w-4xl mx-auto px-6">
      <!-- ヘッダー -->
      <div class="text-center mb-12">
        <span class="inline-block px-4 py-1 bg-akatsuki/10 text-akatsuki rounded-full text-sm font-medium mb-4">
          無料相談
        </span>
        <h2 class="text-3xl md:text-4xl font-gothic font-bold text-deep-sumi mb-4">
          2026年を乗り越える準備は、<br class="sm:hidden">できていますか？
        </h2>
        <p class="text-lg text-ash max-w-2xl mx-auto">
          お問い合わせ後、2営業日以内に担当者よりご連絡いたします。<br>
          まずは現状のお悩みをお聞かせください。
        </p>
      </div>
      
      <!-- フォーム -->
      <div class="bg-white rounded-card shadow-card p-8 md:p-12">
        <!-- ハニーポット -->
        <div class="sr-only" aria-hidden="true">
          <label>
            ウェブサイト
            <input 
              v-model="form.website" 
              type="text" 
              name="website" 
              autocomplete="off" 
              tabindex="-1"
            >
          </label>
        </div>
        
        <form @submit.prevent="onSubmit" class="space-y-6">
          <!-- 興味のある製品（複数選択） -->
          <div>
            <label class="block text-sm font-medium text-sumi mb-3">
              興味のある製品 <span class="text-error">*</span>
              <span class="font-normal text-ash ml-2">（複数選択可）</span>
            </label>
            <div class="grid sm:grid-cols-2 gap-3">
              <label 
                v-for="option in productOptions" 
                :key="option.value"
                class="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all"
                :class="[
                  form.interestedProducts.includes(option.value)
                    ? 'border-akatsuki bg-akatsuki/5'
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <input
                  v-model="form.interestedProducts"
                  type="checkbox"
                  :value="option.value"
                  class="mt-0.5 h-5 w-5 rounded border-gray-300 text-akatsuki focus:ring-akatsuki"
                >
                <div>
                  <span class="font-medium text-sumi">{{ option.label }}</span>
                  <span class="block text-xs text-ash mt-0.5">{{ option.subtitle }}</span>
                </div>
              </label>
            </div>
          </div>
          
          <!-- 基本情報（2カラム） -->
          <div class="grid md:grid-cols-2 gap-4">
            <!-- お名前 -->
            <div>
              <label class="block text-sm font-medium text-sumi mb-1">
                お名前 <span class="text-error">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-akatsuki focus:ring-2 focus:ring-akatsuki/20 outline-none transition-all"
                placeholder="山田 太郎"
              >
            </div>
            
            <!-- メールアドレス -->
            <div>
              <label class="block text-sm font-medium text-sumi mb-1">
                メールアドレス <span class="text-error">*</span>
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-akatsuki focus:ring-2 focus:ring-akatsuki/20 outline-none transition-all"
                placeholder="yamada@example.com"
              >
            </div>
            
            <!-- 電話番号 -->
            <div>
              <label class="block text-sm font-medium text-sumi mb-1">
                電話番号
              </label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-akatsuki focus:ring-2 focus:ring-akatsuki/20 outline-none transition-all"
                placeholder="03-1234-5678"
              >
            </div>
            
            <!-- 会社名 -->
            <div>
              <label class="block text-sm font-medium text-sumi mb-1">
                会社名
              </label>
              <input
                v-model="form.company"
                type="text"
                class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-akatsuki focus:ring-2 focus:ring-akatsuki/20 outline-none transition-all"
                placeholder="株式会社〇〇"
              >
            </div>
          </div>
          
          <!-- 従業員規模 -->
          <div>
            <label class="block text-sm font-medium text-sumi mb-1">
              従業員規模 <span class="text-error">*</span>
            </label>
            <select
              v-model="form.employees"
              required
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-akatsuki focus:ring-2 focus:ring-akatsuki/20 outline-none transition-all"
            >
              <option value="">選択してください</option>
              <option 
                v-for="option in employeeOptions" 
                :key="option.value" 
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          
          <!-- メッセージ -->
          <div>
            <label class="block text-sm font-medium text-sumi mb-1">
              現在のお悩み・ご質問
            </label>
            <textarea
              v-model="form.message"
              rows="4"
              class="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-akatsuki focus:ring-2 focus:ring-akatsuki/20 outline-none transition-all resize-none"
              placeholder="現在の状況や課題、ご質問などをご自由にお書きください"
            />
          </div>
          
          <!-- プライバシーポリシー同意 -->
          <div class="pt-4 border-t border-gray-100">
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                v-model="form.privacyAgreed"
                type="checkbox"
                required
                class="mt-0.5 h-5 w-5 rounded border-gray-300 text-akatsuki focus:ring-akatsuki"
              >
              <span class="text-sm text-ash">
                <NuxtLink 
                  to="/legal/privacy" 
                  class="text-akatsuki underline hover:no-underline" 
                  target="_blank"
                >
                  プライバシーポリシー
                </NuxtLink>
                に同意します <span class="text-error">*</span>
              </span>
            </label>
          </div>
          
          <!-- 送信ボタン -->
          <div class="pt-4">
            <button
              type="submit"
              class="w-full py-4 px-8 bg-akatsuki text-white rounded-button font-bold text-lg shadow-cta hover:shadow-cta-hover hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              :disabled="submitting || !isValid"
            >
              <span v-if="!submitting">
                無料で相談する
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                送信中...
              </span>
            </button>
            
            <p class="text-center text-sm text-ash mt-4">
              ※ 診断結果は即座に表示されます<br>
              ※ しつこい営業は一切ありません
            </p>
          </div>
          
          <!-- エラーメッセージ -->
          <p 
            v-if="errorMessage" 
            class="text-center text-error text-sm" 
            role="alert"
          >
            {{ errorMessage }}
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

