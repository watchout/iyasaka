<script setup lang="ts">
/**
 * AIPlus LP -- /aiplus/:variant
 * A/Bテストバリアント用（/aiplus/b, /aiplus/c 等）
 */

import { seo } from '~/app/data/aiplus-lp'

definePageMeta({
  layout: 'lp',
})

// LP専用タイトル（サイト全体の titleTemplate を上書き）
useHead({
  titleTemplate: '%s',
})

useSeoMeta({
  title: seo.title,
  description: seo.description,
  ogTitle: seo.ogTitle,
  ogDescription: seo.ogDescription,
})

const route = useRoute()
const variantParam = String(route.params.variant ?? '')

const { variant, trackConversion } = useABTest('aiplus_hero', variantParam)
</script>

<template>
  <AiplusLpBody :variant="variant" :track-conversion="trackConversion" />
</template>
