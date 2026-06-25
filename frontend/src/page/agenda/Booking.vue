<template>
  <div>
    <div class="min-h-screen py-24 px-4 bg-[#050505] relative overflow-hidden">
      <div class="absolute top-0 right-0 w-[800px] h-[600px] bg-[#2563EB]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

      <div class="container mx-auto max-w-7xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <div v-if="step < 6" class="lg:col-span-4 lg:sticky lg:top-32">
          <div class="text-center lg:text-left mb-6">
            <h2 class="text-[#00D8FF] font-black tracking-[0.4em] uppercase text-[10px] mb-4 italic">Portal de Clientes</h2>
            <h1 class="text-5xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-none mb-6">
              FAZER <br /><span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">MARCAÇÃO</span>
            </h1>
          </div>

          <div class="bg-[#111115] border border-[#22222A] rounded-2xl p-5">
            <h3 class="text-xs font-black text-white uppercase tracking-widest mb-4">Resumo</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">Serviço</span>
                <span class="text-white font-medium">{{ bookingData.service?.name || "—" }}</span>
              </div>
              <div v-if="bookingData.extras.length > 0" class="flex justify-between">
                <span class="text-gray-400">Extras</span>
                <span class="text-white font-medium">{{ bookingData.extras.length }} selecionados</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Viatura</span>
                <span class="text-white font-medium">{{ bookingData.vehicle ? `${bookingData.vehicle.brand} ${bookingData.vehicle.model}` : "—" }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Data</span>
                <span class="text-white font-medium">{{ formattedDate || "—" }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Hora</span>
                <span class="text-white font-medium">{{ bookingData.time || "—" }}</span>
              </div>
              <div v-if="totalPrice > 0" class="border-t border-white/5 pt-3 mt-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-400">Total</span>
                  <span class="text-xl font-black text-[#00D8FF]">{{ totalPrice }}€</span>
                </div>
              </div>
            </div>
          </div>

          <p class="text-gray-400 text-xs leading-relaxed mt-6 text-center lg:text-left">
            {{ step === 1 ? "Escolha o tratamento ideal para o seu veículo." : 
               step === 2 ? "Adicione extras ao seu serviço (opcional)." : 
               step === 3 ? "Selecione a viatura para calcular o preço." : 
               step === 4 ? "Selecione a melhor data e hora." : 
               step === 5 ? "Preencha os seus dados para finalizar." : "" }}
          </p>
        </div>

        <div :class="['w-full mx-auto', step === 6 ? 'lg:col-span-12 max-w-4xl' : 'lg:col-span-8 max-w-3xl']">
          
          <ProgressBar :steps="steps" :currentStep="step" />

          <router-link 
            to="/servicos" 
            class="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-[#00D8FF] transition-colors duration-300 mt-4 mb-2 group"
          >
            <ArrowLeft class="w-3 h-3 group-hover:-translate-x-1 transition-transform duration-300" />
            Voltar aos serviços
          </router-link>

          <div class="mt-8 min-h-[400px]">
            <transition name="page" mode="out-in">
              <div :key="step" class="w-full">
                
                <div v-if="step === 1">
                  <div class="space-y-8">
                    <ServiceSelection
                      :selectedServiceId="bookingData.service?.id || null"
                      :selectedVehicle="bookingData.vehicle"
                      @update:service="(val: any) => (bookingData.service = val)"
                    />

                    <div v-if="loyaltyBalance.availableCredits > 0 && redeemableRewards.length > 0 && !redeemedSuccess" 
                      class="bg-[#050508] border border-[#10B981]/20 rounded-2xl p-6">
                      <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">🪙 Resgatar LeiriaPoints</h3>
                        <span class="text-xs bg-[#10B981]/20 text-[#10B981] px-3 py-1 rounded-full font-bold">{{ loyaltyBalance.availableCredits }} disponíveis</span>
                      </div>
                      <p class="text-xs text-gray-400 mb-4">Troca os teus pontos por um serviço gratuito</p>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div v-for="reward in redeemableRewards" :key="reward.id"
                          :class="['rounded-xl p-4 border-2 transition-all cursor-pointer', selectedReward?.id === reward.id ? 'border-[#10B981] bg-[#10B981]/10' : 'border-white/10 bg-white/[0.02] hover:border-[#10B981]/30']"
                          @click="selectReward(reward)">
                          <div class="flex items-start justify-between mb-2">
                            <div><p class="text-white font-bold text-sm">{{ reward.name }}</p><p class="text-gray-400 text-xs mt-1">{{ reward.description }}</p></div>
                            <div class="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center flex-shrink-0"><span class="text-sm">🎁</span></div>
                          </div>
                          <div class="flex items-center justify-between pt-3 border-t border-white/5">
                            <span class="text-[#10B981] font-bold text-sm">{{ reward.requiredCredits }} 🪙</span>
                            <span class="text-[10px] text-gray-500">Grátis</span>
                          </div>
                        </div>
                      </div>
                      <button v-if="selectedReward" @click="handleRedeemForBooking" :disabled="isRedeeming"
                        class="w-full mt-4 py-3 bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
                        <span v-if="!isRedeeming">🎁 Resgatar {{ selectedReward.name }} - Grátis!</span>
                        <span v-else>A resgatar...</span>
                      </button>
                    </div>

                    <div v-if="redeemedSuccess" class="bg-[#10B981]/10 border border-[#10B981]/30 rounded-2xl p-6 text-center">
                      <span class="text-3xl">🎉</span>
                      <p class="text-[#10B981] font-bold text-lg mt-2">Recompensa Resgatada!</p>
                      <p class="text-gray-400 text-sm mt-1">{{ bookingData.redeemedReward?.name }} - Grátis!</p>
                    </div>
                  </div>
                </div>

                <div v-else-if="step === 2">
                  <ExtraServices
                    :selectedVehicle="bookingData.vehicle"
                    :selectedExtras="bookingData.extras"
                    :serviceId="bookingData.service?.id"
                    @skip="step++"
                    @update:extras="(val: any[]) => (bookingData.extras = val)"
                  />
                </div>

                <div v-else-if="step === 3">
                  <VehicleSelection
                    :selectedVehicle="bookingData.vehicle"
                    @update:vehicle="(val: any) => (bookingData.vehicle = val)"
                    @saveBookingState="saveBookingState"
                  />
                </div>

                <div v-else-if="step === 4">
                  <DateTimeSelection
                    :selectedDate="bookingData.date"
                    :selectedTime="bookingData.time"
                    :serviceDuration="totalDuration"
                    @update:date="(val: any) => (bookingData.date = val)"
                    @update:time="(val: string) => (bookingData.time = val)"
                  />
                </div>

                <div v-else-if="step === 5">
                  <CustomerDetails
                    :modelValue="bookingData.customer"
                    :vehicle="bookingData.vehicle"
                    @update:modelValue="(val: any) => (bookingData.customer = val)"
                  />
                </div>

                <div v-else-if="step === 6">
                  <Confirmation
                    :bookingData="bookingData"
                    @update:termsAccepted="(val: boolean) => (termsAccepted = val)"
                  />
                </div>
              </div>
            </transition>
          </div>

          <div class="mt-12 flex justify-between items-center border-t border-white/5 pt-8">
            <button v-if="step > 1" @click="step--"
              class="h-14 px-8 rounded-xl border border-white/10 bg-white/5 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 hover:bg-white/10 hover:border-white/20">
              <ArrowLeft class="w-4 h-4" /> Voltar Atrás
            </button>
            <div v-else></div>

            <button v-if="step < 6" @click="handleNextStep" :disabled="!canGoNext"
              class="h-14 px-8 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed shadow-lg">
              Próximo Passo <ArrowRight class="w-4 h-4" />
            </button>

            <button v-if="step === 6" @click="submitBooking" :disabled="isSubmitting || !termsAccepted"
              class="h-14 px-8 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_25px_rgba(37,99,235,0.4)]">
              <Check v-if="!isSubmitting" class="w-4 h-4" />
              {{ isSubmitting ? "A processar..." : "Finalizar Reserva" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <RecommendationModal 
      :show="showRecommendation" 
      :extra="recommendedExtra"
      @confirm="acceptRecommendation"
      @skip="showRecommendation = false; step++"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-vue-next";
import { graphql } from "@/graphql";
import { Cache } from "@/services/cachemanager";
import RecommendationModal from "@/components/booking/RecommendationModal.vue";
import CustomerDetails from "@/components/booking/CustomerDetails.vue";
import ProgressBar from "@/components/booking/ProgressBar.vue";
import VehicleSelection from "@/components/booking/VehicleSelection.vue";
import ServiceSelection from "@/components/booking/ServiceSelection.vue";
import ExtraServices from "@/components/booking/ExtraServices.vue";
import DateTimeSelection from "@/components/booking/DateTimeSelection.vue";
import Confirmation from "@/components/booking/Confirmation.vue";

const router = useRouter();
const route = useRoute();
const step = ref(1);
const isSubmitting = ref(false);
const termsAccepted = ref(false);
const showRecommendation = ref(false);
const recommendedExtra = ref<any>(null);

const steps = [
  { number: 1, label: "Serviço" },
  { number: 2, label: "Extras" },
  { number: 3, label: "Viatura" },
  { number: 4, label: "Data/Hora" },
  { number: 5, label: "Dados" },
  { number: 6, label: "Confirmar" },
];

const handleNextStep = async () => {
  if (step.value === 2 && bookingData.value.extras.length === 0) {
    const extras = await fetchAvailableExtras(bookingData.value.service?.id);
    
    if (extras.length > 0) {
      recommendedExtra.value = extras[Math.floor(Math.random() * extras.length)];
      showRecommendation.value = true;
      return;
    }
  }
  
  step.value++;
};

const fetchAvailableExtras = async (serviceId: string) => {
  try {
    const query = `
      query($packId: ID!) {
        packExtras(packId: $packId) {
          id
          name
          priceAB
          durationMinutes
        }
      }
    `;
    const data = await graphql<{ packExtras: any[] }>(query, { packId: serviceId });
    return data?.packExtras || [];
  } catch (error) {
    console.error("Erro ao buscar extras:", error);
    return [];
  }
};

const acceptRecommendation = () => {
  if (recommendedExtra.value) {
    bookingData.value.extras.push({
      id: recommendedExtra.value.id,
      name: recommendedExtra.value.name,
      price: recommendedExtra.value.priceAB || 0,
      duration: recommendedExtra.value.durationMinutes || 0,
      loyaltyPoints: 0
    });
  }
  showRecommendation.value = false;
  step.value++;
};

const bookingData = ref({
  vehicle: null as any,
  customer: { firstName: "", lastName: "", email: "", phone: "", vehicle: "", licensePlate: "" },
  service: null as any,
  extras: [] as any[],
  date: null as any,
  time: "",
  isRedeemed: false,
  redeemedReward: null as any,
});

const loyaltyBalance = ref({ availableCredits: 0, totalEarned: 0 });
const redeemableRewards = ref<any[]>([]);
const selectedReward = ref<any | null>(null);
const isRedeeming = ref(false);
const redeemedSuccess = ref(false);

const formattedDate = computed(() => {
  if (!bookingData.value.date) return "";
  const d = bookingData.value.date;
  if (d?.day && d?.month && d?.year) return `${String(d.day).padStart(2, "0")}/${String(d.month).padStart(2, "0")}/${d.year}`;
  return d?.toString() || "";
});

const totalDuration = computed(() => {
  const serviceDur = bookingData.value.service?.duration || 60;
  const extrasDur = bookingData.value.extras.reduce((sum: number, e: any) => sum + (e.duration || 0), 0);
  return serviceDur + extrasDur;
});

const totalPrice = computed(() => {
  const servicePrice = bookingData.value.service?.price || 0;
  const extrasPrice = bookingData.value.extras.reduce((sum: number, e: any) => sum + (e.price || 0), 0);
  return servicePrice + extrasPrice;
});

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
  } catch (error) { console.error("Erro ao carregar fidelidade:", error); }
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
  } catch (error) { console.error("Erro ao resgatar:", error); }
  finally { isRedeeming.value = false; }
};

const canGoNext = computed(() => {
  if (step.value === 1) return bookingData.value.service !== null || redeemedSuccess.value;
  if (step.value === 2) return true;
  if (step.value === 3) return bookingData.value.vehicle !== null;
  if (step.value === 4) return bookingData.value.date !== null && bookingData.value.time !== "";
  if (step.value === 5) return bookingData.value.customer?.firstName && bookingData.value.customer?.lastName && bookingData.value.customer?.email && bookingData.value.customer?.phone;
  return true;
});

watch(() => bookingData.value.vehicle, (newVehicle) => {
  if (newVehicle && bookingData.value.service) {
    localStorage.setItem('pre_selected_service_id', bookingData.value.service.id);
  }
});

const submitBooking = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    const userIdStr = Cache.UserId.value;
    if (!userIdStr) { alert("Sessão expirada."); router.push("/login"); return; }
    if (bookingData.value.isRedeemed) { router.push("/client-area"); return; }

    const total = totalPrice.value;

    const createPendingMutation = `
      mutation CreatePendingBooking($input: PendingBookingInput!) {
        createPendingBooking(input: $input) { id expiresAt hasError error { message } }
      }
    `;

    const pendingData = await graphql<{ createPendingBooking: any }>(createPendingMutation, {
      input: {
        userId: parseInt(userIdStr, 10),
        vehicleId: parseInt(bookingData.value.vehicle.id, 10),
        serviceId: parseInt(bookingData.value.service.id, 10),
        bookingDate: bookingData.value.date?.toISOString?.() || bookingData.value.date?.toString() || "",
        bookingTime: bookingData.value.time,
        serviceName: bookingData.value.service?.name || "",
        vehicleName: `${bookingData.value.vehicle?.brand || ""} ${bookingData.value.vehicle?.model || ""}`,
        vehiclePlate: bookingData.value.vehicle?.licensePlate || bookingData.value.vehicle?.plate || "",
        price: total,
        paymentMethod: "mbway",
        expiresInMinutes: 30,
      },
    });

    if (pendingData.createPendingBooking?.hasError) {
      alert(pendingData.createPendingBooking.error?.message || "Erro ao criar marcação.");
      return;
    }

    const bookingId = pendingData.createPendingBooking.id;
    const expiresAt = pendingData.createPendingBooking.expiresAt;

    localStorage.setItem("pending_booking", JSON.stringify({
      bookingId, serviceName: bookingData.value.service?.name || "",
      vehicleName: `${bookingData.value.vehicle?.brand || ""} ${bookingData.value.vehicle?.model || ""}`,
      vehiclePlate: bookingData.value.vehicle?.licensePlate || bookingData.value.vehicle?.plate || "",
      date: bookingData.value.date?.toString() || "", time: bookingData.value.time,
      price: total, createdAt: new Date().toISOString(), expiresAt,
    }));
    localStorage.setItem("pending_booking_id", bookingId);
    router.push(`/pagamento/${bookingId}`);
  } catch (error) {
    console.error("Erro ao gravar reserva:", error);
    alert("Erro ao processar. Tente novamente.");
  } finally {
    isSubmitting.value = false;
  }
};

