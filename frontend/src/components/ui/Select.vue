<script setup lang="ts">
defineProps<{ placeholder?: string; options: { label: string, value: string }[] }>();
defineEmits(['update:modelValue']);
</script>

<template>
  <select @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
          class="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-[#3B82F6] outline-none">
    <option value="" disabled selected>{{ placeholder }}</option>
    <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
  </select>
</template>