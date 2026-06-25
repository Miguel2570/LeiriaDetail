<template>
  <div>
    <div ref="heroSection"><Hero /></div>
    <Separator class="bg-black" />
    
    <div ref="aboutSection"><AboutUs /></div>
    <Separator class="bg-black" />
    
    <div ref="benefitsSection"><Benefits /></div>
    <Separator class="bg-black" />
    
    <div ref="howItWorksSection"><HowItWorks /></div>

    <div ref="testimonialsSection"><Testimonials /></div>   
     
    <div ref="ctaSection"><FinalCTA /></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Hero from '@/components/sections/Hero.vue'
import AboutUs from '@/components/sections/About.vue'
import HowItWorks from '@/components/sections/HowItWorks.vue'
import Benefits from '@/components/sections/Benefits.vue'
import Testimonials from '@/components/sections/Reviews.vue'
import FinalCTA from '@/components/sections/FinalCTA.vue'
import { useHead } from '@vueuse/head'
import Separator from '@/components/ui/utility/Separator.vue'
import { fadeInUp, parallax } from '@/assets/animations/gsap'

useHead({
  title: 'LeiriaDetail - Detalhe Automóvel de Excelência em Leiria',
  meta: [
    { name: 'description', content: 'Serviços profissionais de detalhe automóvel em Leiria. Lavagem, polimento, proteção cerâmica e correção de pintura. Agende online.' },
    { property: 'og:title', content: 'LeiriaDetail - Detalhe Automóvel em Leiria' },
    { property: 'og:description', content: 'Detalhe automóvel de excelência. Agende o seu serviço.' },
    { property: 'og:type', content: 'website' },
  ]
})

const heroSection = ref(null)
const aboutSection = ref(null)
const benefitsSection = ref(null)
const howItWorksSection = ref(null)
const testimonialsSection = ref(null)
const ctaSection = ref(null)

onMounted(() => {
  // ✅ Hero aparece ao carregar
  fadeInUp(heroSection.value)

  // ✅ Secções aparecem ao fazer scroll
  fadeInUp(aboutSection.value, 0.1)
  fadeInUp(benefitsSection.value, 0.2)
  fadeInUp(howItWorksSection.value, 0.3)
  fadeInUp(testimonialsSection.value, 0.4)
  fadeInUp(ctaSection.value, 0.5)

  // ✅ Parallax nos backgrounds
  parallax('.parallax-bg')
})
</script>