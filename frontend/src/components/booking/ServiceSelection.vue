<template>
  <div class="space-y-8">
    <div class="flex flex-col space-y-2 mb-8">
      <h3 class="text-2xl font-black italic text-white uppercase tracking-tight">
        Escolha o <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">Tratamento</span>
      </h3>
      <p class="text-xs text-gray-400 uppercase tracking-widest">Passo 3 de 5</p>
    </div>

    <!-- Toggle Pack -->
    <div class="flex justify-center mb-6">
      <div class="bg-[#050508] border border-white/10 rounded-full p-1 flex">
        <button 
          @click="selectedPack = 'Básico'"
          :class="[
            'px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all',
            selectedPack === 'Básico' 
              ? 'bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white shadow-lg' 
              : 'text-gray-400 hover:text-white'
          ]"
        >
          🧼 Básico
        </button>
        <button 
          @click="selectedPack = 'Premium'"
          :class="[
            'px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all',
            selectedPack === 'Premium' 
              ? 'bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white shadow-lg' 
              : 'text-gray-400 hover:text-white'
          ]"
        >
          👑 Premium
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D8FF]"></div>
    </div>

    <!-- Serviços do Pack Selecionado -->
    <div v-else-if="filteredServices.length > 0" class="space-y-3">
      <div 
        v-for="service in filteredServices" 
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
            <h4 class="text-white font-bold text-sm">{{ service.name }}</h4>
            <p class="text-xs text-gray-500 mt-1">{{ service.description }}</p>
          </div>
          
          <div class="text-right ml-4">
            <span class="text-xl font-black text-[#00D8FF]">{{ getPrice(service) }}€</span>
            <p class="text-[10px] text-gray-500 mt-0.5">⏱ {{ service.durationMinutes }} min</p>
          </div>
        </div>

        <!-- Check no selecionado -->
        <div v-if="selectedServiceId === service.id" class="mt-3 pt-3 border-t border-[#00D8FF]/20 flex items-center gap-2 text-[#00D8FF] text-xs">
          <span class="w-5 h-5 rounded-full bg-[#00D8FF]/20 flex items-center justify-center">✓</span>
          Selecionado
        </div>
      </div>
    </div>

    <!-- Sem serviços -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500 text-sm">Nenhum serviço disponível para {{ selectedPack }}.</p>
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
}

const services = ref<Service[]>([]);
const isLoading = ref(true);
const selectedPack = ref<string>('Básico');  // ✅ Com acento

const filteredServices = computed(() => {
  // ✅ Comparação normalizada (ignora acentos)
  return services.value.filter(s => {
    const normalizedPack = (s.packType || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const normalizedSelected = selectedPack.value.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalizedPack === normalizedSelected;
  });
});

const fetchServices = async () => {
  try {
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
          }
        }
      }
    `;
    const data = await graphql<{ services: { services: Service[] } }>(query);
    services.value = data.services.services;
  } catch (error) {
    console.error("Erro ao carregar serviços:", error);
  } finally {
    isLoading.value = false;
  }
};

const getPrice = (service: Service): number => {
  const category = props.selectedVehicle?.sizeCategory || 'C';
  if (category === 'A' || category === 'B') return service.priceAB;
  if (category === 'C') return service.priceC;
  return service.priceDE;
};

const selectService = (service: Service) => {
  emit('update:service', { 
    id: service.id, 
    name: service.name, 
    price: getPrice(service), 
    duration: service.durationMinutes,
    packType: service.packType
  });
};

onMounted(fetchServices);
</script>