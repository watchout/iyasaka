<script setup lang="ts">
/**
 * ホテル・旅館向けLP
 * OmotenasuAI + ミエルプラスを中心に訴求
 * 
 * 深層ペイン:
 * - ホスピタリティの限界に対する罪悪感
 * - 「人」に依存しすぎるリスクの恐怖
 */
import { getProductById } from '~/app/data/products'

const omotenasuAI = getProductById('omotenasu-ai')
const mieruPlus = getProductById('mieru-plus')

// SEO
useSeoMeta({
  title: 'ホテル・旅館のDX支援｜IYASAKA',
  description: '深夜2時、フロントに誰もいない。でもお客様は待っている──その孤独を解決します。AIコンシェルジュと現場可視化で、本来のおもてなしに集中できる環境を。',
  ogTitle: 'ホテル・旅館向けソリューション｜IYASAKA',
  ogDescription: '深夜対応の80%を自動化。スタッフが本来のおもてなしに集中できる環境を創ります。',
})

// ペイン項目
const pains = [
  {
    icon: '🌙',
    title: '深夜のフロント、誰もいない',
    description: '深夜2時、チェックアウト時間や周辺情報の問い合わせ。対応できるスタッフがいない。翌朝、クレームになる。'
  },
  {
    icon: '😔',
    title: 'おもてなしの本質を忘れている',
    description: '些細な質問対応に追われ、本当に大切にしたい「お客様一人ひとりへの深いおもてなし」に手が回らない。'
  },
  {
    icon: '👤',
    title: 'あの人がいないと回らない',
    description: '多言語対応も、クレーム対応も、特定のベテランに依存。その人が辞めたら、サービス品質が崩壊する。'
  },
  {
    icon: '📊',
    title: '現場の状況が見えない',
    description: '客室の清掃状況、備品の在庫、スタッフの動き。把握するのに時間がかかり、判断が遅れる。'
  }
]

// ソリューション
const solutions = [
  {
    product: 'OmotenasuAI',
    title: 'AIコンシェルジュで深夜対応を自動化',
    description: '24時間365日、お客様からの問い合わせに即座に対応。定型的な質問の80%を自動処理し、スタッフは本来のおもてなしに集中できます。客室AIコンシェルジュを入口に、PMS/CRMまで段階的に連携できます。',
    features: [
      'チェックイン・アウト時間の案内',
      '館内施設・周辺情報の案内',
      'ルームサービス・アメニティの注文受付',
      '多言語対応（15言語以上）',
      'PMS連携で顧客情報を活用'
    ],
    result: '深夜問い合わせの80%を自動化'
  },
  {
    product: 'ミエルプラス',
    title: '現場の「今」をリアルタイムで把握',
    description: '客室の清掃状況、備品の在庫、スタッフの動き。全てがスマホで確認でき、的確な指示が出せます。',
    features: [
      '客室ステータスのリアルタイム表示',
      '清掃スタッフの位置・進捗確認',
      '備品・リネン在庫の自動管理',
      '異常検知とアラート通知',
      'レポート自動生成'
    ],
    result: '管理業務を1日60分削減'
  }
]

// 導入効果
const results = [
  { value: '80', unit: '%', label: '深夜問い合わせ自動化' },
  { value: '60', unit: '分/日', label: '管理業務削減' },
  { value: '35', unit: '%', label: '顧客満足度向上' }
]

// よくある質問
const faqs = [
  {
    q: '既存のPMSと連携できますか？',
    a: 'はい、TL-リンカーン、手間いらず、OPERA等、主要なPMSとの連携実績があります。詳細はお問い合わせください。'
  },
  {
    q: '多言語対応は可能ですか？',
    a: '日本語・英語・中国語・韓国語など15言語以上に対応しています。インバウンド需要にも対応可能です。'
  },
  {
    q: '導入までにどのくらいかかりますか？',
    a: 'OmotenasuAIは初期設定2週間、学習期間1ヶ月で本格稼働。ミエルプラスは2週間で稼働開始できます。'
  },
  {
    q: '小規模な旅館でも導入できますか？',
    a: 'はい、客室数10室程度の小規模施設から、100室以上の大型ホテルまで対応可能です。規模に応じたプランをご提案します。'
  },
  {
    q: '費用はどのくらいですか？',
    a: '施設規模により異なりますが、月額3万円〜でご利用いただけます。詳細はヒアリング後にお見積りします。'
  }
]
</script>

