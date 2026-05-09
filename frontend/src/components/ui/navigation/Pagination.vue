<script setup lang="ts">
import { PaginationList, PaginationRoot, type PaginationRootProps } from 'radix-vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { cn } from '@/utils/cn'

const props = defineProps<PaginationRootProps & { class?: string }>()
</script>

<template>
  <PaginationRoot v-bind="props" :class="cn('flex flex-col items-center gap-4', props.class)">
    <PaginationList v-slot="{ items }" class="flex items-center gap-1">
      <slot name="prev">
        <button class="h-10 w-10 flex items-center justify-center rounded-lg border hover:bg-gray-50 disabled:opacity-50">
          <ChevronLeft class="h-4 w-4" />
        </button>
      </slot>

      <template v-for="(item, index) in items">
        <button
          v-if="item.type === 'page'"
          :key="index"
          :class="cn(
            'h-10 w-10 rounded-lg border text-sm font-medium transition-colors',
            item.value === props.page ? 'bg-[#3B82F6] text-white border-[#3B82F6]' : 'hover:bg-gray-50'
          )"
        >
          {{ item.value }}
        </button>
        <span v-else :key="item.type" class="px-2">...</span>
      </template>

      <slot name="next">
        <button class="h-10 w-10 flex items-center justify-center rounded-lg border hover:bg-gray-50 disabled:opacity-50">
          <ChevronRight class="h-4 w-4" />
        </button>
      </slot>
    </PaginationList>
  </PaginationRoot>
</template>