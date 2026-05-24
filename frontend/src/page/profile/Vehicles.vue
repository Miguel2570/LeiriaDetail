<template>
  <form @submit.prevent="handleAddVehicle" class="space-y-4">
    
    <!-- Matrícula -->
    <div>
      <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Matrícula *</label>
      <input 
        v-model="newVehicle.license_plate" 
        type="text" 
        placeholder="AA-11-BB" 
        class="w-full px-4 py-3 border rounded-xl text-white outline-none transition-colors"
        :class="plateStatus.class"
        @input="handlePlateInput"
        maxlength="8"
        required 
      />
      <p v-if="plateStatus.message" class="text-xs mt-1" :class="plateStatus.messageClass">
        {{ plateStatus.message }}
      </p>
    </div>

    <!-- Campos manuais -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Marca *</label>
        <input v-model="newVehicle.brand" type="text" placeholder="Ex: BMW" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6]" required />
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Modelo *</label>
        <input v-model="newVehicle.model" type="text" placeholder="Ex: Série 4" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6]" required />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Ano</label>
        <input v-model="newVehicle.year" type="number" placeholder="2024" class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6]" />
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-400 uppercase mb-2">Combustível</label>
        <!-- Combustível -->
        <select 
          v-model="newVehicle.fuel_type" 
          class="w-full px-4 py-3 rounded-xl outline-none cursor-pointer"
          style="background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; color-scheme: dark;"
        >
          <option value="" disabled style="color: #6b7280; background: #1a1a1a;">Selecionar</option>
          <option value="Gasolina" style="background: #1a1a1a; color: white;">Gasolina</option>
          <option value="Diesel" style="background: #1a1a1a; color: white;">Diesel</option>
          <option value="Elétrico" style="background: #1a1a1a; color: white;">Elétrico</option>
          <option value="Híbrido" style="background: #1a1a1a; color: white;">Híbrido</option>
        </select>

        <!-- Categoria -->
        <select 
          v-model="newVehicle.size_category" 
          class="w-full px-4 py-3 rounded-xl outline-none cursor-pointer"
          style="background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; color-scheme: dark;"
        >
          <option value="A" style="background: #1a1a1a; color: white;">A - Pequeno</option>
          <option value="B" style="background: #1a1a1a; color: white;">B - Médio</option>
          <option value="C" style="background: #1a1a1a; color: white;">C - Grande</option>
          <option value="D" style="background: #1a1a1a; color: white;">D - SUV</option>
          <option value="E" style="background: #1a1a1a; color: white;">E - Comercial</option>
        </select>
        </div>
      </div>
    <button type="submit" :disabled="isSubmitting || !plateStatus.isValid" class="w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white font-bold rounded-xl disabled:opacity-50">
      {{ isSubmitting ? 'A guardar...' : 'Guardar Veículo' }}
    </button>
    
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { validateLicensePlate } from '@/services/licensePlateService';
import { graphql } from '@/graphql';

const newVehicle = ref({
  license_plate: '',
  brand: '',
  model: '',
  year: null as number | null,
  fuel_type: '',
  size_category: 'C'
});

const isSubmitting = ref(false);
const errorMessage = ref('');

const plateStatus = reactive({
  isValid: false,
  class: 'bg-white/5 border-white/10 focus:border-[#3B82F6]',
  message: '',
  messageClass: ''
});

const handlePlateInput = () => {
  const plate = newVehicle.value.license_plate;
  
  if (plate.length < 2) {
    plateStatus.isValid = false;
    plateStatus.class = 'bg-white/5 border-white/10 focus:border-[#3B82F6]';
    plateStatus.message = '';
    return;
  }
  
  const result = validateLicensePlate(plate);
  plateStatus.isValid = result.isValid;
  
  if (result.isValid) {
    plateStatus.class = 'bg-green-500/5 border-green-500/50';
    plateStatus.message = result.estimatedYear 
      ? `✅ Matrícula válida • Ano estimado: ${result.estimatedYear}`
      : '✅ Matrícula válida';
    plateStatus.messageClass = 'text-green-400';
    
    if (result.estimatedYear) {
      newVehicle.value.year = result.estimatedYear;
    }
  } else {
    plateStatus.class = 'bg-red-500/5 border-red-500/50';
    plateStatus.message = `⚠️ ${result.errorMessage}`;
    plateStatus.messageClass = 'text-red-400';
  }
};

const handleAddVehicle = async () => {
  errorMessage.value = '';
  isSubmitting.value = true;

  try {
    const mutation = `
      mutation AddVehicle($input: AddVehicleInput!) {
        addVehicle(input: $input) {
          vehicle { id licensePlate brand model }
          hasError
          error { message }
        }
      }
    `;

    const data = await graphql<{ addVehicle: any }>(mutation, {
      input: {
        licensePlate: newVehicle.value.license_plate,
        brand: newVehicle.value.brand,
        model: newVehicle.value.model,
        year: newVehicle.value.year,
        fuelType: newVehicle.value.fuel_type || null,
        sizeCategory: newVehicle.value.size_category
      }
    });

    if (data.addVehicle.hasError) {
      errorMessage.value = data.addVehicle.error?.message || 'Erro ao adicionar veículo.';
      return;
    }

    // Reset form
    newVehicle.value = { license_plate: '', brand: '', model: '', year: null, fuel_type: '', size_category: 'C' };
    plateStatus.isValid = false;
    plateStatus.class = 'bg-white/5 border-white/10 focus:border-[#3B82F6]';
    plateStatus.message = '';
    
  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
};
</script>