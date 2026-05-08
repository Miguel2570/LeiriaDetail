<script setup lang="ts">
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTrigger, type DialogRootProps } from 'radix-vue'
import { X } from 'lucide-vue-next'
import { cn } from '@/utils/cn'

const props = defineProps<DialogRootProps & { side?: 'left' | 'right' | 'top' | 'bottom' }>()
const sideVariants = {
  right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm data-[state=open]:animate-slide-in-from-right',
  left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm data-[state=open]:animate-slide-in-from-left',
}
</script>

<template>
  <DialogRoot v-bind="props">
    <slot name="trigger" />
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
      <DialogContent :class="cn('fixed z-50 bg-white p-6 shadow-xl transition ease-in-out duration-300', sideVariants[props.side || 'right'])">
        <slot />
        <DialogClose class="absolute right-4 top-4 opacity-70 hover:opacity-100">
          <X class="h-5 w-5" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>