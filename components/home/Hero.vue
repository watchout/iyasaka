<template>
  <section class="bg-gradient-to-br from-matsuha/10 via-kinari to-ai/10 py-20 md:py-32">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-heading font-bold text-sumi mb-6 leading-tight">
          {{ hero.title }}
        </h1>
        <p class="text-xl md:text-2xl text-sumi/80 mb-8 leading-relaxed">
          {{ hero.subtitle }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            :to="hero.ctaPrimary.href"
            class="btn-primary px-8 py-4 rounded-lg font-bold text-lg transition-all hover:shadow-xl"
          >
            {{ hero.ctaPrimary.label }}
          </NuxtLink>
          <NuxtLink
            v-if="hero.ctaSecondary"
            :to="hero.ctaSecondary.href"
            class="btn-secondary px-8 py-4 rounded-lg font-bold text-lg transition-all hover:shadow-xl"
          >
            {{ hero.ctaSecondary.label }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import homeData from '~/app/data/home'

const { hero } = homeData
</script>

<style scoped>
.btn-primary {
  @apply bg-shu text-white hover:bg-shu/90;
}

.btn-secondary {
  @apply bg-ai text-white hover:bg-ai/90;
}
</style>



