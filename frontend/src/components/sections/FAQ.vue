<script setup lang="ts">
// No Vue usaríamos RadixVue Accordion
const faqs = [
  { q: 'Quanto tempo demora um detalhe interior?', a: 'O Basic demora cerca de 1h, o Standard 2h...' },
  { q: 'Fazem serviço ao domicílio?', a: 'Atualmente trabalhamos apenas nas nossas instalações...' }
]
</script>

<template>
  <section class="py-24 bg-gray-50">
    <div class="container mx-auto px-4 max-w-3xl">
      <h2 class="text-4xl font-bold text-center mb-12">Perguntas Frequentes</h2>
      <div class="space-y-4">
        <div v-for="(faq, i) in faqs" :key="i" class="bg-white border rounded-lg p-4">
          <button class="flex justify-between w-full font-bold text-left">
            {{ faq.q }}
          </button>
          <p class="mt-2 text-gray-500 text-sm">{{ faq.a }}</p>
        </div>
      </div>
    </div>
  </section>
</template>