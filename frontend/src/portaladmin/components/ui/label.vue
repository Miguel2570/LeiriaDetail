<template>
  <Label
    data-slot="label"
    :class="cn(
      'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      props.className
    )"
    v-bind="$attrs"
  >
    <slot />
  </Label>
</template>

<script setup lang="ts">
import { Label } from 'radix-vue'
import { cn } from '../../composables/utils'

const props = defineProps<{
  className?: string
}>()
</script>