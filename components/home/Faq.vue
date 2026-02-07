<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4 max-w-3xl">
      <h2 class="text-3xl md:text-4xl font-heading font-bold text-center text-sumi mb-12">
        よくある質問
      </h2>
      <UAccordion
        :items="faqItems"
        :ui="{
          wrapper: 'space-y-4',
          item: {
            base: 'bg-white rounded-lg border border-gray-200'
          }
        }"
      >
        <template #default="{ item, open }">
          <UButton
            color="gray"
            variant="ghost"
            class="w-full text-left"
            :ui="{ padding: { sm: 'p-4' } }"
          >
            <span class="font-semibold text-matsuha">{{ item.label }}</span>
            <template #trailing>
              <UIcon
                name="i-heroicons-chevron-down-20-solid"
                class="w-5 h-5 transition-transform duration-200"
                :class="[open && 'transform rotate-180']"
              />
            </template>
          </UButton>
        </template>
        <template #item="{ item }">
          <div class="px-4 pb-4 pt-2">
            <p class="text-sumi/80">{{ item.content }}</p>
          </div>
        </template>
      </UAccordion>
    </div>
  </section>
</template>

<script setup lang="ts">
import homeData from '~/app/data/home'

const { faq } = homeData

const faqItems = faq.map(item => ({
  label: item.q,
  content: item.a,
  defaultOpen: false
}))
</script>


