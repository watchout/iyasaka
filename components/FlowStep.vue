<script setup lang="ts">
/**
 * 導入フローステップ
 * 心理学原理：進捗バイアス + 認知的流暢性
 * - ステップを明示することで心理的ハードルを下げる
 * - 番号付きで進捗を可視化
 * - シンプルな説明で理解しやすく
 */
interface Props {
  step: number
  title: string
  description: string
  icon?: string
  isLast?: boolean
}

withDefaults(defineProps<Props>(), {
  isLast: false
})
</script>

<template>
  <div class="relative flex items-start gap-6">
    <!-- ステップ番号 + 接続線 -->
    <div class="flex flex-col items-center">
      <!-- 番号サークル -->
      <div 
        class="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-matsuha text-white font-bold text-xl shadow-lg shadow-matsuha/30"
      >
        {{ step }}
      </div>
      
      <!-- 接続線 -->
      <div 
        v-if="!isLast"
        class="w-0.5 h-full min-h-[80px] bg-gradient-to-b from-matsuha to-matsuha/20 mt-2"
      />
    </div>
    
    <!-- コンテンツ -->
    <div class="flex-1 pb-12">
      <!-- アイコン（オプション） -->
      <span v-if="icon" class="text-3xl mb-3 block">{{ icon }}</span>
      
      <!-- タイトル -->
      <h3 class="text-xl font-bold text-slate-900 mb-2">
        {{ title }}
      </h3>
      
      <!-- 説明 -->
      <p class="text-slate-600 leading-relaxed">
        {{ description }}
      </p>
    </div>
  </div>
</template>

