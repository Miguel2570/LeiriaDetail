<script setup lang="ts">
import { ref } from 'vue'
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-vue-next'

const form = ref({ name: '', email: '', phone: '', message: '' })

const contactInfo = [
  { icon: MapPin, title: 'Sede Técnica', detail: 'Zona Industrial, Leiria, Portugal' },
  { icon: Phone, title: 'Contacto Direto', detail: '+351 912 345 678' },
  { icon: Mail, title: 'E-mail Geral', detail: 'geral@leiriadetail.pt' },
  { icon: Clock, title: 'Horário do Estúdio', detail: 'Seg - Sex: 09:00 - 18:00' }
]

const handleSubmit = () => {
  console.log('Dados do contacto:', form.value)
  // Aqui ligarias à tua API do backend no futuro
}
</script>

<template>
  <section class="py-24 bg-[#050505] relative overflow-hidden min-h-screen">
    
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#00D8FF]/5 blur-[120px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-4 max-w-6xl relative z-10">
      
      <div class="text-center mb-16 border-b border-white/5 pb-12">
        <div class="inline-flex items-center gap-3 mb-6">
          <MessageSquare class="h-4 w-4 text-[#2563EB]" />
          <span class="text-[10px] font-black text-[#2563EB] uppercase tracking-[0.5em] italic">Canais Oficiais</span>
        </div>
        
        <h1 class="text-5xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none">
          FALE <span class="text-leiria-gradient">CONNOSCO</span>
        </h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        
        <div class="lg:col-span-5 flex flex-col justify-between gap-6">
          <div class="space-y-4">
            <h2 class="text-2xl font-black text-white uppercase italic mb-6">Informações de <span class="text-[#2563EB]">Apoio</span></h2>
            
            <div v-for="info in contactInfo" :key="info.title" 
                 class="p-5 border border-white/5 bg-white/[0.01] rounded-2xl flex items-center gap-4">
              <div class="h-10 w-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] shrink-0">
                <component :is="info.icon" class="h-5 w-5" />
              </div>
              <div>
                <h4 class="text-[10px] font-black text-white/30 uppercase tracking-widest">{{ info.title }}</h4>
                <p class="text-sm font-bold text-white uppercase italic tracking-tight mt-0.5">{{ info.detail }}</p>
              </div>
            </div>
          </div>

          <div class="p-6 rounded-3xl bg-gradient-to-br from-[#2563EB]/10 to-transparent border border-[#2563EB]/20">
            <h3 class="text-sm font-black text-white uppercase tracking-wider mb-2">Pretende um orçamento personalizado?</h3>
            <p class="text-[11px] text-gray-400 uppercase tracking-wide leading-relaxed">
              Aconselhamos sempre uma visita ao estúdio para medição da espessura da pintura e avaliação técnica dos defeitos antes de fixar um valor final.
            </p>
          </div>
        </div>

        <div class="lg:col-span-7 bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-white/40 uppercase tracking-widest block pl-2">Nome Completo</label>
                <input 
                  v-model="form.name" 
                  type="text" 
                  placeholder="EX: MIGUEL SILVA" 
                  class="w-full pl-6 pr-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-white text-xs font-black uppercase italic outline-none focus:border-[#2563EB] focus:bg-white/[0.05] transition-all tracking-widest"
                  required
                />
              </div>
              
              <div class="space-y-2">
                <label class="text-[10px] font-black text-white/40 uppercase tracking-widest block pl-2">E-mail</label>
                <input 
                  v-model="form.email" 
                  type="email" 
                  placeholder="EX: GERAL@EMAIL.COM" 
                  class="w-full pl-6 pr-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-white text-xs font-black uppercase italic outline-none focus:border-[#2563EB] focus:bg-white/[0.05] transition-all tracking-widest"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-white/40 uppercase tracking-widest block pl-2">Contacto Telefónico (Opcional)</label>
              <input 
                v-model="form.phone" 
                type="text" 
                placeholder="EX: 912 345 678" 
                class="w-full pl-6 pr-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-white text-xs font-black uppercase italic outline-none focus:border-[#2563EB] focus:bg-white/[0.05] transition-all tracking-widest"
              />
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-white/40 uppercase tracking-widest block pl-2">A Sua Mensagem / Viatura</label>
              <textarea 
                v-model="form.message" 
                rows="4" 
                placeholder="DESCREVA O ESTADO DA VIATURA OU O SERVIÇO PRETENDIDO..." 
                class="w-full pl-6 pr-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-white text-xs font-black uppercase italic outline-none focus:border-[#2563EB] focus:bg-white/[0.05] transition-all tracking-widest resize-none"
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              class="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white font-black h-14 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_20px_rgba(37,99,235,0.2)] text-xs uppercase tracking-widest italic"
            >
              <Send class="h-4 w-4" /> Enviar Mensagem Técnica
            </button>

          </form>
        </div>

      </div>

    </div>
  </section>
</template>

<style scoped>
.text-leiria-gradient {
  background: linear-gradient(to right, #2563EB, #00D8FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

input::placeholder, textarea::placeholder {
  color: rgba(255, 255, 255, 0.15);
  font-weight: 900;
}
</style>