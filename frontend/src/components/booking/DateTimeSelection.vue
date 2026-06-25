<template>
  <div class="space-y-8">
    <div class="flex flex-col space-y-2 mb-8">
      <h3 class="text-2xl font-black italic text-white uppercase tracking-tight">
        Selecione <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">Data e Hora</span>
      </h3>
      <p class="text-xs text-gray-400 uppercase tracking-widest">Passo 3 de 5</p>
      
      <div v-if="totalDuration" class="flex items-center gap-3 mt-3 p-4 bg-[#111115] border border-[#22222A] rounded-2xl">
        <div class="w-10 h-10 rounded-xl bg-[#00D8FF]/10 flex items-center justify-center">
          <Clock class="w-5 h-5 text-[#00D8FF]" />
        </div>
        <div>
          <p class="text-white font-bold text-sm">Este serviço necessita de <span class="text-[#00D8FF]">{{ formatDuration(totalDuration) }}</span></p>
          <p class="text-gray-500 text-[10px] mt-0.5">Inclui {{ BUFFER_MINUTES }}min de preparação</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      
      <!-- Calendário em Cards -->
      <div class="lg:col-span-3 bg-white/[0.01] border border-white/5 rounded-3xl p-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <CalendarIcon class="w-5 h-5 text-[#2563EB]" />
            <h3 class="text-sm font-black text-white uppercase tracking-widest italic">{{ currentMonthLabel }}</h3>
          </div>
          <div class="flex gap-2">
            <button @click="prevMonth" class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <ChevronLeft class="w-4 h-4 text-gray-400" />
            </button>
            <button @click="nextMonth" class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <ChevronRight class="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <!-- ============================================ -->
        <!-- ✅ VERSÃO SIMPLES (ATIVA) - Tudo igual -->
        <!-- ============================================ -->
        
        <!-- Legenda simples -->
        <div class="flex items-center gap-4 mb-6 text-[10px]">
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 rounded bg-white/10 border border-white/20"></div>
            <span class="text-gray-400">Disponível</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 rounded bg-white/5 border border-white/10"></div>
            <span class="text-gray-500">Indisponível</span>
          </div>
        </div>

        <!-- ============================================ -->
        <!-- 🔮 VERSÃO COM CORES (COMENTADA)              -->
        <!-- ============================================ -->
        <!-- 
        <div class="flex items-center gap-3 mb-6 text-[10px] flex-wrap">
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 rounded bg-[#10B981]/30 border border-[#10B981]"></div>
            <span class="text-gray-400">Disponível</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 rounded bg-[#F59E0B]/30 border border-[#F59E0B]"></div>
            <span class="text-gray-400">Parcial</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 rounded bg-[#EF4444]/30 border border-[#EF4444]"></div>
            <span class="text-gray-400">Lotado</span>
          </div>
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 rounded bg-white/5 border border-white/10"></div>
            <span class="text-gray-500">Bloqueado</span>
          </div>
        </div>
        -->

        <div v-if="isLoadingCalendar" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D8FF]"></div>
        </div>

        <!-- Grid de Dias -->
        <div v-else class="grid grid-cols-7 gap-2">
          <div v-for="day in weekDays" :key="day" class="text-center text-[10px] text-gray-500 uppercase font-black tracking-widest py-2">
            {{ day }}
          </div>

          <button
            v-for="(day, index) in calendarDays"
            :key="index"
            @click="selectDay(day)"
            :disabled="!day.available || day.isPast"
            :class="[
              'aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300 text-sm font-bold relative',
              day.isCurrentMonth ? '' : 'opacity-30',
              day.isToday ? 'ring-2 ring-[#00D8FF]' : '',
              day.isPast ? 'opacity-20 cursor-not-allowed' : '',
              day.isSelected ? 'bg-[#00D8FF] text-[#050505] shadow-[0_0_15px_rgba(0,216,255,0.3)]' : getDayColorClass(day),
              day.available && !day.isPast && !day.isSelected ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'
            ]"
          >
            <span :class="['text-sm', day.isSelected ? 'text-[#050505]' : '']">{{ day.number }}</span>
          </button>
        </div>
      </div>

      <!-- Horários -->
      <div class="lg:col-span-2 bg-white/[0.01] border border-white/5 rounded-3xl p-6">
        <div class="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
          <Clock class="w-5 h-5 text-[#00D8FF]" />
          <h3 class="text-sm font-black text-white uppercase tracking-widest italic">
            {{ selectedDayInfo ? `Dia ${selectedDayInfo}` : 'Hora' }}
          </h3>
        </div>
        
        <div v-if="localDate && isDayFullyBlocked && !isLoadingSlots" class="h-60 flex flex-col items-center justify-center text-center">
          <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
            <span class="text-2xl">🔒</span>
          </div>
          <p class="text-gray-400 font-bold text-sm mb-1">Indisponível</p>
          <p class="text-[10px] text-gray-500 uppercase tracking-widest font-bold text-center px-4">
            Não há horários disponíveis neste dia
          </p>
        </div>

        <div v-else-if="localDate && !isDayFullyBlocked" class="space-y-2 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
          <div v-if="isLoadingSlots" class="text-center py-10">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00D8FF] mx-auto"></div>
          </div>
          
          <button 
            v-for="slot in availableSlots" 
            :key="slot"
            @click="emit('update:time', slot)"
            :class="[
              'w-full py-3 rounded-xl text-xs font-black tracking-widest transition-all border',
              props.selectedTime === slot 
                ? 'border-[#00D8FF] bg-[#00D8FF]/10 text-[#00D8FF] shadow-[0_0_10px_rgba(0,216,255,0.2)]' 
                : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05] text-white/70'
            ]"
          >
            {{ slot }}
            <span class="block text-[9px] text-gray-500 font-normal tracking-normal mt-0.5">
              até {{ getEndTime(slot) }}
            </span>
          </button>
        </div>
        
        <div v-else class="h-60 flex flex-col items-center justify-center text-center">
          <CalendarIcon class="w-8 h-8 text-gray-600 mb-3" />
          <p class="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Selecione um dia</p>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { today, getLocalTimeZone, parseDate } from '@internationalized/date';
