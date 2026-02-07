<template>
  <ul class="flex items-center gap-6">
    <li v-for="item in items" :key="item.label">
      <!-- ドロップダウンあり（サービス） -->
      <UDropdown 
        v-if="item.children && item.children.length > 0"
        :items="[item.children.map(child => ({
          label: child.label,
          click: () => navigateToChild(child)
        }))]"
        :popper="{ placement: 'bottom-start' }"
      >
        <button
          type="button"
          class="flex items-center gap-1 text-sumi hover:text-matsuha transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-matsuha focus:ring-offset-2 rounded px-2 py-1"
        >
          <span>{{ item.label }}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </UDropdown>

      <!-- 通常リンク -->
      <NuxtLink
        v-else-if="item.to"
        :to="item.to"
        :external="item.external"
        class="text-sumi hover:text-matsuha transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-matsuha focus:ring-offset-2 rounded px-2 py-1"
      >
        {{ item.label }}
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { NavItem } from '~/app/navigation'

defineProps<{
  items: NavItem[]
}>()

const navigateToChild = (child: NavItem) => {
  if (child.to) {
    navigateTo(child.to)
  }
}
</script>
