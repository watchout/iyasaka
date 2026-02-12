<script setup lang="ts">
/**
 * AIPlus LP本体 -- /aiplus
 * デフォルト（バリアントA）
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

const { variant, trackConversion } = useABTest('aiplus_hero', '')

// v2: analytics tracking
const { initTracking } = useTracking()
const { trackLPView } = useAnalytics()

onMounted(() => {
  initTracking()
  trackLPView()
})
</script>

<template>
  <AiplusLpBody :variant="variant" :track-conversion="trackConversion" />
</template>
