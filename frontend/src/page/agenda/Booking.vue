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
            <div class="w-full">
              
              <VehicleSelection 
                v-if="step === 1" 
                :selectedVehicle="bookingData.vehicle" 
                @update:vehicle="(val: any) => bookingData.vehicle = val"
                @saveBookingState="saveBookingState"
              />
              
              <CustomerDetails 
                v-else-if="step === 2"
                :modelValue="bookingData.customer"
                :vehicle="bookingData.vehicle"
                @update:modelValue="(val: any) => bookingData.customer = val"
              />

              <div v-else-if="step === 3" class="space-y-8">
                <ServiceSelection 
                  :selectedServiceId="bookingData.service?.id || null" 
                  :selectedVehicle="bookingData.vehicle"
                  @update:service="(val: any) => bookingData.service = val" 
                />

                <div v-if="loyaltyBalance.availableCredits > 0 && redeemableRewards.length > 0 && !redeemedSuccess" 
                  class="bg-[#050508] border border-[#10B981]/20 rounded-2xl p-6">
                  
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      🪙 Resgatar LeiriaPoints
                    </h3>
                    <span class="text-xs bg-[#10B981]/20 text-[#10B981] px-3 py-1 rounded-full font-bold">
                      {{ loyaltyBalance.availableCredits }} disponíveis
                    </span>
                  </div>

                  <p class="text-xs text-gray-400 mb-4">Troca os teus pontos por um serviço gratuito</p>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div 
                      v-for="reward in redeemableRewards" 
                      :key="reward.id"
                      :class="[
                        'rounded-xl p-4 border-2 transition-all cursor-pointer',
                        selectedReward?.id === reward.id 
                          ? 'border-[#10B981] bg-[#10B981]/10' 
                          : 'border-white/10 bg-white/[0.02] hover:border-[#10B981]/30'
                      ]"
                      @click="selectReward(reward)"
                    >
                      <div class="flex items-start justify-between mb-2">
                        <div>
                          <p class="text-white font-bold text-sm">{{ reward.name }}</p>
                          <p class="text-gray-400 text-xs mt-1">{{ reward.description }}</p>
                        </div>
                        <div class="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                          <span class="text-sm">🎁</span>
                        </div>
                      </div>
                      <div class="flex items-center justify-between pt-3 border-t border-white/5">
                        <span class="text-[#10B981] font-bold text-sm">{{ reward.requiredCredits }} 🪙</span>
                        <span class="text-[10px] text-gray-500">Grátis</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    v-if="selectedReward"
                    @click="handleRedeemForBooking"
                    :disabled="isRedeeming"
                    class="w-full mt-4 py-3 bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span v-if="!isRedeeming">🎁 Resgatar {{ selectedReward.name }} - Grátis!</span>
                    <span v-else>A resgatar...</span>
                  </button>
                </div>

                <div v-if="redeemedSuccess" class="bg-[#10B981]/10 border border-[#10B981]/30 rounded-2xl p-6 text-center">
                  <span class="text-3xl">🎉</span>
                  <p class="text-[#10B981] font-bold text-lg mt-2">Recompensa Resgatada!</p>
                  <p class="text-gray-400 text-sm mt-1">{{ bookingData.redeemedReward?.name }} - Grátis!</p>
                  <p class="text-gray-500 text-xs mt-2">Continua para escolher a data e hora.</p>
                </div>
              </div>
              
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft, ArrowRight, Check } from 'lucide-vue-next';
import { graphql } from '@/graphql';
import { Cache } from '@/services/cachemanager';

import CustomerDetails from '@/components/booking/CustomerDetails.vue'; 
import ProgressBar from '@/components/booking/ProgressBar.vue';
import VehicleSelection from '@/components/booking/VehicleSelection.vue';
import ServiceSelection from '@/components/booking/ServiceSelection.vue';
import DateTimeSelection from '@/components/booking/DateTimeSelection.vue';
import Confirmation from '@/components/booking/Confirmation.vue';

const router = useRouter();
const step = ref(1);
const isSubmitting = ref(false);

const steps = [
  { number: 1, label: 'Viatura' },
  { number: 2, label: 'Dados' },     
  { number: 3, label: 'Serviço' },  
  { number: 4, label: 'Agenda' },
  { number: 5, label: 'Confirmação' }
];

const bookingData = ref({
  vehicle: null as any,
  customer: { firstName: '', lastName: '', email: '', phone: '', vehicle: '', licensePlate: '' },
  service: null as any,
  date: null as any,
  time: '',
  isRedeemed: false,
  redeemedReward: null as any
});

const loyaltyBalance = ref({ availableCredits: 0, totalEarned: 0 });
const redeemableRewards = ref<any[]>([]);
const selectedReward = ref<any | null>(null);
const isRedeeming = ref(false);
const redeemedSuccess = ref(false);

const loadLoyalty = async () => {
  try {
    const query = `query { loyaltyDashboard { balance { totalEarned availableCredits } rewards { id name description requiredCredits isActive } } }`;
    const data = await graphql<{ loyaltyDashboard: any }>(query);
    if (data.loyaltyDashboard?.balance) {
      loyaltyBalance.value = { availableCredits: data.loyaltyDashboard.balance.availableCredits, totalEarned: data.loyaltyDashboard.balance.totalEarned };
    }
    if (data.loyaltyDashboard?.rewards) {
      redeemableRewards.value = data.loyaltyDashboard.rewards.filter((r: any) => r.requiredCredits <= loyaltyBalance.value.availableCredits);
    }
  } catch (error) { console.error('Erro ao carregar fidelidade:', error); }
};

const selectReward = (reward: any) => { selectedReward.value = selectedReward.value?.id === reward.id ? null : reward; };

