<script setup lang="ts">
// Atenção aos ícones: sempre lucide-vue-next!
import { ShieldCheck, Sparkles, Clock, Gem } from 'lucide-vue-next'

const benefits = [
  { icon: ShieldCheck, title: 'Produtos Premium', desc: 'pH neutro, proteção de longa duração para pintura e interior.' },
  { icon: Sparkles, title: 'Equipamento Profissional', desc: 'Aspiração industrial, vapor, polimento de alta precisão' },
  { icon: Gem, title: 'Serviço por Marcação', desc: 'Sem esperas, agendamento flexível à tua conveniência.' },
  { icon: Clock, title: 'Antes/Depois Garantido', desc: 'Documentação fotográfica completa de cada trabalho.' }
]
</script>

<template>
  <section class="py-24 px-4 relative z-10">
    <div class="container mx-auto max-w-6xl">
      
      <div class="text-center mb-16">
        <h3 class="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter drop-shadow-xl">
          Porquê escolher-nos?
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(benefit, i) in benefits" :key="i" 
             class="bg-[#050508] backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-[#3B82F6]/50 hover:-translate-y-2 transition-all duration-300 group shadow-lg">
          
          <div class="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#3B82F6]/20 to-[#06B6D4]/20 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
            <component :is="benefit.icon" class="h-8 w-8 text-[#06B6D4]" />
          </div>
          
          <h4 class="text-xl font-bold text-white mb-3">{{ benefit.title }}</h4>
          <p class="text-gray-400 text-sm leading-relaxed">{{ benefit.desc }}</p>
        </div>
      </div>

    </div>
  </section>
</template>