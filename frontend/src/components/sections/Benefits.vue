<script setup lang="ts">
import { ShieldCheck, Sparkles, Clock, Gem } from 'lucide-vue-next'

const benefits = [
  { icon: ShieldCheck, title: 'Produtos Premium', desc: 'pH neutro, proteção de longa duração para pintura e interior.' },
  { icon: Sparkles, title: 'Equipamento Profissional', desc: 'Aspiração industrial, vapor, polimento de alta precisão.' },
  { icon: Gem, title: 'Serviço por Marcação', desc: 'Sem esperas, agendamento flexível à sua conveniência.' },
  { icon: Clock, title: 'Antes/Depois Garantido', desc: 'Documentação fotográfica completa de cada trabalho.' }
]
</script>

<template>
  <section class="py-24 px-4  border-y relative z-10">
    <div class="container mx-auto max-w-6xl">
      
      <div class="text-center mb-16">
        <h3 class="text-4xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter">
          Porquê escolher-nos?
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(benefit, i) in benefits" :key="i" 
             class="bg-white border border-gray-100 p-8 rounded-3xl hover:border-[#2563EB]/30 hover:-translate-y-2 transition-all duration-300 group shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)]">
          
          <div class="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-500">
            <component :is="benefit.icon" class="h-8 w-8 text-[#2563EB]" />
          </div>
          
          <h4 class="text-xl font-bold text-gray-900 mb-3">{{ benefit.title }}</h4>
          <p class="text-gray-500 text-sm leading-relaxed">{{ benefit.desc }}</p>
        </div>
      </div>

    </div>
  </section>
</template>