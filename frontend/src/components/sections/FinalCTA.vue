<script setup lang="ts">
import { MessageSquare, FileText } from 'lucide-vue-next'
</script>

<template>
  <section class="py-32 relative overflow-hidden">
    
    <div class="absolute inset-0 bg-gradient-to-t from-transparent via-[#0A0A0F]/90 to-transparent -z-10"></div>

    <div class="container mx-auto px-4 text-center max-w-5xl relative z-10">
      
      <p class="text-xs md:text-sm font-black text-leiria-gradient uppercase tracking-[0.4em] mb-6 italic antialiased">
        Não fiques com dúvidas,
      </p>

      <h2 class="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter mb-14 drop-shadow-2xl">
        FALA <span class="text-white/90">CONNOSCO</span>
      </h2>

      <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
        
        <a href="https://wa.me/351912345678" target="_blank" class="w-full sm:w-auto">
          <button class="group w-full sm:w-auto bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-black px-12 py-5 rounded-2xl uppercase text-xs tracking-[0.2em] shadow-[0_15px_35px_rgba(59,130,246,0.3)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.5)] hover:-translate-y-1.5 transition-all duration-300 flex items-center justify-center gap-3">
            <MessageSquare class="h-5 w-5 transition-transform group-hover:scale-110" /> 
            Enviar Whatsapp
          </button>
        </a>
        
        <router-link to="/precos" class="w-full sm:w-auto">
          <button class="w-full sm:w-auto bg-transparent border-2 border-white/10 text-white font-black px-12 py-5 rounded-2xl uppercase text-xs tracking-[0.2em] hover:bg-white hover:text-[#0A0A0F] hover:border-white transition-all duration-300 flex items-center justify-center gap-3">
            <FileText class="h-5 w-5" /> 
            Pedir Orçamento
          </button>
        </router-link>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Gradiente oficial da marca Leiria Detalhe */
.text-leiria-gradient {
  background: linear-gradient(to right, #3B82F6, #06B6D4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Otimização para dispositivos com ecrãs de alta densidade */
.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>