import { graphql } from '@/graphql';

const props = defineProps<{ 
  selectedDate: any; 
  selectedTime: string;
  serviceDuration?: number;
}>();
const emit = defineEmits(['update:date', 'update:time']);

const localDate = ref(props.selectedDate || today(getLocalTimeZone()));
const isLoadingSlots = ref(false);
const isLoadingCalendar = ref(false);
const blockedDates = ref<string[]>([]);
const occupiedSlots = ref<{ time: string; duration: number }[]>([]);
const calendarDaysData = ref<Record<string, { availableHours: number; isBlocked: boolean }>>({});

const BUFFER_MINUTES = 15;
const WORK_START = '09:00';
const WORK_END = '21:00';

const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const weekDays = ['Dom', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const currentMonthLabel = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value, 1);
  return date.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });
});

const totalDuration = computed(() => (props.serviceDuration || 60) + BUFFER_MINUTES);

const selectedDayInfo = computed(() => {
  if (!localDate.value) return null;
  if (localDate.value.day && localDate.value.month) {
    return `${String(localDate.value.day).padStart(2, '0')}/${String(localDate.value.month).padStart(2, '0')}`;
  }
  return null;
});

const calendarDays = computed(() => {
  const days: any[] = [];
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
  const startPadding = firstDay.getDay();

  for (let i = 0; i < startPadding; i++) {
    const d = new Date(currentYear.value, currentMonth.value, -startPadding + i + 1);
    days.push({ number: d.getDate(), isCurrentMonth: false, isPast: true, available: false, availableHours: null, isToday: false, isSelected: false, date: null });
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(currentYear.value, currentMonth.value, d);
    date.setHours(0, 0, 0, 0);
    const dateStr = formatDateToString({ year: currentYear.value, month: currentMonth.value + 1, day: d });
    const dayData = calendarDaysData.value[dateStr];
    const isBlocked = dayData?.isBlocked || blockedDates.value.includes(dateStr);
    const isPast = date < todayDate;
    const isToday = date.getTime() === todayDate.getTime();
    const isSelected = localDate.value && 
      localDate.value.day === d && 
      localDate.value.month === currentMonth.value + 1 &&
      localDate.value.year === currentYear.value;

    days.push({
      number: d, isCurrentMonth: true, isPast, isBlocked,
      available: !isBlocked && !isPast,
      availableHours: dayData?.availableHours ?? null,
      isToday, isSelected, date: dateStr,
    });
  }

  return days;
});

const availableSlots = computed(() => {
  if (!localDate.value) return [];
  const allSlots = generateTimeSlots(WORK_START, WORK_END, 30);
  return allSlots.filter(slot => canFitService(slot, totalDuration.value, occupiedSlots.value, WORK_END));
});

const isDayFullyBlocked = computed(() => {
  if (!localDate.value) return false;
  return availableSlots.value.length === 0;
});

// ============================================
// ✅ VERSÃO SIMPLES (ATIVA) - Tudo igual
// ============================================
const getDayColorClass = (day: any) => {
  if (!day.available || day.isPast || !day.isCurrentMonth) return 'bg-white/[0.02] border border-white/5 text-gray-600';
  if (day.isBlocked) return 'bg-white/5 border border-white/10 text-gray-500';
  return 'bg-white/[0.05] border border-white/10 text-gray-300 hover:border-[#00D8FF]/30';
};

