<template>
  <AccordionRoot data-slot="accordion" v-bind="$attrs">
    <slot />
  </AccordionRoot>
</template>

<script setup lang="ts">
import { AccordionRoot } from 'radix-vue'

defineProps<{
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  modelValue?: string | string[]
  collapsible?: boolean
}>()
</script>