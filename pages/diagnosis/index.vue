<script setup lang="ts">
/**
 * IYASAKA 業種別診断
 * 
 * 製品ベースではなく業種ベースで診断
 * → 業種選択 → 深堀り質問 → 結果ページ（業種LP or カスタム提案）
 */
import type { ProductId } from '~/app/data/products'

const router = useRouter()
const { saveSimpleDiagnosisResult } = useLeadTracking()

// 診断ステップ
type DiagnosisStep = 'industry' | 'pain' | 'urgency'
const currentStep = ref<DiagnosisStep>('industry')

// 選択結果
const selectedIndustry = ref<string | null>(null)
const selectedPains = ref<string[]>([])
const urgencyLevel = ref<'high' | 'medium' | 'low' | null>(null)

type Industry = {
  id: string
  icon: string
  title: string
  description: string
  path: string | null
  pains: { id: string; label: string }[]
  products: ProductId[]
}

// 業種データ
const industries: Industry[] = [
  {
    id: 'hotel',
    icon: '🏨',
    title: 'ホテル・旅館・宿泊業',
    description: 'フロント対応、多言語、人手不足',
    path: '/hotel/',
    pains: [
      { id: 'night-front', label: '深夜のフロント対応に困っている' },
      { id: 'multilingual', label: '多言語対応が難しい' },
      { id: 'staff-shortage', label: 'スタッフが足りない' },
      { id: 'room-status', label: '客室状況の把握に時間がかかる' }
    ],
    products: ['omotenasu-ai', 'mieru-plus']
  },
  {
    id: 'genba',
    icon: '🏗️',
    title: '建設・製造・物流',
    description: '現場の可視化、属人化、設備保守',
    path: '/genba/',
    pains: [
      { id: 'progress-invisible', label: '現場の進捗が見えない' },
      { id: 'know-how-loss', label: 'ベテランのノウハウが引き継げない' },
      { id: 'equipment-trouble', label: '設備トラブル時に誰に頼むかわからない' },
      { id: 'remote-check', label: '遠隔地の現場確認に時間がかかる' }
    ],
    products: ['mieru-plus', 'jakuden-plus']
  },
  {
    id: 'venue',
    icon: '🎤',
    title: '貸会議室・イベント会場',
    description: '収益多角化、配信、投資リスク',
    path: '/venue/',
    pains: [
      { id: 'box-rental', label: 'ただの「箱貸し」になっている' },
      { id: 'streaming-fear', label: '配信設備の投資リスクが怖い' },
      { id: 'equipment-unused', label: '導入した機材が使われていない' },
      { id: 'event-trouble', label: 'イベント当日のトラブルが心配' }
    ],
    products: ['haishin-plus', 'jakuden-plus']
  },
  {
    id: 'office',
    icon: '🏢',
    title: 'オフィス・施設管理',
    description: 'ネットワーク、設備保守、IT担当不在',
    path: '/infra/',
    pains: [
      { id: 'network-down', label: 'ネットが止まると業務が止まる' },
      { id: 'camera-issue', label: '監視カメラの管理ができていない' },
      { id: 'vendor-expensive', label: '業者を呼ぶと高額請求される' },
      { id: 'no-it-staff', label: 'IT担当者がいない' }
    ],
    products: ['jakuden-plus', 'ai-plus']
  },
  {
    id: 'other',
    icon: '💡',
    title: 'その他・複合的な課題',
    description: '上記に当てはまらない、複数の課題がある',
    path: null,
    pains: [
      { id: 'custom-ai', label: '既製品では解決できない独自の課題がある' },
      { id: 'multiple-issues', label: '複数の課題を同時に解決したい' },
      { id: 'not-sure', label: '何が課題かわからないが、なんとかしたい' }
    ],
    products: ['ai-plus']
  }
]

// 緊急度オプション
const urgencyOptions = [
  { id: 'high', label: '今すぐ（1ヶ月以内に解決したい）', icon: '🔥' },
  { id: 'medium', label: '近いうちに（3ヶ月以内）', icon: '⏰' },
  { id: 'low', label: '情報収集段階', icon: '📚' }
]

// プログレス計算
const progress = computed(() => {
  if (currentStep.value === 'industry') return 33
  if (currentStep.value === 'pain') return 66
  return 100
})

// 選択された業種
const currentIndustry = computed(() => 
  industries.find(i => i.id === selectedIndustry.value)
)

// 業種選択
const selectIndustry = (industryId: string) => {
  selectedIndustry.value = industryId
  selectedPains.value = []
  currentStep.value = 'pain'
}

// ペイン選択（複数可）
const togglePain = (painId: string) => {
  const index = selectedPains.value.indexOf(painId)
  if (index > -1) {
    selectedPains.value.splice(index, 1)
  } else {
    selectedPains.value.push(painId)
  }
}

// ペイン選択完了
const completePainSelection = () => {
  currentStep.value = 'urgency'
}

// 緊急度選択 → 結果へ
const selectUrgency = (level: 'high' | 'medium' | 'low') => {
  urgencyLevel.value = level
  completeDiagnosis()
}

