<script setup lang="ts">
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'radix-vue'

defineProps<{ open?: boolean }>()
defineEmits(['update:open'])
</script>

<template>
  <CollapsibleRoot :open="open" @update:open="$emit('update:open', $event)">
    <slot name="trigger" />
    <CollapsibleContent class="overflow-hidden transition-all data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
      <slot />
    </CollapsibleContent>
  </CollapsibleRoot>
</template>