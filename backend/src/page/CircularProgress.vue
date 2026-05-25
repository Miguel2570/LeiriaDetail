<template>
  <div class="relative w-20 h-20 flex items-center justify-center">
    <svg class="w-full h-full transform -rotate-90">
      <circle cx="40" cy="40" :r="radius" stroke="currentColor" stroke-width="6" fill="transparent" class="text-black/5" />
      <circle 
        cx="40" 
        cy="40" 
        :r="radius" 
        :stroke="color" 
        stroke-width="6" 
        fill="transparent" 
        :stroke-dasharray="circumference" 
        :stroke-dashoffset="strokeDashoffset" 
        class="transition-all duration-1000 ease-in-out" 
        stroke-linecap="round" 
      />
    </svg>
    <div class="absolute flex flex-col items-center justify-center">
      <span class="font-[Poppins] font-bold text-lg leading-none" :style="{ color }">{{ percentage }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  percentage: number
  color: string
  isAlert: boolean
}>()

const radius = 32
const circumference = 2 * Math.PI * radius
const strokeDashoffset = computed(() => circumference - (props.percentage / 100) * circumference)
</script>