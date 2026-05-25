<template>
  <p
    data-slot="card-description"
    :class="cn('text-muted-foreground', props.className)"
    v-bind="$attrs"
  >
    <slot />
  </p>
</template>

<script setup lang="ts">
import { cn } from '../../composables/utils'

const props = defineProps<{
  className?: string
}>()
</script>