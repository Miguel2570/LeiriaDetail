<script setup lang="ts">
import { Cookie, Settings, BarChart3, ShieldCheck, FileText } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section class="py-24 bg-[#050505] relative overflow-hidden min-h-screen antialiased text-white">
    
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-[#3B82F6]/5 blur-[130px] rounded-full pointer-events-none"></div>

    <div class="container mx-auto px-4 max-w-6xl relative z-10">
      
      <div class="text-center mb-24 border-b border-white/5 pb-16">
        <div class="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 shadow-inner">
          <Cookie class="h-4 w-4 text-[#3B82F6]" />
          <span class="text-[10px] font-black text-white/70 uppercase tracking-[0.4em] italic">{{ t('cookies.badge') }}</span>
        </div>
        
        <h1 class="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.8] mb-10 drop-shadow-2xl">
          {{ t('cookies.title1') }} <br> <span class="text-leiria-gradient">{{ t('cookies.title2') }}</span>
        </h1>
        
        <p class="text-white/30 font-bold uppercase text-[11px] tracking-[0.4em] italic">
          {{ t('cookies.subtitle') }}
        </p>
      </div>

      <div class="max-w-4xl mx-auto space-y-12">
        
        <section class="p-10 rounded-3xl border border-white/5 bg-white/[0.01] group hover:border-[#3B82F6]/20 transition-colors duration-500 relative">
          <div class="flex items-center gap-4 mb-8">
            <span class="text-4xl font-black text-[#3B82F6] italic tracking-tight opacity-40">01.</span>
            <h2 class="text-2xl font-black text-white uppercase italic tracking-tight">{{ t('cookies.sections.01.title') }}</h2>
          </div>
          
          <p class="text-white/70 leading-relaxed text-lg font-light antialiased max-w-2xl border-l border-white/5 pl-8 group-hover:border-[#3B82F6]/40 transition-colors" v-html="t('cookies.sections.01.content')">
          </p>
        </section>

        <section class="p-10 rounded-3xl border border-white/5 bg-white/[0.01] group hover:border-[#3B82F6]/20 transition-colors duration-500">
          <div class="flex items-center gap-4 mb-12">
            <span class="text-4xl font-black text-[#3B82F6] italic tracking-tight opacity-40">02.</span>
            <h2 class="text-2xl font-black text-white uppercase italic tracking-tight">{{ t('cookies.sections.02.title') }}</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 pl-8 border-l border-white/5 group-hover:border-[#3B82F6]/40 transition-colors">
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <ShieldCheck class="h-5 w-5 text-[#3B82F6]" />
                <h4 class="text-sm font-black text-white uppercase tracking-widest italic">{{ t('cookies.sections.02.technical.title') }}</h4>
              </div>
              <p class="text-white/40 text-xs font-medium leading-relaxed uppercase tracking-wider">
                {{ t('cookies.sections.02.technical.description') }}
              </p>
            </div>

            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <BarChart3 class="h-5 w-5 text-[#06B6D4]" />
                <h4 class="text-sm font-black text-white uppercase tracking-widest italic">{{ t('cookies.sections.02.analytics.title') }}</h4>
              </div>
              <p class="text-white/40 text-xs font-medium leading-relaxed uppercase tracking-wider">
                {{ t('cookies.sections.02.analytics.description') }}
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
            <h2 class="text-2xl font-black text-white uppercase italic tracking-tight">{{ t('cookies.sections.03.title') }}</h2>
          </div>
          
          <div class="pl-8 border-l border-white/5 group-hover:border-[#3B82F6]/40 transition-colors space-y-8">
            <p class="text-white/70 leading-relaxed text-lg font-light antialiased max-w-2xl" v-html="t('cookies.sections.03.content')">
            </p>
            
            <div class="inline-flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 group-hover:border-[#3B82F6]/20 transition-all">
              <FileText class="h-4 w-4 text-white/20" />
              <p class="text-[10px] font-black text-white/40 uppercase tracking-widest leading-relaxed" v-html="t('cookies.sections.03.browserHint')">
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>

    <div class="absolute bottom-10 right-10 text-[6rem] md:text-[10rem] font-black text-white/[0.02] italic pointer-events-none select-none uppercase tracking-tighter antialiased">
      {{ t('cookies.watermark') }}
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