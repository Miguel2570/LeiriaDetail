<script setup lang="ts">
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'radix-vue'
import { cn } from '@/utils/cn'

defineProps<{ align?: 'start' | 'center' | 'end' }>()
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger as-child>
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent 
        :align="align || 'center'" 
        :side-offset="5"
        :class="cn('z-50 w-72 rounded-xl border bg-white p-4 shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out')"
      >
        <slot />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>