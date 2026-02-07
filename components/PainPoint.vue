<script setup lang="ts">
/**
 * 課題提起カード
 * 心理学原理：損失回避（Loss Aversion）+ コントラスト効果
 * - 痛みに共感することで注目を集める
 * - 損失を意識させることで行動を促す
 * - 解決策への橋渡し
 */
interface Props {
  icon?: string
  title: string
  description: string
  index?: number
}

withDefaults(defineProps<Props>(), {
  index: 0
})

// アイコンマッピング
const iconMap: Record<string, string> = {
  delay: '⏱️',
  compatibility: '🔌',
  operation: '🔄',
  audio: '🔊',
  language: '🌐',
  trouble: '⚠️',
  cost: '💰',
  default: '❓'
}
</script>

<template>
  <div 
    class="group relative p-6 rounded-2xl bg-white border-2 border-slate-100 hover:border-red-200 transition-all duration-300 hover:shadow-lg"
    :style="{ '--delay': `${index * 100}ms` }"
  >
    <!-- 背景グラデーション（ホバー時） -->
    <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-50/0 to-orange-50/0 group-hover:from-red-50/50 group-hover:to-orange-50/50 transition-all duration-300" />
    
    <!-- コンテンツ -->
    <div class="relative">
      <!-- アイコン + インデックス -->
      <div class="flex items-start justify-between mb-4">
        <span class="text-3xl">
          {{ iconMap[icon || 'default'] || iconMap.default }}
        </span>
        <span class="text-xs font-bold text-red-400/60 uppercase tracking-widest">
          Pain #{{ (index + 1).toString().padStart(2, '0') }}
        </span>
      </div>
      
      <!-- タイトル -->
      <h3 class="text-lg font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
        {{ title }}
      </h3>
      
      <!-- 説明 -->
      <p class="text-sm text-slate-600 leading-relaxed">
        {{ description }}
      </p>
      
      <!-- 損失回避を意識させる装飾線 -->
      <div class="mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r from-red-400 to-orange-400 rounded-full transition-all duration-500" />
    </div>
  </div>
</template>