const handleRedeemForBooking = async () => {
  if (!selectedReward.value) return;
  isRedeeming.value = true;
  try {
    const data = await graphql<{ redeemLoyaltyReward: any }>(`mutation { redeemLoyaltyReward(rewardId: ${parseInt(selectedReward.value.id)}) { success redemptionCode } }`);
    if (data.redeemLoyaltyReward?.success) {
      redeemedSuccess.value = true;
      bookingData.value.isRedeemed = true;
      bookingData.value.redeemedReward = selectedReward.value;
      selectedReward.value = null;
      await loadLoyalty();
    }
  } catch (error) { console.error('Erro ao resgatar:', error); }
  finally { isRedeeming.value = false; }
};

const canGoNext = computed(() => {
  if (step.value === 1) return bookingData.value.vehicle !== null;
  if (step.value === 2) return bookingData.value.customer !== null; 
  if (step.value === 3) return bookingData.value.service !== null || redeemedSuccess.value;
  if (step.value === 4) return bookingData.value.date !== null && bookingData.value.time !== '';
  return true;
});

const submitBooking = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    const userIdStr = Cache.UserId.value;
    if (!userIdStr) { alert("Sessão expirada."); router.push('/login'); return; }

    // Se for recompensa resgatada, vai direto para a área de cliente
    if (bookingData.value.isRedeemed) { 
      router.push('/client-area'); 
      return; 
    }

    const basePrice = bookingData.value.service?.price || 120;
    const total = basePrice; // Se tiveres IVA, calcula aqui

    // ✅ Criar pending booking na API
    const createPendingMutation = `
      mutation CreatePendingBooking($input: PendingBookingInput!) {
        createPendingBooking(input: $input) { 
          id 
          expiresAt 
          hasError 
          error { message }
        }
      }
    `;
    
    const pendingData = await graphql<{ createPendingBooking: any }>(createPendingMutation, {
      input: {
        userId: parseInt(userIdStr, 10),
        vehicleId: parseInt(bookingData.value.vehicle.id, 10),
        serviceId: parseInt(bookingData.value.service.id, 10),
        bookingDate: bookingData.value.date?.toISOString?.() || bookingData.value.date?.toString() || '',
        bookingTime: bookingData.value.time,
        serviceName: bookingData.value.service?.name || '',
        vehicleName: `${bookingData.value.vehicle?.brand || ''} ${bookingData.value.vehicle?.model || ''}`,
        vehiclePlate: bookingData.value.vehicle?.licensePlate || bookingData.value.vehicle?.plate || '',
        price: total,
        paymentMethod: 'mbway', // default, será alterado no PaymentPage
        expiresInMinutes: 30 // ✅ 30 minutos para pagar
      }
    });

    if (pendingData.createPendingBooking?.hasError) {
      alert(pendingData.createPendingBooking.error?.message || "Erro ao criar marcação.");
      return;
    }

    const bookingId = pendingData.createPendingBooking.id;
    const expiresAt = pendingData.createPendingBooking.expiresAt;

    // ✅ Guardar no localStorage para fallback
    const pendingBooking = {
      bookingId: bookingId,
      serviceName: bookingData.value.service?.name || '',
      vehicleName: `${bookingData.value.vehicle?.brand || ''} ${bookingData.value.vehicle?.model || ''}`,
      vehiclePlate: bookingData.value.vehicle?.licensePlate || bookingData.value.vehicle?.plate || '',
      date: bookingData.value.date?.toString() || '',
      time: bookingData.value.time,
      price: total,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt
    };
    
    localStorage.setItem('pending_booking', JSON.stringify(pendingBooking));
    localStorage.setItem('pending_booking_id', bookingId);
    localStorage.setItem('last_service', bookingData.value.service?.name || '');
    localStorage.setItem('last_vehicle', pendingBooking.vehicleName);
    localStorage.setItem('last_plate', pendingBooking.vehiclePlate);
    localStorage.setItem('last_date', pendingBooking.date);
    localStorage.setItem('last_time', bookingData.value.time);
    localStorage.setItem('last_price', total.toFixed(2));

    router.push(`/pagamento/${bookingId}`);
  } catch (error) { 
    console.error("Erro ao gravar reserva:", error); 
    alert("Erro ao processar. Tente novamente.");
  } finally { 
    isSubmitting.value = false; 
  }
};

const saveBookingState = () => {
  const state = {
    step: step.value,
    vehicle: bookingData.value.vehicle,
    customer: bookingData.value.customer,
    service: bookingData.value.service,
    date: bookingData.value.date,
    time: bookingData.value.time,
    isRedeemed: bookingData.value.isRedeemed,
    redeemedReward: bookingData.value.redeemedReward
  };
  localStorage.setItem('booking_state', JSON.stringify(state));
};

const restoreBookingState = () => {
  const saved = localStorage.getItem('booking_state');
  if (saved) {
    try {
      const state = JSON.parse(saved);
      bookingData.value = {
        vehicle: state.vehicle,
        customer: state.customer || { firstName: '', lastName: '', email: '', phone: '', vehicle: '', licensePlate: '' },
        service: state.service,
        date: state.date,
        time: state.time,
        isRedeemed: state.isRedeemed || false,
        redeemedReward: state.redeemedReward || null
      };
      step.value = state.step || 1;
      localStorage.removeItem('booking_state');
      return true;
    } catch (e) {
      console.error('Erro ao restaurar estado do booking:', e);
    }
  }
  return false;
};

onMounted(() => {
  loadLoyalty();
  
  // Tentar restaurar estado do booking
  const wasRestored = restoreBookingState();
  if (wasRestored) {
    // Pequeno delay para garantir que os componentes estão prontos
    setTimeout(() => {
      // Forçar atualização se necessário
      console.log('Estado do booking restaurado');
    }, 100);
  }
});
</script>