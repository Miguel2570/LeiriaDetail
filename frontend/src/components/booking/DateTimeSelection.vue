<script setup lang="ts">
import { Calendar as CalendarIcon, Clock } from 'lucide-vue-next';
import Calendar from '@/components/ui/forms/Calendar.vue';

const props = defineProps<{ selectedDate: any; selectedTime: string; }>();
const emit = defineEmits(['update:date', 'update:time']);

const timeSlots = [
  { time: '09:00', available: true }, { time: '10:30', available: true },
  { time: '14:30', available: true }, { time: '16:00', available: true }
];
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    
    <div class="bg-white/[0.01] border border-white/5 rounded-3xl p-6">
      <div class="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <CalendarIcon class="w-5 h-5 text-[#2563EB]" />
        <h3 class="text-sm font-black text-white uppercase tracking-widest italic">1. Dia</h3>
      </div>
      <Calendar :model-value="selectedDate" @update:model-value="emit('update:date', $event)"class="rounded-xl"/>
    </div>

    <div class="bg-white/[0.01] border border-white/5 rounded-3xl p-6">
      <div class="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <Clock class="w-5 h-5 text-[#00D8FF]" />
        <h3 class="text-sm font-black text-white uppercase tracking-widest italic">2. Hora</h3>
      </div>
      
      <div v-if="selectedDate" class="grid grid-cols-2 gap-3">
        <button 
          v-for="slot in timeSlots" :key="slot.time"
          @click="slot.available && emit('update:time', slot.time)"
          :class="[
            'py-3 rounded-xl text-xs font-black tracking-widest transition-all border',
            selectedTime === slot.time 
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