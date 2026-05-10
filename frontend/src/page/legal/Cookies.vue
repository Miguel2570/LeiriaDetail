<script setup lang="ts">
import { Cookie, Settings, BarChart3, ShieldCheck, FileText } from 'lucide-vue-next'
</script>

<template>
  <section class="py-24 bg-[#050505] relative overflow-hidden min-h-screen antialiased text-white">
    
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-[#3B82F6]/5 blur-[130px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-4 max-w-6xl relative z-10">
      
      <div class="text-center mb-24 border-b border-white/5 pb-16">
        <div class="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 shadow-inner">
          <Cookie class="h-4 w-4 text-[#3B82F6]" />
          <span class="text-[10px] font-black text-white/70 uppercase tracking-[0.4em] italic">Tracking Protocol</span>
        </div>
        
        <h1 class="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.8] mb-10 drop-shadow-2xl">
          POLÍTICA DE <br> <span class="text-leiria-gradient">COOKIES</span>
        </h1>
        
        <p class="text-white/30 font-bold uppercase text-[11px] tracking-[0.4em] italic">
          LeiriaDetail — Gestão de Dados e Performance Digital
        </p>
      </div>

      <div class="max-w-4xl mx-auto space-y-12">
        
        <section class="p-10 rounded-3xl border border-white/5 bg-white/[0.01] group hover:border-[#3B82F6]/20 transition-colors duration-500 relative">
          <div class="flex items-center gap-4 mb-8">
            <span class="text-4xl font-black text-[#3B82F6] italic tracking-tight opacity-40">01.</span>
            <h2 class="text-2xl font-black text-white uppercase italic tracking-tight">O que são Cookies?</h2>
          </div>
          
          <p class="text-white/70 leading-relaxed text-lg font-light antialiased max-w-2xl border-l border-white/5 pl-8 group-hover:border-[#3B82F6]/40 transition-colors">
            Cookies são pequenos ficheiros de texto armazenados no seu navegador para otimizar a performance técnica e garantir o correto funcionamento dos sistemas de agendamento online. Na <span class="text-white font-bold italic">LeiriaDetail</span>, utilizamos esta tecnologia para elevar a sua experiência e garantir a segurança da navegação.
          </p>
        </section>

        <section class="p-10 rounded-3xl border border-white/5 bg-white/[0.01] group hover:border-[#3B82F6]/20 transition-colors duration-500">
          <div class="flex items-center gap-4 mb-12">
            <span class="text-4xl font-black text-[#3B82F6] italic tracking-tight opacity-40">02.</span>
            <h2 class="text-2xl font-black text-white uppercase italic tracking-tight">Cookies Utilizados</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 pl-8 border-l border-white/5 group-hover:border-[#3B82F6]/40 transition-colors">
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <ShieldCheck class="h-5 w-5 text-[#3B82F6]" />
                <h4 class="text-sm font-black text-white uppercase tracking-widest italic">Cookies Técnicos</h4>
              </div>
              <p class="text-white/40 text-xs font-medium leading-relaxed uppercase tracking-wider">
                Essenciais para manter a sua sessão ativa durante o processo de marcação e garantir a integridade da segurança do website. Estes cookies não recolhem informação para marketing.
              </p>
            </div>

            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <BarChart3 class="h-5 w-5 text-[#06B6D4]" />
                <h4 class="text-sm font-black text-white uppercase tracking-widest italic">Cookies Analíticos</h4>
              </div>
              <p class="text-white/40 text-xs font-medium leading-relaxed uppercase tracking-wider">
                Utilizamos dados anónimos (Google Analytics) para perceber como os clientes interagem com o nosso estúdio online, permitindo-nos otimizar o fluxo de agendamento e serviços.
              </p>
            </div>
          </div>
        </section>

        <section class="p-10 rounded-3xl border border-white/5 bg-white/[0.01] group hover:border-[#3B82F6]/20 transition-colors duration-500 relative text-white">
          <div class="absolute top-6 right-6 text-white/5 group-hover:text-[#3B82F6]/20 transition-colors">
            <Settings class="h-10 w-10" />
          </div>

          <div class="flex items-center gap-4 mb-8">
            <span class="text-4xl font-black text-[#3B82F6] italic tracking-tight opacity-40">03.</span>
            <h2 class="text-2xl font-black text-white uppercase italic tracking-tight">Gestão de Cookies</h2>
          </div>
          
          <div class="pl-8 border-l border-white/5 group-hover:border-[#3B82F6]/40 transition-colors space-y-8">
            <p class="text-white/70 leading-relaxed text-lg font-light antialiased max-w-2xl">
              Pode configurar o seu navegador para recusar cookies em qualquer altura. Alertamos, no entanto, que partes críticas da nossa plataforma técnica poderão perder funcionalidade ou impedir a conclusão de marcações.
            </p>
            
            <div class="inline-flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 group-hover:border-[#3B82F6]/20 transition-all">
              <FileText class="h-4 w-4 text-white/20" />
              <p class="text-[10px] font-black text-white/40 uppercase tracking-widest leading-relaxed">
                Consulte as definições de privacidade do seu browser <br> (Chrome, Safari, Firefox) para gerir permissões.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>

    <div class="absolute bottom-10 right-10 text-[6rem] md:text-[10rem] font-black text-white/[0.02] italic pointer-events-none select-none uppercase tracking-tighter antialiased">
      Cookie Policy
    </div>
  </section>
</template>

<style scoped>
.text-leiria-gradient {
  background: linear-gradient(to right, #3B82F6, #06B6D4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>