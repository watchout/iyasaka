<template>
  <!-- オーバーレイ -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-sumi/50 z-40 lg:hidden"
      aria-hidden="true"
      @click="close"
    />
  </Transition>

  <!-- モバイルメニュー -->
  <Transition
    enter-active-class="transition-transform duration-300"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-300"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <aside
      v-if="modelValue"
      id="mobile-menu"
      class="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl overflow-y-auto lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="モバイルメニュー"
    >
      <div class="flex flex-col h-full">
        <!-- ヘッダー -->
        <div class="flex items-center justify-between p-4 border-b border-matsuha/20">
          <span class="text-lg font-heading font-bold text-matsuha">メニュー</span>
          <button
            type="button"
            class="p-2 rounded-lg hover:bg-matsuha/10 transition-colors focus:outline-none focus:ring-2 focus:ring-matsuha"
            aria-label="メニューを閉じる"
            @click="close"
          >
            <svg class="w-6 h-6 text-matsuha" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- ナビゲーション -->
        <nav class="flex-1 py-6 px-4" aria-label="モバイルナビゲーション">
          <ul class="space-y-1">
            <li v-for="item in items" :key="item.label">
              <!-- 親アイテム（子がある場合） -->
              <div v-if="item.children && item.children.length > 0">
                <button
                  type="button"
                  class="w-full flex items-center justify-between py-3 px-4 text-left text-sumi hover:bg-matsuha/10 rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-matsuha"
                  @click="toggleSection(item.label)"
                >
                  <span>{{ item.label }}</span>
                  <svg 
                    class="w-5 h-5 transition-transform"
                    :class="{ 'rotate-180': expandedSections.has(item.label) }"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <!-- 子アイテム -->
                <Transition
                  enter-active-class="transition-all duration-300"
                  enter-from-class="opacity-0 max-h-0"
                  enter-to-class="opacity-100 max-h-96"
                  leave-active-class="transition-all duration-300"
                  leave-from-class="opacity-100 max-h-96"
                  leave-to-class="opacity-0 max-h-0"
                >
                  <ul v-if="expandedSections.has(item.label)" class="ml-4 mt-1 space-y-1 overflow-hidden">
                    <li v-for="child in item.children" :key="child.label">
                      <NuxtLink
                        :to="child.to || '#'"
                        class="block py-2 px-4 text-sumi/80 hover:text-matsuha hover:bg-matsuha/5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-matsuha"
                        @click="close"
                      >
                        {{ child.label }}
                      </NuxtLink>
                    </li>
                  </ul>
                </Transition>
              </div>

              <!-- 通常リンク -->
              <NuxtLink
                v-else-if="item.to"
                :to="item.to"
                class="block py-3 px-4 text-sumi hover:bg-matsuha/10 rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-matsuha"
                @click="close"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- CTA buttons -->
        <div class="p-4 border-t border-matsuha/20 space-y-3">
          <NuxtLink 
            :to="site.cta.contact"
            class="btn-primary w-full text-center inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-matsuha focus:ring-offset-2"
            @click="close"
          >
            <span>📞</span>
            <span>お問い合わせ</span>
          </NuxtLink>
          <NuxtLink 
            :to="site.cta.download"
            class="btn-secondary w-full text-center inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-matsuha focus:ring-offset-2"
            @click="close"
          >
            <span>📄</span>
            <span>資料ダウンロード</span>
          </NuxtLink>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { NavItem } from '~/app/navigation'
import { site } from '~/app/site'

const props = defineProps<{
  modelValue: boolean
  items: NavItem[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const expandedSections = ref(new Set<string>())

const close = () => {
  emit('update:modelValue', false)
}

const toggleSection = (label: string) => {
  if (expandedSections.value.has(label)) {
    expandedSections.value.delete(label)
  } else {
    expandedSections.value.add(label)
  }
}

// body スクロールロック
watch(() => props.modelValue, (isOpen) => {
  if (typeof document !== 'undefined') {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

// Escキーで閉じる
if (typeof window !== 'undefined') {
  watch(() => props.modelValue, (isOpen) => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close()
      }
    }
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
    } else {
      window.removeEventListener('keydown', handleEsc)
    }
  })
}
</script>
