<template>
  <div class="min-h-[85vh] flex items-center justify-center py-16 px-4 relative z-10">
    <div class="max-w-md w-full">
      
      <div class="text-center mb-8">
        <h1 class="text-4xl font-black mb-2 text-gray-900 uppercase italic tracking-tighter drop-shadow-sm">
          Criar <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">Conta</span>
        </h1>
        <p class="text-gray-600 font-medium">Junta-te aos clientes LeiriaDetail</p>
      </div>

      <div class="bg-[#050508] backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        
        <div v-if="errorMessage" class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 flex items-center text-red-500 text-sm font-bold">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="relative">
            <User class="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
            <input v-model="formData.name" type="text" placeholder="Nome Completo" class="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6] focus:bg-white/10 transition-all placeholder:text-gray-600" required />
          </div>

          <div class="relative">
            <Phone class="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
            <input v-model="formData.phone" type="tel" placeholder="Telemóvel (ex: 912345678)" class="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6] focus:bg-white/10 transition-all placeholder:text-gray-600" required />
          </div>

          <div class="relative">
            <Mail class="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
            <input v-model="formData.email" type="email" placeholder="Email" class="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6] focus:bg-white/10 transition-all placeholder:text-gray-600" required />
          </div>

          <div class="relative">
            <Lock class="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
            <input v-model="formData.password" type="password" placeholder="Password" class="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6] focus:bg-white/10 transition-all placeholder:text-gray-600" required />
          </div>

          <div class="relative">
            <Lock class="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
            <input v-model="formData.confirmPassword" type="password" placeholder="Confirmar Password" class="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#3B82F6] focus:bg-white/10 transition-all placeholder:text-gray-600" required />
          </div>
          
          <div class="flex items-center gap-3 pt-2">
            <input type="checkbox" v-model="formData.acceptTerms" class="h-4 w-4 rounded border-gray-300 text-[#3B82F6] focus:ring-[#3B82F6] bg-white/5" required />
            <span class="text-sm text-gray-400">Aceito os <a href="#" class="text-[#06B6D4] hover:underline">Termos e Condições</a></span>
          </div>

          <button type="submit" :disabled="isLoading" class="w-full py-4 mt-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-black uppercase tracking-widest text-sm rounded-xl shadow-[0_10px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_10px_25px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <UserPlus v-if="!isLoading" class="h-5 w-5" /> 
            {{ isLoading ? 'A registar...' : 'Criar Conta' }}
          </button>
        </form>
        
        <div class="mt-8 text-center border-t border-white/10 pt-6">
          <p class="text-sm text-gray-400">
            Já tens conta? 
            <router-link to="/login" class="text-white font-bold hover:text-[#06B6D4] transition-colors inline-flex items-center gap-1">
              Inicia Sessão <ArrowRight class="h-3 w-3" />
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { User, Mail, Lock, Phone, UserPlus, ArrowRight } from 'lucide-vue-next'; // Adicionei o Phone!

const router = useRouter();

const formData = ref({
  name: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
});

const errorMessage = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
    errorMessage.value = '';

    if (formData.value.password !== formData.value.confirmPassword) {
        errorMessage.value = 'As passwords não coincidem!';
        return;
    }

    isLoading.value = true;

    try {
        const response = await fetch('http://localhost:3001/Authentication/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: formData.value.name,
                phone: formData.value.phone,
                email: formData.value.email,
                password: formData.value.password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao criar conta.');
        }

        // Se o registo tiver sucesso, redireciona para o Login
        router.push('/login');
        
    } catch (error: any) {
        errorMessage.value = error.message;
    } finally {
        isLoading.value = false;
    }
};

const loginWithGoogle = () => console.log('A implementar Google...');
const loginWithApple = () => console.log('A implementar Apple...');
</script>