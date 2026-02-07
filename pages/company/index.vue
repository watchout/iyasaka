<script setup lang="ts">
/**
 * IYASAKA 会社概要ページ
 * SS評価達成のための信頼構築ページ
 * AIEO対応: LocalBusiness + BreadcrumbList スキーマ出力
 */
import { companyInfo, representative, milestones, values, teamStats } from '~/app/data/team'
import { localBusinessLd, breadcrumbLd } from '~/app/utils/ld'

// SEO
useSeoMeta({
  title: '会社概要｜IYASAKA - 現場の「不」を「光」に変える',
  description: '有限会社IYASAKAは2006年創業。中小企業の「見えない」「止まる」「人がいない」という現場の不安を解決し、本業に集中できる環境を創り出します。',
  ogTitle: '会社概要｜IYASAKA',
  ogDescription: '2006年創業。1,500件以上のプロジェクト実績。現場の「不」を「光」に変える、中小企業DX支援のパートナー。',
})

// LocalBusiness JSON-LD
const businessLd = localBusinessLd()

// パンくずリスト JSON-LD
const breadcrumb = breadcrumbLd([
  { name: 'ホーム', path: '/' },
  { name: '会社概要', path: '/company' }
])

// 構造化データ
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(businessLd)
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(breadcrumb)
    }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-washi">
    
    <!-- ===== HERO ===== -->
    <section class="relative py-20 bg-sumi overflow-hidden">
      <div class="absolute inset-0 washi-noise opacity-[0.03]" />
      <div class="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <h1 class="text-4xl md:text-5xl font-gothic font-bold text-washi mb-6">
          会社概要
        </h1>
        <p class="text-xl text-washi/70 font-mincho">
          現場の「不」を「光」に変える。<br>
          その循環こそが、弥栄（いやさか）。
        </p>
      </div>
    </section>

    <!-- ===== 代表メッセージ ===== -->
    <section class="py-section bg-white">
      <div class="max-w-5xl mx-auto px-6">
        <div class="grid md:grid-cols-5 gap-12 items-start">
          <!-- 写真 -->
          <div class="md:col-span-2">
            <div class="aspect-[3/4] bg-gray-100 rounded-card overflow-hidden">
              <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-sumi/5 to-sumi/10">
                <div class="text-center">
                  <div class="text-6xl mb-4">👤</div>
                  <p class="text-sm text-ash">代表者写真</p>
                </div>
              </div>
            </div>
            <div class="mt-4 text-center">
              <p class="text-sm text-ash">{{ representative.title }}</p>
              <p class="text-xl font-bold text-sumi">{{ representative.name }}</p>
            </div>
          </div>
          
          <!-- メッセージ -->
          <div class="md:col-span-3">
            <span class="inline-block px-4 py-1 bg-akatsuki/10 text-akatsuki rounded-full text-sm font-medium mb-6">
              代表メッセージ
            </span>
            
            <h2 class="text-2xl md:text-3xl font-gothic font-bold text-deep-sumi mb-6 leading-relaxed">
              誰にも相談できない。<br>
              誰も代わってくれない。<br>
              その孤独を、私たちが引き受けます。
            </h2>
            
            <div class="prose prose-lg text-sumi/80 leading-relaxed space-y-4">
              <p>
                中小企業の経営者・現場責任者の皆様は、日々「孤独」と戦っています。
              </p>
              <p>
                設備が止まったとき、誰に相談すればいいかわからない。<br>
                現場の状況が見えないまま、経営判断を迫られる。<br>
                ベテランが辞めたら、ノウハウが全て消えてしまう。
              </p>
              <p>
                そんな「不」を「光」に変えることが、私たちの使命です。
              </p>
              <p>
                2006年の創業以来、1,500件以上のプロジェクトを通じて、<br>
                現場の皆様と一緒に課題を解決してきました。
              </p>
              <p class="font-bold text-sumi">
                高額なシステムを売るのではなく、<br>
                「使える」「続けられる」ソリューションを。<br>
                そして、成果が出るまで伴走する。
              </p>
              <p>
                それがIYASAKAの約束です。
              </p>
            </div>
            
            <!-- 引用 -->
            <blockquote class="mt-8 pl-6 border-l-4 border-akatsuki">
              <p class="text-xl font-mincho text-sumi italic">
                「{{ representative.message }}」
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 数字で見るIYASAKA ===== -->
    <section class="py-section bg-washi">
      <div class="max-w-5xl mx-auto px-6">
        <h2 class="text-2xl md:text-3xl font-gothic font-bold text-deep-sumi text-center mb-12">
          数字で見るIYASAKA
        </h2>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-card p-6 text-center shadow-card">
            <p class="text-4xl md:text-5xl font-bold text-akatsuki mb-2">{{ teamStats.yearsOfExperience }}</p>
            <p class="text-sm text-ash">年の実績</p>
          </div>
          <div class="bg-white rounded-card p-6 text-center shadow-card">
            <p class="text-4xl md:text-5xl font-bold text-akatsuki mb-2">{{ teamStats.totalProjects }}</p>
            <p class="text-sm text-ash">プロジェクト</p>
          </div>
          <div class="bg-white rounded-card p-6 text-center shadow-card">
            <p class="text-4xl md:text-5xl font-bold text-akatsuki mb-2">{{ teamStats.satisfactionRate }}</p>
            <p class="text-sm text-ash">顧客満足度</p>
          </div>
          <div class="bg-white rounded-card p-6 text-center shadow-card">
            <p class="text-4xl md:text-5xl font-bold text-akatsuki mb-2">{{ teamStats.successRate }}</p>
            <p class="text-sm text-ash">継続率</p>
          </div>
        </div>
        
        <p class="text-center text-xs text-ash mt-6">
          ※ 数値は2024年12月時点。顧客満足度は導入企業アンケートに基づく。
        </p>
      </div>
    </section>

    <!-- ===== 私たちの価値観 ===== -->
    <section class="py-section bg-white">
      <div class="max-w-5xl mx-auto px-6">
        <h2 class="text-2xl md:text-3xl font-gothic font-bold text-deep-sumi text-center mb-4">
          私たちの価値観
        </h2>
        <p class="text-center text-ash mb-12">
          なぜIYASAKAは、中小企業から選ばれるのか
        </p>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div 
            v-for="value in values" 
            :key="value.title"
            class="p-6 rounded-card bg-washi border border-gray-100"
          >
            <div class="flex items-start gap-4">
              <span class="text-3xl">{{ value.icon }}</span>
              <div>
                <h3 class="text-lg font-bold text-sumi mb-2">{{ value.title }}</h3>
                <p class="text-ash">{{ value.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 沿革 ===== -->
    <section class="py-section bg-sumi">
      <div class="max-w-4xl mx-auto px-6">
        <h2 class="text-2xl md:text-3xl font-gothic font-bold text-washi text-center mb-12">
          沿革
        </h2>
        
        <div class="relative">
          <!-- タイムライン線 -->
          <div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-washi/20 md:-translate-x-px" />
          
          <!-- マイルストーン -->
          <div class="space-y-8">
            <div 
              v-for="(milestone, index) in milestones" 
              :key="milestone.year + milestone.title"
              class="relative pl-12 md:pl-0"
              :class="index % 2 === 0 ? 'md:pr-[52%]' : 'md:pl-[52%]'"
            >
              <!-- ドット -->
              <div 
                class="absolute left-2 md:left-1/2 top-1 w-4 h-4 rounded-full bg-akatsuki md:-translate-x-1/2"
              />
              
              <!-- カード -->
              <div class="bg-washi/5 border border-washi/10 rounded-lg p-4">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xl">{{ milestone.icon }}</span>
                  <span class="text-sm text-akatsuki font-medium">
                    {{ milestone.year }}{{ milestone.month ? ` ${milestone.month}` : '' }}
                  </span>
                </div>
                <h3 class="font-bold text-washi mb-1">{{ milestone.title }}</h3>
                <p class="text-sm text-washi/60">{{ milestone.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 会社概要テーブル ===== -->
    <section class="py-section bg-white">
      <div class="max-w-3xl mx-auto px-6">
        <h2 class="text-2xl md:text-3xl font-gothic font-bold text-deep-sumi text-center mb-12">
          会社情報
        </h2>
        
        <div class="bg-washi rounded-card overflow-hidden">
          <table class="w-full">
            <tbody class="divide-y divide-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-medium text-ash bg-gray-50 w-1/3">社名</th>
                <td class="px-6 py-4 text-sumi">{{ companyInfo.name }}</td>
              </tr>
              <tr>
                <th class="px-6 py-4 text-left text-sm font-medium text-ash bg-gray-50">代表者</th>
                <td class="px-6 py-4 text-sumi">{{ companyInfo.representative }}</td>
              </tr>
              <tr>
                <th class="px-6 py-4 text-left text-sm font-medium text-ash bg-gray-50">設立</th>
                <td class="px-6 py-4 text-sumi">{{ companyInfo.established }}</td>
              </tr>
              <tr>
                <th class="px-6 py-4 text-left text-sm font-medium text-ash bg-gray-50">所在地</th>
                <td class="px-6 py-4 text-sumi">
                  {{ companyInfo.postalCode }}<br>
                  {{ companyInfo.address }}
                </td>
              </tr>
              <tr>
                <th class="px-6 py-4 text-left text-sm font-medium text-ash bg-gray-50">電話番号</th>
                <td class="px-6 py-4 text-sumi">{{ companyInfo.phone }}</td>
              </tr>
              <tr>
                <th class="px-6 py-4 text-left text-sm font-medium text-ash bg-gray-50">事業内容</th>
                <td class="px-6 py-4 text-sumi">
                  <ul class="list-disc list-inside space-y-1">
                    <li v-for="biz in companyInfo.business" :key="biz">{{ biz }}</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ===== CTA ===== -->
    <section class="py-section bg-gradient-to-b from-washi to-white">
      <div class="max-w-3xl mx-auto px-6 text-center">
        <h2 class="text-2xl md:text-3xl font-gothic font-bold text-deep-sumi mb-6">
          あなたの現場の「不」を、<br class="sm:hidden">
          一緒に解決しませんか？
        </h2>
        <p class="text-ash mb-8">
          まずは現状のお悩みをお聞かせください。<br>
          最適なソリューションをご提案します。
        </p>
        <NuxtLink 
          to="/#contact"
          class="inline-flex items-center gap-2 px-10 py-5 bg-akatsuki text-white rounded-button font-bold text-lg shadow-cta hover:shadow-cta-hover hover:-translate-y-0.5 transition-all"
        >
          無料で相談する
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
    </section>

  </div>
</template>

<style scoped>
.washi-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}
</style>
