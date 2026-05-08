<script setup lang="ts">
import { Package, Calendar, Car, Camera, CheckCircle } from 'lucide-react'
const steps = [
  { icon: Package, title: 'Escolhe serviço/pacote', desc: 'Seleciona o pacote que melhor se adequa' },
  { icon: Calendar, title: 'Marca dia e hora', desc: 'Agenda online de forma rápida e simples' },
  { icon: Car, title: 'Deixa o carro connosco', desc: 'Entrega o veículo na hora marcada' },
  { icon: Camera, title: 'Fazemos o detalhe', desc: 'Trabalho profissional com fotos' },
  { icon: CheckCircle, title: 'Entrega final', desc: 'Recebe o teu carro impecável' }
]
</script>

<template>
  <section class="py-24 bg-white">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-4xl font-bold mb-16">Como funciona</h2>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div v-for="(step, i) in steps" :key="i" class="relative">
          <div class="mx-auto h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center mb-4 border border-blue-100">
            <component :is="step.icon" class="h-8 w-8 text-[#3B82F6]" />
          </div>
          <h3 class="font-bold mb-2">{{ step.title }}</h3>
          <p class="text-sm text-gray-500">{{ step.desc }}</p>
          <div class="absolute top-0 right-1/4 bg-leiria-gradient text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
            {{ i + 1 }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>