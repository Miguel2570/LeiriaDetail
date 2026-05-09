<script setup lang="ts">
import { Separator } from 'radix-vue'
import { cn } from '@/utils/cn'

defineProps<{ orientation?: 'horizontal' | 'vertical'; class?: string }>()
</script>

<template>
  <Separator
    :orientation="orientation || 'horizontal'"
    :class="cn(
      'shrink-0 bg-gray-100',
      orientation === 'vertical' ? 'h-full w-[1px]' : 'h-[1px] w-full',
      $props.class
    )"
  />
</template>