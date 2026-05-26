<template>
  <div
    data-slot="card-footer"
    :class="cn('flex items-center px-6 pb-6 [.border-t]:pt-6', props.className)"
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