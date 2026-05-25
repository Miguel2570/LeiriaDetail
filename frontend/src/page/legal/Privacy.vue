<script setup lang="ts">
import { computed } from 'vue'
import { ShieldCheck, Database, Scale, Mail, FileText } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const dataItems = computed(() => [
  { t: t('privacy.sections.02.items.scheduling.title'), d: t('privacy.sections.02.items.scheduling.description') },
  { t: t('privacy.sections.02.items.billing.title'), d: t('privacy.sections.02.items.billing.description') },
  { t: t('privacy.sections.02.items.vehicle.title'), d: t('privacy.sections.02.items.vehicle.description') }
])
</script>

<template>
  <section class="py-24 bg-[#050505] relative overflow-hidden min-h-screen antialiased">
    
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-[#3B82F6]/5 blur-[130px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-4 max-w-6xl relative z-10">
      
      <div class="text-center mb-24 border-b border-white/5 pb-16">
        <div class="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 shadow-inner">
          <FileText class="h-4 w-4 text-[#3B82F6]" />
          <span class="text-[10px] font-black text-white/70 uppercase tracking-[0.4em] italic">{{ t('privacy.badge') }}</span>
        </div>
        
        <h1 class="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.8] mb-10 drop-shadow-2xl">
          {{ t('privacy.title1') }} <br> <span class="text-leiria-gradient">{{ t('privacy.title2') }}</span>
        </h1>
        
        <p class="text-white/30 font-bold uppercase text-[11px] tracking-[0.4em] italic">
          {{ t('privacy.subtitle') }}
        </p>
      </div>

      <div class="max-w-4xl mx-auto space-y-12">
        
        <section class="p-10 rounded-3xl border border-white/5 bg-white/[0.01] group hover:border-[#3B82F6]/20 transition-colors duration-500 relative">
          <div class="absolute top-6 right-6 text-white/5 group-hover:text-[#3B82F6]/20 transition-colors">
            <ShieldCheck class="h-10 w-10" />
          </div>
          
          <div class="flex items-center gap-4 mb-8">
            <span class="text-4xl font-black text-[#3B82F6] italic tracking-tight opacity-40">01.</span>
            <h2 class="text-2xl font-black text-white uppercase italic tracking-tight">{{ t('privacy.sections.01.title') }}</h2>
          </div>
          
          <p class="text-white/70 leading-relaxed text-lg font-light antialiased max-w-2xl" v-html="t('privacy.sections.01.content')">
          </p>
        </section>

        <section class="p-10 rounded-3xl border border-white/5 bg-white/[0.01] group hover:border-[#3B82F6]/20 transition-colors duration-500 relative">
          <div class="absolute top-6 right-6 text-white/5 group-hover:text-[#3B82F6]/20 transition-colors">
            <Database class="h-10 w-10" />
          </div>

          <div class="flex items-center gap-4 mb-10">
            <span class="text-4xl font-black text-[#3B82F6] italic tracking-tight opacity-40">02.</span>
            <h2 class="text-2xl font-black text-white uppercase italic tracking-tight">{{ t('privacy.sections.02.title') }}</h2>
          </div>

          <p class="text-white/50 text-base font-light mb-10 italic max-w-xl">
            {{ t('privacy.sections.02.description') }}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div v-for="item in dataItems" :key="item.t" class="flex items-start gap-4">
              <div class="h-px w-6 bg-[#3B82F6] mt-3 group-hover:w-8 transition-all"></div>
              <div>
                <h4 class="text-sm font-black text-white uppercase tracking-wider mb-1.5">{{ item.t }}</h4>
                <p class="text-white/40 text-xs font-medium leading-relaxed tracking-wide">{{ item.d }}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="p-10 rounded-3xl border border-white/5 bg-white/[0.01] group hover:border-[#3B82F6]/20 transition-colors duration-500 relative">
          <div class="absolute top-6 right-6 text-white/5 group-hover:text-[#3B82F6]/20 transition-colors">
            <Scale class="h-10 w-10" />
          </div>

          <div class="flex items-center gap-4 mb-8">
            <span class="text-4xl font-black text-[#3B82F6] italic tracking-tight opacity-40">03.</span>
            <h2 class="text-2xl font-black text-white uppercase italic tracking-tight">{{ t('privacy.sections.03.title') }}</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <p class="md:col-span-8 text-white/70 leading-relaxed text-lg font-light antialiased" v-html="t('privacy.sections.03.content')">
            </p>
            
            <div class="md:col-span-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center gap-4 group-hover:border-[#3B82F6]/20 transition-colors">
              <Mail class="h-8 w-8 text-[#06B6D4]" />
              <p class="text-[10px] font-black text-white/40 uppercase tracking-widest">{{ t('privacy.sections.03.channel') }}</p>
              <a href="mailto:geral@leiriadetail.pt" class="text-white font-black italic border-b-2 border-[#3B82F6] pb-1 text-sm hover:text-[#06B6D4] transition-colors antialiased">
                geral@leiriadetail.pt
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>

    <div class="absolute bottom-10 left-10 text-[6rem] md:text-[10rem] font-black text-white/[0.02] italic pointer-events-none select-none uppercase tracking-tighter antialiased">
      {{ t('privacy.watermark') }}
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

span, h1, h2, h3, h4, a {
  font-display: swap;
}
</style>