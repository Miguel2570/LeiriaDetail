<script setup lang="ts">
import { DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from 'radix-vue'
import { X } from 'lucide-vue-next'
import { cn } from '@/utils/cn'

defineProps<{ title?: string; description?: string }>()
</script>

<template>
  <DialogRoot>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />
      <DialogContent :class="cn('fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 rounded-2xl')">
        <div class="flex flex-col space-y-1.5 text-center sm:text-left">
          <DialogTitle class="text-lg font-bold leading-none tracking-tight">
            <slot name="title">{{ title }}</slot>
          </DialogTitle>
          <DialogDescription class="text-sm text-gray-500">
            <slot name="description">{{ description }}</slot>
          </DialogDescription>
        </div>
        
        <slot />

        <DialogClose class="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity">
          <X class="h-4 w-4" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>