<script setup lang="ts">
const props = defineProps<{
  modelValue: any;
}>();
const emit = defineEmits(['update:modelValue']);

// Atualiza o objeto no pai quando o input muda
const updateField = (field: string, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value });
};
</script>

<template>
  <div class="glass-card max-w-3xl mx-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h3 class="text-2xl font-bold mb-6 text-white flex items-center gap-3">
      <span class="w-2 h-8 bg-[#3B82F6] rounded-full"></span>
      Os Teus Dados
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="space-y-2">
        <label class="text-sm font-medium text-[#94A3B8]">Primeiro Nome</label>
        <input :value="modelValue.firstName" @input="e => updateField('firstName', (e.target as HTMLInputElement).value)" type="text" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all" placeholder="Ex: João" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-[#94A3B8]">Apelido</label>
        <input :value="modelValue.lastName" @input="e => updateField('lastName', (e.target as HTMLInputElement).value)" type="text" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all" placeholder="Ex: Silva" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-[#94A3B8]">Email</label>
        <input :value="modelValue.email" @input="e => updateField('email', (e.target as HTMLInputElement).value)" type="email" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all" placeholder="joao@email.com" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-[#94A3B8]">Telemóvel</label>
        <input :value="modelValue.phone" @input="e => updateField('phone', (e.target as HTMLInputElement).value)" type="tel" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all" placeholder="912 345 678" />
      </div>
    </div>

    <h3 class="text-2xl font-bold mb-6 text-white flex items-center gap-3 border-t border-white/5 pt-8">
      <span class="w-2 h-8 bg-[#06B6D4] rounded-full"></span>
      Dados da Viatura
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="text-sm font-medium text-[#94A3B8]">Marca e Modelo</label>
        <input :value="modelValue.vehicle" @input="e => updateField('vehicle', (e.target as HTMLInputElement).value)" type="text" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all" placeholder="Ex: BMW Série 1" />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-[#94A3B8]">Matrícula</label>
        <input :value="modelValue.licensePlate" @input="e => updateField('licensePlate', (e.target as HTMLInputElement).value)" type="text" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all uppercase" placeholder="AA-00-BB" />
      </div>
    </div>

    <div class="mt-8 p-4 rounded-xl border border-[#06B6D4]/30 bg-gradient-to-r from-[#06B6D4]/10 to-[#3B82F6]/10 flex gap-4">
      <svg class="h-6 w-6 shrink-0 text-[#06B6D4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-sm text-[#94A3B8]">
        Todas as informações são confidenciais e utilizadas apenas para os nossos registos de serviço e emissão de fatura.
      </p>
    </div>
  </div>
</template>