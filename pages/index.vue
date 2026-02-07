<script setup lang="ts">
import { getFeaturedProducts } from '@/app/data/products'

const products = getFeaturedProducts()

// SEO
useSeoMeta({
  title: 'IYASAKA | 不を解消し、事業を"弥栄"へ。',
  description: '弱電・電気工事を土台に、ホテルAI、動画配信、現場DX（ミエルボード/ストック/ドライブ）、カスタムAI、dev-OSで現場の「あらゆる不」を技術で解消します。',
  ogTitle: 'IYASAKA | 不を解消し、事業を"弥栄"へ。',
  ogDescription: '弱電・電気工事を土台に、ホテルAI、動画配信、現場DX、カスタムAI、dev-OSで現場の「あらゆる不」を技術で解消します。',
  ogType: 'website'
})

// 業種別LP
const industries = [
  { label: 'ホテル・宿泊業', to: '/hotel', icon: '🏨', desc: '人手不足とおもてなしの両立' },
  { label: 'インフラ・設備', to: '/infra', icon: '⚡', desc: '止まらないインフラ運用' },
  { label: '会議室・ホール', to: '/venue', icon: '🎤', desc: '配信で収益多角化' },
  { label: '建設・製造・現場', to: '/genba', icon: '🔧', desc: '現場の見える化' }
]

// 実績数値
const stats = [
  { value: '1,500+', label: '導入実績' },
  { value: '98%', label: '継続率' },
  { value: '60分', label: '平均業務削減/日' }
]
</script>

