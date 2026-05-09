<script setup lang="ts">
const props = defineProps<{
  selectedServiceId: string | null;
}>();

const emit = defineEmits(['update:service']);

const services = [
  {
    id: 'basic',
    name: 'Lavagem Básica',
    price: '€25',
    duration: '1 hora',
    features: ['Lavagem Exterior Manual', 'Limpeza de Jantes', 'Limpeza de Vidros', 'Aspiração Interior']
  },
  {
    id: 'premium',
    name: 'Detalhe Premium',
    price: '€120',
    duration: '3 horas',
    features: ['Tudo na Básica', 'Descontaminação', 'Polimento Leve', 'Limpeza Profunda Interior']
  },
  {
    id: 'ceramic',
    name: 'Cerâmica VIP',
    price: '€450',
    duration: '1 dia',
    features: ['Tudo no Premium', 'Correção de Pintura', 'Proteção Cerâmica 5 Anos', 'Detalhe do Motor']
  }
];
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div 
      v-for="service in services" 
      :key="service.id"
      @click="emit('update:service', service)"
      :class="[
        'glass-card cursor-pointer transition-all duration-300 border-2 hover:-translate-y-1',
        selectedServiceId === service.id 
          ? 'border-[#3B82F6] bg-gradient-to-br from-[#3B82F6]/10 to-[#06B6D4]/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
          : 'border-white/5 hover:border-white/20'
      ]"
    >
      <div class="flex justify-between items-start mb-6">
        <div>
          <h3 class="text-xl font-bold text-white">{{ service.name }}</h3>
          <p class="text-[#94A3B8] text-sm mt-1 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {{ service.duration }}
          </p>
        </div>
        <span class="text-2xl font-bold text-leiria-gradient">{{ service.price }}</span>
      </div>

      <ul class="space-y-3 mb-8">
        <li v-for="feat in service.features" :key="feat" class="flex items-start gap-3 text-sm text-[#94A3B8]">
          <svg class="h-5 w-5 shrink-0 text-[#06B6D4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ feat }}
        </li>
      </ul>

      <div 
        v-if="selectedServiceId === service.id" 
        class="text-center py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-xl text-xs font-bold text-white uppercase tracking-wider"
      >
        Selecionado
      </div>
    </div>
  </div>
</template>