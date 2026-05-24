<script setup lang="ts">
import { MessageSquare, FileText } from 'lucide-vue-next'
</script>

<template>
  <section class="py-32 relative overflow-hidden bg-[#020204]">
    
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2563EB]/8 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-4 text-center max-w-3xl relative z-10">
      
      <div class="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
        <MessageSquare class="w-4 h-4 text-[#00D8FF]" />
        <span class="text-[10px] font-black text-[#00D8FF] uppercase tracking-[0.3em]">Não fiques com dúvidas</span>
      </div>

      <h2 class="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-6">
        FALA <span class="text-leiria-gradient">CONNOSCO</span>
      </h2>
      
      <p class="text-gray-400 text-sm mb-10 max-w-md mx-auto">
        Pronto para transformar o seu carro? Fale connosco hoje mesmo.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="https://wa.me/351912345678" target="_blank" class="w-full sm:w-auto">
          <button class="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-black px-8 py-4 rounded-xl uppercase text-xs tracking-widest hover:shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
            <MessageSquare class="h-4 w-4" /> WhatsApp
          </button>
        </a>
        
        <router-link to="/contacto" class="w-full sm:w-auto">
          <button class="w-full bg-white/5 border border-white/10 text-white font-black px-8 py-4 rounded-xl uppercase text-xs tracking-widest hover:bg-white/10 hover:border-[#00D8FF]/30 transition-all duration-300 flex items-center justify-center gap-3">
            <FileText class="h-4 w-4" /> Pedir Orçamento
          </button>
        </router-link>
      </div>

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