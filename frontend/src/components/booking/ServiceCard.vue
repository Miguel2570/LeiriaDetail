<script setup lang="ts">
defineProps<{
  id: string;
  name: string;
  price: string;
  duration: string;
  features: string[];
  selected: boolean;
}>();
</script>

<template>
  <div 
    :class="[
      'glass-card cursor-pointer transition-all border-2',
      selected ? 'border-[#3B82F6] bg-[#3B82F6]/5' : 'border-white/5 hover:border-white/20'
    ]"
  >
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-xl font-bold">{{ name }}</h3>
        <p class="text-[#94A3B8] text-sm">{{ duration }}</p>
      </div>
      <span class="text-2xl font-bold text-leiria-gradient">{{ price }}</span>
    </div>

    <ul class="space-y-2 mb-6">
      <li v-for="feat in features" :key="feat" class="flex items-center gap-2 text-sm text-[#94A3B8]">
        <div class="w-1.5 h-1.5 rounded-full bg-[#06B6D4]"></div>
        {{ feat }}
      </li>
    </ul>

    <div v-if="selected" class="text-center py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-lg text-xs font-bold uppercase tracking-wider">
      Selecionado
    </div>
  </div>
</template>