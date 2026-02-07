<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-matsuha/20 shadow-sm">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16 md:h-20">
        <!-- ロゴ -->
        <NuxtLink 
          to="/" 
          class="flex flex-col hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-matsuha focus:ring-offset-2 rounded"
        >
          <span class="text-lg md:text-xl font-heading font-bold text-matsuha">
            {{ site.brand.name }}
          </span>
          <span class="text-xs md:text-sm text-sumi/70">
            {{ site.brand.tagline }}
          </span>
        </NuxtLink>

        <!-- PCナビゲーション -->
        <nav aria-label="メインナビゲーション" class="hidden lg:flex items-center gap-6">
          <HeaderNav :items="headerNav" />
          
          <!-- CTA buttons -->
          <div class="flex items-center gap-3 ml-4">
            <NuxtLink 
              :to="site.cta.contact"
              class="btn-primary text-sm px-6 py-2 inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-matsuha focus:ring-offset-2"
            >
              <span>📞</span>
              <span>お問い合わせ</span>
            </NuxtLink>
            <NuxtLink 
              :to="site.cta.download"
              class="btn-secondary text-sm px-6 py-2 inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-matsuha focus:ring-offset-2"
            >
              <span>📄</span>
              <span>資料DL</span>
            </NuxtLink>
          </div>
        </nav>

        <!-- モバイルハンバーガー -->
        <button
          type="button"
          class="lg:hidden p-2 rounded-lg hover:bg-matsuha/10 transition-colors focus:outline-none focus:ring-2 focus:ring-matsuha"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-menu"
          aria-label="メニューを開く"
          @click="toggleMobileMenu"
        >
          <svg class="w-6 h-6 text-matsuha" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              v-if="!isMobileMenuOpen"
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path 
              v-else
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- モバイルメニュー -->
    <HeaderMobile 
      v-model="isMobileMenuOpen" 
      :items="headerNav" 
    />
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { site } from '~/app/site'
import { headerNav } from '~/app/navigation'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>
