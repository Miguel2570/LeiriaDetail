<script setup lang="ts">
import { Sparkles, Shield, Clock, Euro } from 'lucide-vue-next'

const benefits = [
  { icon: Sparkles, title: 'Qualidade Premium', desc: 'Produtos de alta gama para o melhor acabamento.' },
  { icon: Shield, title: 'Proteção Duradoura', desc: 'Tratamentos que preservam o valor do seu carro.' },
  { icon: Clock, title: 'Eficiência', desc: 'Cumprimos rigorosamente os prazos de entrega.' },
  { icon: Euro, title: 'Preço Justo', desc: 'O melhor detalhe de Leiria ao preço mais competitivo.' }
]
</script>

<template>
  <section class="py-24 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div v-for="b in benefits" :key="b.title" class="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div class="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4 text-[#3B82F6]">
            <component :is="b.icon" class="h-6 w-6" />
          </div>
          <h3 class="font-bold mb-2">{{ b.title }}</h3>
          <p class="text-sm text-gray-500">{{ b.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>