<script setup lang="ts">
import { cn } from '@/utils/cn'; // Usar o alias @ que configurámos
import { RadioGroupRoot, type RadioGroupRootEmits, type RadioGroupRootProps } from 'radix-vue';

// Definimos os props aceitando as propriedades nativas do Radix Vue
const props = defineProps<RadioGroupRootProps & { class?: string }>();
const emits = defineEmits<RadioGroupRootEmits>();
</script>

<template>
  <RadioGroupRoot
    v-bind="props"
    :class="cn('grid gap-3', props.class)"
    @update:model-value="emits('update:modelValue', $event)"
  >
    <slot />
  </RadioGroupRoot>
</template>