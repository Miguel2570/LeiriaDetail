<script setup lang="ts">
import { ref } from 'vue';
import Calendar from '@/components/ui/forms/Calendar.vue';

const props = defineProps<{
  selectedDate: any;
  selectedTime: string;
}>();

const emit = defineEmits(['update:date', 'update:time']);

const timeSlots = [
  { time: '09:00', available: true },
  { time: '10:30', available: true },
  { time: '12:00', available: false },
  { time: '14:30', available: true },
  { time: '16:00', available: true },
  { time: '17:30', available: true },
];
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div class="space-y-4">
      <h3 class="text-xl font-bold flex items-center gap-2">
        <span class="w-2 h-8 bg-[#3B82F6] rounded-full"></span>
        Seleciona o Dia
      </h3>
      <div class="glass-card !p-2 bg-white/[0.02] border-white/5">
        <Calendar 
          :model-value="selectedDate" 
          @update:model-value="val => emit('update:date', val)"
          class="rounded-xl"
        />
      </div>
    </div>

    <div class="space-y-4">
      <h3 class="text-xl font-bold flex items-center gap-2">
        <span class="w-2 h-8 bg-[#06B6D4] rounded-full"></span>
        Horários Disponíveis
      </h3>
      <div v-if="selectedDate" class="grid grid-cols-2 gap-3">
        <button 
          v-for="slot in timeSlots" 
          :key="slot.time"
          @click="slot.available && emit('update:time', slot.time)"
          :disabled="!slot.available"
          :class="[
            'py-4 rounded-xl font-bold transition-all border-2 text-center',
            !slot.available ? 'opacity-20 cursor-not-allowed border-white/5' :
            selectedTime === slot.time 
              ? 'border-[#3B82F6] bg-[#3B82F6]/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
              : 'border-white/5 bg-white/[0.03] hover:border-white/20 text-[#94A3B8]'
          ]"
        >
          {{ slot.time }}
        </button>
      </div>
      <div v-else class="h-64 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl text-[#94A3B8] italic">
        Escolha um dia para ver as horas...
      </div>
    </div>
  </div>
</template>