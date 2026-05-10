<script setup lang="ts">
import { ref } from 'vue'
import { Droplets, Sparkles, Sofa, Wind, Zap, Trash2, Shield, CircleDot } from 'lucide-vue-next'

// Definimos o objeto de serviços primeiro para podermos extrair o tipo das suas chaves
const services = {
  exterior: [
    { icon: Droplets, title: 'Lavagem Premium', desc: 'Método de 2 baldes, descontaminação e cera.', price: 'desde 30€' },
    { icon: Sparkles, title: 'Polimento 1 Etapa', desc: 'Remoção de micro-riscos e brilho intenso.', price: 'desde 80€' },
    { icon: Shield, title: 'Proteção Cerâmica', desc: 'Coating cerâmico de alta durabilidade.', price: 'desde 120€' }
  ],
  interior: [
    { icon: Sofa, title: 'Limpeza de Estofos', desc: 'Extração profunda de sujidade e manchas.', price: 'desde 40€' },
    { icon: Wind, title: 'Tratamento Ozono', desc: 'Eliminação total de odores e bactérias.', price: '35€' },
    { icon: CircleDot, title: 'Detalhe Interior', desc: 'Limpeza minuciosa de todos os materiais.', price: 'desde 45€' }
  ],
  extras: [
    { icon: Zap, title: 'Limpeza de Motor', desc: 'Lavagem técnica e condicionamento seguro.', price: '25€' },
    { icon: Trash2, title: 'Faróis', desc: 'Restauro de óticas baças ou amareladas.', price: '30€/par' }
  ]
}

// 1. Tipamos o activeTab para ser apenas uma das chaves de 'services'
// Isso remove a necessidade de fazer "as key_of_services" no template
const activeTab = ref<keyof typeof services>('exterior')
</script>

<template>
  <div class="py-20 container mx-auto px-4 min-h-screen">
    <div class="text-center mb-16">
      <h1 class="text-4xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">
        Os nossos <span class="text-leiria-gradient">Serviços</span>
      </h1>
      <p class="text-gray-500 font-medium max-w-2xl mx-auto">Soluções profissionais de detalhe para elevar o nível da sua viatura.</p>
    </div>

    <div class="flex justify-center mb-12 space-x-2 md:space-x-4">
      <button v-for="tab in (Object.keys(services) as Array<keyof typeof services>)" :key="tab"
              @click="activeTab = tab"
              :class="['px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all', 
                      activeTab === tab ? 'bg-[#0A0A0F] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100']">
        {{ tab }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <div v-for="service in services[activeTab]" :key="service.title"
           class="bg-[#0A0A0F]/90 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-[#3B82F6]/50 transition-all group">
        <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#3B82F6]/20 to-[#06B6D4]/20 flex items-center justify-center mb-6 border border-white/5">
          <component :is="service.icon" class="h-7 w-7 text-[#06B6D4]" />
        </div>
        <h3 class="text-xl font-bold text-white mb-2 uppercase">{{ service.title }}</h3>
        <p class="text-gray-400 text-sm mb-6 leading-relaxed">{{ service.desc }}</p>
        <p class="text-2xl font-black text-leiria-gradient">{{ service.price }}</p>
      </div>
    </div>
  </div>
</template>