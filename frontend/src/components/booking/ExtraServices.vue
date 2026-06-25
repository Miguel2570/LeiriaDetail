<!-- src/components/booking/ExtraServices.vue -->
<template>
  <div class="space-y-8">
    <div class="flex flex-col space-y-2 mb-8">
      <h3 class="text-2xl font-black italic text-white uppercase tracking-tight">
        {{ selectedExtras.length > 0 ? 'Extras' : 'Adicionar' }} <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">{{ selectedExtras.length > 0 ? 'Selecionados' : 'Extras' }}</span>
      </h3>
      <p class="text-xs text-gray-400 uppercase tracking-widest">Passo 2 de 6</p>
      <p class="text-xs text-gray-500">Opcional - Pode saltar este passo</p>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D8FF]"></div>
    </div>

    <!-- Lista de Extras -->
    <div v-else-if="extras.length > 0" class="space-y-3">
      <div 
        v-for="extra in extras" 
        :key="extra.id"
        @click="toggleExtra(extra)"
        :class="[
          'p-5 rounded-2xl border-2 cursor-pointer transition-all group',
          isSelected(extra.id) 
            ? 'border-[#00D8FF] bg-[#00D8FF]/10 shadow-[0_0_20px_rgba(0,216,255,0.1)]' 
            : 'border-white/10 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.02]'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div :class="[
              'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all',
              isSelected(extra.id) 
                ? 'bg-[#00D8FF] border-[#00D8FF]' 
                : 'border-white/20 group-hover:border-white/40'
            ]">
              <Check v-if="isSelected(extra.id)" class="w-3 h-3 text-[#050505]" />
            </div>
            
            <div class="flex-1">
              <h4 class="text-white font-bold text-sm">{{ extra.name }}</h4>
              <p class="text-xs text-gray-500 mt-1">{{ extra.description }}</p>
              <div v-if="extra.loyaltyPoints > 0" class="flex items-center gap-1 mt-2">
                <span class="text-[#10B981] text-xs font-bold">🪙 +{{ extra.loyaltyPoints }} LeiriaPoints</span>
              </div>
            </div>
          </div>
          
          <div class="text-right ml-4">
            <span v-if="getPrice(extra) === 0" class="text-lg font-black text-amber-500">Sob Orçamento</span>
            <span v-else class="text-lg font-black text-[#00D8FF]">{{ getPrice(extra) }}€</span>
            <p class="text-[10px] text-gray-500 mt-0.5">⏱ {{ extra.durationMinutes }} min</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sem extras -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500 text-sm">Nenhum extra disponível.</p>
    </div>

    <!-- Resumo dos extras selecionados -->
    <div v-if="selectedExtras.length > 0" class="bg-[#050508] border border-[#00D8FF]/20 rounded-2xl p-5">
      <h4 class="text-xs font-black text-white uppercase tracking-widest mb-3">Extras Selecionados</h4>
      <div class="space-y-2">
        <div v-for="extra in selectedExtras" :key="extra.id" class="flex justify-between items-center text-sm">
          <span class="text-gray-300">{{ extra.name }}</span>
          <span class="text-[#00D8FF] font-bold">{{ extra.price }}€</span>
        </div>
        <div class="border-t border-white/5 pt-2 mt-2 flex justify-between items-center">
          <span class="text-white font-bold text-xs">Total Extras</span>
          <span class="text-[#00D8FF] font-black">{{ extrasTotal }}€</span>
        </div>
        <div class="flex justify-between items-center text-xs">
          <span class="text-gray-500">Tempo adicional</span>
          <span class="text-gray-400">+{{ extrasDuration }}min</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Check } from 'lucide-vue-next';
import { graphql } from '@/graphql';

const props = defineProps<{ 
  selectedVehicle: any; 
  selectedExtras: any[];
  serviceId: string;
}>();

const emit = defineEmits(['update:extras', 'skip', 'request-recommendation']);

interface Extra {
  id: string;
  name: string;
  description: string;
  priceAB: number;
  priceC: number;
  priceDE: number;
  durationMinutes: number;
  packType: string;
  loyaltyPoints: number;
}

const extras = ref<Extra[]>([]);
const isLoading = ref(true);

const fetchExtras = async () => {
  try {
    // ✅ Query corrigida com variáveis
    const query = `
      query($packId: ID!) {
        packExtras(packId: $packId) {
          id
          name
          description
          priceAB
          priceC
          priceDE
          durationMinutes
          loyaltyPoints
        }
      }
    `;
    const data = await graphql<{ packExtras: Extra[] }>(query, { packId: props.serviceId });
    extras.value = data.packExtras || [];
  } catch (error) {
    console.error("Erro ao carregar extras:", error);
  } finally {
    isLoading.value = false;
  }
};

const getPrice = (service: Extra): number => {
  const category = props.selectedVehicle?.sizeCategory || 'C';
  if (category === 'A' || category === 'B') return service.priceAB;
  if (category === 'C') return service.priceC;
  return service.priceDE;
};

const isSelected = (id: string): boolean => {
  return props.selectedExtras.some(e => e.id === id);
};

const toggleExtra = (extra: Extra) => {
  const current = [...props.selectedExtras];
  const index = current.findIndex(e => e.id === extra.id);
  
  if (index >= 0) {
    current.splice(index, 1);
  } else {
    current.push({
      id: extra.id,
      name: extra.name,
      price: getPrice(extra),
      duration: extra.durationMinutes,
      loyaltyPoints: extra.loyaltyPoints || 0
    });
  }
  
  emit('update:extras', current);
};

const selectedExtrasList = computed(() => props.selectedExtras || []);
const selectedExtras = computed(() => selectedExtrasList.value);

const extrasTotal = computed(() => {
  return selectedExtrasList.value.reduce((sum, e) => sum + (e.price || 0), 0);
});

const extrasDuration = computed(() => {
  return selectedExtrasList.value.reduce((sum, e) => sum + (e.duration || 0), 0);
});

onMounted(fetchExtras);
</script>