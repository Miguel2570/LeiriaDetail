<script setup lang="ts">
import { 
  CalendarRoot, 
  type CalendarRootProps, 
  CalendarHeader, 
  CalendarHeading, 
  CalendarNext,
  CalendarPrev,
  CalendarGrid, 
  CalendarGridHead, 
  CalendarHeadCell, 
  CalendarGridBody, 
  CalendarCell, 
  CalendarCellTrigger 
} from 'radix-vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { cn } from '@/utils/cn'

const props = defineProps<CalendarRootProps & { class?: string }>()
</script>

<template>
  <CalendarRoot
    v-bind="props"
    v-slot="{ grid, weekDays }"
    :class="cn(
      'p-3 border rounded-2xl shadow-sm transition-colors',
      // Estilo dinâmico: Branco no site, Escuro no Booking
      'bg-white border-gray-100 text-gray-900',
      'group-[.booking-dark-mode]:bg-white/5 group-[.booking-dark-mode]:border-white/10 group-[.booking-dark-mode]:text-white',
      props.class
    )"
  >
    <CalendarHeader class="flex items-center justify-between">
      <CalendarPrev class="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
        <ChevronLeft class="h-4 w-4" />
      </CalendarPrev>
      
      <CalendarHeading class="text-sm font-bold" />
      
      <CalendarNext class="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
        <ChevronRight class="h-4 w-4" />
      </CalendarNext>
    </CalendarHeader>

    <div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <CalendarGrid v-for="month in grid" :key="month.value.toString()" class="w-full border-collapse space-y-1">
        <CalendarGridHead>
          <tr class="flex">
            <CalendarHeadCell
              v-for="day in weekDays" :key="day"
              class="text-gray-400 rounded-md w-9 font-normal text-[0.8rem]"
            >
              {{ day.charAt(0) }}
            </CalendarHeadCell>
          </tr>
        </CalendarGridHead>
        
        <CalendarGridBody>
          <tr v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`" class="flex w-full mt-2">
            <CalendarCell 
              v-for="weekDate in weekDates" 
              :key="weekDate.toString()" 
              :date="weekDate" 
              class="relative p-0 text-center text-sm focus-within:relative focus-within:z-20"
            >
              <CalendarCellTrigger
                :day="weekDate"
                :month="month.value"
                :class="cn(
                  'h-9 w-9 p-0 font-normal rounded-lg transition-all',
                  'hover:bg-blue-50 group-[.booking-dark-mode]:hover:bg-white/10',
                  'data-[selected]:bg-[#3B82F6] data-[selected]:text-white data-[selected]:font-bold data-[selected]:opacity-100',
                  'data-[today]:bg-gray-100 data-[today]:text-[#3B82F6] group-[.booking-dark-mode]:data-[today]:bg-white/20',
                  'data-[outside-view]:text-gray-300 data-[outside-view]:opacity-50 group-[.booking-dark-mode]:data-[outside-view]:text-white/20'
                )"
              />
            </CalendarCell>
          </tr>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>