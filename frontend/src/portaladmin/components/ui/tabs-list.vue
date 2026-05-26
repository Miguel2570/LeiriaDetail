<template>
  <TabsList
    data-slot="tabs-list"
    :class="cn('bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px] flex', props.className)"
    v-bind="$attrs"
  >
    <slot />
  </TabsList>
</template>

<script setup lang="ts">
import { TabsList } from 'radix-vue'
import { cn } from '../../composables/utils'

const props = defineProps<{
  className?: string
}>()
</script>