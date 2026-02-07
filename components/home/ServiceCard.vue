<template>
  <NuxtLink
    :to="href"
    class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border border-matsuha/10 hover:border-matsuha/30 block"
  >
    <div class="text-4xl mb-3">{{ icon }}</div>
    <h3 class="text-xl font-bold text-matsuha mb-2">{{ title }}</h3>
    <p class="text-sumi/70 text-sm">{{ description }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  href: string
  icon?: string
}>()
</script>


