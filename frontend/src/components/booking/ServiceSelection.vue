<!-- src/components/booking/ServiceSelection.vue -->
<template>
  <div class="space-y-8">
    <div class="flex flex-col space-y-2 mb-8">
      <h3 class="text-2xl font-black italic text-white uppercase tracking-tight">
        {{ isPreSelected ? 'Serviço' : 'Escolha o' }} <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">{{ isPreSelected ? 'Selecionado' : 'Tratamento' }}</span>
      </h3>
      <p class="text-xs text-gray-400 uppercase tracking-widest">Passo 1 de 6</p>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D8FF]"></div>
    </div>

    <!-- ============================================ -->
    <!-- ✅ MODO PRÉ-SELECIONADO -->
    <!-- ============================================ -->
    <div v-else-if="isPreSelected && preSelectedServiceData" class="space-y-4">
      <div class="p-5 rounded-2xl border-2 border-[#00D8FF] bg-[#00D8FF]/10 shadow-[0_0_20px_rgba(0,216,255,0.1)]">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h4 class="text-white font-bold text-sm">{{ preSelectedServiceData.name }}</h4>
              <span class="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-[#F59E0B]/10 text-[#F59E0B]">
                Pack
              </span>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ preSelectedServiceData.description }}</p>
            
            <!-- Extras disponíveis -->
            <div v-if="packExtrasCount[preSelectedServiceData.id]" class="flex items-center gap-1 mt-2">
              <span class="text-[#F59E0B] text-xs">➕ {{ packExtrasCount[preSelectedServiceData.id] }} extras disponíveis</span>
            </div>
            
            <div v-if="preSelectedServiceData.loyaltyPoints > 0" class="flex items-center gap-1 mt-1">
              <span class="text-[#10B981] text-xs font-bold">🪙 +{{ preSelectedServiceData.loyaltyPoints }} LeiriaPoints</span>
            </div>
          </div>
          
          <div class="text-right ml-4">
            <span class="text-xl font-black text-[#00D8FF]">{{ getPrice(preSelectedServiceData) }}€</span>
            <p class="text-[10px] text-gray-500 mt-0.5">⏱ {{ preSelectedServiceData.durationMinutes }} min</p>
          </div>
        </div>

        <div class="mt-3 pt-3 border-t border-[#00D8FF]/20 flex items-center gap-2 text-[#00D8FF] text-xs">
          <span class="w-5 h-5 rounded-full bg-[#00D8FF]/20 flex items-center justify-center">✓</span>
          Selecionado
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- ✅ LISTA DE PACKS -->
    <!-- ============================================ -->
    <div v-else-if="packServices.length > 0" class="space-y-3">
      <div 
        v-for="service in packServices" 
        :key="service.id"
        @click="selectService(service)"
        :class="[
          'p-5 rounded-2xl border-2 cursor-pointer transition-all group',
          selectedServiceId === service.id 
            ? 'border-[#00D8FF] bg-[#00D8FF]/10 shadow-[0_0_20px_rgba(0,216,255,0.1)]' 
            : 'border-white/10 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.02]'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h4 class="text-white font-bold text-sm">{{ service.name }}</h4>
              <span class="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-[#F59E0B]/10 text-[#F59E0B]">
                Pack
              </span>
            </div>
            <p class="text-xs text-gray-500 mt-1">{{ service.description }}</p>
            
            <!-- Extras disponíveis -->
            <div v-if="packExtrasCount[service.id]" class="flex items-center gap-1 mt-2">
              <span class="text-[#F59E0B] text-xs">➕ {{ packExtrasCount[service.id] }} extras disponíveis</span>
            </div>
            
            <div v-if="service.loyaltyPoints > 0" class="flex items-center gap-1 mt-1">
              <span class="text-[#10B981] text-xs font-bold">🪙 +{{ service.loyaltyPoints }} LeiriaPoints</span>
            </div>
          </div>
          
          <div class="text-right ml-4">
            <span class="text-xl font-black text-[#00D8FF]">{{ getPrice(service) }}€</span>
            <p class="text-[10px] text-gray-500 mt-0.5">⏱ {{ service.durationMinutes }} min</p>
          </div>
        </div>

        <div v-if="selectedServiceId === service.id" class="mt-3 pt-3 border-t border-[#00D8FF]/20 flex items-center gap-2 text-[#00D8FF] text-xs">
          <span class="w-5 h-5 rounded-full bg-[#00D8FF]/20 flex items-center justify-center">✓</span>
          Selecionado
        </div>
      </div>
    </div>

    <!-- Sem serviços -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500 text-sm">Nenhum serviço disponível.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { graphql } from '@/graphql';

