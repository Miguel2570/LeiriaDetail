<script setup lang="ts">
import { Car, Plus } from 'lucide-vue-next'

// 1. Alterado para receber o objeto completo do carro em vez de apenas a matrícula
defineProps<{ selectedVehicle: any }>()
const emit = defineEmits(['update:vehicle'])

// Isto viria da API/Pinia, carros que ele já registou na Garagem
const myVehicles = [
  { plate: 'AA-00-AA', brand: 'BMW', model: 'M4 Competition', type: 'Coupe' },
  { plate: '99-ZZ-99', brand: 'Porsche', model: 'Macan GTS', type: 'SUV' }
]
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in">
    
    <div 
      v-for="car in myVehicles" 
      :key="car.plate"
      @click="emit('update:vehicle', car)"
      :class="[
        'p-6 rounded-[2rem] cursor-pointer transition-all duration-300 border-2 relative overflow-hidden',
        // 2. Agora verificamos se o plate do carro selecionado é igual ao do loop
        selectedVehicle?.plate === car.plate 
          ? 'border-[#00D8FF] bg-[#00D8FF]/5 shadow-[0_0_20px_rgba(0,216,255,0.15)]' 
          : 'border-white/5 bg-white/[0.01] hover:border-white/20'
      ]"
    >
      <Car :class="['h-8 w-8 mb-4 transition-colors', selectedVehicle?.plate === car.plate ? 'text-[#00D8FF]' : 'text-white/20']" />
      <h3 class="text-xl font-bold text-white uppercase italic tracking-tight mb-1">{{ car.brand }} {{ car.model }}</h3>
      <span class="inline-block px-3 py-1 mt-2 bg-white/5 rounded-md text-[10px] text-white/60 font-black tracking-widest border border-white/5 uppercase">{{ car.plate }}</span>
    </div>

    <router-link to="/area-cliente" class="p-6 rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center hover:border-[#2563EB] hover:bg-[#2563EB]/5 transition-all group">
      <div class="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[#2563EB] transition-colors">
        <Plus class="h-6 w-6 text-white/40 group-hover:text-white" />
      </div>
      <span class="text-xs font-black text-white/50 uppercase tracking-widest group-hover:text-white">Adicionar nova viatura</span>
    </router-link>

  </div>
</template>