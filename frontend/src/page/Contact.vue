<script setup lang="ts">
import { ref } from 'vue'
import { Mail, MapPin, Phone, Clock, MessageCircle } from 'lucide-vue-next'

const form = ref({ name: '', email: '', message: '' })

const submitContact = () => {
  alert('Mensagem enviada! Responderemos em breve. [cite: 212]')
}
</script>

<template>
  <div class="py-16 container mx-auto px-4 max-w-6xl">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold">Entre em <span class="text-[#3B82F6]">Contacto</span></h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <div v-for="info in [
        { icon: MapPin, title: 'Localização', desc: 'Leiria, Portugal [cite: 217]' },
        { icon: Phone, title: 'Telefone', desc: '+351 XXX XXX XXX [cite: 220]' },
        { icon: Mail, title: 'Email', desc: 'info@leiriadetail.pt [cite: 223]' }
      ]" :key="info.title" class="p-8 border rounded-xl text-center">
        <component :is="info.icon" class="mx-auto h-8 w-8 text-[#3B82F6] mb-4" />
        <h3 class="font-bold">{{ info.title }}</h3>
        <p class="text-gray-500">{{ info.desc }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <form @submit.prevent="submitContact" class="space-y-4 p-8 border rounded-xl bg-white shadow-sm">
        <h2 class="text-2xl font-bold mb-6">Envia uma mensagem [cite: 225]</h2>
        <input v-model="form.name" type="text" placeholder="Teu Nome" class="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#3B82F6]" required />
        <input v-model="form.email" type="email" placeholder="Teu Email" class="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#3B82F6]" required />
        <textarea v-model="form.message" rows="5" placeholder="Como podemos ajudar? [cite: 235]" class="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#3B82F6]" required></textarea>
        <button type="submit" class="w-full py-3 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-bold rounded-lg hover:opacity-90">Enviar Mensagem [cite: 236]</button>
      </form>

      <div class="p-8 border rounded-xl bg-gray-50">
        <div class="flex items-center gap-3 mb-6">
          <Clock class="text-[#3B82F6]" />
          <h2 class="text-2xl font-bold">Horário de Funcionamento [cite: 239]</h2>
        </div>
        <div class="space-y-4">
          <div class="flex justify-between border-b pb-2"><span>Segunda a Sexta</span><span class="font-bold">09:00 - 18:00 [cite: 240]</span></div>
          <div class="flex justify-between border-b pb-2"><span>Sábado</span><span class="font-bold">09:00 - 13:00 [cite: 241]</span></div>
          <div class="flex justify-between"><span>Domingo</span><span class="text-red-500">Encerrado</span></div>
        </div>
      </div>
    </div>
  </div>
</template>