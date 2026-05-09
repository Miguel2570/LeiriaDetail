<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, type SliderRootEmits, type SliderRootProps } from 'radix-vue'
import { cn } from '@/utils/cn'

const props = defineProps<SliderRootProps & { class?: string }>()
const emits = defineEmits<SliderRootEmits>()
</script>

<template>
  <SliderRoot
    v-bind="props"
    :class="cn('relative flex w-full touch-none select-none items-center', props.class)"
    @update:model-value="emits('update:modelValue', $event)"
  >
    <span class="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-100">
      <SliderRange class="absolute h-full bg-[#3B82F6]" />
    </span>
    <SliderThumb
      class="block h-5 w-5 rounded-full border-2 border-[#3B82F6] bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] disabled:pointer-events-none disabled:opacity-50"
    />
  </SliderRoot>
</template>