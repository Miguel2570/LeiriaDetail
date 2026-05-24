<template>
  <div class="min-h-screen py-24 px-4 bg-[#050505] relative overflow-hidden">
    
    <div class="absolute top-0 right-0 w-[800px] h-[600px] bg-[#2563EB]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

    <div class="container mx-auto max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      
      <div class="lg:col-span-4 lg:sticky lg:top-32 text-center lg:text-left">
        <h2 class="text-[#00D8FF] font-black tracking-[0.4em] uppercase text-[10px] mb-4 italic">Portal de Clientes</h2>
        <h1 class="text-5xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-none mb-6">
          FAZER <br><span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">MARCAÇÃO</span>
        </h1>
        <p class="text-gray-400 text-sm leading-relaxed mb-10 max-w-sm mx-auto lg:mx-0">
          {{ step === 1 ? 'Selecione a viatura para ver os serviços disponíveis.' : 
             step === 2 ? 'Confirme os seus dados pessoais.' : 
             step === 3 ? 'Escolha o tratamento ideal para o seu veículo.' : 
             step === 4 ? 'Selecione a melhor data e hora para nos visitar.' : 
             'Confirme os detalhes e finalize o agendamento.' }}
        </p>
      </div>

      <div class="lg:col-span-8 w-full max-w-3xl mx-auto">
        
        <ProgressBar :steps="steps" :currentStep="step" />

        <div class="mt-12 min-h-[400px]">
          <transition name="page" mode="out-in">
            <div :key="step" class="w-full">
              
              <VehicleSelection 
                v-if="step === 1" 
                :selectedVehicle="bookingData.vehicle" 
                @update:vehicle="(val: any) => bookingData.vehicle = val" 
              />
              
              <CustomerDetails 
                v-else-if="step === 2"
                :modelValue="bookingData.customer"
                @update:modelValue="(val: any) => bookingData.customer = val"
              />

              <ServiceSelection 
                v-else-if="step === 3" 
                :selectedServiceId="bookingData.service?.id || null" 
                :selectedVehicle="bookingData.vehicle"
                @update:service="(val: any) => bookingData.service = val" 
              />
              
              <DateTimeSelection 
                v-else-if="step === 4" 
                :selectedDate="bookingData.date" 
                :selectedTime="bookingData.time" 
                @update:date="(val: any) => bookingData.date = val" 
                @update:time="(val: string) => bookingData.time = val" 
              />
              
              <Confirmation 
                v-else-if="step === 5" 
                :bookingData="bookingData" 
              />
            </div>
          </transition>
        </div>

        <div class="mt-12 flex justify-between items-center border-t border-white/5 pt-8">
          
          <button 
            v-if="step > 1" 
            @click="step--" 
            class="h-14 px-8 rounded-xl border border-white/10 bg-white/5 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
          >
            <ArrowLeft class="w-4 h-4" /> Voltar Atrás
          </button>
          <div v-else></div> 

          <button 
            v-if="step < 5" 
            @click="step++" 
            :disabled="!canGoNext" 
            class="h-14 px-8 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
          >
            Próximo Passo <ArrowRight class="w-4 h-4" />
          </button>

          <button 
            v-if="step === 5" 
            @click="submitBooking" 
            :disabled="isSubmitting"
            class="h-14 px-8 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_25px_rgba(37,99,235,0.4)]"
          >
            <Check v-if="!isSubmitting" class="w-4 h-4" /> 
            {{ isSubmitting ? 'A processar...' : 'Finalizar Reserva' }}
          </button>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, ArrowRight, Check } from 'lucide-vue-next';
import { graphql } from '@/services/graphql';
import { Cache } from '@/CacheManagement/cachemanager';

// Componentes dos passos
import CustomerDetails from '@/components/booking/CustomerDetails.vue'; 
import ProgressBar from '@/components/booking/ProgressBar.vue';
import VehicleSelection from '@/components/booking/VehicleSelection.vue';
import ServiceSelection from '@/components/booking/ServiceSelection.vue';
import DateTimeSelection from '@/components/booking/DateTimeSelection.vue';
import Confirmation from '@/components/booking/Confirmation.vue';

const router = useRouter();
const step = ref(1);
const isSubmitting = ref(false); // Estado para evitar duplos cliques no botão final

const steps = [
  { number: 1, label: 'Viatura' },
  { number: 2, label: 'Dados' },     
  { number: 3, label: 'Serviço' },
  { number: 4, label: 'Agenda' },
  { number: 5, label: 'Confirmação' }
];

const bookingData = ref({
  vehicle: null as any,
  customer: null as any, 
  service: null as any,
  date: null as any,
  time: ''
});

const canGoNext = computed(() => {
  if (step.value === 1) return bookingData.value.vehicle !== null;
  if (step.value === 2) return bookingData.value.customer !== null; 
  if (step.value === 3) return bookingData.value.service !== null;
  if (step.value === 4) return bookingData.value.date !== null && bookingData.value.time !== '';
  return true;
});

const submitBooking = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    // 1. Verifica se o cliente tem sessão iniciada
    const userIdStr = Cache.UserId.value;
    if (!userIdStr) {
      alert("Sessão expirada. Por favor inicie sessão para concluir a reserva.");
      router.push('/login');
      return;
    }

    const userId = parseInt(userIdStr, 10);
    
    // Converte os IDs para número para o GraphQL aceitar
    // Se ainda não tens a viatura gravada na BD, podes meter um fallback como 1
    const vehicleId = bookingData.value.vehicle?.id ? parseInt(bookingData.value.vehicle.id, 10) : 1; 
    const serviceId = parseInt(bookingData.value.service.id, 10);

    // 2. A Mutation GraphQL
    const mutation = `
      mutation CreateNewBooking($input: BookingInput!) {
        createBooking(input: $input) {
          id
          status
          booking_date
        }
      }
    `;

    const variables = {
      input: {
        user_id: userId,
        vehicle_id: vehicleId,
        service_id: serviceId,
        booking_date: bookingData.value.date,
        booking_time: bookingData.value.time
      }
    };

    // 3. Executar o pedido
    await graphql(mutation, variables);
    
    alert("Agendamento concluído com sucesso!");
    
    // Volta para o início ou para uma Área de Cliente
    router.push('/'); 

  } catch (error) {
    console.error("Erro ao gravar reserva:", error);
    // Nota: O teu graphql.ts já faz o redirecionamento automático para a página de erro, se necessário.
  } finally {
    isSubmitting.value = false;
  }
};
</script>