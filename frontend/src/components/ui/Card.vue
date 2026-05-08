<script setup lang="ts">
import { cn } from '@/utils/cn'
</script>

<template>
  <div :class="cn('rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md', $attrs.class as string)">
    <div v-if="$slots.header" class="p-6 border-b border-gray-50 font-bold text-lg"><slot name="header" /></div>
    <div class="p-6"><slot /></div>
    <div v-if="$slots.footer" class="p-6 pt-0"><slot name="footer" /></div>
  </div>
</template>