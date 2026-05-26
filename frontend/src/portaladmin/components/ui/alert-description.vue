<template>
  <div
    data-slot="alert-description"
    :class="cn('text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed', props.className)"
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