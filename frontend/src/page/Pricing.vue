<script setup lang="ts">
import { Check, Star, ArrowRight, HelpCircle } from 'lucide-vue-next';

// Dados dos pacotes principais
const packages = [
  {
    name: 'Basic',
    price: '25€',
    suv: '30€',
    description: 'Manutenção regular rápida.',
    features: ['Lavagem exterior + secagem', 'Limpeza rápida interior', 'Vidros e acabamento', 'Duração: ~1h'],
    popular: false
  },
  {
    name: 'Standard',
    price: '45€',
    suv: '55€',
    description: 'O cuidado mais procurado.',
    features: ['Exterior completo + jantes', 'Interior completo + aspiração profunda', 'Plásticos + perfume', 'Tratamento de pneus', 'Duração: ~2h'],
    popular: true
  },
  {
    name: 'Premium',
    price: '90€',
    suv: '110€',
    description: 'Detalhe minucioso total.',
    features: ['Detalhe interior profundo + estofos', 'Polimento (1 etapa) ou proteção', 'Limpeza profunda de jantes', 'Tratamento completo de plásticos', 'Duração: ~4h'],
    popular: false
  }
];

// Tabela detalhada de serviços individuais
const detailedPrices = [
  { service: 'Lavagem Premium', light: '25€', suv: '30€' },
  { service: 'Polimento (1 etapa)', light: '80€', suv: '100€' },
  { service: 'Polimento (2 etapas)', light: '150€', suv: '180€' },
  { service: 'Coating Cerâmico', light: '120€', suv: '150€' },
  { service: 'Limpeza Interior Completa', light: '40€', suv: '50€' },
  { service: 'Limpeza de Estofos', light: '40€', suv: '55€' },
  { service: 'Tratamento de Ozono', light: '35€', suv: '35€' }
];
</script>

<template>
  <div class="py-20 container mx-auto px-4 min-h-screen">
    
    <div class="max-w-3xl mx-auto text-center space-y-4 mb-16">
      <h1 class="text-4xl md:text-7xl font-black text-gray-900 uppercase italic tracking-tighter drop-shadow-sm">
        Preços <span class="text-leiria-gradient">Transparentes</span>
      </h1>
      <p class="text-lg text-gray-500 font-medium">Sem custos escondidos. Escolha o nível de detalhe que o seu carro merece.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
      <div v-for="pkg in packages" :key="pkg.name" 
           :class="['bg-[#0A0A0F]/95 backdrop-blur-xl border p-10 rounded-3xl relative transition-all duration-500 flex flex-col', 
                   pkg.popular ? 'border-[#3B82F6] shadow-[0_0_50px_rgba(59,130,246,0.25)] scale-105 z-10' : 'border-white/10 shadow-xl']">
        
        <div v-if="pkg.popular" class="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
          Mais Vendido
        </div>

        <div class="mb-8">
          <h3 class="text-2xl font-bold text-white mb-2 uppercase italic">{{ pkg.name }}</h3>
          <p class="text-gray-500 text-xs font-bold uppercase tracking-widest mb-6">{{ pkg.description }}</p>
          <div class="flex items-baseline gap-2">
            <span class="text-5xl font-black text-leiria-gradient">{{ pkg.price }}</span>
            <span class="text-gray-500 text-sm font-medium">/ Ligeiro</span>
          </div>
          <div class="text-gray-400 text-xs mt-2 font-bold uppercase">SUV/Carrinha: {{ pkg.suv }}</div>
        </div>

        <ul class="space-y-4 mb-10 border-t border-white/5 pt-8 flex-grow">
          <li v-for="feature in pkg.features" :key="feature" class="flex items-start gap-3 text-sm text-gray-300">
            <Check class="h-5 w-5 text-[#06B6D4] flex-shrink-0" />
            <span>{{ feature }}</span>
          </li>
        </ul>

        <router-link to="/agenda" class="block">
          <button :class="['w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all', 
                          pkg.popular ? 'bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white shadow-lg' : 'bg-white text-black hover:bg-[#3B82F6] hover:text-white']">
            Reservar {{ pkg.name }}
          </button>
        </router-link>
      </div>
    </div>

    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-center gap-3 mb-10">
        <div class="h-px w-12 bg-[#3B82F6]/30"></div>
        <h3 class="text-2xl font-black text-gray-900 uppercase italic tracking-tight">Tabela Detalhada</h3>
        <div class="h-px w-12 bg-[#3B82F6]/30"></div>
      </div>

      <div class="overflow-hidden bg-[#0A0A0F]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white/5 text-[10px] font-black text-[#06B6D4] uppercase tracking-[0.2em]">
              <th class="p-6 border-b border-white/5">Serviço</th>
              <th class="p-6 border-b border-white/5">Ligeiro</th>
              <th class="p-6 border-b border-white/5 text-right">SUV/Carrinha</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr v-for="item in detailedPrices" :key="item.service" class="hover:bg-white/5 transition-colors group">
              <td class="p-6 border-b border-white/5 font-bold text-white group-hover:text-[#06B6D4] transition-colors">{{ item.service }}</td>
              <td class="p-6 border-b border-white/5 text-gray-400">{{ item.light }}</td>
              <td class="p-6 border-b border-white/5 text-gray-400 text-right">{{ item.suv }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 px-4 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
        <div class="flex items-center gap-2">
          <HelpCircle class="h-4 w-4 text-[#3B82F6]" />
          <span>Preços sujeitos a avaliação do estado da viatura</span>
        </div>
        <span>* IVA incluído à taxa legal em vigor</span>
      </div>
    </div>

  </div>
</template>