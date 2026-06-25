<script setup lang="ts">
import { ref, useTemplateRef, onMounted } from 'vue'
import { Award, MapPin, Clock, Star } from 'lucide-vue-next'

// Counter values
const carsCount = ref(0)
const ratingCount = ref(0)
const yearsCount = ref(0)
const satisfactionCount = ref(0)

// Target numbers
const targets = {
  cars: 528,
  rating: 5.0,
  years: 3,
  satisfaction: 100
}

// Animation state
let animationStarted = false
const sectionRef = useTemplateRef('aboutSection')

// Animate function
const animateNumbers = () => {
  if (animationStarted) return
  animationStarted = true
  
  const duration = 2000 // 2 seconds
  const stepTime = 20 // ms per step
  
  // Cars (528)
  const carsSteps = targets.cars / (duration / stepTime)
  let carsCurrent = 0
  const carsInterval = setInterval(() => {
    carsCurrent += carsSteps
    if (carsCurrent >= targets.cars) {
      carsCount.value = targets.cars
      clearInterval(carsInterval)
    } else {
      carsCount.value = Math.floor(carsCurrent)
    }
  }, stepTime)
  
  // Years (3)
  const yearsSteps = targets.years / (duration / stepTime)
  let yearsCurrent = 0
  const yearsInterval = setInterval(() => {
    yearsCurrent += yearsSteps
    if (yearsCurrent >= targets.years) {
      yearsCount.value = targets.years
      clearInterval(yearsInterval)
    } else {
      yearsCount.value = Math.floor(yearsCurrent)
    }
  }, stepTime)
  
  // Satisfaction (100)
  const satSteps = targets.satisfaction / (duration / stepTime)
  let satCurrent = 0
  const satInterval = setInterval(() => {
    satCurrent += satSteps
    if (satCurrent >= targets.satisfaction) {
      satisfactionCount.value = targets.satisfaction
      clearInterval(satInterval)
    } else {
      satisfactionCount.value = Math.floor(satCurrent)
    }
  }, stepTime)
  
  // Rating (5.0) - show as 5.0 immediately
  ratingCount.value = targets.rating
}

// Intersection Observer to trigger animation when section is visible
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !animationStarted) {
        animateNumbers()
      }
    },
    { threshold: 0.3 } // Trigger when 30% of section is visible
  )
  
  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
})
</script>

<template>
  <!-- ✅ Added background: bg-[#111115] (slightly lighter than hero) -->
  <section ref="aboutSection" class="py-24 px-4 relative z-10 bg-black">
    <div class="container mx-auto max-w-6xl">
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        <!-- Left side - Text -->
        <div>
          <div class="inline-flex items-center gap-2 bg-[#0A0A0F]/50 border border-[#22222A] rounded-full px-4 py-2 mb-6">
            <Award class="w-4 h-4 text-[#06B6D4]" />
            <span class="text-[10px] font-black text-[#06B6D4] uppercase tracking-[0.3em]">Sobre Nós</span>
          </div>
          
          <h2 class="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-6">
            Paixão por <span class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">detalhe</span>
          </h2>
          
          <p class="text-gray-300 text-base leading-relaxed mb-6">
            A LeiriaDetail nasceu da paixão por automóveis e da exigência por um serviço de excelência. 
            Somos especialistas em detalhe automóvel, trazendo um serviço premium diretamente até si.
          </p>
          
          <p class="text-gray-300 text-base leading-relaxed mb-8">
            Utilizamos produtos certificados e equipamento profissional para garantir um acabamento 
            impecável em cada veículo. Do exterior ao interior, cada detalhe é tratado com precisão cirúrgica.
          </p>
          
          <div class="flex flex-wrap gap-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6]/20 to-[#06B6D4]/10 flex items-center justify-center">
                <MapPin class="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div>
                <p class="text-xs text-gray-400">Serviço em</p>
                <p class="text-sm font-bold text-white">Leiria e região</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B82F6]/20 to-[#06B6D4]/10 flex items-center justify-center">
                <Clock class="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div>
                <p class="text-xs text-gray-400">Horário flexível</p>
                <p class="text-sm font-bold text-white">3ª a Domingo</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right side - Stats Card with Animated Numbers -->
        <div class="bg-gradient-to-br from-[#0A0A0F] to-[#0D0D12] border border-[#22222A] rounded-3xl p-8 shadow-xl">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-1 bg-[#3B82F6]/10 px-4 py-1.5 rounded-full">
              <Star class="w-3.5 h-3.5 text-[#06B6D4] fill-[#06B6D4]" />
              <span class="text-[11px] font-bold text-[#06B6D4] uppercase tracking-wider">Excelência Comprovada</span>
            </div>
          </div>
          
          <div class="space-y-6">
            <!-- Carros detalhados -->
            <div class="flex justify-between items-center border-b border-[#22222A] pb-4">
              <span class="text-gray-400 text-sm">Carros detalhados</span>
              <span class="text-3xl font-black text-white">{{ carsCount }}+</span>
            </div>
            
            <!-- Avaliação Google -->
            <div class="flex justify-between items-center border-b border-[#22222A] pb-4">
              <span class="text-gray-400 text-sm">Avaliação Google</span>
              <div class="flex items-center gap-1">
                <span class="text-[#06B6D4] text-xl">★</span>
                <span class="text-3xl font-black text-white">{{ ratingCount }}</span>
              </div>
            </div>
            
            <!-- Anos de experiência -->
            <div class="flex justify-between items-center border-b border-[#22222A] pb-4">
              <span class="text-gray-400 text-sm">Anos de experiência</span>
              <span class="text-3xl font-black text-white">{{ yearsCount }}+</span>
            </div>
            
            <!-- Clientes satisfeitos -->
            <div class="flex justify-between items-center">
              <span class="text-gray-400 text-sm">Clientes satisfeitos</span>
              <span class="text-3xl font-black text-white">{{ satisfactionCount }}%</span>
            </div>
          </div>

          <!-- TODO: Add photo of your work space here later -->
          <!-- 
          <div class="mt-6 pt-6 border-t border-[#22222A] text-center">
            <img src="/images/workspace.jpg" alt="Nosso espaço de trabalho" class="rounded-xl w-full">
          </div>
          -->
        </div>
        
      </div>
    </div>
  </section>
</template>