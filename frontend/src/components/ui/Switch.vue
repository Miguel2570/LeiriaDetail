<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'radix-vue'
import { cn } from '@/utils/cn'

const props = defineProps<{ modelValue?: boolean; class?: string }>()
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <SwitchRoot
    :checked="modelValue"
    @update:checked="emit('update:modelValue', $event)"
    :class="cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      modelValue ? 'bg-[#3B82F6]' : 'bg-gray-200',
      props.class
    )"
  >
    <SwitchThumb
      :class="cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
        modelValue ? 'translate-x-5' : 'translate-x-0'
      )"
    />
  </SwitchRoot>
</template>