<script setup lang="ts">
import { ShieldCheck, Calendar, Car } from 'lucide-vue-next';
const props = defineProps<{ bookingData: any; }>();
</script>

<template>
  <div class="bg-gradient-to-br from-[#2563EB]/10 to-[#050505] border border-[#2563EB]/20 rounded-[2rem] p-8 md:p-10 shadow-[0_0_30px_rgba(37,99,235,0.1)] relative overflow-hidden">
    
    <ShieldCheck class="absolute -right-6 -top-6 w-40 h-40 text-[#2563EB]/5 pointer-events-none" />

    <h2 class="text-2xl font-black text-white uppercase italic tracking-tight mb-8">Resumo da Reserva</h2>

    <div class="space-y-6 relative z-10">
      
      <div class="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <span class="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">Tratamento Selecionado</span>
          <h3 class="text-xl font-bold text-white">{{ bookingData.service?.name }}</h3>
        </div>
        <div class="text-2xl font-black text-[#00D8FF] italic">{{ bookingData.service?.price }}</div>
      </div>

      <div class="grid grid-cols-2 gap-6 pt-2">
        <div>
          <span class="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Calendar class="w-3 h-3" /> Agenda</span>
          <p class="text-sm font-bold text-white">{{ bookingData.date ? new Date(bookingData.date).toLocaleDateString() : '' }}</p>
          <p class="text-xs text-[#00D8FF] font-black mt-1">{{ bookingData.time }}</p>
        </div>
        <div>
          <span class="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Car class="w-3 h-3" /> Viatura</span>
          <p class="text-sm font-bold text-white">{{ bookingData.personal.vehicle }}</p>
          <p class="text-xs text-gray-500 uppercase mt-1">{{ bookingData.personal.licensePlate }}</p>
        </div>
      </div>

    </div>
  </div>
</template>