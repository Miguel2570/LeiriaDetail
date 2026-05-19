<script setup lang="ts">
import { Sparkles, Shield, Clock, CheckCircle2 } from 'lucide-vue-next'

const props = defineProps<{ 
  selectedServiceId: string | null,
  selectedVehicle: any // Recebe o veículo para calcular preço
}>()

const emit = defineEmits(['update:service'])

const services = [
  { id: '1', icon: Sparkles, name: 'Lavagem Detalhe', basePrice: 40, duration: '2h', features: ['Limpeza de jantes', 'Banho de espuma', 'Aspiração interior'] },
  { id: '2', icon: Shield, name: 'Proteção Cerâmica', basePrice: 350, duration: '2 dias', features: ['Correção de pintura', 'Selagem 9H', 'Durabilidade 3 anos'] }
]

// Exemplo simples de cálculo de preço: se o carro for SUV, é mais caro
const getCalculatedPrice = (basePrice: number) => {
  if (props.selectedVehicle?.type === 'SUV') return basePrice + 50
  return basePrice
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
    
    <div 
      v-for="service in services" 
      :key="service.id"
      @click="emit('update:service', { ...service, finalPrice: getCalculatedPrice(service.basePrice) })"
      :class="[
        'flex flex-col h-[420px] p-8 rounded-[2rem] cursor-pointer transition-all duration-300 border-2 relative',
        selectedServiceId === service.id 
          ? 'border-[#2563EB] bg-[#2563EB]/10 shadow-[0_0_30px_rgba(37,99,235,0.2)] scale-[1.02]' 
          : 'border-white/5 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.03]'
      ]"
    >
      <div class="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 shrink-0">
        <component :is="service.icon" :class="['h-6 w-6 transition-colors', selectedServiceId === service.id ? 'text-[#00D8FF]' : 'text-white/40']" />
      </div>

      <h3 class="text-xl font-bold text-white uppercase italic tracking-tight">{{ service.name }}</h3>
      <div class="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-2 mb-6">
        <Clock class="w-3 h-3" /> {{ service.duration }}
      </div>

      <ul class="space-y-3 mb-auto">
        <li v-for="feat in service.features" :key="feat" class="flex items-start gap-2 text-xs text-gray-400">
          <CheckCircle2 class="h-4 w-4 text-[#2563EB] shrink-0" /> {{ feat }}
        </li>
      </ul>

      <div class="pt-6 border-t border-white/5 mt-6 flex justify-between items-end">
        <span class="text-[10px] font-black text-white/40 uppercase tracking-widest">Valor Exato</span>
        <span class="text-3xl font-black text-[#00D8FF] italic">{{ getCalculatedPrice(service.basePrice) }}€</span>
      </div>
      
      <div v-if="selectedServiceId === service.id" class="absolute top-4 right-4 h-6 w-6 rounded-full bg-[#00D8FF] flex items-center justify-center shadow-lg">
        <CheckCircle2 class="h-4 w-4 text-[#050505]" />
      </div>
    </div>

  </div>
</template>