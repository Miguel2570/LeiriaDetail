<script setup lang="ts">
import { TabsContent, TabsList, TabsRoot, TabsTrigger, type TabsRootProps } from 'radix-vue'
import { cn } from '@/utils/cn'

const props = defineProps<TabsRootProps & { class?: string }>()
</script>

<template>
  <TabsRoot v-bind="props" :class="cn('w-full', props.class)">
    <slot />
  </TabsRoot>
</template>