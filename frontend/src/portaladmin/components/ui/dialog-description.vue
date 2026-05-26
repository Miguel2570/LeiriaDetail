<template>
  <DialogDescription
    data-slot="dialog-description"
    :class="cn('text-muted-foreground text-sm', props.className)"
    v-bind="$attrs"
  >
    <slot />
  </DialogDescription>
</template>

<script setup lang="ts">
import { DialogDescription } from 'radix-vue'
import { cn } from '../../composables/utils'

const props = defineProps<{
  className?: string
}>()
</script>