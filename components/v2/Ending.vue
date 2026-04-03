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
  setTimeout(() => { isVisible.value = true }, 2000)
})
</script>

<template>
  <section
    ref="sectionRef"
    class="py-20 lg:py-32 bg-gray-900 transition-all duration-1000"
    :class="isVisible ? 'opacity-100' : 'opacity-0'"
  >
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto text-center">
        <p class="text-gray-400 text-lg mb-4">
          すべてに共通していること。
        </p>
        <h2 class="font-mincho text-3xl md:text-4xl lg:text-5xl text-white mb-8">
          <span class="text-amber-400">AIが、動いている。</span>
        </h2>
        <p class="text-gray-400 text-lg mb-10">
          この仕組みを、御社にも。
        </p>

        <NuxtLink
          to="/aiplus/shindan"
          class="inline-flex items-center gap-3 px-10 py-5 bg-amber-500 text-white rounded-full font-bold text-lg hover:bg-amber-600 transition-colors shadow-lg"
        >
          5分無料AI活用診断
          <span class="text-xl">&#8594;</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
