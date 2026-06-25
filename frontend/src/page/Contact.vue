<template>
  <section class="min-h-screen py-24 bg-[#0A0A0F] relative overflow-hidden">
    
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3B82F6]/6 blur-[150px] rounded-full pointer-events-none parallax-bg"></div>
    <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00D8FF]/4 blur-[120px] rounded-full pointer-events-none parallax-bg"></div>

    <div class="container mx-auto px-4 max-w-5xl relative z-10">
      
      <!-- Header -->
      <div class="text-center mb-16 contact-header">
        <div class="inline-flex items-center gap-2 bg-[#111115] border border-[#22222A] rounded-full px-4 py-2 mb-6 header-badge">
          <MessageSquare class="w-4 h-4 text-[#00D8FF]" />
          <span class="text-[10px] font-black text-[#00D8FF] uppercase tracking-[0.3em]">Contactos</span>
        </div>
        <h1 class="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-6 header-title">
          Fale <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">Connosco</span>
        </h1>
        <p class="text-gray-400 text-base max-w-xl mx-auto header-subtitle">
          Estamos prontos para responder a todas as suas questões. Contacte-nos por telefone, email ou visite-nos.
        </p>
      </div>

      <!-- Grid de Contactos -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        
        <a href="tel:+351912345678" class="contact-card bg-[#111115] border border-[#22222A] rounded-2xl p-8 text-center hover:border-[#3B82F6]/30 transition-all duration-300 group">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2563EB]/20 to-[#00D8FF]/10 border border-[#3B82F6]/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
            <Phone class="w-6 h-6 text-[#00D8FF]" />
          </div>
          <h3 class="text-white font-bold text-lg mb-2">Telefone</h3>
          <p class="text-gray-400 text-sm group-hover:text-[#00D8FF] transition-colors">+351 912 345 678</p>
        </a>

        <a href="mailto:info@leiriadetail.pt" class="contact-card bg-[#111115] border border-[#22222A] rounded-2xl p-8 text-center hover:border-[#3B82F6]/30 transition-all duration-300 group">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2563EB]/20 to-[#00D8FF]/10 border border-[#3B82F6]/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
            <Mail class="w-6 h-6 text-[#00D8FF]" />
          </div>
          <h3 class="text-white font-bold text-lg mb-2">Email</h3>
          <p class="text-gray-400 text-sm group-hover:text-[#00D8FF] transition-colors">leiriadetail@gmail.com</p>
        </a>

        <a href="https://maps.google.com/?q=Leiria" target="_blank" class="contact-card bg-[#111115] border border-[#22222A] rounded-2xl p-8 text-center hover:border-[#3B82F6]/30 transition-all duration-300 group">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2563EB]/20 to-[#00D8FF]/10 border border-[#3B82F6]/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
            <MapPin class="w-6 h-6 text-[#00D8FF]" />
          </div>
          <h3 class="text-white font-bold text-lg mb-2">Morada</h3>
          <p class="text-gray-400 text-sm group-hover:text-[#00D8FF] transition-colors">Rua Exemplo, 123<br>2400-000 Leiria</p>
        </a>

      </div>

      <!-- Horário + Formulário -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        
        <div class="schedule-section bg-[#111115] border border-[#22222A] rounded-2xl p-8">
          <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Clock class="w-5 h-5 text-[#00D8FF]" /> Horário de Funcionamento
          </h3>
          <div class="space-y-3">
            <div v-for="schedule in schedules" :key="schedule.day" class="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
              <span class="text-gray-400 text-sm">{{ schedule.day }}</span>
              <span class="text-white text-sm font-bold">{{ schedule.hours }}</span>
            </div>
          </div>
        </div>

        <div class="form-section bg-[#111115] border border-[#22222A] rounded-2xl p-8">
          <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare class="w-5 h-5 text-[#00D8FF]" /> Pedir Informações
          </h3>
          
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input 
                v-model="form.name"
                type="text" 
                placeholder="Nome" 
                class="w-full bg-[#0A0A0F] border border-[#22222A] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#3B82F6] transition-colors"
                required
              />
              <input 
                v-model="form.phone"
                type="tel" 
                placeholder="Telemóvel" 
                class="w-full bg-[#0A0A0F] border border-[#22222A] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#3B82F6] transition-colors"
                required
              />
            </div>
            <input 
              v-model="form.email"
              type="email" 
              placeholder="Email" 
              class="w-full bg-[#0A0A0F] border border-[#22222A] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#3B82F6] transition-colors"
              required
            />
            <textarea 
              v-model="form.message"
              placeholder="Mensagem" 
              rows="3"
              class="w-full bg-[#0A0A0F] border border-[#22222A] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#3B82F6] transition-colors resize-none"
              required
            ></textarea>
            <button 
              type="submit"
              class="btn-3d w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
            >
              Enviar Mensagem
            </button>
          </form>
        </div>

      </div>

      <!-- Mapa -->
      <div class="map-section mt-8 bg-[#111115] border border-[#22222A] rounded-2xl overflow-hidden h-[300px]">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.123456789!2d-8.812345678901234!3d39.743456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDQ0JzM2LjQiTiA4wrA0OCc0NC40Ilc!5e0!3m2!1spt-PT!2spt!4v1234567890123" 
          width="100%" 
          height="100%" 
          style="border:0;" 
          allow="fullscreen"
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-vue-next';
import { heroAnimation, fadeInUp, scaleIn, parallax, button3DHover } from '@/assets/animations/gsap'

const form = ref({
  name: '',
  phone: '',
  email: '',
  message: ''
});

const schedules = [
  { day: 'Terça - Sexta', hours: '09:00 - 19:00' },
  { day: 'Segunda', hours: 'Fechado' },
  { day: 'Sábado', hours: '09:00 - 21:00' },
  { day: 'Domingo', hours: '09:00 - 21:00' },
];

const handleSubmit = () => {
  const text = `Olá! Sou ${form.value.name}. ${form.value.message} (Tel: ${form.value.phone}, Email: ${form.value.email})`;
  window.open(`https://wa.me/351912345678?text=${encodeURIComponent(text)}`, '_blank');
  form.value = { name: '', phone: '', email: '', message: '' };
};

onMounted(() => {
  // Header
  heroAnimation({
    badge: '.header-badge',
    title: '.header-title',
    subtitle: '.header-subtitle'
  })

  // Cards de contacto com scale (zoom suave)
  scaleIn('.contact-card', 0.1)

  // Horário e formulário
  fadeInUp('.schedule-section', 0.2)
  fadeInUp('.form-section', 0.3)

  // Mapa
  fadeInUp('.map-section', 0.4)

  // Parallax
  parallax('.parallax-bg', -80)

  // Botão 3D
  button3DHover('.btn-3d')
})
</script>