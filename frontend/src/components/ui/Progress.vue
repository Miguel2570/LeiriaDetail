<script setup lang="ts">
import { ProgressIndicator, ProgressRoot } from 'radix-vue'
import { cn } from '@/utils/cn'

defineProps<{ value?: number; class?: string }>()
</script>

<template>
  <ProgressRoot
    :value="value"
    :class="cn('relative h-2 w-full overflow-hidden rounded-full bg-gray-100', $props.class)"
  >
    <ProgressIndicator
      class="h-full w-full flex-1 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] transition-all duration-500 ease-in-out"
      :style="`transform: translateX(-${100 - (value || 0)}%)`"
    />
  </ProgressRoot>
</template>