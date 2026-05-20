<script setup lang="ts">
import { ref, watch } from 'vue';
import { User, Car, Mail, Phone, Hash } from 'lucide-vue-next';

// Recebemos o veículo inteiro em vez de apenas a matrícula
const props = defineProps<{ selectedVehicle: any; }>();
const emit = defineEmits(['update:vehicle']);

// Criamos um estado local com a estrutura exata que a Confirmação precisa
const formData = ref(props.selectedVehicle || {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  model: '', // Marca e modelo
  plate: ''  // Matrícula
});

// Sempre que o utilizador escreve, avisamos logo o Booking.vue
const updateField = (field: string, value: any) => {
  formData.value[field] = value;
  emit('update:vehicle', formData.value);
};
</script>

<template>
  <div class="bg-white/[0.01] border border-white/5 rounded-[2rem] p-8 md:p-10 shadow-lg animate-fade-in">
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="space-y-2">
        <label class="text-[10px] font-black text-white/40 uppercase tracking-widest block pl-1">Nome Próprio</label>
        <div class="relative group">
          <User class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#2563EB]" />
          <input :value="formData.firstName" @input="e => updateField('firstName', (e.target as HTMLInputElement).value)" type="text" class="w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white text-sm font-bold outline-none focus:border-[#2563EB] transition-colors" placeholder="João" />
        </div>
      </div>
      <div class="space-y-2">
        <label class="text-[10px] font-black text-white/40 uppercase tracking-widest block pl-1">Apelido</label>
        <div class="relative group">
          <User class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#2563EB]" />
          <input :value="formData.lastName" @input="e => updateField('lastName', (e.target as HTMLInputElement).value)" type="text" class="w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white text-sm font-bold outline-none focus:border-[#2563EB] transition-colors" placeholder="Silva" />
        </div>
      </div>
      <div class="space-y-2">
        <label class="text-[10px] font-black text-white/40 uppercase tracking-widest block pl-1">E-mail</label>
        <div class="relative group">
          <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#2563EB]" />
          <input :value="formData.email" @input="e => updateField('email', (e.target as HTMLInputElement).value)" type="email" class="w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white text-sm font-bold outline-none focus:border-[#2563EB] transition-colors" placeholder="joao@email.com" />
        </div>
      </div>
      <div class="space-y-2">
        <label class="text-[10px] font-black text-white/40 uppercase tracking-widest block pl-1">Telemóvel</label>
        <div class="relative group">
          <Phone class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#2563EB]" />
          <input :value="formData.phone" @input="e => updateField('phone', (e.target as HTMLInputElement).value)" type="tel" class="w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white text-sm font-bold outline-none focus:border-[#2563EB] transition-colors" placeholder="912 345 678" />
        </div>
      </div>
    </div>

    <div class="h-px w-full bg-white/5 mb-8"></div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="text-[10px] font-black text-white/40 uppercase tracking-widest block pl-1">Veículo (Marca e Modelo)</label>
        <div class="relative group">
          <Car class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#00D8FF]" />
          <input :value="formData.model" @input="e => updateField('model', (e.target as HTMLInputElement).value)" type="text" class="w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white text-sm font-bold outline-none focus:border-[#00D8FF] transition-colors" placeholder="Ex: BMW M4" />
        </div>
      </div>
      <div class="space-y-2">
        <label class="text-[10px] font-black text-white/40 uppercase tracking-widest block pl-1">Matrícula</label>
        <div class="relative group">
          <Hash class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#00D8FF]" />
          <input :value="formData.plate" @input="e => updateField('plate', (e.target as HTMLInputElement).value)" type="text" class="w-full pl-11 pr-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-white text-sm font-bold outline-none focus:border-[#00D8FF] uppercase transition-colors" placeholder="AA-00-BB" />
        </div>
      </div>
    </div>
    
  </div>
</template>