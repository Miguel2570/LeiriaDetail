<template>
  <h4
    data-slot="card-title"
    :class="cn('leading-none', props.className)"
    v-bind="$attrs"
  >
    <slot />
  </h4>
</template>

<script setup lang="ts">
import { cn } from '../../composables/utils'

const props = defineProps<{
  className?: string
}>()
</script>