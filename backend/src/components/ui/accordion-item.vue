<template>
  <AccordionItem
    data-slot="accordion-item"
    :value="value"
    :class="cn('border-b last:border-b-0', props.className)"
    v-bind="$attrs"
  >
    <slot />
  </AccordionItem>
</template>

<script setup lang="ts">
import { AccordionItem } from 'radix-vue'
import { cn } from '../../composables/utils'

const props = defineProps<{
  value: string
  className?: string
}>()
</script>