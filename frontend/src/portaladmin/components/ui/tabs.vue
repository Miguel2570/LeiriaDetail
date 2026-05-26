<template>
  <TabsRoot
    data-slot="tabs"
    :class="cn('flex flex-col gap-2', className)"
    v-model="selectedValue"
    v-bind="$attrs"
  >
    <slot />
  </TabsRoot>
</template>

<script setup lang="ts">
import { TabsRoot } from 'radix-vue'
import { cn } from '../../composables/utils'
import { ref, watch } from 'vue'

const props = defineProps<{
  className?: string
  defaultValue?: string
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectedValue = ref(props.modelValue ?? props.defaultValue ?? '')

watch(() => props.modelValue, (newVal) => {
  if (newVal !== undefined) {
    selectedValue.value = newVal
  }
})

watch(selectedValue, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>