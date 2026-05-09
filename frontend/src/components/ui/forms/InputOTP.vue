<script setup lang="ts">
import { PinInputInput, PinInputRoot } from 'radix-vue'
import { cn } from '@/utils/cn'

const props = defineProps<{ modelValue?: string[] }>()
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <PinInputRoot
    id="pin-input"
    @update:model-value="emit('update:modelValue', $event)"
    placeholder="○"
    class="flex gap-2 items-center"
  >
    <PinInputInput
      v-for="(id, index) in 6"
      :key="id"
      :index="index"
      :class="cn(
        'relative flex h-12 w-10 items-center justify-center border-y border-r border-gray-200 text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md focus:z-10 focus:ring-2 focus:ring-[#3B82F6] outline-none',
      )"
    />
  </PinInputRoot>
</template>