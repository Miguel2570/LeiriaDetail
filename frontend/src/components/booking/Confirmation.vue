<!-- src/components/booking/Confirmation.vue -->
<template>
  <div class="space-y-8 animate-fade-in">
    
    <div class="border-b border-white/5 pb-4">
      <h2 class="text-xl font-black text-white uppercase tracking-widest italic flex items-center gap-3">
        <ShieldCheck class="w-6 h-6 text-[#00D8FF]" />
        Resumo do Agendamento
      </h2>
      <p class="text-gray-400 text-xs mt-1">Por favor, confirme todos os detalhes antes de finalizar a sua reserva.</p>
    </div>

    <!-- Grid: Pagamento (esquerda) + Viatura/Serviço/Data (direita) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Detalhes do Pagamento - Esquerda -->
      <div class="bg-white/[0.01] border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 text-white text-sm font-black uppercase tracking-wider italic border-b border-white/5 pb-3 mb-4">
            <CreditCard class="w-4 h-4 text-[#00D8FF]" /> Detalhes do Pagamento
          </div>
          <div class="space-y-4 text-sm">
            <div class="flex justify-between text-gray-400">
              <span>Preço Base (s/ IVA)</span>
              <span class="text-white font-medium">{{ (basePrice / 1.23).toFixed(2) }}€</span>
            </div>
            <div class="flex justify-between text-gray-400">
              <span>IVA (23%)</span>
              <span class="text-white font-medium">{{ iva }}€</span>
            </div>
            <div class="border-t border-white/5 pt-4 mt-2 flex justify-between items-center">
              <span class="text-white font-bold uppercase text-xs tracking-wider">Total Final (c/ IVA)</span>
              <span class="text-2xl font-black bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">
                {{ total.toFixed(2) }}€
              </span>
            </div>
            <p class="text-[9px] text-gray-500">Preços em EUR. IVA incluído à taxa legal em vigor (23%).</p>
          </div>
        </div>
        <div class="mt-6 pt-4 border-t border-white/5">
          <p class="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Pagamento seguro via</p>
          <div class="flex gap-2">
            <span class="text-[10px] bg-[#E6007E]/10 text-[#E6007E] px-2 py-1 rounded-lg font-bold">MB Way</span>
            <span class="text-[10px] bg-[#FF6600]/10 text-[#FF6600] px-2 py-1 rounded-lg font-bold">Multibanco</span>
          </div>
        </div>
      </div>

      <!-- Coluna direita: Viatura + Serviço + Data -->
      <div class="space-y-4">
        <div class="bg-white/[0.01] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
          <div class="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider font-bold mb-3">
            <Car class="w-4 h-4 text-[#2563EB]" /> Viatura
          </div>
          <p class="text-white font-bold text-lg">
            {{ bookingData.vehicle?.brand || 'N/D' }} {{ bookingData.vehicle?.model || '' }}
          </p>
          <p class="text-xs text-gray-400 mt-1">
            Matrícula: <span class="text-[#00D8FF] font-mono font-bold">{{ bookingData.vehicle?.plate || 'N/D' }}</span>
          </p>
        </div>

        <div class="bg-white/[0.01] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
          <div class="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider font-bold mb-3">
            <Sparkles class="w-4 h-4 text-[#00D8FF]" /> Tratamento
          </div>
          <p class="text-white font-bold text-lg">
            {{ bookingData.service?.name || 'N/D' }}
          </p>
          <p class="text-xs text-gray-400 mt-1 line-clamp-2">
            {{ bookingData.service?.description || 'Serviço de detalhe automóvel.' }}
          </p>
        </div>

        <div class="bg-white/[0.01] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
          <div class="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider font-bold mb-3">
            <Calendar class="w-4 h-4 text-[#2563EB]" /> Data e Hora
          </div>
          <p class="text-white font-bold text-lg">{{ formattedDate }}</p>
          <p class="text-xs text-gray-400 mt-1">
            Horário: <span class="text-white font-bold">{{ bookingData.time || 'N/D' }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Lembretes -->
    <div class="bg-white/[0.01] border border-white/5 rounded-2xl p-5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#00D8FF]/10 flex items-center justify-center">
            <Bell class="w-5 h-5 text-[#00D8FF]" />
          </div>
          <div>
            <p class="text-white font-bold text-sm">Lembretes Automáticos</p>
            <p class="text-gray-400 text-xs">Receba notificações por email e SMS antes do serviço</p>
          </div>
        </div>
        <button 
          @click="remindersEnabled = !remindersEnabled; showReminders = remindersEnabled"
          :class="['relative w-12 h-6 rounded-full transition-colors duration-300', remindersEnabled ? 'bg-[#00D8FF]' : 'bg-white/10']"
        >
          <div :class="['absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300', remindersEnabled ? 'translate-x-6' : 'translate-x-0.5']" />
        </button>
      </div>

      <div v-if="remindersEnabled" class="mt-4">
        <button @click="showReminders = !showReminders" class="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors mb-3">
          <ChevronDown :class="['w-3 h-3 transition-transform', showReminders ? 'rotate-180' : '']" />
          {{ showReminders ? 'Ocultar opções' : 'Personalizar lembretes' }}
        </button>
        
        <div v-if="showReminders" class="space-y-2">
          <div 
            v-for="opt in reminderOptions" :key="opt.key"
            @click="toggleReminder(opt.key)"
            :class="['flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
              selectedReminders.includes(opt.key) 
                ? 'bg-white/[0.05] border-[#00D8FF]/30' 
                : 'bg-transparent border-white/5 opacity-60 hover:opacity-80']"
          >
            <div :class="['w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all',
              selectedReminders.includes(opt.key) ? 'bg-[#00D8FF] border-[#00D8FF]' : 'border-white/20']"
            >
              <svg v-if="selectedReminders.includes(opt.key)" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
            </div>
            <div class="flex-1">
              <p class="text-white text-xs font-bold" :style="{ color: selectedReminders.includes(opt.key) ? opt.color : undefined }">{{ opt.label }}</p>
              <p class="text-gray-400 text-[10px]">{{ opt.desc }}</p>
            </div>
            <span v-if="opt.forced" class="text-[9px] text-[#00D8FF] bg-[#00D8FF]/10 px-1.5 py-0.5 rounded-full">Obrigatório</span>
            <span v-else :class="['text-[9px] px-1.5 py-0.5 rounded-full',
              selectedReminders.includes(opt.key) ? 'text-green-400 bg-green-400/10' : 'text-gray-500 bg-white/5']"
            >{{ selectedReminders.includes(opt.key) ? 'Ativo' : 'Inativo' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Termos -->
    <div class="flex items-start gap-3 bg-white/[0.01] border border-white/5 rounded-2xl p-4">
      <input type="checkbox" id="terms" class="mt-1 h-4 w-4 rounded border-white/10 bg-white/5 text-[#2563EB] accent-[#2563EB]" required />
      <label for="terms" class="text-xs text-gray-400 leading-relaxed cursor-pointer select-none">
        Declaro que li e aceito os 
        <router-link to="/termos" class="text-[#00D8FF] hover:underline font-bold">Termos e Condições</router-link> 
        e a 
        <router-link to="/privacidade" class="text-[#00D8FF] hover:underline font-bold">Política de Privacidade</router-link> 
        da LeiriaDetail, Lda.
      </label>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Car, Sparkles, Calendar, CreditCard, ShieldCheck, Bell, ChevronDown } from 'lucide-vue-next';

const props = defineProps<{
  bookingData: {
    vehicle: { brand?: string; model?: string; plate: string } | null;
    service: { id: string; name: string; price?: number; description?: string } | null;
    date: any;
    time: string;
  }
}>();

const remindersEnabled = ref(false);
const showReminders = ref(false);
const selectedReminders = ref<string[]>(['24h']);

const toggleReminder = (key: string) => {
  if (key === '24h') return;
  const idx = selectedReminders.value.indexOf(key);
  if (idx >= 0) {
    selectedReminders.value.splice(idx, 1);
  } else {
    selectedReminders.value.push(key);
  }
};

const reminderOptions = [
  { key: 'immediate', label: 'Confirmação Imediata', desc: 'Email + SMS com resumo da marcação assim que o pagamento for confirmado.', color: '#10B981', forced: false },
  { key: '24h', label: '24 Horas Antes', desc: 'Lembrete automático com data, hora e morada do serviço.', color: '#00D8FF', forced: true },
  { key: '6h', label: '6 Horas Antes', desc: 'Aviso de proximidade para preparar o veículo e documentos.', color: '#F59E0B', forced: false },
  { key: '3h', label: '3 Horas Antes', desc: 'Último aviso antes do serviço.', color: '#8B5CF6', forced: false },
  { key: '1h', label: '1 Hora Antes', desc: 'Lembrete final. Hora de sair de casa.', color: '#EC4899', forced: false },
];

const formattedDate = computed(() => {
  if (!props.bookingData.date) return 'Não selecionada';
  const d = props.bookingData.date;
  if (d.day && d.month && d.year) {
    return `${String(d.day).padStart(2, '0')}/${String(d.month).padStart(2, '0')}/${d.year}`;
  }
  return d.toString();
});

const basePrice = computed(() => props.bookingData.service?.price || 120.00);
const iva = computed(() => Number((basePrice.value * 0.23).toFixed(2)));
const total = computed(() => Number((basePrice.value + iva.value).toFixed(2)));
</script>