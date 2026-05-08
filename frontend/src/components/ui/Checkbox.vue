<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot, type CheckboxRootEmits, type CheckboxRootProps } from 'radix-vue'
import { Check } from 'lucide-vue-next'
import { cn } from '@/utils/cn'

const props = defineProps<CheckboxRootProps & { class?: string }>()
const emits = defineEmits<CheckboxRootEmits>()
</script>

<template>
  <CheckboxRoot
    v-bind="props"
    @update:checked="emits('update:checked', $event)"
    :class="cn(
      'peer h-5 w-5 shrink-0 rounded-md border border-[#3B82F6] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#3B82F6] data-[state=checked]:text-white transition-colors',
      props.class
    )"
  >
    <CheckboxIndicator class="flex items-center justify-center text-current">
      <Check class="h-3.5 w-3.5 stroke-[3]" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>