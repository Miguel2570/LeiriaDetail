<template>
  <div
    data-slot="card-content"
    :class="cn('px-6 [&:last-child]:pb-6', props.className)"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '../../composables/utils'

const props = defineProps<{
  className?: string
}>()
</script>