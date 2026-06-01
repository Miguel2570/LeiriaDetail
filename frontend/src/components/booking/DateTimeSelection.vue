<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    
    <div class="bg-white/[0.01] border border-white/5 rounded-3xl p-6">
      <div class="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <CalendarIcon class="w-5 h-5 text-[#2563EB]" />
        <h3 class="text-sm font-black text-white uppercase tracking-widest italic">1. Dia</h3>
      </div>
      
      <Calendar v-model="localDate" :min-value="minDate" :disabled-dates="blockedDates" class="rounded-xl" />
    </div>

    <div class="bg-white/[0.01] border border-white/5 rounded-3xl p-6">
      <div class="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <Clock class="w-5 h-5 text-[#00D8FF]" />
        <h3 class="text-sm font-black text-white uppercase tracking-widest italic">2. Hora</h3>
      </div>
      
      <!-- Loja fechada -->
      <div v-if="localDate && isBlocked && !isLoadingSlots" class="h-40 flex flex-col items-center justify-center text-center">
        <p class="text-[#00D8FF] font-bold text-sm mb-1">🔒 Loja Fechada</p>
        <p class="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Não há horários disponíveis neste dia</p>
      </div>

      <!-- Slots disponíveis -->
      <div v-else-if="localDate && !isBlocked" class="grid grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
        <div v-if="isLoadingSlots" class="col-span-2 text-center py-10">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00D8FF] mx-auto"></div>
        </div>
        <button 
          v-else
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

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { Calendar as CalendarIcon, Clock } from 'lucide-vue-next';
import Calendar from '@/components/ui/forms/Calendar.vue';
import { today, getLocalTimeZone } from '@internationalized/date';
import { graphql } from '@/graphql';

const props = defineProps<{ selectedDate: any; selectedTime: string }>();
const emit = defineEmits(['update:date', 'update:time']);

const localDate = ref(props.selectedDate || today(getLocalTimeZone()));
const minDate = today(getLocalTimeZone());
const timeSlots = ref<{ time: string; available: boolean }[]>([]);
const isLoadingSlots = ref(false);
const isBlocked = ref(false);
const blockedDates = ref<string[]>([]);

watch(localDate, (newValue) => {
  emit('update:date', newValue);
  if (newValue) fetchSlots(newValue);
});

onMounted(() => {
  if (!localDate.value) localDate.value = today(getLocalTimeZone());
  if (localDate.value) fetchSlots(localDate.value);
  fetchBlockedDates();
});

const fetchBlockedDates = async () => {
  try {
    const query = `query { blockedDates { dates { id date reason isRecurring } } }`;
    const data = await graphql<{ blockedDates: { dates: any[] } }>(query);
    if (data.blockedDates?.dates) {
      blockedDates.value = data.blockedDates.dates.map((d: any) => d.date);
    }
  } catch (e) { console.error('Erro ao carregar bloqueios:', e); }
};

const fetchSlots = async (date: any) => {
  isLoadingSlots.value = true;
  isBlocked.value = false;
  
  try {
    let dateStr: string;
    if (typeof date === 'string') {
      dateStr = date;
    } else if (date?.year && date?.month && date?.day) {
      dateStr = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    } else {
      dateStr = new Date().toISOString().split('T')[0];
    }
    
    // ✅ Usa o blockedDates que já foi carregado (não faz query separada)
    if (blockedDates.value.includes(dateStr)) {
      isBlocked.value = true;
      timeSlots.value = [];
      isLoadingSlots.value = false;
      return;
    }
    
    // ✅ Busca slots via GraphQL
    const query = `query($date: String!) { availableSlots(date: $date) { availableSlots occupiedSlots } }`;
    const data = await graphql<{ availableSlots: { availableSlots: string[], occupiedSlots: string[] } }>(query, { date: dateStr });
    
    const allSlots = [
      '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
    ];
    
    if (data.availableSlots?.availableSlots) {
      timeSlots.value = allSlots.map(time => ({
        time,
        available: data.availableSlots.availableSlots.includes(time)
      }));
    } else {
      // ✅ Fallback: todos disponíveis
      timeSlots.value = allSlots.map(time => ({ time, available: true }));
    }
  } catch (error) {
    console.error('Erro ao carregar slots:', error);
    // ✅ Fallback em caso de erro
    const allSlots = ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'];
    timeSlots.value = allSlots.map(time => ({ time, available: true }));
  } finally {
    isLoadingSlots.value = false;
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 8px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 216, 255, 0.2); border-radius: 8px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 216, 255, 0.5); }
</style>