<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

// Importação dos teus novos componentes
import ProgressBar from '@/components/booking/ProgressBar.vue';
import ServiceSelection from '@/components/booking/ServiceSelection.vue';
import DateTimeSelection from '@/components/booking/DateTimeSelection.vue';
import VehicleDetails from '@/components/booking/VehicleDetails.vue';
import Confirmation from '@/components/booking/Confirmation.vue';

// --- LÓGICA DE TROCA DE TEMA ---
onMounted(() => {
  document.body.classList.add('booking-dark-mode');
});

onUnmounted(() => {
  document.body.classList.remove('booking-dark-mode');
});

// --- ESTADO PRINCIPAL ---
const step = ref(1);
const steps = [
  { number: 1, label: 'Serviço' },
  { number: 2, label: 'Agenda' },
  { number: 3, label: 'Detalhes' },
  { number: 4, label: 'Resumo' }
];

const bookingData = ref({
  service: null as any,
  date: null as any,
  time: '',
  personal: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    vehicle: '',
    licensePlate: ''
  }
});

const canGoNext = computed(() => {
  if (step.value === 1) return bookingData.value.service !== null;
  if (step.value === 2) return bookingData.value.date !== null && bookingData.value.time !== '';
  if (step.value === 3) {
    const p = bookingData.value.personal;
    return p.firstName && p.lastName && p.email && p.phone && p.vehicle && p.licensePlate;
  }
  return true;
});

const submitBooking = () => {
  console.log("A enviar reserva:", bookingData.value);
  alert("Agendamento concluído com sucesso! Obrigado por escolheres a LeiriaDetail.");
};
</script>

<template>
  <div class="min-h-screen pt-24 pb-20 px-4">
    <div class="max-w-5xl mx-auto">
      
      <div class="text-center mb-16 animate-in slide-in-from-top-4 duration-700">
        <h2 class="text-[#94A3B8] font-medium tracking-[0.3em] uppercase text-xs md:text-sm mb-3">
          Agendamento Online
        </h2>
        <h1 class="text-5xl md:text-7xl font-black italic tracking-tighter text-white drop-shadow-2xl uppercase">
          LEIRIA<span class="text-leiria-gradient">DETAIL</span>
        </h1>
      </div>

      <ProgressBar :steps="steps" :currentStep="step" />

      <div class="mt-12 min-h-[400px]">
        <ServiceSelection 
          v-if="step === 1" 
          :selectedServiceId="bookingData.service?.id || null"
          @update:service="val => bookingData.service = val"
        />

        <DateTimeSelection 
          v-if="step === 2"
          :selectedDate="bookingData.date"
          :selectedTime="bookingData.time"
          @update:date="val => bookingData.date = val"
          @update:time="val => bookingData.time = val"
        />

        <VehicleDetails 
          v-if="step === 3"
          v-model="bookingData.personal"
        />

        <Confirmation 
          v-if="step === 4"
          :bookingData="bookingData"
        />
      </div>

      <div class="mt-16 flex justify-between items-center max-w-5xl mx-auto border-t border-white/10 pt-8">
        <button 
          v-if="step > 1" 
          @click="step--"
          class="px-6 py-3 rounded-xl border border-white/10 text-[#94A3B8] hover:bg-white/5 hover:text-white font-bold flex items-center gap-2 transition-all"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar
        </button>
        <div v-else></div> 

        <button 
          v-if="step < 4"
          @click="step++"
          :disabled="!canGoNext"
          class="btn-primary-gradient disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Próximo Passo
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        <button 
          v-if="step === 4"
          @click="submitBooking"
          class="btn-primary-gradient flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Confirmar e Pagar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.glass-card) {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
}
</style>