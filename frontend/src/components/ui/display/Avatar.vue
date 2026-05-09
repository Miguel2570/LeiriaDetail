<script setup lang="ts">
import { AvatarFallback, AvatarImage, AvatarRoot } from 'radix-vue'
import { cn } from '@/utils/cn'

defineProps<{ src?: string; fallback: string; class?: string }>()
</script>

<template>
  <AvatarRoot :class="cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', $props.class)">
    <AvatarImage :src="src" class="aspect-square h-full w-full" />
    <AvatarFallback class="flex h-full w-full items-center justify-center rounded-full bg-gray-100 font-medium">
      {{ fallback }}
    </AvatarFallback>
  </AvatarRoot>
</template>