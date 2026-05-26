<template>
  <TabsContent
    data-slot="tabs-content"
    :class="cn('flex-1 outline-none', props.className)"
    :value="value"
    v-bind="$attrs"
  >
    <slot />
  </TabsContent>
</template>

<script setup lang="ts">
import { TabsContent } from 'radix-vue'
import { cn } from '../../composables/utils'

const props = defineProps<{
  className?: string
  value: string
}>()
</script>