<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="sr-only">実績紹介</h2>
      <dl class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="text-center"
        >
          <dt class="text-sm text-sumi/60 mb-2">{{ stat.label }}</dt>
          <dd class="text-4xl md:text-5xl font-bold text-matsuha">
            {{ stat.value }}<span v-if="stat.unit" class="text-2xl ml-1">{{ stat.unit }}</span>
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<script setup lang="ts">
import homeData from '~/app/data/home'

const { stats } = homeData
</script>



