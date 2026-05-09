<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { cn } from '@/utils/cn'

defineProps<{
  items: { label: string; href?: string; active?: boolean }[]
}>()
</script>

<template>
  <nav aria-label="Breadcrumb" class="flex">
    <ol class="flex items-center space-x-2 text-sm text-gray-500">
      <li v-for="(item, index) in items" :key="index" class="flex items-center">
        <template v-if="index > 0">
          <ChevronRight class="h-4 w-4 mx-2 text-gray-400" />
        </template>
        
        <router-link 
          v-if="item.href && !item.active" 
          :to="item.href" 
          class="hover:text-[#3B82F6] transition-colors"
        >
          {{ item.label }}
        </router-link>
        <span v-else :class="cn('font-medium', item.active ? 'text-gray-900' : '')">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>