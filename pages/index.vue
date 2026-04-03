<script setup lang="ts">
const config = useRuntimeConfig()
const hpVersion = config.public.hpVersion || 'v1'

// SEO（バージョン別）
if (hpVersion === 'v2') {
  useSeoMeta({
    title: 'IYASAKA | 現場の不をAIと技術で解消する',
    description: 'ホテルAI、弱電DX、配信、現場可視化、カスタムAI。各業界に特化したAIソリューションで、現場の「不」を「光」へ。',
    ogTitle: 'IYASAKA | 現場の不をAIと技術で解消する',
    ogDescription: '各業界に特化したAIソリューションで、現場の「不」を「光」へ。',
    ogType: 'website'
  })
} else {
  useSeoMeta({
    title: 'IYASAKA | 不を解消し、事業を"IYASAKA"へ。',
    description: '弱電・電気工事を土台に、ホテルAI、動画配信、現場DX、カスタムAIで現場の「あらゆる不」を技術で解消します。',
    ogTitle: 'IYASAKA | 不を解消し、事業を"IYASAKA"へ。',
    ogDescription: '弱電・電気工事を土台に、ホテルAI、動画配信、現場DX、カスタムAIで現場の「あらゆる不」を技術で解消します。',
    ogType: 'website'
  })
}
</script>

<template>
  <V2HomeV2 v-if="hpVersion === 'v2'" />
  <V1HomeV1 v-else />
</template>
