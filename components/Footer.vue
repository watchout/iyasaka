<template>
  <footer class="bg-gray-900 text-white">
    <div class="container mx-auto px-4 py-12 md:py-16">
      <!-- メイングリッド -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
        <!-- 1. 企業情報（NAP） -->
        <div class="lg:col-span-2">
          <div class="mb-6">
            <h3 class="text-2xl font-bold text-amber-400 mb-1">{{ site.brand.name }}</h3>
            <p class="text-sm text-white/70">{{ site.brand.tagline }}</p>
          </div>
          <div class="space-y-3 text-sm text-white/80">
            <p class="flex items-start gap-2">
              <span class="text-amber-400">📍</span>
              <span>{{ site.nap.address }}</span>
            </p>
            <p class="flex items-center gap-2">
              <span class="text-amber-400">📞</span>
              <a :href="`tel:${site.nap.phone.replace(/-/g, '')}`" class="hover:text-amber-400 transition-colors">
                {{ site.nap.phone }}
              </a>
            </p>
            <p class="flex items-center gap-2">
              <span class="text-amber-400">🕒</span>
              <span>{{ site.nap.businessHours }}</span>
            </p>
            <p class="flex items-center gap-2">
              <span class="text-amber-400">🗺️</span>
              <span>{{ site.nap.serviceArea }}</span>
            </p>
          </div>
        </div>

        <!-- 2. 整える -->
        <div>
          <h3 class="text-sm font-bold mb-4 text-blue-400 flex items-center gap-2">
            🔧 整える
          </h3>
          <ul class="space-y-2 text-sm">
            <li v-for="link in footerSections.organize" :key="link.label">
              <NuxtLink
                :to="link.to || '#'"
                class="text-white/70 hover:text-amber-400 transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- 3. つなぐ + 育てる -->
        <div>
          <h3 class="text-sm font-bold mb-4 text-teal-400 flex items-center gap-2">
            🔗 つなぐ
          </h3>
          <ul class="space-y-2 text-sm mb-6">
            <li v-for="link in footerSections.connect" :key="link.label">
              <NuxtLink
                :to="link.to || '#'"
                class="text-white/70 hover:text-amber-400 transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
          
          <h3 class="text-sm font-bold mb-4 text-green-400 flex items-center gap-2">
            🌱 育てる
          </h3>
          <ul class="space-y-2 text-sm">
            <li v-for="link in footerSections.nurture" :key="link.label">
              <NuxtLink
                :to="link.to || '#'"
                class="text-white/70 hover:text-amber-400 transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- 4. 会社案内 + リソース -->
        <div>
          <h3 class="text-sm font-bold mb-4 text-white/90">会社案内</h3>
          <ul class="space-y-2 text-sm mb-6">
            <li v-for="link in footerSections.company" :key="link.label">
              <NuxtLink
                :to="link.to || '#'"
                class="text-white/70 hover:text-amber-400 transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
          
          <h3 class="text-sm font-bold mb-4 text-white/90">リソース</h3>
          <ul class="space-y-2 text-sm">
            <li v-for="link in footerSections.resources" :key="link.label">
              <NuxtLink
                :to="link.to || '#'"
                class="text-white/70 hover:text-amber-400 transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- ミッション -->
      <div class="mt-12 pt-8 border-t border-white/10 text-center">
        <p class="text-lg font-medium text-white/80">
          {{ site.brand.mission }}
        </p>
      </div>

      <!-- 法務リンク + コピーライト -->
      <div class="mt-8 pt-8 border-t border-white/10">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <!-- 法務リンク -->
          <nav aria-label="法務リンク" class="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            <NuxtLink
              v-for="link in legalLinks"
              :key="link.label"
              :to="link.to || '#'"
              class="text-white/50 hover:text-amber-400 transition-colors"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>

          <!-- コピーライト -->
          <p class="text-xs text-white/50">
            © {{ site.footerCopyrightYear }} 有限会社IYASAKA
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { site } from '~/app/site'
import { footerSections, legalLinks } from '~/app/navigation'
</script>
