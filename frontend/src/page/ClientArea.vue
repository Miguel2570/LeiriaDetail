<template>
  <div class="min-h-screen bg-[#020204] text-white pt-28 pb-20 relative overflow-hidden">
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2563EB]/5 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00D8FF]/5 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="max-w-6xl mx-auto px-4 relative z-10">
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/5 pb-8">
        <div>
          <h2 class="text-[#00D8FF] font-black tracking-[0.4em] uppercase text-[10px] mb-2 italic">Área Privada</h2>
          <h1 class="text-4xl font-black italic tracking-tighter uppercase text-white">
            Olá, <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">{{ customerName }}</span>
          </h1>
          <p class="text-gray-400 text-sm mt-1">Gere os teus agendamentos e o histórico do teu veículo.</p>
        </div>
        
        <router-link to="/agenda" class="h-12 px-6 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white text-xs font-black uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all hover:scale-[1.02] shadow-lg">
          <CalendarPlus class="w-4 h-4" /> Nova Marcação
        </router-link>
      </div>

      <div v-if="isLoading" class="flex justify-center items-center min-h-[300px]">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D8FF]"></div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div class="lg:col-span-8 space-y-6">
          <h3 class="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock class="w-5 h-5 text-[#00D8FF]" /> As Minhas Marcações
          </h3>

          <div v-if="bookings.length === 0" class="p-12 border border-white/5 bg-white/[0.01] rounded-2xl text-center">
            <Calendar class="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h4 class="text-white font-bold mb-1">Ainda não tens agendamentos</h4>
            <p class="text-sm text-gray-400 mb-6">Trata do visual e proteção da tua viatura hoje mesmo.</p>
            <router-link to="/agenda" class="px-5 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-white/10 transition-all inline-block">
              Agendar Primeiro Serviço
            </router-link>
          </div>

          <div 
            v-for="b in bookings" 
            :key="b.id"
            class="p-6 border border-white/10 bg-[#050508] rounded-2xl relative overflow-hidden transition-all hover:border-white/20 group"
          >
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4 mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
                  <Sparkles class="w-5 h-5 text-[#00D8FF]" />
                </div>
                <div>
                  <h4 class="text-base font-bold text-white tracking-tight group-hover:text-[#00D8FF] transition-colors">
                    {{ b.service_name }}
                  </h4>
                  <p class="text-xs text-gray-400 uppercase font-mono tracking-wider mt-0.5">
                    🚗 {{ b.vehicle_name }} <span class="text-gray-600">•</span> {{ b.vehicle_plate }}
                  </p>
                </div>
              </div>

              <span :class="[
                'text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border',
                b.status === 'PENDENTE' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                b.status === 'APROVADO' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
                'bg-red-500/10 border-red-500/30 text-red-500'
              ]">
                ● {{ b.status }}
              </span>
            </div>

            <div class="flex flex-wrap justify-between items-center text-sm gap-4">
              <div class="flex gap-6 text-gray-400 font-medium">
                <span class="flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Calendar class="w-4 h-4 text-gray-500" /> {{ formatDate(b.booking_date) }}
                </span>
                <span class="flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Clock class="w-4 h-4 text-gray-500" /> {{ b.booking_time }}
                </span>
              </div>
              <div class="text-lg font-black italic text-[#00D8FF]">
                {{ b.service_price }}€
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-4 space-y-6">
          <h3 class="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck class="w-5 h-5 text-[#00D8FF]" /> Estatísticas LeiriaDetail
          </h3>
          
          <div class="p-6 border border-white/5 bg-white/[0.01] rounded-2xl space-y-4">
            <div class="border-b border-white/5 pb-4">
              <p class="text-xs text-gray-400 uppercase tracking-widest font-bold">Total de Visitas</p>
              <h4 class="text-3xl font-black italic text-white mt-1">{{ bookings.length }}</h4>
            </div>
            
            <div>
              <p class="text-xs text-gray-400 uppercase tracking-widest font-bold">Nível de Membro</p>
              <h4 class="text-sm font-bold text-[#00D8FF] uppercase tracking-wider mt-2 flex items-center gap-1.5">
                💎 Membro {{ bookings.length >= 5 ? 'Elite Detailer' : 'Regular' }}
              </h4>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Calendar, Clock, Sparkles, CalendarPlus, ShieldCheck } from 'lucide-vue-next';
import { graphql } from '@/services/graphql';
import { Cache } from '@/CacheManagement/cachemanager';

interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  vehicle_name: string;
  vehicle_plate: string;
  service_name: string;
  service_price: number;
}

const bookings = ref<Booking[]>([]);
const isLoading = ref(true);
const customerName = ref(Cache.UserName.value || 'Cliente');

const loadCustomerDashboard = async () => {
  const userId = Cache.UserId.value;
  if (!userId) {
    isLoading.value = false;
    return;
  }

  try {
    const query = `
      query GetDashboardData($userId: Int!) {
        customerBookings(user_id: $userId) {
          id
          booking_date
          booking_time
          status
          vehicle_name
          vehicle_plate
          service_name
          service_price
        }
      }
    `;

    const response = await graphql<{ customerBookings: Booking[] }>(query, { userId: parseInt(userId, 10) });
    bookings.value = response.customerBookings;
  } catch (error) {
    console.error("Erro ao popular área de cliente:", error);
  } finally {
    isLoading.value = false;
  }
};

// Formata datas do tipo 2026-05-24 para 24 Mai 2026
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' });
};

onMounted(() => {
  loadCustomerDashboard();
});
</script>