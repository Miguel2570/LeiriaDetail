<script setup lang="ts">
import { Toggle, type ToggleEmits, type ToggleProps } from 'radix-vue'
import { cn } from '@/utils/cn'

const props = defineProps<ToggleProps & { class?: string; variant?: 'default' | 'outline' }>()
const emits = defineEmits<ToggleEmits>()

const variants = {
  default: 'bg-transparent hover:bg-gray-100 text-gray-700 data-[state=on]:bg-blue-50 data-[state=on]:text-[#3B82F6]',
  outline: 'border border-gray-200 bg-transparent hover:bg-gray-50 data-[state=on]:bg-gray-100',
}
</script>

<template>
  <Toggle
    v-bind="props"
    @update:pressed="emits('update:pressed', $event)"
    :class="cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-10 px-3',
      variants[variant || 'default'],
      props.class
    )"
  >
    <slot />
  </Toggle>
</template>