<template>
  <div class="min-h-screen bg-washi">
    
    <!-- ===== HERO ===== -->
    <section class="relative py-24 md:py-32 bg-sumi overflow-hidden">
      <div class="absolute inset-0 washi-noise opacity-[0.02]" />
      <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-akatsuki/10 rounded-full blur-3xl" />
      
      <div class="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <span class="inline-block px-4 py-1 bg-akatsuki/20 text-akatsuki rounded-full text-sm font-medium mb-6">
          ホテル・旅館向け
        </span>
        
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-mincho text-washi leading-relaxed mb-8">
          深夜2時、フロントに誰もいない。<br>
          でもお客様は待っている。<br>
          <span class="text-akatsuki">──その孤独を、解決します。</span>
        </h1>
        
        <p class="text-lg text-washi/70 mb-10 max-w-2xl mx-auto">
          些細な質問対応に追われて、本来のおもてなしができない。<br>
          ベテランが辞めたら、サービスが崩壊する。<br>
          そんな不安を、AIと可視化で解決します。
        </p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="#contact"
            class="inline-flex items-center gap-3 px-10 py-5 bg-akatsuki text-white rounded-button font-bold text-lg shadow-cta hover:shadow-cta-hover hover:-translate-y-1 transition-all"
          >
            無料で相談する
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <NuxtLink 
            to="/cases"
            class="inline-flex items-center gap-2 px-8 py-4 border-2 border-washi/30 text-washi rounded-button font-medium hover:bg-washi/10 transition-all"
          >
            ホテルの導入事例を見る
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ===== ペイン（共感セクション） ===== -->
    <section class="py-section bg-white">
      <div class="max-w-5xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-2xl md:text-3xl font-gothic font-bold text-deep-sumi mb-4">
            こんなお悩み、ありませんか？
          </h2>
        </div>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div 
            v-for="pain in pains" 
            :key="pain.title"
            class="p-6 rounded-card bg-washi border border-gray-100"
          >
            <div class="flex items-start gap-4">
              <span class="text-3xl">{{ pain.icon }}</span>
              <div>
                <h3 class="font-bold text-sumi mb-2">{{ pain.title }}</h3>
                <p class="text-sm text-ash leading-relaxed">{{ pain.description }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-12">
          <p class="text-xl text-sumi font-mincho">
            これらの「不」を「光」に変えるのが、<br>
            IYASAKAのソリューションです。
          </p>
        </div>
      </div>
    </section>

    <!-- ===== ソリューション ===== -->
    <section class="py-section bg-washi">
      <div class="max-w-5xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-2xl md:text-3xl font-gothic font-bold text-deep-sumi mb-4">
            2つのソリューションで解決
          </h2>
        </div>
        
        <div class="space-y-12">
          <div 
            v-for="(solution, index) in solutions" 
            :key="solution.product"
            class="bg-white rounded-card shadow-card overflow-hidden"
          >
            <div class="p-8 md:p-12">
              <div class="flex items-center gap-3 mb-4">
                <span class="px-3 py-1 bg-akatsuki/10 text-akatsuki rounded-full text-sm font-medium">
                  Solution {{ index + 1 }}
                </span>
                <span class="font-bold text-sumi">{{ solution.product }}</span>
              </div>
              
              <h3 class="text-xl md:text-2xl font-bold text-deep-sumi mb-4">
                {{ solution.title }}
              </h3>
              
              <p class="text-ash mb-6">
                {{ solution.description }}
              </p>
              
              <div class="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 class="font-medium text-sumi mb-3">主な機能</h4>
                  <ul class="space-y-2">
                    <li 
                      v-for="feature in solution.features" 
                      :key="feature"
                      class="flex items-start gap-2 text-sm text-ash"
                    >
                      <svg class="w-5 h-5 text-akatsuki flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {{ feature }}
                    </li>
                  </ul>
                </div>
                <div class="flex items-center justify-center">
                  <div class="text-center p-6 bg-akatsuki/5 rounded-lg">
                    <p class="text-sm text-ash mb-2">期待される効果</p>
                    <p class="text-2xl font-bold text-akatsuki">{{ solution.result }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 導入効果 ===== -->
    <section class="py-section bg-sumi">
      <div class="max-w-5xl mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-gothic font-bold text-washi mb-4">
            導入効果
          </h2>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8 mb-8">
          <div 
            v-for="result in results" 
            :key="result.label"
            class="text-center p-6"
          >
            <div class="text-5xl md:text-6xl font-bold text-akatsuki mb-2">
              {{ result.value }}<span class="text-2xl">{{ result.unit }}</span>
            </div>
            <p class="text-washi/70">{{ result.label }}</p>
          </div>
        </div>
        
        <p class="text-center text-xs text-washi/50">
          ※ 数値は導入施設へのヒアリング結果に基づく平均値です。効果は施設規模・運用方法により異なります。
        </p>
      </div>
    </section>

    <!-- ===== FAQ ===== -->
    <section class="py-section bg-white">
      <div class="max-w-3xl mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-gothic font-bold text-deep-sumi mb-4">
            よくあるご質問
          </h2>
        </div>
        
        <div class="space-y-4">
          <details 
            v-for="faq in faqs" 
            :key="faq.q"
            class="group bg-washi rounded-lg"
          >
            <summary class="flex items-center justify-between p-6 cursor-pointer list-none">
              <span class="font-medium text-sumi pr-4">{{ faq.q }}</span>
              <svg class="w-5 h-5 text-ash group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="px-6 pb-6 text-ash">
              {{ faq.a }}
            </div>
          </details>
        </div>
      </div>
    </section>

    <!-- ===== CTA ===== -->
    <section id="contact" class="py-section bg-gradient-to-b from-washi to-white scroll-mt-20">
      <div class="max-w-3xl mx-auto px-6 text-center">
        <h2 class="text-2xl md:text-3xl font-gothic font-bold text-deep-sumi mb-6">
          本来のおもてなしに集中できる<br>
          環境を、一緒に作りませんか？
        </h2>
        <p class="text-ash mb-8">
          まずは現状のお悩みをお聞かせください。<br>
          施設の規模・課題に合わせた最適なプランをご提案します。
        </p>
        <NuxtLink 
          to="/#contact?product=omotenasu-ai"
          class="inline-flex items-center gap-2 px-10 py-5 bg-akatsuki text-white rounded-button font-bold text-lg shadow-cta hover:shadow-cta-hover hover:-translate-y-0.5 transition-all"
        >
          無料で相談する
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
        <p class="text-sm text-ash mt-4">
          ※ 2営業日以内に担当者よりご連絡いたします
        </p>
      </div>
    </section>

  </div>
</template>

<style scoped>
.washi-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}
</style>

