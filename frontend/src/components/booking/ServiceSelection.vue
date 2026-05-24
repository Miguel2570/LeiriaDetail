<template>
  <div class="space-y-6">
    <div class="flex flex-col space-y-2 mb-8">
      <h3 class="text-2xl font-black italic text-white uppercase tracking-tight">
        Selecione a sua <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">Viatura</span>
      </h3>
      <p class="text-xs text-gray-400 uppercase tracking-widest">Passo 1 de 5</p>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D8FF]"></div>
    </div>

    <div v-else>
      <div v-if="vehicles.length > 0 && !showAddForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="car in vehicles" 
          :key="car.id"
          @click="selectVehicle(car)"
          :class="[
            'p-6 rounded-2xl border transition-all duration-300 cursor-pointer group relative overflow-hidden',
            selectedVehicle?.id === car.id 
              ? 'border-[#00D8FF] bg-[#00D8FF]/10 shadow-[0_0_30px_rgba(0,216,255,0.15)]' 
              : 'border-white/10 bg-white/5 hover:bg-white/10'
          ]"
        >
          <div class="flex items-center gap-4 relative z-10">
            <div class="w-12 h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center">
              <Car class="w-6 h-6 text-[#00D8FF]" />
            </div>
            <div>
              <h4 class="text-lg font-bold text-white uppercase">{{ car.brand }}</h4>
              <p class="text-sm text-gray-400">{{ car.model }}</p>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
            <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Matrícula</span>
            <span class="text-sm font-mono text-white bg-black/50 px-3 py-1 rounded border border-white/10">{{ car.license_plate }}</span>
          </div>
        </div>

        <div 
          @click="showAddForm = true"
          class="p-6 rounded-2xl border border-dashed border-white/20 bg-transparent hover:bg-white/5 hover:border-[#00D8FF]/50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[160px] text-gray-400 hover:text-[#00D8FF]"
        >
          <Plus class="w-8 h-8 mb-2" />
          <span class="text-sm font-bold uppercase tracking-widest">Adicionar Viatura</span>
        </div>
      </div>

      <div v-if="showAddForm" class="p-6 border border-white/10 bg-[#050508] rounded-2xl">
        <h4 class="text-lg font-bold text-white mb-6 uppercase tracking-wider">Nova Viatura</h4>
        
        <form @submit.prevent="addNewVehicle" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="newCar.brand" placeholder="Marca" required class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white" />
            <input v-model="newCar.model" placeholder="Modelo" required class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white" />
          </div>
          <input v-model="newCar.license_plate" placeholder="Matrícula" required class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white uppercase" />
          
          <select v-model="newCar.size_category" required class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white">
            <option value="" disabled>Selecione o tamanho do veículo</option>
            <option value="A/B">Pequeno (A/B)</option>
            <option value="C">Médio (C)</option>
            <option value="D/E">Grande/SUV (D/E)</option>
          </select>

          <div class="flex gap-3 mt-8">
            <button type="button" @click="cancelAdd" class="flex-1 py-3.5 bg-transparent border border-white/10 text-white rounded-xl">Cancelar</button>
            <button type="submit" :disabled="isSaving" class="flex-1 py-3.5 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white rounded-xl">
              {{ isSaving ? 'A Guardar...' : 'Guardar Viatura' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Car, Plus } from 'lucide-vue-next';
import { graphql } from '@/services/graphql';
import { Cache } from '@/CacheManagement/cachemanager';

const props = defineProps({ selectedVehicle: { type: Object, default: null } });
const emit = defineEmits(['update:vehicle']);

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
  size_category: 'A/B' | 'C' | 'D/E';
}

const vehicles = ref<Vehicle[]>([]);
const isLoading = ref(true);
const isSaving = ref(false);
const showAddForm = ref(false);

const newCar = ref({
  brand: '',
  model: '',
  license_plate: '',
  size_category: ''
});

const fetchVehicles = async () => {
  const userId = Cache.UserId.value;
  if (!userId) { isLoading.value = false; return; }

  try {
    const query = `
      query GetCustomerCars($userId: Int!) {
        customerVehicles(user_id: $userId) {
          id
          brand
          model
          license_plate
          size_category
        }
      }
    `;
    const response = await graphql<{ customerVehicles: Vehicle[] }>(query, { userId: parseInt(userId, 10) });
    vehicles.value = response.customerVehicles;
  } catch (error) {
    console.error("Erro ao carregar viaturas:", error);
  } finally {
    isLoading.value = false;
  }
};

const addNewVehicle = async () => {
  const userId = Cache.UserId.value;
  if (!userId) return;
  isSaving.value = true;

  try {
    const mutation = `
      mutation CreateCar($input: CreateVehicleInput!) {
        createVehicle(input: $input) {
          id
          brand
          model
          license_plate
          size_category
        }
      }
    `;

    const variables = {
      input: {
        user_id: parseInt(userId, 10),
        brand: newCar.value.brand,
        model: newCar.value.model,
        license_plate: newCar.value.license_plate.toUpperCase(),
        size_category: newCar.value.size_category
      }
    };

    const response = await graphql<{ createVehicle: Vehicle }>(mutation, variables);
    vehicles.value.unshift(response.createVehicle);
    selectVehicle(response.createVehicle);
    showAddForm.value = false;
    newCar.value = { brand: '', model: '', license_plate: '', size_category: '' };
  } catch (error) {
    alert("Erro ao registar a viatura.");
  } finally {
    isSaving.value = false;
  }
};

const selectVehicle = (car: Vehicle) => emit('update:vehicle', car);
const cancelAdd = () => { showAddForm.value = false; newCar.value = { brand: '', model: '', license_plate: '', size_category: '' }; };

onMounted(fetchVehicles);
</script>