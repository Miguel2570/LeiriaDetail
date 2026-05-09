<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = defineProps<{
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
  class?: string
}>()

const variants = {
  default: 'border-transparent bg-[#3B82F6] text-white hover:bg-[#3B82F6]/80',
  secondary: 'border-transparent bg-blue-50 text-[#3B82F6] hover:bg-blue-100',
  outline: 'text-gray-600 border-gray-200',
  destructive: 'border-transparent bg-red-500 text-white hover:bg-red-500/80',
}
</script>

<template>
  <div :class="cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', variants[variant || 'default'], props.class)">
    <slot />
  </div>
</template>