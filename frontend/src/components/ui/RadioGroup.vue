<script setup lang="ts">
import { cn } from '../../utils/utils';
defineProps<{ modelValue?: string; class?: string }>();
defineEmits(['update:modelValue']);
</script>

<template>
  <div :class="cn('grid gap-3', $props.class)">
    <slot />
  </div>
</template>