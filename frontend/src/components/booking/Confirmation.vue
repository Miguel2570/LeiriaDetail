<script setup lang="ts">
import { computed } from 'vue';
import { Car, Sparkles, Calendar, CreditCard, ShieldCheck } from 'lucide-vue-next';

// Recebemos os dados preenchidos nos passos anteriores vindos do pai (Booking.vue)
const props = defineProps<{
  bookingData: {
    vehicle: { brand?: string; model?: string; plate: string } | null;
    service: { id: string; name: string; price?: number; description?: string } | null;
    date: any;
    time: string;
  }
}>();

// Formatação reativa da data do calendário Radix UI (@internationalized/date)
const formattedDate = computed(() => {
  if (!props.bookingData.date) return 'Não selecionada';
  const d = props.bookingData.date;
  // Extrai o dia/mês/ano de forma segura
  if (d.day && d.month && d.year) {
    return `${String(d.day).padStart(2, '0')}/${String(d.month).padStart(2, '0')}/${d.year}`;
  }
  return d.toString();
});

// Cálculos automáticos de preços (Simulação baseada no preço do serviço)
const basePrice = computed(() => {
  return props.bookingData.service?.price || 120.00; // Valor exemplo caso o teu mock não tenha preço fixo ainda
});

const iva = computed(() => {
  return Number((basePrice.value * 0.23).toFixed(2));
});

const total = computed(() => {
  return Number((basePrice.value + iva.value).toFixed(2));
});
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    
    <div class="border-b border-white/5 pb-4">
      <h2 class="text-xl font-black text-white uppercase tracking-widest italic flex items-center gap-3">
        <ShieldCheck class="w-6 h-6 text-[#00D8FF]" />
        Resumo do Agendamento
      </h2>
      <p class="text-gray-400 text-xs mt-1">Por favor, confirme todos os detalhes antes de finalizar a sua reserva.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div class="bg-white/[0.01] border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-white/10 transition-all">
        <div>
          <div class="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider font-bold mb-3">
            <Car class="w-4 h-4 text-[#2563EB]" /> Viatura
          </div>
          <p class="text-white font-bold text-lg">
            {{ bookingData.vehicle?.brand || 'Porsche' }} {{ bookingData.vehicle?.model || '911 Carrera' }}
          </p>
          <p class="text-xs text-gray-400 mt-1">
            Matrícula: <span class="text-[#00D8FF] font-mono font-bold">{{ bookingData.vehicle?.plate || 'AA-00-BB' }}</span>
          </p>
        </div>
      </div>

      <div class="bg-white/[0.01] border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-white/10 transition-all">
        <div>
          <div class="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider font-bold mb-3">
            <Sparkles class="w-4 h-4 text-[#00D8FF]" /> Tratamento
          </div>
          <p class="text-white font-bold text-lg">
            {{ bookingData.service?.name || 'Detalhamento Premium' }}
          </p>
          <p class="text-xs text-gray-400 mt-1 line-clamp-2">
            Correção de pintura e proteção cerâmica duradoura.
          </p>
        </div>
      </div>

      <div class="bg-white/[0.01] border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-white/10 transition-all">
        <div>
          <div class="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider font-bold mb-3">
            <Calendar class="w-4 h-4 text-[#2563EB]" /> Data e Hora
          </div>
          <p class="text-white font-bold text-lg">
            {{ formattedDate }}
          </p>
          <p class="text-xs text-gray-400 mt-1">
            Horário: <span class="text-white font-bold">{{ bookingData.time || '09:30' }}</span>
          </p>
        </div>
      </div>

    </div>

    <div class="bg-white/[0.01] border border-white/5 rounded-3xl p-6 max-w-md ml-auto">
      <div class="flex items-center gap-2 text-white text-sm font-black uppercase tracking-wider italic border-b border-white/5 pb-3 mb-4">
        <CreditCard class="w-4 h-4 text-[#00D8FF]" /> Detalhes do Pagamento
      </div>
      
      <div class="space-y-3 text-sm">
        <div class="flex justify-between text-gray-400">
          <span>Preço Base</span>
          <span class="text-white font-medium">{{ basePrice.toFixed(2) }}€</span>
        </div>
        <div class="flex justify-between text-gray-400">
          <span>IVA (23%)</span>
          <span class="text-white font-medium">{{ iva.toFixed(2) }}€</span>
        </div>
        
        <div class="border-t border-white/5 pt-3 mt-2 flex justify-between items-center">
          <span class="text-white font-bold uppercase text-xs tracking-wider">Total Final</span>
          <span class="text-2xl font-black text-leiria-gradient">
            {{ total.toFixed(2) }}€
          </span>
        </div>
      </div>
    </div>

    <div class="flex items-start gap-3 bg-white/[0.01] border border-white/5 rounded-2xl p-4 mt-6">
      <input 
        type="checkbox" 
        id="terms" 
        class="mt-1 h-4 w-4 rounded border-white/10 bg-white/5 text-[#2563EB] focus:ring-[#2563EB] focus:ring-offset-0 accent-[#2563EB]"
        required
      />
      <label for="terms" class="text-xs text-gray-400 leading-relaxed cursor-pointer select-none">
        Declaro que li e aceito os 
        <router-link to="/termos" class="text-[#00D8FF] hover:underline font-bold">Termos e Condições</router-link> 
        e a 
        <router-link to="/privacidade" class="text-[#00D8FF] hover:underline font-bold">Política de Privacidade</router-link> 
        do LeiriaDetail.
      </label>
    </div>

  </div>
</template>