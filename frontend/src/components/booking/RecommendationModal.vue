<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" @click.self="$emit('skip')">
    <div class="bg-[#050508] border border-[#00D8FF]/30 rounded-2xl p-6 max-w-sm w-full" @click.stop>
      <h3 class="text-white font-black text-xl mb-2">Extra Recomendado</h3>
      <p class="text-gray-400 text-sm mb-6">Este serviço tem um extra recomendado. Sugerimos adicioná-lo.</p>
      
      <div v-if="extra" class="p-4 bg-white/5 rounded-xl border border-white/10 mb-6">
        <p class="text-white font-bold">{{ extra.name }}</p>
        <p class="text-[#00D8FF] font-black text-lg">{{ extra.priceAB || extra.price || 0 }}€</p>
      </div>
      
      <button 
        @click="$emit('confirm')" 
        class="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-[#00D8FF] transition-all"
      >
        Adicionar e Continuar
      </button>
      <button 
        @click="$emit('skip')" 
        class="w-full py-3 mt-2 text-gray-500 text-xs hover:text-white"
      >
        Não, obrigado
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  extra: any;
}>();

defineEmits(['confirm', 'skip']);
</script>