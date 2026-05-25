<template>
  <DialogTitle
    data-slot="dialog-title"
    :class="cn('text-lg leading-none font-semibold', props.className)"
    v-bind="$attrs"
  >
    <slot />
  </DialogTitle>
</template>

<script setup lang="ts">
import { DialogTitle } from 'radix-vue'
import { cn } from '../../composables/utils'

const props = defineProps<{
  className?: string
}>()
</script>