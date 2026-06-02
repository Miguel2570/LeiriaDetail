<!-- src/page/review/SubmitReview.vue -->
<template>
  <div class="min-h-screen bg-[#020204] text-white flex items-center justify-center px-4">
    <div class="max-w-lg w-full bg-[#050508] border border-white/10 rounded-2xl p-8 text-center">
      
      <!-- Loading -->
      <div v-if="isLoading" class="py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D8FF] mx-auto"></div>
        <p class="text-gray-400 mt-4">A carregar...</p>
      </div>

      <!-- Já submetida -->
      <div v-else-if="alreadySubmitted" class="py-8">
        <span class="text-5xl">✅</span>
        <h2 class="text-2xl font-black text-white mt-4">Review já submetida!</h2>
        <p class="text-gray-400 mt-2">Obrigado pelo seu feedback.</p>
      </div>

      <!-- Token inválido -->
      <div v-else-if="invalidToken" class="py-8">
        <span class="text-5xl">❌</span>
        <h2 class="text-2xl font-black text-white mt-4">Link inválido</h2>
        <p class="text-gray-400 mt-2">Este link já não está disponível.</p>
      </div>

      <!-- Formulário -->
      <div v-else>
        <span class="text-4xl">⭐</span>
        <h2 class="text-2xl font-black text-white mt-4">Como foi a sua experiência?</h2>
        <p class="text-gray-400 text-sm mt-2">{{ reviewData?.car }}</p>

        <!-- Estrelas -->
        <div class="flex justify-center gap-2 my-6">
          <button 
            v-for="n in 5" :key="n" 
            @click="rating = n"
            class="text-3xl transition-all hover:scale-125"
          >
            {{ n <= rating ? '⭐' : '☆' }}
          </button>
        </div>

        <!-- Texto -->
        <textarea 
          v-model="text" 
          placeholder="Conte-nos a sua experiência..." 
          rows="4"
          class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#00D8FF] resize-none mb-4"
        ></textarea>

        <!-- Submeter -->
        <button 
          @click="submitReview" 
          :disabled="isSubmitting || !text.trim()"
          class="w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#00D8FF] text-white font-bold rounded-xl disabled:opacity-50"
        >
          {{ isSubmitting ? 'A enviar...' : 'Enviar Review ⭐' }}
        </button>

        <p v-if="success" class="text-green-400 text-sm mt-4">✅ Review enviada! Obrigado!</p>
        <p v-if="error" class="text-red-400 text-sm mt-4">{{ error }}</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { graphql } from '@/graphql';

const route = useRoute();
const token = route.params.token as string;

const isLoading = ref(true);
const alreadySubmitted = ref(false);
const invalidToken = ref(false);
const reviewData = ref<any>(null);
const rating = ref(5);
const text = ref('');
const isSubmitting = ref(false);
const success = ref(false);
const error = ref('');

const fetchReview = async () => {
  try {
    const query = `
      query GetReviewByToken($token: String!) {
        reviewByToken(token: $token) {
          reviews { id name car text rating submitted }
          hasError
        }
      }
    `;
    const data = await graphql<{ reviewByToken: any }>(query, { token });
    
    if (data.reviewByToken?.reviews?.length > 0) {
      const review = data.reviewByToken.reviews[0];
      if (review.submitted) {
        alreadySubmitted.value = true;
      } else {
        reviewData.value = review;
      }
    } else {
      invalidToken.value = true;
    }
  } catch {
    invalidToken.value = true;
  } finally {
    isLoading.value = false;
  }
};

const submitReview = async () => {
  isSubmitting.value = true;
  error.value = '';
  
  try {
    const mutation = `
      mutation SubmitReviewByToken($token: String!, $text: String!, $rating: Int!) {
        submitReviewByToken(token: $token, text: $text, rating: $rating) {
          success
          message
          hasError
        }
      }
    `;
    const data = await graphql<{ submitReviewByToken: any }>(mutation, { token, text: text.value, rating: rating.value });
    
    if (data.submitReviewByToken?.hasError) {
      error.value = data.submitReviewByToken.message || 'Erro ao enviar.';
    } else {
      success.value = true;
    }
  } catch {
    error.value = 'Erro de conexão.';
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(fetchReview);
</script>