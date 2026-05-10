<script setup lang="ts">
import { ref } from 'vue'
import { MapPin, Phone, Clock, Send, Navigation, ExternalLink } from 'lucide-vue-next'

const form = ref({ name: '', email: '', message: '' })
const submit = () => alert('Pedido submetido! Entraremos em contacto brevemente.')

const contactInfo = [
  { icon: MapPin, t: 'Localização', d: 'Leiria, Portugal' },
  { icon: Phone, t: 'Telefone', d: '+351 912 345 678' },
  { icon: Clock, t: 'Horário', d: 'Seg-Sáb: 09:00 - 19:00' }
]
</script>

<template>
  <section class="py-24 bg-[#050505] relative overflow-hidden">
    
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#3B82F6]/5 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-4 max-w-6xl relative z-10">
      
      <div class="mb-20 border-b border-white/5 pb-12">
        <span class="text-[#3B82F6] font-black uppercase tracking-[0.5em] text-[10px] mb-4 block italic">Direct Line</span>
        <h1 class="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
          CONTACTA O <span class="text-leiria-gradient">ESTÚDIO</span>
        </h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        <div class="lg:col-span-4 space-y-12">
          
          <div class="space-y-8">
            <div v-for="info in contactInfo" :key="info.t" class="flex items-center gap-5 group">
              <div class="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:bg-[#3B82F6] group-hover:text-white group-hover:border-[#3B82F6] transition-all duration-500 shrink-0">
                <component :is="info.icon" class="h-5 w-5" />
              </div>
              <div>
                <h4 class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">{{ info.t }}</h4>
                <p class="text-white font-black italic uppercase tracking-tight text-sm md:text-base">{{ info.d }}</p>
              </div>
            </div>
          </div>

          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-[2rem] blur-xl opacity-10 group-hover:opacity-30 transition-opacity duration-700"></div>
            
            <div class="relative h-64 w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-[#0A0A0F]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49156.4678225575!2d-8.850404!3d39.743621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd22731389304947%3A0x400ebbde4ec13c0!2sLeiria!5e0!3m2!1spt-PT!2spt!4v1715310000000!5m2!1spt-PT!2spt" 
                width="100%" 
                height="100%" 
                style="border:0;" 
                allowfullscreen="true" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>

              <a href="https://maps.google.com" target="_blank" class="absolute bottom-4 right-4 bg-[#3B82F6] text-white p-2.5 rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all">
                <Navigation class="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div class="lg:col-span-8">
          <form @submit.prevent="submit" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            
            <div class="space-y-2">
              <label class="text-[9px] font-black text-white/30 uppercase ml-1 tracking-[0.3em]">Nome</label>
              <input v-model="form.name" type="text" placeholder="EX: JOÃO SILVA" 
                     class="w-full p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-white text-xs font-black uppercase italic outline-none focus:border-[#3B82F6] focus:bg-white/[0.04] transition-all" required />
            </div>

            <div class="space-y-2">
              <label class="text-[9px] font-black text-white/30 uppercase ml-1 tracking-[0.3em]">Email</label>
              <input v-model="form.email" type="email" placeholder="EX: CONTACTO@EMAIL.COM" 
                     class="w-full p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-white text-xs font-black uppercase italic outline-none focus:border-[#3B82F6] focus:bg-white/[0.04] transition-all" required />
            </div>

            <div class="md:col-span-2 space-y-2">
              <label class="text-[9px] font-black text-white/30 uppercase ml-1 tracking-[0.3em]">O que precisas de saber?</label>
              <textarea v-model="form.message" rows="6" placeholder="DESCREVE O TEU PEDIDO..." 
                        class="w-full p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-white text-xs font-black uppercase italic outline-none focus:border-[#3B82F6] focus:bg-white/[0.04] transition-all resize-none" required></textarea>
            </div>

            <div class="md:col-span-2 pt-4">
              <button type="submit" class="group w-full py-6 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-black uppercase italic tracking-[0.3em] rounded-2xl shadow-[0_15px_35px_rgba(59,130,246,0.2)] hover:shadow-[#3B82F6]/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-4 text-sm">
                <Send class="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                Submeter Pedido
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>

    <div class="absolute bottom-6 left-6 text-[3rem] font-black text-white/[0.02] italic pointer-events-none select-none uppercase tracking-tighter">
      LeiriaDetail
    </div>
  </section>
</template>

<style scoped>
.text-leiria-gradient {
  background: linear-gradient(to right, #3B82F6, #06B6D4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Estilização do placeholder para ser ultra-discreto */
input::placeholder, textarea::placeholder {
  color: rgba(255, 255, 255, 0.05);
  font-weight: 900;
}

/* Ajuste para o scrollbar da textarea caso seja necessário */
textarea::-webkit-scrollbar {
  width: 4px;
}
textarea::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.2);
  border-radius: 10px;
}
</style>