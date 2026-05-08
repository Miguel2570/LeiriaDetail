<script setup lang="ts">
import { ref } from 'vue'
import { Droplets, Sparkles, Disc, Sofa, Wind, Zap, Trash2, Sprout, Shield } from 'lucide-vue-next'

const activeTab = ref('exterior')

const exteriorServices = [
  { icon: Droplets, title: 'Lavagem Premium + Cera', description: 'Lavagem completa com produtos pH neutro e cera protetora', price: 'desde 30€' },
  { icon: Sparkles, title: 'Polimento (1 etapa)', description: 'Correção leve de micro-riscos e restauro do brilho', price: 'desde 80€' },
  { icon: Shield, title: 'Selante / Coating', description: 'Proteção cerâmica de longa duração (6-12 meses)', price: 'desde 120€' }
]
// Podes adicionar os restantes serviços do teu txt aqui [cite: 401-404]
</script>

<template>
  <div class="py-16 container mx-auto px-4">
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-6xl font-bold mb-4">
        Os nossos <span class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">serviços</span>
      </h1>
      <p class="text-xl text-gray-500">Serviços profissionais para todos os tipos de veículos [cite: 406]</p>
    </div>

    <div class="flex justify-center mb-12 border-b">
      <button v-for="tab in ['exterior', 'interior', 'extras']" :key="tab"
              @click="activeTab = tab"
              :class="['px-8 py-4 font-bold capitalize transition-all', 
                      activeTab === tab ? 'border-b-4 border-[#3B82F6] text-[#3B82F6]' : 'text-gray-400']">
        {{ tab }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="service in (activeTab === 'exterior' ? exteriorServices : [])" :key="service.title"
           class="p-6 border border-gray-100 rounded-xl hover:border-[#3B82F6]/50 transition-all shadow-sm">
        <div class="h-12 w-12 rounded-lg bg-gradient-to-r from-[#3B82F6]/20 to-[#06B6D4]/20 flex items-center justify-center mb-4">
          <component :is="service.icon" class="h-6 w-6 text-[#3B82F6]" />
        </div>
        <h3 class="text-lg font-bold mb-2">{{ service.title }}</h3>
        <p class="text-gray-500 text-sm mb-4">{{ service.description }} [cite: 398-400]</p>
        <p class="font-bold text-[#3B82F6]">{{ service.price }}</p>
      </div>
    </div>
  </div>
</template>