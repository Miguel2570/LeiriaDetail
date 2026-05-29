<script setup lang="ts">
import Hero from '@/components/sections/Hero.vue'
import HowItWorks from '@/components/sections/HowItWorks.vue'
import Benefits from '@/components/sections/Benefits.vue'
import ServicePacks from '@/components/sections/ServicePacks.vue' 
import Testimonials from '@/components/sections/Testimonials.vue'
import FAQ from '@/components/sections/FAQ.vue'
import FinalCTA from '@/components/sections/FinalCTA.vue'
import FeaturedServices from '@/components/sections/FeaturedServices.vue'
import { useHead } from '@vueuse/head'
// Importa o teu separador
import Separator from '@/components/ui/utility/Separator.vue'

useHead({
  title: 'LeiriaDetail - Detalhe Automóvel de Excelência em Leiria',
  meta: [
    { name: 'description', content: 'Serviços profissionais de detalhe automóvel em Leiria. Lavagem, polimento, proteção cerâmica e correção de pintura. Agende online.' },
    { property: 'og:title', content: 'LeiriaDetail - Detalhe Automóvel em Leiria' },
    { property: 'og:description', content: 'Detalhe automóvel de excelência. Agende o seu serviço.' },
    { property: 'og:type', content: 'website' },
  ]
})
</script>

<template>
  <div>
    <Hero />
    <Separator class="bg-black" />
    
    <Benefits />
    <Separator class="bg-black" />
    
    <FeaturedServices/>
    <Separator class="bg-black" />
    
    <ServicePacks /> 
    <Separator class="bg-black" />
    
    <HowItWorks />
    <Separator class="bg-black" />
    
    <Testimonials />
    <Separator class="bg-black" />
    
    <FAQ />
    <Separator class="bg-black" />
    
    <FinalCTA />
  </div>
</template>