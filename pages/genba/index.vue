<script setup lang="ts">
/**
 * 建設・製造・物流向けLP
 * ミエルプラス + 弱電プラスを中心に訴求
 * 
 * 深層ペイン:
 * - 「進捗の嘘」への不信
 * - 属人化した「脳内データ」の喪失
 */
import { getProductById } from '~/app/data/products'

const mieruPlus = getProductById('mieru-plus')
const jakudenPlus = getProductById('jakuden-plus')

// SEO
useSeoMeta({
  title: '建設・製造・物流のDX支援｜IYASAKA',
  description: 'ホワイトボードに書いてあることは、もう3時間前の話。現場の「今」が見えないまま経営判断を迫られる──その孤独を解決します。',
  ogTitle: '建設・製造・物流向けソリューション｜IYASAKA',
  ogDescription: '現場の進捗をリアルタイムで可視化。属人化を解消し、誰がいなくても回る現場を創ります。',
})

// ペイン項目
const pains = [
  {
    icon: '📋',
    title: 'ホワイトボードは3時間前の話',
    description: '朝礼で確認した進捗が、午後には変わっている。でも誰も更新しない。経営判断は常に「過去のデータ」に基づいている。'
  },
  {
    icon: '🧠',
    title: 'あの職人の頭の中にしかない',
    description: '在庫の場所、作業の手順、トラブル対応のコツ。全てベテランの「脳内」にある。その人が辞めたら、ノウハウが消える。'
  },
  {
    icon: '🚗',
    title: '現場に行かないとわからない',
    description: '遠隔地の現場状況を把握するために、往復2時間。確認のためだけに移動時間を使っている。'
  },
  {
    icon: '⚡',
    title: '設備が止まったら、誰に頼む？',
    description: '電気設備のトラブル。IT機器の不具合。誰に電話すればいいかわからない。見積もりは毎回高額で、妥当性も判断できない。'
  }
]

// ソリューション
const solutions = [
  {
    product: 'ミエルプラス',
    title: '現場の「今」をリアルタイムで把握',
    description: 'AI+カメラで、作業の進捗・在庫・人の動きを自動で可視化。ホワイトボードへの手入力は不要。スマホから遠隔で確認できます。',
    features: [
      '作業進捗のリアルタイム表示',
      '在庫・資材の自動カウント',
      'スタッフの位置・稼働状況確認',
      '異常検知とアラート通知',
      '日報・レポート自動生成'
    ],
    result: '管理業務を1日60分削減'
  },
  {
    product: '弱電プラス',
    title: '設備トラブル時の「頼れる先」',
    description: 'ネットワーク、監視カメラ、音響設備。専門外のトラブルに24時間365日対応。月額固定で予算も読めます。',
    features: [
      '24時間365日の電話サポート',
      'トラブル発生30分以内に一次回答',
      '現地駆けつけ24時間以内',
      '月額固定で予算が読める',
      '予防保守で未然にトラブル防止'
    ],
    result: 'トラブル対応時間80%削減'
  }
]

// 導入効果
const results = [
  { value: '60', unit: '分/日', label: '管理業務削減' },
  { value: '80', unit: '%', label: 'トラブル対応時間削減' },
  { value: '92', unit: '%', label: 'ライン停止時間削減' }
]

// よくある質問
const faqs = [
  {
    q: '既存のシステムと連携できますか？',
    a: 'はい、API連携により多くの管理システムと統合できます。詳細は無料診断時にご相談ください。'
  },
  {
    q: '導入までにどのくらいかかりますか？',
    a: 'ミエルプラスは初回ヒアリング後2週間で稼働開始。弱電プラスは契約後即日サポート開始できます。'
  },
  {
    q: '複数の現場・拠点に対応できますか？',
    a: 'はい、クラウドベースなので複数拠点を一元管理できます。拠点追加も簡単です。'
  },
  {
    q: '現場のスタッフがITに詳しくなくても使えますか？',
    a: 'はい、直感的なUIのため特別なトレーニングは不要です。導入時に操作説明を行います。'
  },
  {
    q: '費用はどのくらいですか？',
    a: 'ミエルプラスは月額3万円〜、弱電プラスは拠点数により変動します。詳細はヒアリング後にお見積りします。'
  }
]
</script>

<template>
  <div class="min-h-screen bg-washi">
    
    <!-- ===== HERO ===== -->
    <section class="relative py-24 md:py-32 bg-sumi overflow-hidden">
      <div class="absolute inset-0 washi-noise opacity-[0.02]" />
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-akatsuki/10 rounded-full blur-3xl" />
      
      <div class="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <span class="inline-block px-4 py-1 bg-akatsuki/20 text-akatsuki rounded-full text-sm font-medium mb-6">
          建設・製造・物流向け
        </span>
        
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-mincho text-washi leading-relaxed mb-8">
          ホワイトボードに書いてあることは、<br>
          もう3時間前の話だ。<br>
          <span class="text-akatsuki">──現場の「今」を、見える化します。</span>
        </h1>
        
        <p class="text-lg text-washi/70 mb-10 max-w-2xl mx-auto">
          進捗が見えないまま経営判断を迫られる。<br>
          ベテランの頭の中にしかないノウハウ。<br>
          設備が止まったとき、誰に頼めばいいかわからない。<br>
          そんな現場の「不」を解決します。
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
            製造業の導入事例を見る
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
          ※ 数値は導入企業へのヒアリング結果に基づく平均値です。効果は現場規模・運用方法により異なります。
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
          現場の「今」が見える。<br>
          止まらない。<br>
          そんな現場を、一緒に作りませんか？
        </h2>
        <p class="text-ash mb-8">
          まずは現状のお悩みをお聞かせください。<br>
          現場の規模・課題に合わせた最適なプランをご提案します。
        </p>
        <NuxtLink 
          to="/#contact?product=mieru-plus"
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

