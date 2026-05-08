<script setup lang="ts">
import { ContextMenuContent, ContextMenuPortal, ContextMenuRoot, ContextMenuTrigger } from 'radix-vue'
import { cn } from '@/utils/cn'

defineProps<{ class?: string }>()
</script>

<template>
  <ContextMenuRoot>
    <ContextMenuTrigger :class="cn('flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm', $props.class)">
      <slot name="trigger" />
    </ContextMenuTrigger>
    <ContextMenuPortal>
      <ContextMenuContent :class="cn('z-50 min-w-[8rem] overflow-hidden rounded-xl border bg-white p-1 shadow-md animate-in fade-in-80')">
        <slot />
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>