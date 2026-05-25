<template>
  <TooltipRoot v-model:open="open" :delay-duration="delayDuration">
    <slot />
  </TooltipRoot>
</template>

<script setup lang="ts">
import { TooltipRoot } from 'radix-vue'
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  open?: boolean
  defaultOpen?: boolean
  delayDuration?: number
}>(), {
  open: undefined,
  defaultOpen: false,
  delayDuration: 0,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const open = ref(props.open ?? props.defaultOpen)

watch(() => props.open, (newVal) => {
  if (newVal !== undefined) {
    open.value = newVal
  }
})

watch(open, (newVal) => {
  emit('update:open', newVal)
})
</script>