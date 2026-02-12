<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- LP専用ヘッダー（ロゴのみ） -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-14 md:h-16">
          <NuxtLink
            to="/aiplus"
            class="hover:opacity-80 transition-opacity"
          >
            <img
              src="/images/aiplus/logo-header.png"
              srcset="/images/aiplus/logo-header.png 1x, /images/aiplus/logo-header-2x.png 2x"
              alt="AIプラス"
              class="h-9 md:h-10 w-auto"
            >
          </NuxtLink>
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/company"
              class="hidden sm:inline-block text-sm text-gray-500 hover:text-aiplus-navy transition-colors"
            >
              会社概要
            </NuxtLink>
            <NuxtLink
              to="/aiplus/shindan"
              class="hidden sm:inline-flex items-center gap-2 px-5 py-2 bg-aiplus-cta text-white text-sm font-bold rounded-full shadow-aiplus-cta hover:bg-aiplus-cta-hover hover:shadow-aiplus-cta-hover transition-all"
            >
              無料診断する
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="flex-1 pt-14 md:pt-16">
      <NuxtPage />
    </main>

    <!-- LP専用フッター -->
    <footer class="bg-aiplus-navy text-white/70 py-8">
      <div class="max-w-5xl mx-auto px-6 text-center">
        <div class="flex items-center justify-center gap-2 mb-1">
          <img
            src="/images/aiplus/logo-icon.png"
            alt=""
            class="h-6 w-auto brightness-0 invert"
          >
          <span class="text-white font-gothic font-bold">AIプラス | 有限会社IYASAKA</span>
        </div>
        <p class="text-sm mb-3">
          中小企業のためのAI導入相談役
        </p>
        <p class="text-xs text-white/50 mb-1">
          〒344-0043 埼玉県春日部市下蛭田422-5
        </p>
        <p class="text-xs text-white/50 mb-4">
          TEL: 048-872-6822
        </p>
        <div class="flex items-center justify-center gap-4 text-xs text-white/40 mb-4">
          <NuxtLink to="/company" class="hover:text-white/60 transition-colors">
            会社概要
          </NuxtLink>
          <span>|</span>
          <NuxtLink to="/legal/privacy" class="hover:text-white/60 transition-colors">
            プライバシーポリシー
          </NuxtLink>
          <span>|</span>
          <NuxtLink to="/legal/terms" class="hover:text-white/60 transition-colors">
            利用規約
          </NuxtLink>
        </div>
        <p class="text-xs text-white/50">
          &copy; 2026 IYASAKA Inc. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// LP専用レイアウト
// - CV最適化: サイトナビゲーションなし
// - ロゴのみのヘッダー + ヘッダーCTAボタン（SP非表示）
// - LP専用フッター（会社情報のみ）
// - ScrollProgress, ChatWidget, FooterCta なし
</script>
