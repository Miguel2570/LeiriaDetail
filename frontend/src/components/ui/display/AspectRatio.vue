<script setup lang="ts">
import { AspectRatio } from 'radix-vue'

defineProps<{ ratio?: number }>()
</script>

<template>
  <AspectRatio :ratio="ratio || 16 / 9">
    <slot />
  </AspectRatio>
</template>