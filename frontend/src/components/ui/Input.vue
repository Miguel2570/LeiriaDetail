<script setup lang="ts">
import { cn } from '@/utils/cn'

defineProps<{
  modelValue?: string | number
  type?: string
  placeholder?: string
  class?: string
}>()

defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :type="type || 'text'"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    :placeholder="placeholder"
    :class="cn(
      'flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
      $props.class
    )"
  />
</template>