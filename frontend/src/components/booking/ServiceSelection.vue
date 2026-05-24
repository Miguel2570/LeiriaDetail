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

      <div v-if="vehicles.length === 0 && !showAddForm" class="text-center py-12 border border-white/10 bg-white/5 rounded-2xl">
        <Car class="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h4 class="text-white font-bold mb-2">Nenhuma viatura registada</h4>
        <p class="text-sm text-gray-400 mb-6">Adicione o seu veículo para podermos apresentar os tratamentos adequados.</p>
        <button @click="showAddForm = true" class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all">
          Registar Carro
        </button>
      </div>

      <div v-if="showAddForm" class="p-6 border border-white/10 bg-[#050508] rounded-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/10 blur-[50px] rounded-full pointer-events-none"></div>
        
        <h4 class="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
          <Plus class="w-5 h-5 text-[#00D8FF]" /> Nova Viatura
        </h4>
        
        <form @submit.prevent="addNewVehicle" class="space-y-4 relative z-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Marca</label>
              <input v-model="newCar.brand" type="text" placeholder="Ex: BMW" required class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6] focus:bg-white/10 transition-all placeholder:text-gray-600" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Modelo</label>
              <input v-model="newCar.model" type="text" placeholder="Ex: Série 4" required class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6] focus:bg-white/10 transition-all placeholder:text-gray-600" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Matrícula</label>
            <input v-model="newCar.license_plate" type="text" placeholder="Ex: AA-11-BB" required class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6] focus:bg-white/10 transition-all uppercase placeholder:text-gray-600" />
          </div>

          <div class="flex gap-3 mt-8">
            <button type="button" @click="cancelAdd" class="flex-1 py-3.5 bg-transparent border border-white/10 hover:bg-white/5 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all">
              Cancelar
            </button>
            <button type="submit" :disabled="isSaving" class="flex-1 py-3.5 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]">
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

const props = defineProps({
  selectedVehicle: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:vehicle']);

// Tipagem
interface Vehicle {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
}

// Estados
const vehicles = ref<Vehicle[]>([]);
const isLoading = ref(true);
const isSaving = ref(false);
const showAddForm = ref(false);

const newCar = ref({
  brand: '',
  model: '',
  license_plate: ''
});

// Busca os carros do cliente à base de dados
const fetchVehicles = async () => {
  const userId = Cache.UserId.value;
  if (!userId) {
    isLoading.value = false;
    return;
  }

  try {
    const query = `
      query GetCustomerCars($userId: Int!) {
        customerVehicles(user_id: $userId) {
          id
          brand
          model
          license_plate
        }
      }
    `;
    
    const response = await graphql<{ customerVehicles: Vehicle[] }>(query, { userId: parseInt(userId, 10) });
    vehicles.value = response.customerVehicles;

    // Se o utilizador já tiver um carro selecionado antes (ex: andou para trás nos passos), mantém a seleção
    if (props.selectedVehicle) {
        const found = vehicles.value.find(v => v.id === props.selectedVehicle.id);
        if (found) emit('update:vehicle', found);
    } else if (vehicles.value.length === 1) {
        // Se só tiver um carro, auto-seleciona para poupar tempo ao cliente!
        emit('update:vehicle', vehicles.value[0]);
    }

  } catch (error) {
    console.error("Erro ao carregar viaturas:", error);
  } finally {
    isLoading.value = false;
  }
};

// Adiciona um carro novo através da Mutation
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
        }
      }
    `;

    const variables = {
      input: {
        user_id: parseInt(userId, 10),
        brand: newCar.value.brand,
        model: newCar.value.model,
        license_plate: newCar.value.license_plate.toUpperCase()
      }
    };

    const response = await graphql<{ createVehicle: Vehicle }>(mutation, variables);
    
    // Adiciona o carro novo à lista local
    vehicles.value.unshift(response.createVehicle);
    
    // Auto-seleciona o carro novo e fecha o form
    selectVehicle(response.createVehicle);
    showAddForm.value = false;
    
    // Limpa o formulário
    newCar.value = { brand: '', model: '', license_plate: '' };

  } catch (error) {
    console.error("Erro ao gravar viatura:", error);
    alert("Não foi possível registar a viatura. Verifique se a matrícula já existe.");
  } finally {
    isSaving.value = false;
  }
};

const selectVehicle = (car: Vehicle) => {
  emit('update:vehicle', car);
};

const cancelAdd = () => {
  showAddForm.value = false;
  newCar.value = { brand: '', model: '', license_plate: '' };
};

onMounted(() => {
  fetchVehicles();
});
</script>