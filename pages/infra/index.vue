<script setup lang="ts">
/**
 * 施設・オフィス向けLP（弱電インフラ）
 * 弱電プラス + AIプラスを中心に訴求
 * 
 * 深層ペイン:
 * - 「繋がらない・鳴らない」時の絶望感
 * - ブラックボックス化する設備費用
 */
import { getProductById } from '~/app/data/products'

const jakudenPlus = getProductById('jakuden-plus')
const aiPlus = getProductById('ai-plus')

// SEO
useSeoMeta({
  title: '施設・オフィスの弱電インフラ支援｜IYASAKA',
  description: 'ネットが繋がらない。カメラが映らない。電話すると高額請求──トラブル時に頼れる「かかりつけ医」を持ちませんか？',
  ogTitle: '施設・オフィス向け弱電インフラ支援｜IYASAKA',
  ogDescription: 'ネットワーク、監視カメラ、音響設備。月額固定で24時間サポート。トラブル対応時間80%削減。',
})

// ペイン項目
const pains = [
  {
    icon: '📶',
    title: 'ネットが繋がらない。仕事が止まる。',
    description: 'ある日突然、Wi-Fiが不安定に。業務は完全ストップ。電話しても「明日対応します」。その間の損失は誰が補填してくれる？'
  },
  {
    icon: '📹',
    title: 'カメラが映らない。何が起きてる？',
    description: '監視カメラの映像が乱れる、録画されていない。いざという時に証拠がない。そんな不安を抱えながら営業している。'
  },
  {
    icon: '💴',
    title: '業者を呼ぶと、毎回高額請求',
    description: '見積もりを見ても、何にいくらかかっているかわからない。「これって本当に必要？」と思っても、専門外だから言えない。'
  },
  {
    icon: '🆘',
    title: 'トラブル時、誰に電話すればいい？',
    description: 'ネットワークはA社、カメラはB社、音響はC社。それぞれに電話して、たらい回し。本業に集中できない。'
  }
]

// ソリューション
const solutions = [
  {
    product: '弱電プラス',
    title: '弱電設備の「かかりつけ医」',
    description: 'ネットワーク、監視カメラ、音響・映像、電話設備。必要な弱電工事・電気工事まで含めて、一括でサポート。月額固定で、予算も読めます。',
    features: [
      '24時間365日の電話サポート',
      'トラブル発生30分以内に一次回答',
      '現地駆けつけ24時間以内',
      '弱電工事・電気工事（改修/増設）※条件付き',
      '月額固定で予算が読める',
      '定期点検で未然にトラブル防止',
      'ベンダー代行で見積もり交渉'
    ],
    result: 'トラブル対応時間80%削減'
  },
  {
    product: 'AIプラス',
    title: '既製品では解決できない課題に',
    description: 'パッケージ製品では対応できない独自の課題。あなたの現場に合わせたオーダーメイドのAIシステムを開発します。',
    features: [
      '現場ヒアリングから要件定義',
      'dev-OS上での高品質開発',
      '止まらない・壊れない品質保証',
      '導入後の保守・進化も対応',
      '既存システムとの連携'
    ],
    result: '既製品では解決できない課題を解決'
  }
]

// 対応範囲
const coverage = [
  { icon: '🌐', title: 'ネットワーク', items: ['有線LAN', 'Wi-Fi', 'ルーター・スイッチ', 'VPN'] },
  { icon: '📹', title: '監視カメラ', items: ['IPカメラ', 'レコーダー', 'クラウド録画', '遠隔監視'] },
  { icon: '🎤', title: '音響・映像', items: ['スピーカー', 'マイク', 'プロジェクター', 'デジタルサイネージ'] },
  { icon: '📞', title: '電話設備', items: 'ビジネスフォン, PBX, クラウドPBX' }
]

// よくある質問
const faqs = [
  {
    q: '対応エリアはどこですか？',
    a: '関東エリア（東京・神奈川・千葉・埼玉）を中心に対応しています。その他のエリアはご相談ください。'
  },
  {
    q: '月額固定で本当にすべて対応できますか？',
    a: 'はい、通常のトラブル対応は月額内で対応します。大規模な機器交換や新規導入は別途お見積りとなりますが、その場合も適正価格で透明な見積もりを提供します。'
  },
  {
    q: '既存の保守契約がありますが、乗り換えできますか？',
    a: 'はい、現在の契約内容を確認の上、スムーズな移行をサポートします。多くの場合、コスト削減も実現できます。'
  },
  {
    q: '小規模なオフィスでも対応可能ですか？',
    a: 'はい、10人規模の小規模オフィスから、100拠点以上の大企業まで対応可能です。規模に応じたプランをご提案します。'
  },
  {
    q: '費用はどのくらいですか？',
    a: '拠点規模により月額1万円〜5万円程度です。複数拠点割引もあります。詳細はヒアリング後にお見積りします。'
  }
]
</script>

