<script setup lang="ts">
import { Check, Star } from 'lucide-vue-next';

// Dados extraídos diretamente do teu ficheiro original [cite: 321-323]
const packages = [
  {
    name: 'Basic',
    price: '25€',
    suv: '30€',
    description: 'Manutenção regular',
    features: ['Lavagem exterior + secagem', 'Limpeza rápida interior', 'Vidros e acabamento', 'Duração: ~1h'],
    popular: false
  },
  {
    name: 'Standard',
    price: '45€',
    suv: '55€',
    description: 'O mais vendido',
    features: ['Exterior completo + jantes', 'Interior completo + aspiração profunda', 'Plásticos + perfume', 'Tratamento de pneus', 'Duração: ~2h'],
    popular: true
  },
  {
    name: 'Premium',
    price: '90€',
    suv: '110€',
    description: 'Detalhe completo',
    features: ['Detalhe interior profundo + estofos', 'Polimento (1 etapa) ou proteção', 'Limpeza profunda de jantes', 'Tratamento completo de plásticos', 'Duração: ~4h'],
    popular: false
  }
];

// Tabela detalhada de preços [cite: 341-349]
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
  <div class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto text-center space-y-4 mb-12">
        <h1 class="text-4xl md:text-6xl font-bold">
          Preços <span class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">transparentes</span>
        </h1>
        <p class="text-xl text-gray-500">Sem custos escondidos. Escolhe o pacote ideal para o teu veículo.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
        <div v-for="pkg in packages" :key="pkg.name" 
             :class="['relative p-8 border rounded-2xl transition-all duration-300', 
                     pkg.popular ? 'border-[#3B82F6] shadow-[0_0_20px_rgba(59,130,246,0.2)] scale-105 z-10' : 'border-gray-100 shadow-sm']">
          
          <div v-if="pkg.popular" class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-full text-xs font-bold flex items-center gap-1">
            <Star class="h-3 w-3 fill-current" /> MAIS POPULAR
          </div>

          <div class="text-center mb-8">
            <h3 class="text-2xl font-bold mb-2">{{ pkg.name }}</h3>
            <p class="text-sm text-gray-400 mb-6">{{ pkg.description }}</p>
            <div class="space-y-1">
              <div class="text-4xl font-black bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                {{ pkg.price }}
              </div>
              <div class="text-sm text-gray-400">SUV/Carrinha: {{ pkg.suv }} [cite: 331]</div>
            </div>
          </div>

          <ul class="space-y-4 mb-8">
            <li v-for="feature in pkg.features" :key="feature" class="flex items-start gap-3 text-sm text-gray-600">
              <Check class="h-5 w-5 text-[#3B82F6] flex-shrink-0" />
              <span>{{ feature }}</span>
            </li>
          </ul>

          <router-link to="/marcacao" 
            :class="['block text-center py-3 rounded-xl font-bold transition-all', 
                    pkg.popular ? 'bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white hover:opacity-90' : 'border border-[#3B82F6] text-[#3B82F6] hover:bg-blue-50']">
            Agendar {{ pkg.name }}
          </router-link>
        </div>
      </div>

      <div class="max-w-4xl mx-auto">
        <h3 class="text-2xl font-bold mb-8 text-center">Tabela de Preços Detalhada</h3>
        <div class="overflow-hidden border border-gray-100 rounded-2xl shadow-sm">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 text-sm font-bold text-gray-600">
                <th class="p-4 border-b">Serviço</th>
                <th class="p-4 border-b">Ligeiro</th>
                <th class="p-4 border-b">SUV/Carrinha</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr v-for="item in detailedPrices" :key="item.service" class="hover:bg-gray-50/50 transition-colors">
                <td class="p-4 border-b font-medium text-gray-700">{{ item.service }}</td>
                <td class="p-4 border-b text-gray-500">{{ item.light }}</td>
                <td class="p-4 border-b text-gray-500">{{ item.suv }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p class="text-center text-xs text-gray-400 mt-8">
          * Preços sujeitos a avaliação do estado do veículo. Serviços extra podem ter acréscimo. [cite: 350-351]
        </p>
      </div>
    </div>
  </div>
</template>