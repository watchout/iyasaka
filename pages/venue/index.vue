<script setup lang="ts">
/**
 * 貸会議室・イベント会場向けLP
 * 配信プラス + 弱電プラスを中心に訴求
 * 
 * 深層ペイン:
 * - 「場所貸し」という付加価値の死
 * - 投資リスクへの恐怖
 */
import { getProductById } from '~/app/data/products'

const haishinPlus = getProductById('haishin-plus')
const jakudenPlus = getProductById('jakuden-plus')

// SEO
useSeoMeta({
  title: '貸会議室・イベント会場のDX支援｜IYASAKA',
  description: '隣の会議室は配信で月100万稼いでいる。あなたの会議室は？──ただの箱貸しから、収益を生む資産へ。JV型で投資リスクを分担します。',
  ogTitle: '貸会議室・イベント会場向けソリューション｜IYASAKA',
  ogDescription: '配信機能をJVで追加。投資リスクなしで客単価+5,000円を実現します。',
})

// ペイン項目
const pains = [
  {
    icon: '📦',
    title: 'ただの「箱貸し」になっている',
    description: '立地と価格だけの競争。差別化ポイントがなく、毎年値下げ圧力が強まる。このままでは利益が出ない。'
  },
  {
    icon: '💸',
    title: '配信設備、投資できない',
    description: '配信需要があるのはわかる。でも、数百万の設備投資は怖い。使いこなせなかったらどうする？'
  },
  {
    icon: '🎛️',
    title: '機材があっても使えない',
    description: '以前導入した機材が、ホコリを被っている。スタッフが操作できない。お客様からクレームが来た。'
  },
  {
    icon: '🔧',
    title: 'トラブル時、誰が対応する？',
    description: 'イベント当日、マイクが鳴らない。プロジェクターが映らない。業者を呼ぶと高額請求。現場は大混乱。'
  }
]

// ソリューション
const solutions = [
  {
    product: '配信プラス',
    title: 'JV型で、投資リスクなしの配信事業',
    description: '設備投資はIYASAKAが負担。売上をシェアするJV型なので、あなたのリスクはゼロ。さらに外注・スクール（内製化）まで、運用が続く形で提供します。',
    features: [
      '初期投資ゼロ（JV型）',
      '配信機材の設置・保守込み',
      'オペレーター派遣も可能',
      '動画配信の外注（単発/継続）',
      '配信スクール（内製化支援）',
      '配信対応会議室としての告知支援',
      '売上シェア型の透明な契約'
    ],
    result: '客単価+5,000円、月間売上20-30%増'
  },
  {
    product: '弱電プラス',
    title: 'イベント当日も安心の保守体制',
    description: '音響・映像・ネットワーク。イベント中のトラブルに24時間対応。月額固定で予算も読めます。',
    features: [
      '24時間365日の電話サポート',
      'イベント当日の緊急対応',
      '音響・映像・ネットワーク全対応',
      '月額固定で予算が読める',
      '定期点検で未然にトラブル防止'
    ],
    result: 'トラブル対応時間80%削減'
  }
]

// 導入効果
const results = [
  { value: '+5,000', unit: '円', label: '客単価アップ' },
  { value: '20-30', unit: '%', label: '月間売上増' },
  { value: '0', unit: '円', label: '初期投資（JV型）' }
]

// よくある質問
const faqs = [
  {
    q: 'JV型とはどういう契約ですか？',
    a: '初期投資をIYASAKAが負担し、売上の一部をシェアする形式です。リスクを分担できるのが特徴です。月額固定型も選択可能です。'
  },
  {
    q: '既存の会議室設備を活用できますか？',
    a: 'はい、既存の設備を診断し、必要最小限の追加投資で配信対応可能にします。'
  },
  {
    q: '配信の運用も任せられますか？',
    a: 'はい、機材の操作からイベント当日のオペレーターまで一括で対応可能です。スタッフ教育も行えます。'
  },
  {
    q: 'どのくらいの収益増が見込めますか？',
    a: '立地・規模により異なりますが、平均で客単価+5,000円、月間売上20-30%増の実績があります。詳細はシミュレーションでご確認いただけます。'
  },
  {
    q: '契約期間に縛りはありますか？',
    a: 'JV型は最低1年契約をお願いしていますが、月額固定型は3ヶ月単位で柔軟に対応可能です。'
  }
]
</script>

