<template>
  <DialogRoot v-model:open="open" v-bind="$attrs">
    <slot />
  </DialogRoot>
</template>

<script setup lang="ts">
import { DialogRoot } from 'radix-vue'
import { ref, watch } from 'vue'

const props = defineProps<{
  open?: boolean
  defaultOpen?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const open = ref(props.open ?? props.defaultOpen ?? false)

watch(() => props.open, (newVal) => {
  if (newVal !== undefined) {
    open.value = newVal
  }
})

watch(open, (newVal) => {
  emit('update:open', newVal)
})
</script>