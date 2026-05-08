<script setup lang="ts">
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'radix-vue'
import { cn } from '@/utils/cn'

defineProps<{ class?: string }>()
</script>

<template>
  <ScrollAreaRoot :class="cn('relative overflow-hidden', $props.class)">
    <ScrollAreaViewport class="h-full w-full rounded-[inherit]">
      <slot />
    </ScrollAreaViewport>
    <ScrollAreaScrollbar
      class="flex touch-none select-none transition-colors p-0.5 bg-gray-50/50 orientation-vertical:w-2.5 orientation-horizontal:flex-col orientation-horizontal:h-2.5"
      orientation="vertical"
    >
      <ScrollAreaThumb class="relative flex-1 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors" />
    </ScrollAreaScrollbar>
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>