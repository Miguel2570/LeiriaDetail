<script setup lang="ts">
import { ToggleGroupRoot, type ToggleGroupRootEmits, type ToggleGroupRootProps } from 'radix-vue'
import { cn } from '@/utils/cn'

const props = defineProps<ToggleGroupRootProps & { class?: string }>()
const emits = defineEmits<ToggleGroupRootEmits>()
</script>

<template>
  <ToggleGroupRoot
    v-bind="props"
    @update:model-value="emits('update:modelValue', $event)"
    :class="cn('flex items-center justify-center gap-1', props.class)"
  >
    <slot />
  </ToggleGroupRoot>
</template>