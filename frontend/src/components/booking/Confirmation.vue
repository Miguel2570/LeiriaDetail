<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  bookingData: any;
}>();

const formattedDate = computed(() => {
  if (!props.bookingData.date) return '';
  return new Date(props.bookingData.date).toLocaleDateString('pt-PT', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
});
</script>

<template>
  <div class="max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[#3B82F6]/20 to-[#06B6D4]/20 border border-[#3B82F6]/30 mb-6">
        <svg class="w-10 h-10 text-[#06B6D4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="text-3xl font-bold text-white mb-2">Quase lá, {{ bookingData.personal.firstName }}!</h2>
      <p class="text-[#94A3B8]">Revê os detalhes do teu agendamento antes de confirmar.</p>
    </div>

    <div class="glass-card p-0 overflow-hidden border-white/10">
      <div class="bg-gradient-to-r from-[#3B82F6]/10 to-[#06B6D4]/10 p-6 border-b border-white/5 flex justify-between items-center">
        <div>
          <p class="text-sm text-[#94A3B8] font-medium uppercase tracking-wider mb-1">Serviço Selecionado</p>
          <h4 class="text-xl font-bold text-white">{{ bookingData.service?.name }}</h4>
        </div>
        <div class="text-right">
          <p class="text-sm text-[#94A3B8] font-medium uppercase tracking-wider mb-1">Total Estimado</p>
          <span class="text-2xl font-bold text-leiria-gradient">{{ bookingData.service?.price }}</span>
        </div>
      </div>

      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p class="text-sm text-[#94A3B8] mb-1">Data e Hora</p>
          <p class="text-white font-medium capitalize">{{ formattedDate }}</p>
          <p class="text-[#06B6D4] font-bold mt-1">{{ bookingData.time }}</p>
        </div>
        <div>
          <p class="text-sm text-[#94A3B8] mb-1">Viatura</p>
          <p class="text-white font-medium">{{ bookingData.personal.vehicle }}</p>
          <p class="text-white/60 text-sm mt-1 uppercase">{{ bookingData.personal.licensePlate }}</p>
        </div>
      </div>
    </div>
  </div>
</template>