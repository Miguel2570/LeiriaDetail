<script setup lang="ts">
import { ref, computed } from 'vue';
import { Check, ChevronLeft, ChevronRight } from 'lucide-vue-next';

const step = ref(1);
const bookingData = ref({
  package: '',
  vehicleType: '',
  extras: [] as string[],
  date: '',
  timeSlot: ''
});

const packages = [
  { id: 'basic', name: 'Basic', price: 25 },
  { id: 'standard', name: 'Standard', price: 45 },
  { id: 'premium', name: 'Premium', price: 90 }
];

const vehicleTypes = [
  { id: 'city', name: 'Citadino', multiplier: 1 },
  { id: 'sedan', name: 'Sedan', multiplier: 1 },
  { id: 'suv', name: 'SUV', multiplier: 1.2 }
];

const calculatePrice = computed(() => {
  const pkg = packages.find(p => p.id === bookingData.value.package);
  const vehicle = vehicleTypes.find(v => v.id === bookingData.value.vehicleType);
  if (!pkg || !vehicle) return 0;
  return Math.round(pkg.price * vehicle.multiplier);
});
</script>

<template>
    <div class="py-16 container mx-auto px-4 max-w-2xl">
    <h1 class="text-3xl font-bold text-center mb-8">Agendar <span class="text-[#3B82F6]">Serviço</span></h1>

    <div class="bg-white border rounded-xl p-8 shadow-sm">
        <div v-if="step === 1" class="space-y-6">
        <h2 class="font-bold text-xl">Escolhe o Pacote</h2>
        <div v-for="pkg in packages" :key="pkg.id" 
                @click="bookingData.package = pkg.id"
                :class="['p-4 border rounded-lg cursor-pointer transition-all', bookingData.package === pkg.id ? 'border-[#3B82F6] bg-blue-50' : '']">
            {{ pkg.name }} - {{ pkg.price }}€
        </div>

        <h2 class="font-bold text-xl mt-8">Tipo de Veículo</h2>
        <div class="flex gap-4">
            <button v-for="v in vehicleTypes" :key="v.id" 
                    @click="bookingData.vehicleType = v.id"
                    :class="['flex-1 p-3 border rounded-lg', bookingData.vehicleType === v.id ? 'bg-[#3B82F6] text-white' : '']">
            {{ v.name }}
            </button>
        </div>
        </div>

      <div class="mt-12 flex justify-between">
    <button 
        @click="step--" 
        :disabled="step === 1" 
        class="flex items-center px-6 py-2 border rounded-lg disabled:opacity-30"
    >
        <ChevronLeft class="mr-2 h-4 w-4" /> 
        Voltar
    </button>

    <button 
        v-if="step < 4" 
        @click="step++" 
        :disabled="!bookingData.package" 
        class="flex items-center px-6 py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-lg hover:opacity-90"
    >
        Continuar
        <ChevronRight class="ml-2 h-4 w-4" />
    </button>

    <button 
        v-else 
        class="flex items-center px-6 py-2 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-lg hover:opacity-90"
    >
        <Check class="mr-2 h-4 w-4" />
        Confirmar Marcação 
    </button>
</div>
    </div>
  </div>
</template>