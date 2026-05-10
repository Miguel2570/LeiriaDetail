<script setup lang="ts">
import { Gavel, ClipboardCheck, AlertCircle, Scale, FileText } from 'lucide-vue-next'
</script>

<template>
  <section class="py-24 bg-[#050505] relative overflow-hidden min-h-screen antialiased">
    
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-[#3B82F6]/5 blur-[130px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-4 max-w-6xl relative z-10">
      
      <div class="text-center mb-24 border-b border-white/5 pb-16">
        <div class="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 shadow-inner">
          <Gavel class="h-4 w-4 text-[#3B82F6]" />
          <span class="text-[10px] font-black text-white/70 uppercase tracking-[0.4em] italic">Acordo de Serviço</span>
        </div>
        
        <h1 class="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.8] mb-10 drop-shadow-2xl">
          TERMOS E <br> <span class="text-leiria-gradient">CONDIÇÕES</span>
        </h1>
        
        <p class="text-white/30 font-bold uppercase text-[11px] tracking-[0.4em] italic">
          LeiriaDetail — Condições Gerais de Operação
        </p>
      </div>

      <div class="max-w-4xl mx-auto space-y-12">
        
        <section class="p-10 rounded-3xl border border-white/5 bg-white/[0.01] group hover:border-[#3B82F6]/20 transition-colors duration-500 relative">
          <div class="absolute top-6 right-6 text-white/5 group-hover:text-[#3B82F6]/20 transition-colors">
            <ClipboardCheck class="h-10 w-10" />
          </div>
          
          <div class="flex items-center gap-4 mb-8">
            <span class="text-4xl font-black text-[#3B82F6] italic tracking-tight opacity-40">01.</span>
            <h2 class="text-2xl font-black text-white uppercase italic tracking-tight">Orçamentos e Avaliação</h2>
          </div>
          
          <p class="text-white/60 leading-relaxed text-lg font-light antialiased max-w-2xl border-l border-white/5 pl-8 group-hover:border-[#3B82F6]/40 transition-colors">
            Os preços apresentados no nosso website são estimativas baseadas em viaturas com um estado de conservação padrão. A <span class="text-white font-bold">LeiriaDetail</span> reserva-se o direito de ajustar o orçamento final após a inspeção presencial, caso sejam detetadas contaminações extremas ou danos não declarados.
          </p>
        </section>

        <section class="p-10 rounded-3xl border border-white/5 bg-white/[0.01] group hover:border-[#3B82F6]/20 transition-colors duration-500 relative">
          <div class="absolute top-6 right-6 text-white/5 group-hover:text-[#3B82F6]/20 transition-colors">
            <Scale class="h-10 w-10" />
          </div>

          <div class="flex items-center gap-4 mb-8">
            <span class="text-4xl font-black text-[#3B82F6] italic tracking-tight opacity-40">02.</span>
            <h2 class="text-2xl font-black text-white uppercase italic tracking-tight">Política de Cancelamento</h2>
          </div>
          
          <p class="text-white/60 leading-relaxed text-lg font-light antialiased max-w-2xl border-l border-white/5 pl-8 group-hover:border-[#3B82F6]/40 transition-colors">
            Trabalhamos exclusivamente por marcação para garantir o tempo e dedicação necessários a cada detalhe. Solicitamos que qualquer cancelamento ou reagendamento seja comunicado com um aviso prévio de pelo menos <span class="text-[#3B82F6] font-black italic uppercase">24 Horas</span>.
          </p>
        </section>

        <section class="p-10 rounded-3xl border border-white/5 bg-white/[0.01] group hover:border-[#3B82F6]/20 transition-colors duration-500 relative text-white">
          <div class="absolute top-6 right-6 text-white/5 group-hover:text-red-500/20 transition-colors">
            <AlertCircle class="h-10 w-10" />
          </div>

          <div class="flex items-center gap-4 mb-8">
            <span class="text-4xl font-black text-[#3B82F6] italic tracking-tight opacity-40">03.</span>
            <h2 class="text-2xl font-black text-white uppercase italic tracking-tight">Responsabilidade</h2>
          </div>
          
          <p class="text-white/60 leading-relaxed text-lg font-light antialiased max-w-2xl border-l border-white/5 pl-8 group-hover:border-red-500/40 transition-colors">
            A <span class="text-white font-bold">LeiriaDetail</span> não se responsabiliza por objetos de valor deixados no interior das viaturas. Recomendamos a remoção de todos os bens pessoais antes da entrega do veículo no nosso estúdio.
          </p>
        </section>

        <section class="p-10 rounded-3xl border border-white/5 bg-white/[0.01] group hover:border-[#3B82F6]/20 transition-colors duration-500 relative">
          <div class="absolute top-6 right-6 text-white/5 group-hover:text-[#3B82F6]/20 transition-colors">
            <FileText class="h-10 w-10" />
          </div>

          <div class="flex items-center gap-4 mb-8">
            <span class="text-4xl font-black text-[#3B82F6] italic tracking-tight opacity-40">04.</span>
            <h2 class="text-2xl font-black text-white uppercase italic tracking-tight">Resolução de Litígios</h2>
          </div>
          
          <div class="pl-8 border-l border-white/5 group-hover:border-[#3B82F6]/40 transition-colors space-y-6">
            <p class="text-white/60 leading-relaxed text-lg font-light antialiased max-w-2xl">
              Em caso de litígio, o consumidor pode recorrer a uma Entidade de Resolução Alternativa de Litígios de Consumo (RAL).
            </p>
            <div class="inline-flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 group-hover:border-[#3B82F6]/20 transition-all">
              <span class="text-[10px] font-black text-white/30 uppercase tracking-widest italic">Entidade:</span>
              <span class="text-sm font-black text-white uppercase italic tracking-tighter antialiased">CNIACC - Centro Nacional de Informação</span>
            </div>
          </div>
        </section>

      </div>
    </div>

    <div class="absolute bottom-10 left-10 text-[6rem] md:text-[10rem] font-black text-white/[0.02] italic pointer-events-none select-none uppercase tracking-tighter antialiased">
      Terms of Service
    </div>
  </section>
</template>

<style scoped>
.text-leiria-gradient {
  background: linear-gradient(to right, #3B82F6, #06B6D4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>