const props = defineProps<{ selectedServiceId: string | null; selectedVehicle: any }>();
const emit = defineEmits(['update:service']);

interface Service {
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

const services = ref<Service[]>([]);
const isLoading = ref(true);
const packExtrasCount = ref<Record<string, number>>({});

// ✅ Verificar se já tem serviço pré-selecionado (do bookingData ou localStorage)
const isPreSelected = computed(() => {
  return !!props.selectedServiceId || !!localStorage.getItem('pre_selected_service_id');
});

// ✅ Dados do serviço pré-selecionado
const preSelectedServiceData = computed(() => {
  const id = props.selectedServiceId || localStorage.getItem('pre_selected_service_id');
  if (!id) return null;
  return services.value.find(s => s.id === id) || null;
});

// ✅ Filtrar apenas packs
const packServices = computed(() => {
  return services.value.filter(s => s.packType === 'Pack');
});

const fetchServices = async () => {
  try {
    isLoading.value = true;
    const query = `
      query {
        services {
          services {
            id
            name
            description
            priceAB
            priceC
            priceDE
            durationMinutes
            packType
            loyaltyPoints
          }
        }
      }
    `;
    
    const data = await graphql<{ services: { services: Service[] } }>(query);
    services.value = data?.services?.services || [];
    
    // ✅ Corrigido: Carregar extras garantindo que não bloqueia a UI se falhar
    await loadExtrasCount();
    
    // ✅ Corrigido: Lógica de pré-seleção mais segura
    const preSelectedId = localStorage.getItem('pre_selected_service_id');
    if (preSelectedId) {
      const found = services.value.find(s => s.id === preSelectedId);
      if (found) {
        // Só selecionamos se a prop ainda não tiver um serviço ativo
        if (!props.selectedServiceId) {
          selectService(found);
        }
        localStorage.removeItem('pre_selected_service_id');
      }
    }
  } catch (error) {
    console.error("Erro ao carregar serviços:", error);
  } finally {
    isLoading.value = false;
  }
};

// Sugestão de implementação robusta para o loadExtrasCount
const loadExtrasCount = async () => {
  try {
    // Usamos um Promise.all para carregar tudo em paralelo e ser mais rápido
    const results = await Promise.all(
      services.value
        .filter(s => s.packType === 'Pack')
        .map(async (s) => {
          const res = await graphql<{ packExtras: any[] }>(
            `query { packExtras(packId: "${s.id}") { id } }`
          );
          return { id: s.id, count: res?.packExtras?.length || 0 };
        })
    );

    // Mapear resultados para o objeto packExtrasCount
    results.forEach(r => {
      packExtrasCount.value[r.id] = r.count;
    });
  } catch (error) {
    console.error("Erro ao carregar extras:", error);
    // Não paramos a execução se falhar, apenas não mostramos contagem
  }
};

const getPrice = (service: Service): number => {
  const category = props.selectedVehicle?.sizeCategory || 'Small';
  
  if (category === 'Small') return service.priceAB;   // Clio, 208, Golf
  if (category === 'Medium') return service.priceC;   // Série 3, Qashqai, 3008
  return service.priceDE;                              // Classe V, Trafic
};

const selectService = (service: Service) => {
  // Guardar preços para recalcular depois
  const existing = JSON.parse(localStorage.getItem('service_prices') || '{}');
  existing[service.id] = {
    priceAB: service.priceAB,
    priceC: service.priceC,
    priceDE: service.priceDE
  };
  localStorage.setItem('service_prices', JSON.stringify(existing));
  
  if (service.packType === 'Pack') {
    localStorage.setItem('selected_pack_id', service.id);
  }
  
  emit('update:service', { 
    id: service.id, 
    name: service.name, 
    price: getPrice(service),  // 🔥 Preço inicial (pode ser recalculado depois)
    duration: service.durationMinutes,
    packType: service.packType,
    loyaltyPoints: service.loyaltyPoints || 0,
    // 🔥 NOVO: Passar os preços para recalcular
    priceAB: service.priceAB,
    priceC: service.priceC,
    priceDE: service.priceDE
  });
};


const clearPreSelection = () => {
  localStorage.removeItem('selected_pack_id');
  emit('update:service', null);
};

onMounted(() => {
  fetchServices();
});
</script>