<!-- src/components/loyalty/LoyaltyCard.vue -->
<template>
  <div class="space-y-4">
    
    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D8FF]"></div>
    </div>

    <template v-else>
      
      <!-- ===== CARD PRINCIPAL (BK Style) ===== -->
      <div class="bg-[#050508] border border-white/10 rounded-3xl p-5">
        <!-- Título e pontos -->
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-[10px] text-gray-400 uppercase tracking-widest">LeiriaPoints</p>
            <p class="text-3xl font-black text-white">{{ balance.availableCredits }} <span class="text-lg font-normal text-gray-400">pts</span></p>
          </div>
          <div class="text-right">
            <p class="text-[10px] text-gray-500">Total acumulado</p>
            <p class="text-white font-bold">{{ balance.totalEarned }}</p>
          </div>
        </div>

        <!-- Barra de progresso com marcadores -->
        <div class="relative pt-1 pb-8">
          <!-- Linha da barra -->
          <div class="w-full bg-white/5 rounded-full h-2 overflow-hidden">
            <div 
              class="bg-gradient-to-r from-[#FF6B00] to-[#FFD700] h-2 rounded-full transition-all duration-700"
              :style="{ width: barPercent + '%' }"
            ></div>
          </div>

          <!-- Marcadores (200, 400, 600, 800, 1000) -->
          <div class="absolute top-0 left-0 w-full">
            <div 
              v-for="marker in markers" 
              :key="marker.points"
              class="absolute -translate-x-1/2"
              :style="{ left: marker.position + '%' }"
            >
              <!-- Bolinha -->
              <div 
                class="w-3 h-3 rounded-full -mt-0.5 mx-auto"
                :class="balance.availableCredits >= marker.points ? 'bg-[#FFD700]' : 'bg-gray-700'"
              ></div>
              <!-- Número -->
              <p class="text-[9px] mt-1 text-center font-medium whitespace-nowrap"
                 :class="balance.availableCredits >= marker.points ? 'text-[#FFD700]' : 'text-gray-600'">
                {{ marker.points }}
              </p>
            </div>
          </div>
        </div>

        <!-- Próxima recompensa -->
        <div v-if="nextReward" class="flex items-center gap-2 bg-white/[0.02] rounded-xl p-3">
          <span class="text-lg">🎯</span>
          <div class="flex-1">
            <p class="text-white text-xs font-bold">{{ nextReward.name }}</p>
            <p class="text-[10px] text-gray-500">{{ balance.availableCredits }}/{{ nextReward.requiredCredits }} pts • {{ progressPercent }}%</p>
          </div>
        </div>
        <div v-else class="bg-[#10B981]/5 rounded-xl p-3 text-center">
          <p class="text-[#10B981] text-xs font-bold">🎉 Já podes resgatar tudo!</p>
        </div>
      </div>

      <!-- ===== RECOMPENSAS (Grid 2 colunas) ===== -->
      <div>
        <h3 class="text-xs font-bold text-white uppercase tracking-wider mb-2">🏆 Resgatar</h3>
        
        <div class="grid grid-cols-2 gap-2">
          <div 
            v-for="reward in rewards" 
            :key="reward.id"
            :class="[
              'rounded-2xl p-3 transition-all cursor-pointer text-center border-2',  // ← border-2
              canRedeem(reward) 
                ? 'bg-[#050508] border-[#10B981]/30 hover:border-[#10B981] hover:bg-[#10B981]/5' 
                : 'bg-[#050508] border-white/10 opacity-50'  // ← border-white/10 em vez de border-white/5
            ]"
            @click="canRedeem(reward) && handleRedeem(reward)"
          >
            <!-- Ícone -->
            <div :class="[
              'w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-xl mb-2',
              canRedeem(reward) ? 'bg-[#10B981]/10' : 'bg-white/5'
            ]">
              {{ getRewardIcon(reward.name) }}
            </div>
            
            <!-- Nome -->
            <p class="text-white font-bold text-[11px] leading-tight mb-1">{{ reward.name }}</p>
            
            <!-- Preço em pontos -->
            <p :class="canRedeem(reward) ? 'text-[#10B981]' : 'text-gray-500'" class="text-xs font-bold">
              {{ reward.requiredCredits }} pts
            </p>
            
            <!-- Botão -->
            <button 
              v-if="canRedeem(reward)"
              class="mt-2 w-full py-1.5 bg-[#10B981] text-white text-[10px] font-bold rounded-lg hover:bg-[#059669] transition-all"
            >
              Resgatar
            </button>
            <p v-else class="text-[10px] text-gray-600 mt-2">faltam {{ reward.requiredCredits - balance.availableCredits }}</p>
          </div>
        </div>
      </div>

      <!-- ===== CUPÕES ATIVOS ===== -->
      <div v-if="activeCoupons.length > 0">
        <h3 class="text-xs font-bold text-white uppercase tracking-wider mb-2">🎫 Cupões ({{ activeCoupons.length }})</h3>
        <div class="space-y-1.5">
          <div 
            v-for="coupon in activeCoupons" 
            :key="coupon.id"
            class="bg-[#050508] border border-[#3B82F6]/20 rounded-xl p-2.5 flex items-center gap-2.5"
          >
            <span class="text-lg flex-shrink-0">🎫</span>
            <div class="flex-1 min-w-0">
              <p class="text-white text-[11px] font-bold truncate">{{ coupon.rewardName }}</p>
              <p class="text-[10px] text-gray-500">até {{ formatDate(coupon.expiresAt) }}</p>
            </div>
            <p class="text-[#00D8FF] text-[10px] font-mono font-bold flex-shrink-0">{{ coupon.redemptionCode }}</p>
          </div>
        </div>
      </div>

    </template>

    <!-- ===== MODAL CONFIRMAÇÃO ===== -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click="showConfirmModal = false">
          <div class="bg-[#0a0a0f] border border-[#10B981]/30 p-5 rounded-3xl max-w-xs w-full mx-4 text-center" @click.stop>
            <span class="text-4xl">🎁</span>
            <p class="text-white font-bold mt-2">Resgatar {{ selectedReward?.name }}?</p>
            <p class="text-gray-400 text-sm mt-1">{{ selectedReward?.requiredCredits }} pontos</p>
            <div class="flex gap-2 mt-4">
              <button @click="showConfirmModal = false" class="flex-1 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-bold">Não</button>
              <button @click="confirmRedeem" :disabled="isRedeeming" class="flex-1 py-2.5 bg-[#10B981] text-white rounded-xl text-sm font-bold">Sim!</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===== MODAL SUCESSO ===== -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="redeemedCode" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click="redeemedCode = ''">
          <div class="bg-[#0a0a0f] border border-[#10B981]/30 p-5 rounded-3xl max-w-xs w-full mx-4 text-center" @click.stop>
            <span class="text-5xl">🎉</span>
            <p class="text-[#10B981] font-bold text-lg mt-2">Resgatado!</p>
            <div class="bg-black/50 border border-dashed border-[#10B981]/30 rounded-xl p-3 my-3">
              <p class="text-[#00D8FF] text-lg font-mono font-bold tracking-widest select-all">{{ redeemedCode }}</p>
            </div>
            <p class="text-[10px] text-gray-500 mb-3">Válido por 90 dias</p>
            <button @click="redeemedCode = ''; fetchData()" class="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl text-sm font-bold">
              OK
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { graphql } from '@/graphql';

