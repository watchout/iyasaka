<template>
  <div class="min-h-screen flex flex-col">
    <!-- スクロールプログレス -->
    <ScrollProgress />
    
    <Header />
    
    <main class="pt-16 md:pt-20 flex-1">
      <NuxtPage />
    </main>
    
    <Footer />
    <FooterCta />
    <ChatWidget />
  </div>
</template>

<script setup lang="ts">
import ChatWidget from '@/components/ChatWidget.vue'
import ScrollProgress from '@/components/ui/ScrollProgress.vue'

// デフォルトレイアウト - 全ページ共通の基本構造
// - スクロールプログレスバー（Apple風）
// - ヘッダー固定のため main に pt-16/md:pt-20 で余白確保
// - FooterCtaはFeatureFlagで制御（コンポーネント内で判定）

// スムーススクロール初期化
useSmoothScroll()
</script>
