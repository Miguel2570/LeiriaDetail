<script setup lang="ts">
import { Gavel, ClipboardCheck, AlertCircle, Scale, FileText } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section class="py-24 bg-[#050505] relative overflow-hidden min-h-screen antialiased">
    
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-[#3B82F6]/5 blur-[130px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-4 max-w-6xl relative z-10">
      
      <div class="text-center mb-24 border-b border-white/5 pb-16">
        <div class="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 shadow-inner">
          <Gavel class="h-4 w-4 text-[#3B82F6]" />
          <span class="text-[10px] font-black text-white/70 uppercase tracking-[0.4em] italic">{{ t('terms.badge') }}</span>
        </div>
        
        <h1 class="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.8] mb-10 drop-shadow-2xl">
          {{ t('terms.title1') }} <br> <span class="text-leiria-gradient">{{ t('terms.title2') }}</span>
        </h1>
        
        <p class="text-white/30 font-bold uppercase text-[11px] tracking-[0.4em] italic">
          {{ t('terms.subtitle') }}
        </p>
      </div>

      <div class="max-w-4xl mx-auto space-y-12">
        
        <section class="p-10 rounded-3xl border border-white/5 bg-white/[0.01] group hover:border-[#3B82F6]/20 transition-colors duration-500 relative">
          <div class="absolute top-6 right-6 text-white/5 group-hover:text-[#3B82F6]/20 transition-colors">
            <ClipboardCheck class="h-10 w-10" />
          </div>
          
          <div class="flex items-center gap-4 mb-8">
            <span class="text-4xl font-black text-[#3B82F6] italic tracking-tight opacity-40">01.</span>
            <h2 class="text-2xl font-black text-white uppercase italic tracking-tight">{{ t('terms.sections.01.title') }}</h2>
          </div>
          
          <p class="text-white/60 leading-relaxed text-lg font-light antialiased max-w-2xl border-l border-white/5 pl-8 group-hover:border-[#3B82F6]/40 transition-colors" v-html="t('terms.sections.01.content')">
          </p>
        </section>

        <section class="p-10 rounded-3xl border border-white/5 bg-white/[0.01] group hover:border-[#3B82F6]/20 transition-colors duration-500 relative">
          <div class="absolute top-6 right-6 text-white/5 group-hover:text-[#3B82F6]/20 transition-colors">
            <Scale class="h-10 w-10" />
          </div>

          <div class="flex items-center gap-4 mb-8">
            <span class="text-4xl font-black text-[#3B82F6] italic tracking-tight opacity-40">02.</span>
            <h2 class="text-2xl font-black text-white uppercase italic tracking-tight">{{ t('terms.sections.02.title') }}</h2>
          </div>
          
          <p class="text-white/60 leading-relaxed text-lg font-light antialiased max-w-2xl border-l border-white/5 pl-8 group-hover:border-[#3B82F6]/40 transition-colors" v-html="t('terms.sections.02.content')">
          </p>
        </section>

        <section class="p-10 rounded-3xl border border-white/5 bg-white/[0.01] group hover:border-[#3B82F6]/20 transition-colors duration-500 relative text-white">
          <div class="absolute top-6 right-6 text-white/5 group-hover:text-red-500/20 transition-colors">
            <AlertCircle class="h-10 w-10" />
          </div>

          <div class="flex items-center gap-4 mb-8">
            <span class="text-4xl font-black text-[#3B82F6] italic tracking-tight opacity-40">03.</span>
            <h2 class="text-2xl font-black text-white uppercase italic tracking-tight">{{ t('terms.sections.03.title') }}</h2>
          </div>
          
          <p class="text-white/60 leading-relaxed text-lg font-light antialiased max-w-2xl border-l border-white/5 pl-8 group-hover:border-red-500/40 transition-colors" v-html="t('terms.sections.03.content')">
          </p>
        </section>

        <section class="p-10 rounded-3xl border border-white/5 bg-white/[0.01] group hover:border-[#3B82F6]/20 transition-colors duration-500 relative">
          <div class="absolute top-6 right-6 text-white/5 group-hover:text-[#3B82F6]/20 transition-colors">
            <FileText class="h-10 w-10" />
          </div>

          <div class="flex items-center gap-4 mb-8">
            <span class="text-4xl font-black text-[#3B82F6] italic tracking-tight opacity-40">04.</span>
            <h2 class="text-2xl font-black text-white uppercase italic tracking-tight">{{ t('terms.sections.04.title') }}</h2>
          </div>
          
          <div class="pl-8 border-l border-white/5 group-hover:border-[#3B82F6]/40 transition-colors space-y-6">
            <p class="text-white/60 leading-relaxed text-lg font-light antialiased max-w-2xl" v-html="t('terms.sections.04.content1')">
            </p>
            <div class="inline-flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 group-hover:border-[#3B82F6]/20 transition-all">
              <span class="text-[10px] font-black text-white/30 uppercase tracking-widest italic">{{ t('terms.sections.04.entity') }}:</span>
              <span class="text-sm font-black text-white uppercase italic tracking-tighter antialiased">{{ t('terms.sections.04.entityName') }}</span>
            </div>
          </div>
        </section>

      </div>
    </div>

    <div class="absolute bottom-10 left-10 text-[6rem] md:text-[10rem] font-black text-white/[0.02] italic pointer-events-none select-none uppercase tracking-tighter antialiased">
      {{ t('terms.watermark') }}
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