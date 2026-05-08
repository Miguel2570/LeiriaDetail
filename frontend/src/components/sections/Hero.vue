<script setup lang="ts">
import { Calendar, ArrowRight } from 'lucide-react';
</script>

<template>
  <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/20 via-[#06B6D4]/10 to-transparent"></div>
    
    <div class="container mx-auto px-4 relative z-10 text-center space-y-8">
      <div class="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[#3B82F6]/20 to-[#06B6D4]/20 border border-[#3B82F6]/30">
        <span class="text-sm font-medium text-[#3B82F6]">Detalhe Profissional em Leiria</span>
      </div>

      <h1 class="text-5xl md:text-7xl font-bold leading-tight">
        O teu carro merece <span class="text-leiria-gradient">o melhor</span>
      </h1>

      <p class="text-xl text-gray-500 max-w-2xl mx-auto">
        Detalhe profissional, resultados reais. Do exterior ao interior, tratamos do teu carro como se fosse nosso.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <router-link to="/marcacao" class="btn-primary flex items-center gap-2">
          <Calendar class="h-5 w-5" /> Agendar Agora
        </router-link>
        <router-link to="/servicos" class="px-8 py-3 border rounded-lg flex items-center gap-2 hover:bg-gray-50">
          Ver Serviços <ArrowRight class="h-5 w-5" />
        </router-link>
      </div>

      <div class="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t border-gray-100">
        <div><div class="text-3xl font-bold text-[#3B82F6]">500+</div><p class="text-sm text-gray-400">Carros tratados</p></div>
        <div><div class="text-3xl font-bold text-[#3B82F6]">4.9★</div><p class="text-sm text-gray-400">Avaliação média</p></div>
        <div><div class="text-3xl font-bold text-[#3B82F6]">3 anos</div><p class="text-sm text-gray-400">De experiência</p></div>
      </div>
    </div>
  </section>
</template>