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
            'w-4 h-4 rounded-full border-[3px] transition-all duration-500 bg-[#050505]',
            step.number < currentStep ? 'border-[#00D8FF] bg-[#00D8FF] shadow-[0_0_10px_rgba(0,216,255,0.4)]' : 
            step.number === currentStep ? 'border-[#2563EB] shadow-[0_0_10px_rgba(37,99,235,0.4)] scale-125' : 
            'border-white/20'
          ]">
        </div>
      </div>
    </div>

    <div class="relative flex items-center justify-between mt-4">
      <div v-for="step in steps" :key="`label-${step.number}`" class="text-center w-20 -ml-8 first:ml-0 last:-mr-8">
         <span :class="[
            'text-[9px] font-black uppercase tracking-widest transition-colors duration-500',
            step.number <= currentStep ? 'text-white' : 'text-white/30'
          ]">
          {{ step.label }}
        </span>
      </div>
    </div>
  </div>
</template>