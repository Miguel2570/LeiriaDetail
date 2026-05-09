<script setup lang="ts">
import { NavigationMenuIndicator, NavigationMenuRoot, NavigationMenuViewport } from 'radix-vue'
import { cn } from '@/utils/cn'

defineProps<{ class?: string }>()
</script>

<template>
  <NavigationMenuRoot :class="cn('relative z-10 flex max-w-max flex-1 items-center justify-center', $props.class)">
    <slot />
    <div class="absolute left-0 top-full flex justify-center">
      <NavigationMenuViewport class="origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-xl border bg-white text-gray-950 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out md:w-[var(--radix-navigation-menu-viewport-width)]" />
    </div>
  </NavigationMenuRoot>
</template>