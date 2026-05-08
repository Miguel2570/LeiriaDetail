<script setup lang="ts">
import { MenubarMenu, MenubarRoot, MenubarTrigger, MenubarPortal, MenubarContent, MenubarItem } from 'radix-vue'
import { cn } from '@/utils/cn'
</script>

<template>
  <MenubarRoot class="flex h-10 items-center space-x-1 rounded-md border bg-white p-1">
    <slot />
  </MenubarRoot>
</template>