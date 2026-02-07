<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-heading font-bold text-center text-sumi mb-12">
        導入事例
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <article
          v-for="caseItem in cases"
          :key="caseItem.id"
          class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all border border-gray-200"
        >
          <NuxtImg
            :src="caseItem.image"
            :alt="caseItem.title"
            class="w-full h-48 object-cover rounded-t-lg bg-gray-200"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 33vw"
            format="webp"
          />
          <div class="p-6">
            <h3 class="text-lg font-bold text-matsuha mb-2">{{ caseItem.title }}</h3>
            <p class="text-sumi/70 text-sm mb-4">{{ caseItem.description }}</p>
            <NuxtLink
              :to="caseItem.href"
              class="text-ai hover:text-ai/80 font-semibold text-sm transition-colors"
            >
              詳しく見る →
            </NuxtLink>
          </div>
        </article>
      </div>
      <div class="text-center">
        <NuxtLink
          to="/cases"
          class="inline-block bg-matsuha text-white px-8 py-3 rounded-lg font-bold hover:bg-matsuha/90 transition-all"
        >
          すべての事例を見る
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import homeData from '~/app/data/home'

const { cases } = homeData
</script>


