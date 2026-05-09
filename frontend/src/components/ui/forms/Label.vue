<script setup lang="ts">
import { Label } from 'radix-vue'
import { cn } from '@/utils/cn'

defineProps<{ class?: string; for?: string }>()
</script>

<template>
  <Label
    :for="$props.for"
    :class="cn(
      'text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700',
      $props.class
    )"
  >
    <slot />
  </Label>
</template>