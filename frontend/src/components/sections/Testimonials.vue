<script setup lang="ts">
import { onMounted } from 'vue';

// Elfsight widget will load automatically when the component mounts
onMounted(() => {
  // The Elfsight script will handle everything
  // No additional code needed
});
</script>

<template>
  <section class="py-24 px-4 relative z-10 bg-white">
    <div class="container mx-auto max-w-7xl relative">
      
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter drop-shadow-sm">
          Opiniões dos <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">Clientes</span>
        </h2>
      </div>

      <!-- Elfsight Google Reviews Widget -->
      <!-- Replace YOUR_WIDGET_ID with your actual widget ID from Elfsight -->
      <div class="elfsight-app-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" data-elfsight-app-lazy></div>
      
    </div>
  </section>
</template>