<script setup lang="ts">
import Hero from '@/components/sections/Hero.vue'
import HowItWorks from '@/components/sections/HowItWorks.vue'
import Benefits from '@/components/sections/Benefits.vue'
import ServicePacks from '@/components/sections/ServicePacks.vue' 
import Testimonials from '@/components/sections/Testimonials.vue'
import FAQ from '@/components/sections/FAQ.vue'
import FinalCTA from '@/components/sections/FinalCTA.vue'
import FeaturedServices from '@/components/sections/FeaturedServices.vue'

// Importa o teu separador
import Separator from '@/components/ui/utility/Separator.vue'
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