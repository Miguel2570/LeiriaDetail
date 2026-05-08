<script setup lang="ts">
import { cn } from '@/utils/cn'
</script>

<template>
  <div class="relative w-full overflow-auto">
    <table :class="cn('w-full caption-bottom text-sm', $attrs.class as string)">
      <slot />
    </table>
  </div>
</template>

<style scoped>
:deep(th) { @apply h-12 px-4 text-left align-middle font-bold text-gray-500 uppercase tracking-wider; }
:deep(td) { @apply p-4 align-middle border-t border-gray-100; }
:deep(tr) { @apply transition-colors hover:bg-gray-50/50; }
</style>