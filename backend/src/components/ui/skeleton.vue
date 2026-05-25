<template>
  <div
    data-slot="skeleton"
    :class="cn('bg-accent animate-pulse rounded-md', props.className)"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { cn } from '../../composables/utils'

const props = defineProps<{
  className?: string
}>()
</script>