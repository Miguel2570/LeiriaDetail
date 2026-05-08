<script setup lang="ts">
import { 
  AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogOverlay, AlertDialogPortal, 
  AlertDialogRoot, AlertDialogTitle, AlertDialogTrigger 
} from 'radix-vue'
import { cn } from '@/utils/cn'

defineProps<{ title: string; description: string }>()
</script>

<template>
  <AlertDialogRoot>
    <AlertDialogTrigger as-child><slot name="trigger" /></AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0" />
      <AlertDialogContent :class="cn('fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 rounded-2xl animate-in zoom-in-95')">
        <div class="flex flex-col space-y-2 text-center sm:text-left">
          <AlertDialogTitle class="text-lg font-bold">{{ title }}</AlertDialogTitle>
          <AlertDialogDescription class="text-sm text-gray-500">{{ description }}</AlertDialogDescription>
        </div>
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <AlertDialogCancel as-child><slot name="cancel" /></AlertDialogCancel>
          <AlertDialogAction as-child><slot name="action" /></AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>