<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { graphql } from '@/graphql';

interface Review {
  id: string;
  name: string;
  car: string;
  text: string;
  rating: number;
  createdAt: string;
}

const reviews = ref<Review[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');
const currentIndex = ref(0);
const isTransitioning = ref(false);

const fetchReviews = async () => {
  try {
    const query = `
      query {
        reviews {
          reviews {
            id
            name
            car
            text
            rating
            createdAt
          }
          hasError
          message
        }
      }
    `;
    
    const data = await graphql<{ reviews: { reviews: Review[], hasError: boolean, message: string } }>(query);
    
    if (data.reviews?.hasError) {
      errorMessage.value = data.reviews.message || 'Erro ao carregar';
      return;
    }
    
    reviews.value = data.reviews?.reviews || [];
  } catch (error: any) {
    errorMessage.value = error.message || 'Erro de conexão';
  } finally {
    isLoading.value = false;
  }
};

const totalReviews = computed(() => reviews.value.length);

const nextReview = () => {
  if (isTransitioning.value || totalReviews.value === 0) return;
  isTransitioning.value = true;
  currentIndex.value = (currentIndex.value + 1) % totalReviews.value;
  setTimeout(() => { isTransitioning.value = false; }, 500);
};

const prevReview = () => {
  if (isTransitioning.value || totalReviews.value === 0) return;
  isTransitioning.value = true;
  currentIndex.value = (currentIndex.value - 1 + totalReviews.value) % totalReviews.value;
  setTimeout(() => { isTransitioning.value = false; }, 500);
};

const goToReview = (index: number) => {
  if (isTransitioning.value) return;
  isTransitioning.value = true;
  currentIndex.value = index;
  setTimeout(() => { isTransitioning.value = false; }, 500);
};

// Autoplay
let autoplayInterval: ReturnType<typeof setInterval>;

const startAutoplay = () => {
  autoplayInterval = setInterval(() => {
    nextReview();
  }, 5000);
};

const stopAutoplay = () => {
  clearInterval(autoplayInterval);
};

onMounted(() => {
  fetchReviews();
  startAutoplay();
});
</script>

<template>
  <section 
    class="py-24 px-4 relative z-10 bg-white"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
  >
    <div class="container mx-auto max-w-4xl relative">
      
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-4 py-2 mb-6">
          <Star class="w-4 h-4 text-[#F59E0B]" />
          <span class="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Testemunhos</span>
        </div>
        <h2 class="text-4xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter drop-shadow-sm">
          Opiniões dos <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">Clientes</span>
        </h2>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563EB]"></div>
      </div>

      <!-- Carrossel de Reviews -->
      <div v-else-if="reviews.length > 0" class="relative mb-12">
        
        <!-- Review Atual -->
        <div class="relative overflow-hidden">
          <transition name="carousel" mode="out-in">
            <div 
              :key="currentIndex"
              class="bg-gray-50 border border-gray-100 rounded-2xl p-8 md:p-12 text-center"
            >
              <!-- Aspas -->
              <Quote class="w-12 h-12 text-[#2563EB]/10 mx-auto mb-6" />
              
              <!-- Estrelas -->
              <div class="flex gap-1 justify-center mb-6">
                <Star 
                  v-for="i in 5" 
                  :key="i" 
                  :class="[
                    'w-5 h-5',
                    i <= reviews[currentIndex].rating 
                      ? 'text-[#F59E0B] fill-[#F59E0B]' 
                      : 'text-gray-300'
                  ]" 
                />
              </div>
              
              <!-- Texto -->
              <p class="text-gray-600 text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                "{{ reviews[currentIndex].text }}"
              </p>
              
              <!-- Autor -->
              <div class="flex items-center justify-center gap-4">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#2563EB]/20 to-[#00D8FF]/20 flex items-center justify-center text-[#2563EB] font-bold text-lg border border-[#2563EB]/10">
                  {{ reviews[currentIndex].name.charAt(0) }}
                </div>
                <div class="text-left">
                  <p class="text-gray-900 font-bold">{{ reviews[currentIndex].name }}</p>
                  <p class="text-gray-400 text-sm">{{ reviews[currentIndex].car }}</p>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- Botões de Navegação -->
        <button 
          @click="prevReview"
          class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:border-[#2563EB]/30 transition-all duration-300 group"
        >
          <ChevronLeft class="w-5 h-5 text-gray-400 group-hover:text-[#2563EB]" />
        </button>
        
        <button 
          @click="nextReview"
          class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:border-[#2563EB]/30 transition-all duration-300 group"
        >
          <ChevronRight class="w-5 h-5 text-gray-400 group-hover:text-[#2563EB]" />
        </button>

        <!-- Indicadores (dots) -->
        <div class="flex justify-center gap-2 mt-8">
          <button 
            v-for="(_, index) in reviews" 
            :key="index"
            @click="goToReview(index)"
            :class="[
              'w-2.5 h-2.5 rounded-full transition-all duration-300',
              index === currentIndex 
                ? 'bg-[#2563EB] w-8' 
                : 'bg-gray-300 hover:bg-gray-400'
            ]"
          />
        </div>

        <!-- Contador -->
        <div class="text-center mt-4">
          <span class="text-sm text-gray-400 font-medium">
            {{ currentIndex + 1 }} / {{ totalReviews }}
          </span>
        </div>
      </div>

      <!-- Sem reviews -->
      <div v-else class="text-center py-8 mb-12">
        <p class="text-gray-400 text-sm">Ainda não há reviews. Seja o primeiro a avaliar!</p>
      </div>

      <!-- 🔮 GOOGLE REVIEWS (QUANDO TIVERES DOMÍNIO) -->
      <!-- 
      <div class="elfsight-app-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" data-elfsight-app-lazy></div>
      -->

      <!-- CTA -->
      <div class="text-center mt-12">
        <p class="text-gray-400 text-sm mb-4">Teve uma boa experiência? Deixe a sua review!</p>
        
        <!-- 🔮 Link do Google -->
        <!-- 
        <a 
          href="https://g.page/r/SEU-LINK-AQUI/review" 
          target="_blank" 
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-6 py-3 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-xl text-[#F59E0B] text-sm font-bold hover:bg-[#F59E0B]/20 transition-all duration-300"
        >
          <Star class="w-4 h-4 fill-[#F59E0B]" />
          Avaliar no Google
        </a>
        -->
        
        <router-link 
          to="/contactos"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 text-sm font-bold hover:bg-gray-100 hover:border-[#2563EB]/30 transition-all duration-300"
        >
          <Star class="w-4 h-4 text-[#F59E0B]" />
          Deixar Review
        </router-link>
      </div>
      
    </div>
  </section>
</template>

<style scoped>
.carousel-enter-active,
.carousel-leave-active {
  transition: all 0.4s ease;
}

.carousel-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.carousel-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>