<template>
  <AccordionContent
    data-slot="accordion-content"
    class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
    v-bind="$attrs"
  >
    <div :class="cn('pt-0 pb-4', props.className)">
      <slot />
    </div>
  </AccordionContent>
</template>

<script setup lang="ts">
import { AccordionContent } from 'radix-vue'
import { cn } from '../../composables/utils'

const props = defineProps<{
  className?: string
}>()
</script>