const saveBookingState = () => {
  localStorage.setItem("booking_state", JSON.stringify({
    step: step.value, vehicle: bookingData.value.vehicle, customer: bookingData.value.customer,
    service: bookingData.value.service, extras: bookingData.value.extras,
    date: bookingData.value.date, time: bookingData.value.time,
    isRedeemed: bookingData.value.isRedeemed, redeemedReward: bookingData.value.redeemedReward,
  }));
};

const restoreBookingState = () => {
  const saved = localStorage.getItem("booking_state");
  if (saved) {
    try {
      const state = JSON.parse(saved);
      bookingData.value = {
        vehicle: state.vehicle,
        customer: state.customer || { firstName: "", lastName: "", email: "", phone: "", vehicle: "", licensePlate: "" },
        service: state.service, extras: state.extras || [],
        date: state.date, time: state.time,
        isRedeemed: state.isRedeemed || false, redeemedReward: state.redeemedReward || null,
      };
      step.value = state.step || 1;
      localStorage.removeItem("booking_state");
      return true;
    } catch (e) { console.error("Erro ao restaurar estado do booking:", e); }
  }
  return false;
};

onMounted(() => {
  loadLoyalty();
  restoreBookingState();

  const serviceIdFromQuery = route.query.serviceId as string;
  const packFromQuery = route.query.pack as string;

  if (serviceIdFromQuery) localStorage.setItem("pre_selected_service_id", serviceIdFromQuery);
  if (packFromQuery) localStorage.setItem("selected_pack", packFromQuery);
});
</script>