// ============================================
// 🔮 VERSÃO COM CORES (COMENTADA)
// ============================================
/*
const getDayColorClass = (day: any) => {
  if (!day.available || day.isPast || !day.isCurrentMonth) return 'bg-white/[0.02] border border-white/5 text-gray-600';
  if (day.isBlocked) return 'bg-white/5 border border-white/10 text-gray-500';
  if (day.availableHours === 0) return 'bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]';
  if (day.availableHours !== null && day.availableHours < totalDuration.value / 60) return 'bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B]';
  return 'bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981]';
};
*/

const selectDay = (day: any) => {
  if (!day.available || day.isPast || !day.date) return;
  try {
    const [y, m, d] = day.date.split('-').map(Number);
    localDate.value = parseDate(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    emit('update:date', localDate.value);
    fetchSlots(day.date);
  } catch (e) {
    console.error('Erro ao selecionar dia:', e);
  }
};

const prevMonth = () => {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value--; }
  else { currentMonth.value--; }
  loadMonthData();
};

const nextMonth = () => {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++; }
  else { currentMonth.value++; }
  loadMonthData();
};

const loadMonthData = () => {
  isLoadingCalendar.value = true;
  const daysMap: Record<string, any> = {};
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const workMinutes = timeToMinutes(WORK_END) - timeToMinutes(WORK_START);
  const totalHours = Math.floor(workMinutes / 60);
  
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(currentYear.value, currentMonth.value, d);
    date.setHours(0, 0, 0, 0);
    const dateStr = formatDateToString({ year: currentYear.value, month: currentMonth.value + 1, day: d });
    const isBlocked = blockedDates.value.includes(dateStr);
    const isPast = date < todayDate;
    
    daysMap[dateStr] = {
      date: dateStr,
      availableHours: (isBlocked || isPast) ? 0 : totalHours,
      isBlocked: isBlocked || isPast
    };
  }
  
  calendarDaysData.value = daysMap;
  isLoadingCalendar.value = false;
};

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
  try {
    let dateStr = typeof date === 'string' ? date : formatDateToString(date);
    if (blockedDates.value.includes(dateStr)) {
      occupiedSlots.value = [];
      isLoadingSlots.value = false;
      return;
    }
    const query = `query($date: String!) { availableSlots(date: $date) { availableSlots occupiedSlots } }`;
    const data = await graphql<{ availableSlots: { availableSlots: string[], occupiedSlots: string[] } }>(query, { date: dateStr });
    occupiedSlots.value = (data.availableSlots?.occupiedSlots || []).map(time => ({ time, duration: 60 }));
  } catch (error) {
    occupiedSlots.value = [];
  } finally {
    isLoadingSlots.value = false;
  }
};

const canFitService = (slotTime: string, durationMinutes: number, occupied: { time: string; duration: number }[], workEnd: string): boolean => {
  const slotStart = timeToMinutes(slotTime);
  const slotEnd = slotStart + durationMinutes;
  if (slotEnd > timeToMinutes(workEnd)) return false;
  for (const occ of occupied) {
    const occStart = timeToMinutes(occ.time);
    if (slotStart < occStart + (occ.duration || 60) && slotEnd > occStart) return false;
  }
  return true;
};

const generateTimeSlots = (start: string, end: string, intervalMinutes: number): string[] => {
  const slots: string[] = [];
  let current = timeToMinutes(start);
  while (current + totalDuration.value <= timeToMinutes(end)) {
    slots.push(minutesToTime(current));
    current += intervalMinutes;
  }
  return slots;
};

const getEndTime = (slot: string): string => minutesToTime(timeToMinutes(slot) + totalDuration.value);

const timeToMinutes = (time: string): number => { const [h, m] = time.split(':').map(Number); return h * 60 + m; };
const minutesToTime = (minutes: number): string => { const h = Math.floor(minutes / 60); const m = minutes % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`; };

const formatDateToString = (date: any): string => {
  if (typeof date === 'string') return date;
  if (date?.year && date?.month && date?.day) return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  return new Date().toISOString().split('T')[0];
};

const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
};

watch(localDate, (newValue) => {
  emit('update:date', newValue);
  if (newValue) fetchSlots(newValue);
});

onMounted(async () => {
  if (!localDate.value) localDate.value = today(getLocalTimeZone());
  await fetchBlockedDates();
  loadMonthData();
  if (localDate.value) fetchSlots(localDate.value);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 8px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 216, 255, 0.2); border-radius: 8px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 216, 255, 0.5); }
</style>