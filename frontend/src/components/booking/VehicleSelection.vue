<template>
  <div class="space-y-6">
    <div class="flex flex-col space-y-2 mb-8">
      <h3 class="text-2xl font-black italic text-white uppercase tracking-tight">
        Selecione a sua <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">Viatura</span>
      </h3>
      <p class="text-xs text-gray-400 uppercase tracking-widest">Passo 1 de 5</p>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D8FF]"></div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div 
        v-for="car in vehicles" 
        :key="car.id"
        @click="emit('update:vehicle', car)"
        :class="[
          'p-6 rounded-[2rem] cursor-pointer transition-all duration-300 border-2 relative overflow-hidden',
          selectedVehicle?.id === car.id 
            ? 'border-[#00D8FF] bg-[#00D8FF]/5 shadow-[0_0_20px_rgba(0,216,255,0.15)]' 
            : 'border-white/5 bg-white/[0.01] hover:border-white/20'
        ]"
      >
        <Car :class="['h-8 w-8 mb-4 transition-colors', selectedVehicle?.id === car.id ? 'text-[#00D8FF]' : 'text-white/20']" />
        <h3 class="text-xl font-bold text-white uppercase italic tracking-tight mb-1">{{ car.brand }} {{ car.model }}</h3>
        <span class="inline-block px-3 py-1 mt-2 bg-white/5 rounded-md text-[10px] text-white/60 font-black tracking-widest border border-white/5 uppercase">
          {{ car.licensePlate }}
        </span>
        <span v-if="car.isPrimary" class="absolute top-4 right-4 text-[10px] bg-[#00D8FF]/20 text-[#00D8FF] px-2 py-1 rounded-full">Principal</span>
      </div>

      <!-- Se logado → área cliente / Se não → login -->
      <button 
        @click="handleAddVehicle"
        class="p-6 rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center hover:border-[#2563EB] hover:bg-[#2563EB]/5 transition-all group w-full"
      >
        <div class="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[#2563EB] transition-colors">
          <Plus class="h-6 w-6 text-white/40 group-hover:text-white" />
        </div>
        <span class="text-xs font-black text-white/50 uppercase tracking-widest group-hover:text-white">Adicionar nova viatura</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Car, Plus } from 'lucide-vue-next';
import { graphql } from '@/graphql';
import { Cache } from '@/services/cachemanager';

const router = useRouter();
const props = defineProps<{ selectedVehicle: any }>();
const emit = defineEmits(['update:vehicle']);

interface Vehicle {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  sizeCategory: string;
  isPrimary: boolean;
}

const vehicles = ref<Vehicle[]>([]);
const isLoading = ref(true);

const fetchVehicles = async () => {
  try {
    const query = `
      query {
        userVehicles {
          vehicles {
            id
            licensePlate
            brand
            model
            sizeCategory
            isPrimary
          }
        }
      }
    `;
    const data = await graphql<{ userVehicles: { vehicles: Vehicle[] } }>(query);
    vehicles.value = data.userVehicles.vehicles;
  } catch (error) {
    console.error("Erro ao carregar veículos:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleAddVehicle = () => {
  if (Cache.Session.value && Cache.Session.value !== '1234') {
    router.push('/client-area');
  } else {
    router.push('/login');
  }
};

onMounted(fetchVehicles);
</script>