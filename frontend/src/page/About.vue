<script setup lang="ts">
import { Sparkles, Shield, Heart, Award, CheckCircle2, History } from 'lucide-vue-next'

const values = [
  { icon: Sparkles, title: 'Qualidade Absoluta', desc: 'Não trabalhamos com pressa. Cada viatura recebe o tempo necessário para atingir o reflexo perfeito.' },
  { icon: Shield, title: 'Transparência Total', desc: 'Orçamentos rigorosos, sem surpresas. Documentamos cada fase do processo com registo fotográfico.' },
  { icon: Heart, title: 'Paixão pelo Automóvel', desc: 'Tratamos cada carro como se fosse nosso. Uma obsessão pela perfeição em cada vinco da carroçaria.' },
  { icon: Award, title: 'Técnica Certificada', desc: 'Utilizamos apenas a melhor química internacional de pH neutro e equipamentos de polimento de alta precisão.' }
]

const checkmarks = ['Lavagem Manual Segura', 'Correção de Pintura', 'Proteção Cerâmica', 'Tratamento de Pele']
</script>

<template>
  <section class="py-24 bg-[#050505] relative overflow-hidden min-h-screen">
    
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#2563EB]/10 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-4 max-w-6xl relative z-10">
      
      <div class="mb-16 border-b border-white/5 pb-12">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div class="inline-flex items-center gap-3 mb-6">
              <History class="h-4 w-4 text-[#2563EB]" />
              <span class="text-[10px] font-black text-[#2563EB] uppercase tracking-[0.5em] italic">O Estúdio</span>
            </div>
            <h1 class="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none">
              SOBRE A <span class="text-leiria-gradient">LEIRIADETAIL</span>
            </h1>
          </div>
          <div class="flex flex-wrap gap-4">
            <div v-for="t in checkmarks" :key="t" class="hidden lg:flex items-center gap-2">
              <div class="h-1 w-1 bg-[#2563EB] rounded-full"></div>
              <span class="text-[9px] font-black text-white/40 uppercase tracking-widest">{{ t }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <div class="lg:col-span-5 space-y-6">
          <h2 class="text-2xl font-black text-white uppercase italic">A Nossa <span class="text-[#2563EB]">Essência</span></h2>
          <p class="text-gray-400 text-sm leading-relaxed">
            Não somos um centro de lavagem tradicional. Somos um estúdio focado de forma independente na preservação, correção e restauro da estética automóvel em Leiria.
          </p>
          <p class="text-gray-500 text-sm leading-relaxed">
            Combinamos a engenharia química mais avançada do mercado com processos manuais meticulosos. O nosso objetivo é devolver o aspeto de salão a qualquer veículo, protegendo-o contra a degradação do tempo.
          </p>
          
          <div class="flex flex-wrap gap-x-6 gap-y-3 pt-4">
             <div v-for="t in checkmarks" :key="t" class="flex lg:hidden items-center gap-2">
                <CheckCircle2 class="h-3 w-3 text-[#2563EB]" />
                <span class="text-[10px] font-bold text-white/80 uppercase italic">{{ t }}</span>
             </div>
          </div>
        </div>

        <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="v in values" :key="v.title" 
               class="p-6 border border-white/5 bg-white/[0.01] rounded-2xl group hover:border-[#2563EB]/30 hover:bg-white/[0.03] transition-all duration-500">
            <div class="flex items-center gap-4 mb-4">
              <div class="p-3 bg-[#2563EB]/5 rounded-xl group-hover:bg-[#2563EB]/10 transition-colors">
                <component :is="v.icon" class="h-5 w-5 text-[#2563EB]" />
              </div>
              <h3 class="text-sm font-black text-white uppercase italic tracking-wider">{{ v.title }}</h3>
            </div>
            <p class="text-[11px] text-gray-400 uppercase tracking-wide leading-relaxed">
              {{ v.desc }}
            </p>
          </div>
        </div>

      </div>

    </div>

    <div class="absolute bottom-4 right-4 text-[5rem] md:text-[8rem] font-black text-white/[0.02] italic pointer-events-none select-none uppercase tracking-tighter">
      Est. 2026
    </div>
  </section>
</template>

<style scoped>
.text-leiria-gradient {
  background: linear-gradient(to right, #2563EB, #00D8FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>