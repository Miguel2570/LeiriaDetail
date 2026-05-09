<script setup lang="ts">
import { ref, provide } from 'vue'
import useEmblaCarousel from 'embla-carousel-vue'
import { cn } from '@/utils/cn'

const props = defineProps<{ class?: string; opts?: any }>()
const [emblaRef, emblaApi] = useEmblaCarousel(props.opts)

const scrollPrev = () => emblaApi.value?.scrollPrev()
const scrollNext = () => emblaApi.value?.scrollNext()
</script>

<template>
  <div class="relative w-full" role="region" aria-roledescription="carousel">
    <div ref="emblaRef" class="overflow-hidden">
      <div :class="cn('flex -ml-4', props.class)">
        <slot />
      </div>
    </div>
    <slot name="navigation" :prev="scrollPrev" :next="scrollNext" />
  </div>
</template>