<script setup lang="ts">
const sectionRef = ref<HTMLElement>()
const isVisible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.2 }
  )
  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
})
</script>

<template>
  <section
    ref="sectionRef"
    class="py-20 lg:py-32 bg-[#0f1a2e] transition-all duration-1000"
    :class="isVisible ? 'opacity-100' : 'opacity-0'"
  >
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto text-center">
        <p class="text-white/50 text-lg mb-4">
          すべての街区に共通していること。
        </p>
        <h2 class="font-mincho text-3xl md:text-4xl lg:text-5xl text-white mb-8">
          <span class="text-amber-400">AIが、動いている。</span>
        </h2>
        <p class="text-white/60 text-lg mb-10">
          この仕組みを、御社にも。
        </p>

        <NuxtLink
          to="/aiplus/shindan"
          class="inline-flex items-center gap-3 px-10 py-5 bg-amber-400 text-[#0f1a2e] rounded-full font-bold text-lg hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
        >
          5分無料AI活用診断
          <span class="text-xl">&#8594;</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
