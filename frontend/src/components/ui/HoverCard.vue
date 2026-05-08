<script setup lang="ts">
import { HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from 'radix-vue'
import { cn } from '@/utils/cn'

defineProps<{ openDelay?: number; closeDelay?: number }>()
</script>

<template>
  <HoverCardRoot :open-delay="openDelay || 200" :close-delay="closeDelay || 100">
    <HoverCardTrigger as-child>
      <slot name="trigger" />
    </HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent
        side="top"
        :side-offset="5"
        :class="cn('z-50 w-64 rounded-xl border bg-white p-4 shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out')"
      >
        <slot />
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>