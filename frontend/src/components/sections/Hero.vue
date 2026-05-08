<script setup lang="ts">
import Button from '../ui/Button.vue'
import { Calendar, ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <section class="py-20 px-4">
    <div class="container mx-auto text-center max-w-4xl">
      <div class="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 border border-blue-100">
        <span class="text-sm font-medium text-[#3B82F6]">O melhor detalhe de Leiria</span>
      </div>

      <h1 class="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
        Leiria<span class="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#06B6D4]">Detail</span>
      </h1>

      <p class="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        Detalhe automóvel com qualidade e consistência. O teu carro merece o tratamento profissional que só nós oferecemos.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link to="/marcacao">
          <Button class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white h-12 px-8 font-bold">
            <Calendar class="mr-2 h-5 w-5" /> Agendar Agora
          </Button>
        </router-link>
        
        <router-link to="/servicos">
          <Button variant="outline" class="h-12 px-8">
            Ver Serviços <ArrowRight class="ml-2 h-5 w-5" />
          </Button>
        </router-link>
      </div>
    </div>
  </section>
</template>