interface LoyaltyBalance { totalEarned: number; availableCredits: number; }
interface LoyaltyReward { id: string; name: string; description: string; requiredCredits: number; isActive: boolean; }
interface RewardRedemption { id: string; rewardName: string; redemptionCode: string; expiresAt: string; }
interface CreditTransaction { id: string; amount: number; description: string; type: string; }

const balance = ref<LoyaltyBalance>({ totalEarned: 0, availableCredits: 0 });
const rewards = ref<LoyaltyReward[]>([]);
const activeCoupons = ref<RewardRedemption[]>([]);
const isLoading = ref(true);
const showConfirmModal = ref(false);
const isRedeeming = ref(false);
const selectedReward = ref<LoyaltyReward | null>(null);
const redeemedCode = ref('');

// Marcadores da barra (ajusta conforme as tuas recompensas)
const markers = [
  { points: 300, position: 30 },
  { points: 500, position: 50 },
  { points: 800, position: 70 },
  { points: 1000, position: 85 },
  { points: 1500, position: 100 },
];

const maxBarPoints = 1500;
const barPercent = computed(() => Math.min((balance.value.availableCredits / maxBarPoints) * 100, 100));

const getRewardIcon = (name: string): string => {
  if (name.includes('Lavagem')) return '🧼';
  if (name.includes('Aspiração')) return '🪣';
  if (name.includes('Polimento')) return '✨';
  if (name.includes('Couro')) return '🛋️';
  if (name.includes('Cerâmica')) return '🛡️';
  if (name.includes('Premium')) return '👑';
  return '🎁';
};

const nextReward = computed(() => rewards.value.find(r => r.requiredCredits > balance.value.availableCredits) || null);
const progressPercent = computed(() => {
  if (!nextReward.value) return 100;
  return Math.round((balance.value.availableCredits / nextReward.value.requiredCredits) * 100);
});
const canRedeem = (reward: LoyaltyReward) => balance.value.availableCredits >= reward.requiredCredits;
const formatDate = (date: string) => date ? new Date(date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' }) : '';

const handleRedeem = (reward: LoyaltyReward) => { selectedReward.value = reward; showConfirmModal.value = true; };

const confirmRedeem = async () => {
  if (!selectedReward.value) return;
  isRedeeming.value = true;
  try {
    const data = await graphql<{ redeemLoyaltyReward: any }>(`
      mutation { redeemLoyaltyReward(rewardId: ${parseInt(selectedReward.value.id)}) { success redemptionCode } }
    `);
    if (data.redeemLoyaltyReward?.success) {
      redeemedCode.value = data.redeemLoyaltyReward.redemptionCode;
      showConfirmModal.value = false;
    }
  } catch (error) { console.error(error); }
  finally { isRedeeming.value = false; }
};

const fetchData = async () => {
  isLoading.value = true;
  try {
    const data = await graphql<{ loyaltyDashboard: any }>(`
      query {
        loyaltyDashboard {
          balance { totalEarned availableCredits }
          rewards { id name description requiredCredits isActive }
          redemptions { id rewardName redemptionCode expiresAt }
        }
      }
    `);
    if (data.loyaltyDashboard?.balance) {
      balance.value = {
        totalEarned: data.loyaltyDashboard.balance.totalEarned,
        availableCredits: data.loyaltyDashboard.balance.availableCredits
      };
    }
    if (data.loyaltyDashboard?.rewards) rewards.value = data.loyaltyDashboard.rewards;
    if (data.loyaltyDashboard?.redemptions) activeCoupons.value = data.loyaltyDashboard.redemptions;
  } catch (error) { console.error(error); }
  finally { isLoading.value = false; }
};

onMounted(fetchData);
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>