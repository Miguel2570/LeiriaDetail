<script setup lang="ts">
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-vue-next'
</script>

<template>
  <footer class="bg-[#050508] border-y border-white/5 text-gray-400 pt-16 pb-8  relative z-20">
    <div class="container mx-auto px-4 max-w-6xl">
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div class="col-span-1 md:col-span-1">
          <router-link to="/" class="flex items-center gap-2 mb-4">
            <span class="font-black text-2xl italic tracking-tighter uppercase text-white">
              Leiria<span class="text-leiria-gradient">Detail</span>
            </span>
          </router-link>
          <p class="text-sm text-gray-500 mb-6">
            O estúdio de detalhe automóvel de excelência em Leiria. Porque o seu carro merece mais do que uma simples lavagem.
          </p>
          <div class="flex gap-4">
            <a href="#" class="hover:text-[#06B6D4] transition-colors"><Instagram class="h-5 w-5" /></a>
            <a href="#" class="hover:text-[#3B82F6] transition-colors"><Facebook class="h-5 w-5" /></a>
          </div>
        </div>

        <div>
          <h4 class="text-white font-bold uppercase mb-4 tracking-wider text-sm">Links Rápidos</h4>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/servicos" class="hover:text-[#06B6D4] transition-colors">Serviços</router-link></li>
            <li><router-link to="/precos" class="hover:text-[#06B6D4] transition-colors">Tabela de Preços</router-link></li>
            <li><router-link to="/portfolio" class="hover:text-[#06B6D4] transition-colors">Portfólio</router-link></li>
            <li><router-link to="/agenda" class="text-[#3B82F6] font-bold hover:text-[#06B6D4] transition-colors">Agendar Agora</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold uppercase mb-4 tracking-wider text-sm">Legal</h4>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/termos" class="hover:text-white transition-colors">Termos e Condições</router-link></li>
            <li><router-link to="/privacidade" class="hover:text-white transition-colors">Política de Privacidade</router-link></li>
            <li><router-link to="/cookies" class="hover:text-white transition-colors">Política de Cookies</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold uppercase mb-4 tracking-wider text-sm">Contactos</h4>
          <ul class="space-y-4 text-sm">
            <li class="flex items-start gap-3">
              <MapPin class="h-5 w-5 text-[#06B6D4] shrink-0" />
              <span>Zona Industrial,<br>Leiria, Portugal</span>
            </li>
            <li class="flex items-center gap-3">
              <Phone class="h-5 w-5 text-[#06B6D4] shrink-0" />
              <span>+351 912 345 678</span>
            </li>
            <li class="flex items-center gap-3">
              <Mail class="h-5 w-5 text-[#06B6D4] shrink-0" />
              <span>geral@leiriadetail.pt</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/10 pt-8 text-center text-xs text-gray-600 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; 2026 LeiriaDetail. Todos os direitos reservados.</p>
        <p>Desenvolvido para apaixonados por automóveis.</p>
      </div>

    </div>
  </footer>
</template>