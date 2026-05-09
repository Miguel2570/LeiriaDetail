<script setup lang="ts">
import { cn } from '@/utils/cn'

const props = defineProps<{
  variant?: 'default' | 'destructive'
  class?: string
}>()

const variants = {
  default: 'bg-blue-50 text-[#3B82F6] border-blue-100',
  destructive: 'bg-red-50 text-red-600 border-red-100'
}
</script>

<template>
  <div :class="cn('relative w-full rounded-xl border p-4 flex gap-3', variants[variant || 'default'], props.class)">
    <div class="mt-0.5"><slot name="icon" /></div>
    <div>
      <h5 class="font-bold leading-none tracking-tight mb-1"><slot name="title" /></h5>
      <div class="text-sm opacity-90"><slot /></div>
    </div>
  </div>
</template>