<template>
  <div class="min-h-screen">
    <!-- Section 1: ファーストビュー -->
    <section class="relative bg-gradient-to-br from-washi via-washi to-ash/30 py-20 lg:py-32">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl">
          <!-- キャッチコピー -->
          <h1 class="font-mincho text-4xl md:text-5xl lg:text-6xl text-sumi leading-tight mb-6">
            不を解消し、<br>
            事業を<span class="text-akatsuki">"弥栄"</span>へ。
          </h1>
          <p class="text-lg md:text-xl text-sumi/80 mb-8 max-w-2xl">
            弱電・電気工事から、ホテルAI、動画配信、現場DX、カスタムAI、dev-OSまで。<br>
            現場の「あらゆる不」を技術で解消し、"止まる前"に手を打つ。IYASAKA。
          </p>
          
          <!-- CTA -->
          <div class="flex flex-wrap gap-4">
            <NuxtLink 
              to="/diagnosis" 
              class="inline-flex items-center gap-2 px-8 py-4 bg-akatsuki text-white rounded-button font-bold hover:bg-akatsuki/90 transition-colors"
            >
              5分で最適解を診断
              <span class="text-xl">→</span>
            </NuxtLink>
            <a 
              href="#contact" 
              class="inline-flex items-center gap-2 px-8 py-4 border-2 border-sumi text-sumi rounded-button font-medium hover:bg-sumi/5 transition-colors"
            >
              すぐに相談する
            </a>
          </div>
        </div>
      </div>
      
      <!-- 背景装飾 -->
      <div class="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
        <div class="w-full h-full bg-gradient-to-l from-akatsuki to-transparent"></div>
      </div>
    </section>

    <!-- Section 2: 2026年問題への警鐘 -->
    <section class="py-16 lg:py-24 bg-sumi text-washi">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <p class="text-akatsuki font-bold mb-4">⚠️ 2026年問題</p>
          <h2 class="font-mincho text-3xl md:text-4xl mb-6">
            あなたの会社は、<br class="md:hidden">「止まる」準備ができていますか？
          </h2>
          <p class="text-washi/80 mb-8">
            人手不足、システム老朽化、デジタル対応の遅れ——<br>
            2026年、これらの課題が一斉に顕在化します。
          </p>
          
          <!-- 統計 -->
          <div class="grid md:grid-cols-3 gap-8 mt-12">
            <div class="p-6 bg-washi/10 rounded-lg">
              <p class="text-4xl font-bold text-akatsuki mb-2">70%</p>
              <p class="text-sm">中小企業がDX未着手<br><span class="text-washi/60">（中小企業白書2024）</span></p>
            </div>
            <div class="p-6 bg-washi/10 rounded-lg">
              <p class="text-4xl font-bold text-akatsuki mb-2">2025年</p>
              <p class="text-sm">SAP保守終了の崖<br><span class="text-washi/60">（経済産業省DXレポート）</span></p>
            </div>
            <div class="p-6 bg-washi/10 rounded-lg">
              <p class="text-4xl font-bold text-akatsuki mb-2">130万人</p>
              <p class="text-sm">2030年IT人材不足予測<br><span class="text-washi/60">（経済産業省調査）</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3: IYASAKAの価値提案 -->
    <section class="py-16 lg:py-24 bg-washi">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="font-mincho text-3xl md:text-4xl text-sumi mb-4">
            IYASAKAが選ばれる理由
          </h2>
          <p class="text-sumi/70">
            「止まってから慌てる」から「止まる前に手を打つ」へ。
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div class="p-8 bg-white rounded-lg shadow-soft">
            <div class="text-4xl mb-4">🔮</div>
            <h3 class="font-bold text-xl text-sumi mb-3">予防保全</h3>
            <p class="text-sumi/70 text-sm">
              AIが異常を予測し、トラブルが起きる前に対処。「止まってから」ではなく「止まる前に」。
            </p>
          </div>
          <div class="p-8 bg-white rounded-lg shadow-soft">
            <div class="text-4xl mb-4">🔗</div>
            <h3 class="font-bold text-xl text-sumi mb-3">横断統合</h3>
            <p class="text-sumi/70 text-sm">
              弱電・電気工事から、ホテルAI・配信・現場DX・カスタムAIまで一社で対応。複数ベンダーの調整コストを削減。
            </p>
          </div>
          <div class="p-8 bg-white rounded-lg shadow-soft">
            <div class="text-4xl mb-4">🤝</div>
            <h3 class="font-bold text-xl text-sumi mb-3">伴走支援</h3>
            <p class="text-sumi/70 text-sm">
              導入して終わりではなく、定着するまで伴走。使われないシステムにしない。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 4: 業種で選ぶ -->
    <section class="py-16 lg:py-24 bg-ash/30">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="font-mincho text-3xl md:text-4xl text-sumi mb-4">
            業種で選ぶ
          </h2>
          <p class="text-sumi/70">
            あなたの業界に特化した解決策をご用意しています。
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <NuxtLink 
            v-for="industry in industries" 
            :key="industry.to"
            :to="industry.to"
            class="p-6 bg-white rounded-lg shadow-soft hover:shadow-md transition-shadow group"
          >
            <div class="text-4xl mb-4">{{ industry.icon }}</div>
            <h3 class="font-bold text-lg text-sumi mb-2 group-hover:text-akatsuki transition-colors">
              {{ industry.label }}
            </h3>
            <p class="text-sumi/60 text-sm">{{ industry.desc }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section 5: 主要ソリューション -->
    <section class="py-16 lg:py-24 bg-washi">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="font-mincho text-3xl md:text-4xl text-sumi mb-4">
            主要ソリューション
          </h2>
          <p class="text-sumi/70">
            課題に合わせて選べる、IYASAKAの製品ラインナップ。
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <NuxtLink 
            v-for="product in products" 
            :key="product.id"
            :to="`/products/${product.slug}`"
            class="p-6 bg-white rounded-lg shadow-soft hover:shadow-md transition-all group border-l-4 border-transparent hover:border-akatsuki"
          >
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="font-bold text-lg text-sumi group-hover:text-akatsuki transition-colors">
                  {{ product.name }}
                </h3>
                <p class="text-sm text-sumi/60">{{ product.subtitle }}</p>
              </div>
              <span class="text-akatsuki opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
            <p class="text-sumi/70 text-sm mb-4">{{ product.strongestPain }}</p>
            <div class="flex items-center gap-2 text-sm">
              <span class="px-2 py-1 bg-akatsuki/10 text-akatsuki rounded text-xs font-medium">
                {{ product.keyResult }}
              </span>
            </div>
          </NuxtLink>
        </div>
        
        <div class="text-center mt-8">
          <NuxtLink 
            to="/diagnosis" 
            class="inline-flex items-center gap-2 text-akatsuki hover:underline"
          >
            どれを選べばいいか分からない方は診断へ →
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section 6: 実績・信頼 -->
    <section class="py-16 lg:py-24 bg-sumi text-washi">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="font-mincho text-3xl md:text-4xl mb-4">
            選ばれる実績
          </h2>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <p class="text-5xl font-bold text-akatsuki mb-2">{{ stat.value }}</p>
            <p class="text-washi/70">{{ stat.label }}</p>
          </div>
        </div>
        
        <div class="text-center mt-12">
          <NuxtLink 
            to="/cases" 
            class="inline-flex items-center gap-2 px-6 py-3 border border-washi/50 text-washi rounded-button hover:bg-washi/10 transition-colors"
          >
            導入事例を見る →
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section 7: 診断CTA -->
    <section class="py-16 lg:py-24 bg-gradient-to-r from-akatsuki to-akatsuki/80 text-white">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="font-mincho text-3xl md:text-4xl mb-6">
            5分で最適解を診断
          </h2>
          <p class="text-white/80 mb-8">
            5つの質問に答えるだけで、あなたの課題に最適なソリューションをご提案します。
          </p>
          <NuxtLink 
            to="/diagnosis" 
            class="inline-flex items-center gap-2 px-8 py-4 bg-white text-akatsuki rounded-button font-bold hover:bg-white/90 transition-colors"
          >
            無料診断を始める
            <span class="text-xl">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section 8: お問い合わせ -->
    <section id="contact" class="py-16 lg:py-24 bg-washi">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="font-mincho text-3xl md:text-4xl text-sumi mb-4">
              お問い合わせ
            </h2>
            <p class="text-sumi/70">
              ご質問・ご相談はこちらから。2営業日以内にご連絡いたします。
            </p>
          </div>
          
          <div class="bg-white p-8 rounded-lg shadow-soft">
            <LeadForm 
              primary-product-slug="general"
              source="homepage_contact"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
