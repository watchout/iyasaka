<template>
  <div class="min-h-screen flex flex-col bg-kinari">
    <!-- 簡易ヘッダー（ロゴのみ） -->
    <header class="border-b border-matsuha/20 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-center h-16 md:h-20">
          <NuxtLink to="/" class="text-xl md:text-2xl font-heading font-bold text-matsuha hover:opacity-80 transition-opacity">
            IYASAKA
          </NuxtLink>
        </div>
      </div>
    </header>
    
    <main class="flex-1 py-8 md:py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <NuxtPage />
      </div>
    </main>
    
    <Footer />
    <!-- FooterCtaは非表示 -->
  </div>
</template>

<script setup lang="ts">
// ミニマルレイアウト - 法務ページ/LP向け
// - ヘッダーはロゴのみのシンプル版
// - FooterCtaは表示しない
// - main の余白と最大幅で読みやすさ重視
</script>
