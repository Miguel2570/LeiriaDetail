<script setup lang="ts">
import Hero from '@/components/sections/Hero.vue'
import HowItWorks from '@/components/sections/HowItWorks.vue'
import Benefits from '@/components/sections/Benefits.vue'
import ServicePacks from '@/components/sections/ServicePacks.vue' 
import Testimonials from '@/components/sections/Testimonials.vue'
import FAQ from '@/components/sections/FAQ.vue'
import FinalCTA from '@/components/sections/FinalCTA.vue'
import FeaturedServices from '@/components/sections/FeaturedServices.vue'
</script>

<template>
  <div>
    <Hero />
    <Benefits />
    <FeaturedServices/>
    <ServicePacks /> 
    <HowItWorks />
    <Testimonials />
    <FAQ />
    <FinalCTA />
  </div>
</template>