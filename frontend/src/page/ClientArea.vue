<script setup lang="ts">
import { ref } from 'vue'
import { User, Car, Search, Plus, Calendar, LogOut, Loader2, Check } from 'lucide-vue-next'

const client = { name: 'Miguel Silva', memberSince: '2025' }
const vehicles = ref([
  { plate: 'AA-00-AA', brand: 'BMW', model: 'M4 Competition' }
])

// Lógica de "Simulador de Seguros" para a Matrícula
const newPlate = ref('')
const isSearching = ref(false)
const foundCar = ref<any>(null)

const searchPlate = () => {
  if (newPlate.value.length < 6) return
  isSearching.value = true
  foundCar.value = null
  
  // Simula o tempo de procura na API (1.5 segundos)
  setTimeout(() => {
    isSearching.value = false
    // Aqui no futuro o backend devolve a info real. Agora simulamos:
    foundCar.value = { brand: 'Porsche', model: 'Macan GTS' }
  }, 1500)
}

const addVehicle = () => {
  if (foundCar.value) {
    vehicles.value.push({ plate: newPlate.value.toUpperCase(), ...foundCar.value })
    newPlate.value = ''
    foundCar.value = null
  }
}
</script>

<template>
  <section class="min-h-screen py-24 bg-[#050505] relative overflow-hidden">
    <div class="absolute top-0 right-0 w-[800px] h-[500px] bg-[#00D8FF]/5 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-4 max-w-6xl relative z-10">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
        <div class="flex items-center gap-6">
          <div class="h-16 w-16 rounded-full bg-gradient-to-br from-[#2563EB] to-[#00D8FF] p-0.5">
            <div class="h-full w-full bg-[#050505] rounded-full flex items-center justify-center">
              <User class="h-6 w-6 text-white" />
            </div>
          </div>
          <div>
            <h1 class="text-3xl font-black text-white uppercase italic tracking-tighter">
              BEM-VINDO, <span class="text-[#00D8FF]">{{ client.name }}</span>
            </h1>
          </div>
        </div>
        <router-link to="/agenda">
          <button class="h-12 px-6 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] transition-transform">
            <Calendar class="h-4 w-4" /> Nova Marcação
          </button>
        </router-link>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-6 space-y-6">
          <h2 class="text-lg font-black text-white uppercase italic flex items-center gap-3">
            <Car class="h-5 w-5 text-[#2563EB]" /> A Minha Garagem
          </h2>

          <div class="p-6 border border-white/5 bg-white/[0.01] rounded-3xl">
            <label class="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-3">Adicionar Veículo (Matrícula)</label>
            <div class="flex gap-3 mb-4">
              <input 
                v-model="newPlate" 
                type="text" 
                placeholder="AA-00-BB" 
                class="w-full px-4 bg-white/[0.02] border border-white/5 rounded-xl text-white text-center text-lg font-black uppercase tracking-widest outline-none focus:border-[#2563EB] transition-colors"
                @keyup.enter="searchPlate"
              />
              <button @click="searchPlate" :disabled="isSearching" class="px-6 rounded-xl bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/20 hover:bg-[#2563EB] hover:text-white transition-all disabled:opacity-50 flex items-center justify-center">
                <Loader2 v-if="isSearching" class="h-5 w-5 animate-spin" />
                <Search v-else class="h-5 w-5" />
              </button>
            </div>

            <div v-if="foundCar" class="p-4 bg-[#00D8FF]/10 border border-[#00D8FF]/20 rounded-xl flex justify-between items-center animate-in fade-in slide-in-from-top-2">
              <div>
                <span class="text-[9px] font-black text-[#00D8FF] uppercase tracking-widest block">Veículo Detetado</span>
                <span class="text-sm font-bold text-white uppercase">{{ foundCar.brand }} {{ foundCar.model }}</span>
              </div>
              <button @click="addVehicle" class="h-8 px-4 rounded-lg bg-[#00D8FF] text-[#050505] text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:scale-105 transition-transform">
                <Plus class="h-3 w-3" /> Guardar
              </button>
            </div>
          </div>

          <div class="space-y-3">
            <div v-for="car in vehicles" :key="car.plate" class="p-5 border border-white/5 bg-white/[0.01] rounded-2xl flex justify-between items-center group">
              <div>
                <h4 class="text-sm font-bold text-white uppercase">{{ car.brand }} {{ car.model }}</h4>
                <div class="mt-1 inline-block px-3 py-1 bg-white/5 rounded text-[10px] text-white/50 font-black tracking-widest border border-white/5">{{ car.plate }}</div>
              </div>
              <Check class="h-5 w-5 text-white/10 group-hover:text-[#00D8FF] transition-colors" />
            </div>
          </div>
        </div>

        <div class="lg:col-span-6 space-y-6">
          <h2 class="text-lg font-black text-white uppercase italic flex items-center gap-3">
            <Calendar class="h-5 w-5 text-[#00D8FF]" /> Próximas Marcações
          </h2>
          <div class="p-8 border border-dashed border-white/10 rounded-3xl text-center text-white/30 text-xs font-black uppercase tracking-widest italic">
            Sem marcações ativas
          </div>
        </div>

      </div>
    </div>
  </section>
</template>