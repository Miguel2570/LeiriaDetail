<template>
  <div
    data-slot="alert"
    role="alert"
    :class="cn(alertVariants({ variant }), className)"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../composables/utils'

const props = defineProps<{
  variant?: 'default' | 'destructive'
  className?: string
}>()

const alertVariants = (props: { variant?: string }) => {
  const base = "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current"
  
  const variants = {
    default: "bg-card text-card-foreground",
    destructive: "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90"
  }
  
  return `${base} ${variants[props.variant as keyof typeof variants] || variants.default}`
}
</script>