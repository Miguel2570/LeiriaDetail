<script setup lang="ts">
import { 
  DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuPortal, 
  DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, type DropdownMenuRootProps 
} from 'radix-vue'
import { cn } from '@/utils/cn'

const props = defineProps<DropdownMenuRootProps & { class?: string }>()
</script>

<template>
  <DropdownMenuRoot v-bind="props">
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :side-offset="5"
        :class="cn('z-50 min-w-[8rem] overflow-hidden rounded-xl border bg-white p-1 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out', props.class)"
      >
        <slot />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style scoped>
:deep([role="menuitem"]) {
  @apply relative flex cursor-default select-none items-center rounded-lg px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50;
}
:deep([data-radix-collection-item]) {
  @apply font-medium text-gray-700;
}
</style>