<template>
  <div class="min-h-screen bg-washi">
    
    <!-- ===== HERO ===== -->
    <section class="relative py-24 md:py-32 bg-sumi overflow-hidden">
      <div class="absolute inset-0 washi-noise opacity-[0.02]" />
      <div class="absolute top-1/3 left-1/3 w-96 h-96 bg-akatsuki/10 rounded-full blur-3xl" />
      
      <div class="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <span class="inline-block px-4 py-1 bg-akatsuki/20 text-akatsuki rounded-full text-sm font-medium mb-6">
          施設・オフィス向け
        </span>
        
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-mincho text-washi leading-relaxed mb-8">
          ネットが繋がらない。<br>
          電話すると高額請求。<br>
          <span class="text-akatsuki">──「かかりつけ医」を持ちませんか？</span>
        </h1>
        
        <p class="text-lg text-washi/70 mb-10 max-w-2xl mx-auto">
          ネットワーク、監視カメラ、音響設備。<br>
          トラブル時に頼れる先がない。呼ぶと高い。<br>
          月額固定で、すべて任せられる安心を。
        </p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="#contact"
            class="inline-flex items-center gap-3 px-10 py-5 bg-akatsuki text-white rounded-button font-bold text-lg shadow-cta hover:shadow-cta-hover hover:-translate-y-1 transition-all"
          >
            無料診断を受ける
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <NuxtLink 
            to="/cases"
            class="inline-flex items-center gap-2 px-8 py-4 border-2 border-washi/30 text-washi rounded-button font-medium hover:bg-washi/10 transition-all"
          >
            導入事例を見る
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

    <!-- ===== 対応範囲 ===== -->
    <section class="py-section bg-washi">
      <div class="max-w-5xl mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-gothic font-bold text-deep-sumi mb-4">
            すべて、一括でサポート
          </h2>
          <p class="text-ash">
            複数の業者に電話する必要はありません
          </p>
        </div>
        
        <div class="grid md:grid-cols-4 gap-6">
          <div 
            v-for="item in coverage" 
            :key="item.title"
            class="bg-white p-6 rounded-card text-center"
          >
            <span class="text-4xl mb-4 block">{{ item.icon }}</span>
            <h3 class="font-bold text-sumi mb-3">{{ item.title }}</h3>
            <ul class="text-sm text-ash space-y-1">
              <template v-if="Array.isArray(item.items)">
                <li v-for="i in item.items" :key="i">{{ i }}</li>
              </template>
              <template v-else>
                <li v-for="i in item.items.split(', ')" :key="i">{{ i }}</li>
              </template>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== ソリューション ===== -->
    <section class="py-section bg-white">
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
            class="bg-washi rounded-card shadow-card overflow-hidden"
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

    <!-- ===== 比較表 ===== -->
    <section class="py-section bg-sumi">
      <div class="max-w-4xl mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-gothic font-bold text-washi mb-4">
            従来の方法との比較
          </h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full bg-white rounded-lg overflow-hidden text-sm">
            <thead>
              <tr class="bg-washi">
                <th class="p-4 text-left text-sumi font-medium"></th>
                <th class="p-4 text-center text-ash">従来（都度発注）</th>
                <th class="p-4 text-center text-akatsuki font-bold">弱電プラス</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-t border-gray-100">
                <td class="p-4 text-sumi font-medium">費用体系</td>
                <td class="p-4 text-center text-ash">都度見積もり（不透明）</td>
                <td class="p-4 text-center text-sumi font-medium">月額固定（予算が読める）</td>
              </tr>
              <tr class="border-t border-gray-100">
                <td class="p-4 text-sumi font-medium">対応速度</td>
                <td class="p-4 text-center text-ash">翌日〜数日</td>
                <td class="p-4 text-center text-sumi font-medium">30分以内に一次回答</td>
              </tr>
              <tr class="border-t border-gray-100">
                <td class="p-4 text-sumi font-medium">対応範囲</td>
                <td class="p-4 text-center text-ash">業者ごとにバラバラ</td>
                <td class="p-4 text-center text-sumi font-medium">弱電設備すべて一括</td>
              </tr>
              <tr class="border-t border-gray-100">
                <td class="p-4 text-sumi font-medium">予防保守</td>
                <td class="p-4 text-center text-ash">なし（壊れてから対応）</td>
                <td class="p-4 text-center text-sumi font-medium">定期点検で未然防止</td>
              </tr>
              <tr class="border-t border-gray-100">
                <td class="p-4 text-sumi font-medium">サポート時間</td>
                <td class="p-4 text-center text-ash">平日9-18時</td>
                <td class="p-4 text-center text-sumi font-medium">24時間365日</td>
              </tr>
            </tbody>
          </table>
        </div>
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
          トラブル時に頼れる<br>
          「かかりつけ医」を持ちませんか？
        </h2>
        <p class="text-ash mb-8">
          まずは現状の設備環境を無料で診断します。<br>
          最適な保守プランと、コスト削減の可能性をご提案します。
        </p>
        <NuxtLink 
          to="/#contact?product=jakuden-plus"
          class="inline-flex items-center gap-2 px-10 py-5 bg-akatsuki text-white rounded-button font-bold text-lg shadow-cta hover:shadow-cta-hover hover:-translate-y-0.5 transition-all"
        >
          無料診断を依頼する
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
