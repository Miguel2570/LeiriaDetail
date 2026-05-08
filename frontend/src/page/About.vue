<script setup lang="ts">
import { Sparkles, Shield, Heart, Award } from 'lucide-vue-next'

const values = [
  { icon: Sparkles, title: 'Qualidade', description: 'Produtos premium e técnicas profissionais em cada serviço' },
  { icon: Shield, title: 'Transparência', description: 'Preços claros e comunicação honesta com cada cliente' },
  { icon: Heart, title: 'Cuidado', description: 'Tratamos cada veículo com a máxima dedicação e atenção' },
  { icon: Award, title: 'Excelência', description: 'Compromisso com resultados que superam expectativas' }
]
</script>

<template>
  <div class="py-16">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">
          Sobre <span class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">Nós</span>
        </h1>
        <p class="text-xl text-muted-foreground">Detalhe com qualidade e consistência [cite: 5]</p>
      </div>

      <section class="mb-12">
        <h2 class="text-3xl font-bold mb-6">A Nossa Missão</h2>
        <p class="text-lg text-muted-foreground leading-relaxed">
          Na LeiriaDetail, a nossa missão é oferecer serviços de detalhe automóvel de excelência[cite: 6].
        </p>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="value in values" :key="value.title" class="p-6 border border-gray-200 rounded-lg shadow-[0_0_12px_rgba(0,0,0,0.1)]">
          <div class="h-12 w-12 rounded-lg bg-gradient-to-r from-[#3B82F6]/20 to-[#06B6D4]/20 flex items-center justify-center mb-4">
            <component :is="value.icon" class="h-6 w-6 text-[#3B82F6]" />
          </div>
          <h3 class="text-xl font-semibold mb-2">{{ value.title }}</h3>
          <p class="text-muted-foreground">{{ value.description }} [cite: 10]</p>
        </div>
      </section>
    </div>
  </div>
</template>