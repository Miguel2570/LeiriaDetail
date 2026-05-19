<script setup lang="ts">
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-vue-next'
</script>

<template>
  <footer class="backdrop-blur-md border-t text-white/80 pt-16 pb-8 relative z-20 bg-black">
    <div class="container mx-auto px-4 sm:px-6 max-w-7xl">
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
        
        <!-- Brand Column -->
        <div class="col-span-1">
          <router-link to="/" class="flex items-center gap-2 mb-4">
            <span class="font-black text-2xl italic tracking-tighter uppercase">
              Leiria<span class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">Detail</span>
            </span>
          </router-link>
          <p class="text-sm mb-6 leading-relaxed">
            O estúdio de detalhe automóvel de excelência em Leiria. Porque o seu carro merece mais do que uma simples lavagem.
          </p>
          <div class="flex gap-4">
            <a href="#" class="text-gray-400 hover:text-[#06B6D4] transition-all duration-300 hover:scale-110">
              <Instagram class="h-5 w-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-[#3B82F6] transition-all duration-300 hover:scale-110">
              <Facebook class="h-5 w-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-[#FF0000] transition-all duration-300 hover:scale-110">
              <Youtube class="h-5 w-5" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-bold uppercase mb-4 tracking-wider text-sm">Links Rápidos</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <router-link to="/servicos" class="hover:text-[#3B82F6] transition-all duration-300 hover:pl-1">
                Serviços
              </router-link>
            </li>
            <li>
              <router-link to="/precos" class="hover:text-[#3B82F6] transition-all duration-300 hover:pl-1">
                Tabela de Preços
              </router-link>
            </li>
            <li>
              <router-link to="/portfolio" class="hover:text-[#3B82F6] transition-all duration-300 hover:pl-1">
                Portfólio
              </router-link>
            </li>
            <li>
              <router-link to="/agenda" class="text-[#3B82F6] font-bold hover:text-[#06B6D4] transition-all duration-300 hover:pl-1">
                Agendar Agora →
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h4 class="font-bold uppercase mb-4 tracking-wider text-sm">Legal</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <router-link to="/termos" class=" hover:text-[#3B82F6] transition-all duration-300 hover:pl-1">
                Termos e Condições
              </router-link>
            </li>
            <li>
              <router-link to="/privacidade" class=" hover:text-[#3B82F6] transition-all duration-300 hover:pl-1">
                Política de Privacidade
              </router-link>
            </li>
            <li>
              <router-link to="/cookies" class=" hover:text-[#3B82F6] transition-all duration-300 hover:pl-1">
                Política de Cookies
              </router-link>
            </li>
            <li>
              <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer" class=" hover:text-[#3B82F6] transition-all duration-300 hover:pl-1">
                Livro de Reclamações
              </a>
            </li>          
          </ul>
        </div>

        <!-- Contactos -->
        <div>
          <h4 class="font-bold uppercase mb-4 tracking-wider text-sm">Contactos</h4>
          <ul class="space-y-4 text-sm">
            <li class="flex items-start gap-3 group">
              <MapPin class="h-5 w-5 text-[#06B6D4] shrink-0 transition-transform group-hover:scale-110" />
              <span class="">Zona Industrial, Leiria, Portugal</span>
            </li>
            <li class="flex items-center gap-3 group">
              <Phone class="h-5 w-5 text-[#06B6D4] shrink-0 transition-transform group-hover:scale-110" />
              <a href="tel:+351912345678" class="hover:text-[#3B82F6] transition-colors">
                +351 912 345 678
              </a>
            </li>
            <li class="flex items-center gap-3 group">
              <Mail class="h-5 w-5 text-[#06B6D4] shrink-0 transition-transform group-hover:scale-110" />
              <a href="mailto:geral@leiriadetail.pt" class="hover:text-[#3B82F6] transition-colors">
                geral@leiriadetail.pt
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-white/30 pt-8 text-center text-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; 2026 LeiriaDetail. Todos os direitos reservados.</p>
      </div>

    </div>
  </footer>
</template>

<style scoped>
/* Animações suaves para os ícones */
a, button {
  transition: all 0.3s ease;
}

/* Melhora a legibilidade em dispositivos móveis */
@media (max-width: 640px) {
  footer {
    text-align: center;
  }
  
  .flex.items-start.gap-3 {
    justify-content: center;
  }
}
</style>