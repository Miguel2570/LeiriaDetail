<script setup lang="ts">
import { Check } from 'lucide-vue-next';

defineProps<{
  steps: { number: number; label: string }[];
  currentStep: number;
}>();
</script>

<template>
  <div class="relative mb-12">
    <div class="absolute left-0 right-0 top-5 h-0.5 bg-white/10 -z-0">
      <div 
        class="h-full bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        :style="{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }"
      ></div>
    </div>

    <div class="relative flex justify-between z-10">
      <div v-for="step in steps" :key="step.number" class="flex flex-col items-center">
        <div 
          :class="[
            'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
            step.number <= currentStep 
              ? 'border-[#3B82F6] bg-[#0A0A0F] text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
              : 'border-white/20 bg-[#0A0A0F] text-[#94A3B8]'
          ]"
        >
          <Check v-if="step.number < currentStep" class="h-5 w-5 text-[#06B6D4]" />
          <span v-else :class="['font-bold', step.number === currentStep ? 'text-[#3B82F6]' : '']">
            {{ step.number }}
          </span>
        </div>
        <span 
          :class="[
            'mt-2 text-xs font-medium uppercase tracking-wider',
            step.number <= currentStep ? 'text-[#06B6D4]' : 'text-[#94A3B8]'
          ]"
        >
          {{ step.label }}
        </span>
      </div>
    </div>
  </div>
</template>