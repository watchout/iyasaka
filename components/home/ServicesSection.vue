<template>
  <section class="py-16 bg-kinari">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-heading font-bold text-center text-sumi mb-12">
        サービス
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <HomeServiceCard
          v-for="service in services"
          :key="service.id"
          :title="service.title"
          :description="service.description"
          :href="service.href"
          :icon="service.icon"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import homeData from '~/app/data/home'

const { services } = homeData
</script>


