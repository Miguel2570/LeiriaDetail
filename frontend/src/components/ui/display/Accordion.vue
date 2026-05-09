<script setup lang="ts">
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger, type AccordionRootProps } from 'radix-vue'
import { ChevronDown } from 'lucide-vue-next'
import { cn } from '@/utils/cn'

const props = defineProps<AccordionRootProps & { class?: string }>()
</script>

<template>
  <AccordionRoot type="single" collapsible class="w-full space-y-2">
    <AccordionItem v-for="item in faqs" :key="item.id" :value="item.id" class="border rounded-xl overflow-hidden bg-white">
      <AccordionHeader class="flex">
        <AccordionTrigger class="flex flex-1 items-center justify-between p-4 font-bold hover:bg-gray-50 transition-all [&[data-state=open]>svg]:rotate-180">
          {{ item.question }}
          <ChevronDown class="h-4 w-4 shrink-0 transition-transform duration-200" />
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent class="p-4 text-sm text-gray-500 bg-white overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
        {{ item.answer }}
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>

<script lang="ts">
export const AccordionItemStyled = (props: any) => ({
  component: AccordionItem,
  class: cn('border-b', props.class)
})
</script>