<script setup lang="ts">
import { ref } from 'vue';
import { User, Mail, Phone, Lock } from 'lucide-vue-next';

const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
});

const handleSubmit = () => {
  if (formData.value.password !== formData.value.confirmPassword) {
    alert('As passwords não coincidem!');
    return;
  }
  console.log('Registo:', formData.value);
  alert('Conta criada com sucesso!');
};
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center py-16">
    <div class="max-w-md w-full px-4">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-2">Criar <span class="text-[#3B82F6]">Conta</span></h1>
      </div>

      <div class="bg-white border p-8 rounded-xl shadow-lg">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <input v-model="formData.name" type="text" placeholder="Nome Completo" class="w-full p-2 border rounded-lg" required />
          <input v-model="formData.email" type="email" placeholder="Email" class="w-full p-2 border rounded-lg" required />
          <input v-model="formData.password" type="password" placeholder="Password" class="w-full p-2 border rounded-lg" required />
          <input v-model="formData.confirmPassword" type="password" placeholder="Confirmar Password" class="w-full p-2 border rounded-lg" required />
          
          <div class="flex items-center gap-2 text-sm">
            <input type="checkbox" v-model="formData.acceptTerms" required />
            <span>Aceito os Termos e Condições</span>
          </div>

          <button type="submit" class="w-full py-3 bg-[#3B82F6] text-white rounded-lg font-bold">Criar Conta</button>
        </form>
        
        <p class="mt-4 text-center text-sm">
          Já tens conta? <router-link to="/login" class="text-[#3B82F6]">Inicia sessão</router-link>
        </p>
      </div>
    </div>
  </div>
</template>