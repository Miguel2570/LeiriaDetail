<script setup lang="ts">
import { Package, Calendar, Car, Camera, CheckCircle } from 'lucide-vue-next'

const steps = [
  { icon: Package, title: 'Escolhe o Pacote', desc: 'Seleciona o serviço ideal' },
  { icon: Calendar, title: 'Marca Online', desc: 'Agenda de forma rápida' },
  { icon: Car, title: 'Entrega a Viatura', desc: 'Deixa o carro connosco' },
  { icon: Camera, title: 'O Nosso Detalhe', desc: 'Trabalho profissional' },
  { icon: CheckCircle, title: 'Entrega Final', desc: 'Recebe o carro impecável' }
]
</script>

<template>
  <section class="py-24 relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0F]/80 to-transparent -z-10"></div>

    <div class="container mx-auto px-4 text-center relative z-10">
      <h2 class="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-20 drop-shadow-xl">
        Como <span class="text-leiria-gradient">Funciona</span>
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
        
        <div class="hidden md:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-[#3B82F6]/50 to-transparent -z-10"></div>

        <div v-for="(step, i) in steps" :key="i" class="relative group">
          <div class="mx-auto h-20 w-20 rounded-full bg-[#0A0A0F] border-2 border-[#3B82F6]/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)] group-hover:border-[#06B6D4] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300">
            <component :is="step.icon" class="h-8 w-8 text-[#06B6D4]" />
          </div>
          <h3 class="font-bold text-white mb-2 uppercase tracking-wide">{{ step.title }}</h3>
          <p class="text-sm text-white font-light">{{ step.desc }}</p>
          
          <div class="absolute top-0 right-1/4 md:right-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white text-xs rounded-full h-7 w-7 flex items-center justify-center font-black shadow-lg shadow-blue-500/50">
            {{ i + 1 }}
          </div>
        </div>

      </div>
    </div>
  </section>
</template>