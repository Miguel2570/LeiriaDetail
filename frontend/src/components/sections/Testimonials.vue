<script setup lang="ts">
import { Star } from 'lucide-vue-next'

const reviews = [
  { name: 'João Silva', text: 'O meu carro parece novo. O detalhe interior foi incrível!', rating: 5 },
  { name: 'Maria Santos', text: 'Profissionais excelentes e muito cuidadosos. Recomendo!', rating: 5 },
  { name: 'Pedro Oliveira', text: 'Melhor serviço de detalhe em Leiria. Preço e qualidade imbatíveis.', rating: 5 }
]
</script>

<template>
  <section class="py-24">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl font-bold mb-12">O que dizem os nossos clientes</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="r in reviews" :key="r.name" class="p-8 border rounded-2xl bg-white italic relative">
          <div class="flex justify-center gap-1 mb-4 text-yellow-400">
            <Star v-for="i in r.rating" :key="i" class="h-4 w-4 fill-current" />
          </div>
          <p class="text-gray-600 mb-4">"{{ r.text }}"</p>
          <span class="font-bold text-sm not-italic">- {{ r.name }}</span>
        </div>
      </div>
    </div>
  </section>
</template>