<script setup lang="ts">
import { ref, watch } from 'vue';
import { Calendar as CalendarIcon, Clock } from 'lucide-vue-next';
import Calendar from '@/components/ui/forms/Calendar.vue';

// 1. Importamos as funções que vão descobrir qual é o "dia de hoje" para bloquear o passado
import { today, getLocalTimeZone } from '@internationalized/date';

const props = defineProps<{ selectedDate: any; selectedTime: string; }>();
const emit = defineEmits(['update:date', 'update:time']);

const localDate = ref(props.selectedDate || undefined);

// 2. Definimos que a data mínima permitida é o dia de hoje
const minDate = today(getLocalTimeZone());

watch(localDate, (newValue) => {
  emit('update:date', newValue);
});

// 3. Os teus novos horários divididos entre Manhã e Tarde (intervalos de 30 min)
const timeSlots = [
  // Manhã (09:30 às 14:00) -> O último agendamento começa às 13:30
  { time: '09:30', available: true }, { time: '10:00', available: true },
  { time: '10:30', available: true }, { time: '11:00', available: true },
  { time: '11:30', available: true }, { time: '12:00', available: true },
  { time: '12:30', available: true }, { time: '13:00', available: true },
  { time: '13:30', available: true },
  
  // Tarde (15:00 às 20:00) -> O último agendamento começa às 19:30
  { time: '15:00', available: true }, { time: '15:30', available: true },
  { time: '16:00', available: true }, { time: '16:30', available: true },
  { time: '17:00', available: true }, { time: '17:30', available: true },
  { time: '18:00', available: true }, { time: '18:30', available: true },
  { time: '19:00', available: true }, { time: '19:30', available: true }
];
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    
    <div class="bg-white/[0.01] border border-white/5 rounded-3xl p-6">
      <div class="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <CalendarIcon class="w-5 h-5 text-[#2563EB]" />
        <h3 class="text-sm font-black text-white uppercase tracking-widest italic">1. Dia</h3>
      </div>
      
      <Calendar v-model="localDate" :min-value="minDate" class="rounded-xl" />
    </div>

    <div class="bg-white/[0.01] border border-white/5 rounded-3xl p-6">
      <div class="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <Clock class="w-5 h-5 text-[#00D8FF]" />
        <h3 class="text-sm font-black text-white uppercase tracking-widest italic">2. Hora</h3>
      </div>
      
      <div v-if="localDate" class="grid grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
        <button 
          v-for="slot in timeSlots" :key="slot.time"
          @click="slot.available && emit('update:time', slot.time)"
          :class="[
            'py-3 rounded-xl text-xs font-black tracking-widest transition-all border',
            props.selectedTime === slot.time 
              ? 'border-[#00D8FF] bg-[#00D8FF]/10 text-[#00D8FF] shadow-[0_0_10px_rgba(0,216,255,0.2)]' 
              : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05] text-white/70'
          ]"
        >
          {{ slot.time }}
        </button>
      </div>
      
      <div v-else class="h-40 flex flex-col items-center justify-center text-center">
        <p class="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Selecione um dia no calendário</p>
      </div>
    </div>
    
  </div>
</template>

<style scoped>
/* Estilo para a barra de scroll ficar fina e com as cores do teu site */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02); 
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 216, 255, 0.2); 
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 216, 255, 0.5); 
}
</style>