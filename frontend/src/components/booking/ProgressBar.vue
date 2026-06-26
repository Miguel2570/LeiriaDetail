<script setup lang="ts">
defineProps<{
  steps: { number: number; label: string }[];
  currentStep: number;
}>();
</script>

<template>
  <div class="w-full mb-10 px-2">
    <div class="relative flex items-center justify-between">
      
      <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full z-0"></div>
      
      <div 
        class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] rounded-full z-0 transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
        :style="{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }"
      ></div>

      <div v-for="step in steps" :key="step.number" class="relative z-10 flex flex-col items-center">
        
        <div :class="[
            'w-8 h-8 rounded-full border-[3px] transition-all duration-500 flex items-center justify-center font-black text-[12px]',
            step.number < currentStep ? 'border-[#00D8FF] bg-[#00D8FF] text-[#050505] shadow-[0_0_10px_rgba(0,216,255,0.4)]' : 
            step.number === currentStep ? 'border-[#2563EB] bg-[#050505] text-white shadow-[0_0_10px_rgba(37,99,235,0.4)] scale-110' : 
            'border-white/20 bg-[#050505] text-white/30'
          ]">
          {{ step.number }}
        </div>

        <div class="absolute top-full mt-3 flex justify-center items-center w-0">
          <span :class="[
            'text-[9px] font-black uppercase tracking-widest transition-colors duration-500 whitespace-nowrap',
            step.number <= currentStep ? 'text-white' : 'text-white/30'
          ]">
            {{ step.label }}
          </span>
        </div>

      </div>
    </div>
  </div>
</template>