// 診断完了
const completeDiagnosis = () => {
  const result = {
    industry: selectedIndustry.value,
    pains: selectedPains.value,
    urgency: urgencyLevel.value,
    products: currentIndustry.value?.products || [],
    timestamp: Date.now()
  }
  
  if (import.meta.client) {
    // 詳細結果（任意: 将来の改善/分析用）
    sessionStorage.setItem('iyasaka_industry_diagnosis', JSON.stringify(result))
  }
  
  const recommendedProduct: ProductId = (currentIndustry.value?.products?.[0] || 'mieru-plus') as ProductId
  saveSimpleDiagnosisResult({
    product: recommendedProduct,
    score: selectedPains.value.length,
    timestamp: Date.now()
  })
  
  router.push({
    path: '/diagnosis/result',
    query: { product: recommendedProduct }
  })
}

// 戻る
const goBack = () => {
  if (currentStep.value === 'pain') {
    currentStep.value = 'industry'
    selectedIndustry.value = null
  } else if (currentStep.value === 'urgency') {
    currentStep.value = 'pain'
  }
}

// SEO
useSeoMeta({
  title: '90秒診断｜IYASAKA',
  description: 'あなたの業種・課題に最適なソリューションを90秒で診断。ホテル、建設、製造、貸会議室など、現場の「不」を解決します。',
  robots: 'noindex'
})
</script>

<template>
  <div class="min-h-screen bg-washi py-16 md:py-24">
    <div class="max-w-2xl mx-auto px-6">
      
      <!-- ヘッダー -->
      <div class="text-center mb-12">
        <h1 class="text-2xl md:text-3xl font-gothic font-bold text-deep-sumi mb-4">
          90秒診断
        </h1>
        <p class="text-ash">
          あなたの業種・課題に最適なソリューションを見つけます
        </p>
      </div>
      
      <!-- プログレスバー -->
      <div class="mb-12">
        <div class="flex justify-between mb-2 text-sm text-ash">
          <span>{{ currentStep === 'industry' ? '業種選択' : currentStep === 'pain' ? 'お悩み選択' : '緊急度' }}</span>
          <span>{{ progress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-akatsuki h-2 rounded-full transition-all duration-500"
            :style="{ width: progress + '%' }"
          />
        </div>
      </div>
      
      <!-- STEP 1: 業種選択 -->
      <div v-if="currentStep === 'industry'" class="space-y-4">
        <h2 class="text-xl font-bold text-sumi mb-6">
          あなたの業種は？
        </h2>
        
        <button
          v-for="industry in industries"
          :key="industry.id"
          @click="selectIndustry(industry.id)"
          class="w-full p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-akatsuki hover:shadow-lg transition-all text-left group"
        >
          <div class="flex items-start gap-4">
            <span class="text-4xl">{{ industry.icon }}</span>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-sumi group-hover:text-akatsuki transition-colors">
                {{ industry.title }}
              </h3>
              <p class="text-sm text-ash mt-1">{{ industry.description }}</p>
            </div>
            <svg class="w-6 h-6 text-gray-300 group-hover:text-akatsuki transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
      
      <!-- STEP 2: ペイン選択 -->
      <div v-else-if="currentStep === 'pain'" class="space-y-4">
        <h2 class="text-xl font-bold text-sumi mb-2">
          {{ currentIndustry?.title }}
        </h2>
        <p class="text-ash mb-6">
          当てはまるものをすべて選んでください（複数選択可）
        </p>
        
        <button
          v-for="pain in currentIndustry?.pains"
          :key="pain.id"
          @click="togglePain(pain.id)"
          :class="[
            'w-full p-5 rounded-xl border-2 transition-all text-left',
            selectedPains.includes(pain.id)
              ? 'border-akatsuki bg-akatsuki/5'
              : 'border-gray-200 bg-white hover:border-akatsuki/50'
          ]"
        >
          <div class="flex items-center gap-4">
            <div 
              :class="[
                'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                selectedPains.includes(pain.id)
                  ? 'border-akatsuki bg-akatsuki'
                  : 'border-gray-300'
              ]"
            >
              <svg 
                v-if="selectedPains.includes(pain.id)" 
                class="w-4 h-4 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span class="text-sumi">{{ pain.label }}</span>
          </div>
        </button>
        
        <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            @click="goBack"
            class="text-ash hover:text-sumi transition-colors"
          >
            ← 業種選択に戻る
          </button>
          <button
            @click="completePainSelection"
            :disabled="selectedPains.length === 0"
            :class="[
              'px-8 py-3 rounded-lg font-bold transition-all',
              selectedPains.length > 0
                ? 'bg-akatsuki text-white hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            ]"
          >
            次へ →
          </button>
        </div>
      </div>
      
      <!-- STEP 3: 緊急度 -->
      <div v-else-if="currentStep === 'urgency'" class="space-y-4">
        <h2 class="text-xl font-bold text-sumi mb-2">
          解決の緊急度は？
        </h2>
        <p class="text-ash mb-6">
          最適なご提案のために教えてください
        </p>
        
        <button
          v-for="option in urgencyOptions"
          :key="option.id"
          @click="selectUrgency(option.id as 'high' | 'medium' | 'low')"
          class="w-full p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-akatsuki hover:shadow-lg transition-all text-left group"
        >
          <div class="flex items-center gap-4">
            <span class="text-3xl">{{ option.icon }}</span>
            <span class="text-sumi font-medium group-hover:text-akatsuki transition-colors">
              {{ option.label }}
            </span>
          </div>
        </button>
        
        <div class="mt-8 pt-6 border-t border-gray-200">
          <button
            @click="goBack"
            class="text-ash hover:text-sumi transition-colors"
          >
            ← お悩み選択に戻る
          </button>
        </div>
      </div>
      
    </div>
  </div>
</template>
