<template>
  <Separator
    data-slot="separator-root"
    :decorative="decorative"
    :orientation="orientation"
    :class="cn(
      'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
      props.className
    )"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { Separator } from 'radix-vue'
import { cn } from '../../composables/utils'

const props = defineProps<{
  className?: string
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}>()
</script>