<template>
  <div class="min-h-screen bg-washi">
    
    <!-- ===== HERO ===== -->
    <section class="relative py-24 md:py-32 bg-sumi overflow-hidden">
      <div class="absolute inset-0 washi-noise opacity-[0.02]" />
      <div class="absolute bottom-1/4 right-1/3 w-96 h-96 bg-akatsuki/10 rounded-full blur-3xl" />
      
      <div class="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <span class="inline-block px-4 py-1 bg-akatsuki/20 text-akatsuki rounded-full text-sm font-medium mb-6">
          貸会議室・イベント会場向け
        </span>
        
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-mincho text-washi leading-relaxed mb-8">
          隣の会議室は、配信で月100万稼いでいる。<br>
          <span class="text-akatsuki">あなたの会議室は？</span>
        </h1>
        
        <p class="text-lg text-washi/70 mb-10 max-w-2xl mx-auto">
          「ただの箱貸し」から脱却したい。<br>
          でも、配信設備への投資は怖い。<br>
          JV型なら、リスクゼロで収益多角化できます。
        </p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="#contact"
            class="inline-flex items-center gap-3 px-10 py-5 bg-akatsuki text-white rounded-button font-bold text-lg shadow-cta hover:shadow-cta-hover hover:-translate-y-1 transition-all"
          >
            収益シミュレーションを見る
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <NuxtLink 
            to="/cases"
            class="inline-flex items-center gap-2 px-8 py-4 border-2 border-washi/30 text-washi rounded-button font-medium hover:bg-washi/10 transition-all"
          >
            会場の導入事例を見る
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

    <!-- ===== JV型の説明 ===== -->
    <section class="py-section bg-akatsuki/5">
      <div class="max-w-4xl mx-auto px-6">
        <div class="bg-white rounded-card shadow-card p-8 md:p-12">
          <div class="text-center mb-8">
            <span class="inline-block px-4 py-1 bg-akatsuki/10 text-akatsuki rounded-full text-sm font-medium mb-4">
              IYASAKAだけの仕組み
            </span>
            <h2 class="text-2xl md:text-3xl font-gothic font-bold text-deep-sumi">
              JV（ジョイントベンチャー）型とは？
            </h2>
          </div>
          
          <div class="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div class="w-16 h-16 mx-auto mb-4 bg-akatsuki/10 rounded-full flex items-center justify-center">
                <span class="text-2xl">💰</span>
              </div>
              <h3 class="font-bold text-sumi mb-2">初期投資ゼロ</h3>
              <p class="text-sm text-ash">設備投資はIYASAKAが負担。あなたの持ち出しはありません。</p>
            </div>
            <div>
              <div class="w-16 h-16 mx-auto mb-4 bg-akatsuki/10 rounded-full flex items-center justify-center">
                <span class="text-2xl">🤝</span>
              </div>
              <h3 class="font-bold text-sumi mb-2">リスク分担</h3>
              <p class="text-sm text-ash">売上が出なければ費用もかからない。成功を一緒に目指すパートナー。</p>
            </div>
            <div>
              <div class="w-16 h-16 mx-auto mb-4 bg-akatsuki/10 rounded-full flex items-center justify-center">
                <span class="text-2xl">📈</span>
              </div>
              <h3 class="font-bold text-sumi mb-2">売上シェア</h3>
              <p class="text-sm text-ash">配信で得た売上の一部をシェア。透明な契約で安心。</p>
            </div>
          </div>
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
                    <p class="text-xl font-bold text-akatsuki">{{ solution.result }}</p>
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
          ※ 数値は導入施設へのヒアリング結果に基づく平均値です。効果は会場規模・立地により異なります。
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
          「ただの箱貸し」から、<br>
          収益を生む資産へ。
        </h2>
        <p class="text-ash mb-8">
          まずは収益シミュレーションをご覧ください。<br>
          現在の稼働率と収益から、配信導入後の収益増を試算します。
        </p>
        <NuxtLink 
          to="/#contact?product=haishin-plus"
          class="inline-flex items-center gap-2 px-10 py-5 bg-akatsuki text-white rounded-button font-bold text-lg shadow-cta hover:shadow-cta-hover hover:-translate-y-0.5 transition-all"
        >
          収益シミュレーションを依頼する
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

