<script setup lang="ts">
import Button from '@/components/ui/forms/Button.vue'
import { Calendar } from 'lucide-vue-next'
</script>

<template>
  <section class="py-20">
    <div class="container mx-auto px-4">
      <div class="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-3xl p-12 text-center text-white shadow-xl">
        <h2 class="text-4xl font-bold mb-6">Pronto para transformar o seu veículo?</h2>
        <p class="text-xl mb-10 opacity-90">Junte-se aos centenas de clientes satisfeitos em Leiria.</p>
        <router-link to="/marcacao">
          <Button class="bg-white text-[#3B82F6] hover:bg-gray-100 h-14 px-10 text-lg font-bold">
            <Calendar class="mr-2 h-5 w-5" /> Agendar Agora
          </Button>
        </router-link>
      </div>
    </div>
  </section>
</template>