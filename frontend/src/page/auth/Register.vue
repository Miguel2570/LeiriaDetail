<template>
  <div class="min-h-[85vh] flex items-center justify-center py-16 px-4 relative z-10">
    <div class="max-w-md w-full">
      
      <div class="text-center mb-8">
        <h1 class="text-4xl font-black mb-2 text-white uppercase italic tracking-tighter drop-shadow-sm">
          Criar <span class="bg-gradient-to-r from-[#2563EB] to-[#00D8FF] bg-clip-text text-transparent">Conta</span>
        </h1>
        <p class="text-gray-600 font-medium">Junta-te aos clientes LeiriaDetail</p>
      </div>

      <div class="bg-[#050508] backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        
        <!-- Sucesso - Redirecionar para verificação -->
        <div v-if="success" class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Mail class="w-8 h-8 text-blue-400" />
          </div>
          <p class="text-blue-400 font-bold text-lg mb-2">Conta criada!</p>
          <p class="text-gray-400 text-sm mb-6">Enviámos um código de verificação para o teu email.</p>
          <button @click="goToVerify" class="w-full py-4 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white font-black uppercase tracking-widest text-sm rounded-xl">
            Inserir Código de Verificação
          </button>
        </div>

        <!-- Formulário -->
        <div v-else>
          <div class="flex flex-col gap-3 mb-6">
            <button @click="registerWithGoogle" type="button" class="w-full py-3.5 px-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3">
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Registar com o Google
            </button>
            
            <!--<button @click="registerWithApple" type="button" class="w-full py-3.5 px-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 16.97 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
              </svg>
              Registar com a Apple
            </button>
            -->
          </div>

          <div class="flex items-center gap-4 mb-6">
            <div class="h-px bg-white/10 flex-1"></div>
            <span class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Ou com email</span>
            <div class="h-px bg-white/10 flex-1"></div>
          </div>

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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { User, Mail, Lock, Phone, UserPlus, ArrowRight } from 'lucide-vue-next';
import { Cache } from '@/services/cachemanager';

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
const success = ref(false);

// ✅ Redirecionar para verificação
const goToVerify = () => {
  router.push(`/verify?email=${encodeURIComponent(formData.value.email)}`);
};

const handleRegister = async () => {
    errorMessage.value = '';

    if (formData.value.password !== formData.value.confirmPassword) {
        errorMessage.value = 'As passwords não coincidem!';
        return;
    }

    isLoading.value = true;

    try {
        const nameParts = formData.value.name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const response = await fetch('/Authentication/Register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.value.email,
                password: formData.value.password,
                firstName: firstName,
                lastName: lastName
            })
        });

        const data = await response.json();

        if (data.HasError) {
            throw new Error(data.Error?.Message || 'Erro ao criar conta.');
        }

        // ✅ Mostrar mensagem de sucesso em vez de redirecionar para login
        success.value = true;
        
    } catch (error: any) {
        errorMessage.value = error.message;
    } finally {
        isLoading.value = false;
    }
};

const registerWithGoogle = async () => {
  try {
    if (!(window as any).google?.accounts?.oauth2) {
      await new Promise<void>((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    }

    const client = (window as any).google.accounts.oauth2.initCodeClient({
      client_id: '433691700860-nuutndflkr2iosttdc0ij269igarlua7.apps.googleusercontent.com',
      scope: 'email profile',
      ux_mode: 'redirect',
      redirect_uri: 'http://localhost:5174/registar',
      callback: async (response: any) => {
        if (response.code) {
          isLoading.value = true;
          
          const res = await fetch('/Authentication/GoogleLogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: response.code })
          });
          
          const data = await res.json();
          
          if (data.HasError) {
            errorMessage.value = data.Error?.Message || 'Erro no registo com Google.';
            isLoading.value = false;
            return;
          }
          
          Cache.setAuth(data.SessionKey, data.CredencialKey?.toString(), '');
          router.push('/');
        }
      }
    });

    client.requestCode();
  } catch (error: any) {
    errorMessage.value = error.message;
  }
};
/*
const registerWithApple = async () => {
  try {
    // Apple Sign-In - a implementar quando tiveres Apple Developer configurado
    alert('Registo com Apple será disponibilizado em breve!');
  } catch (error: any) {
    errorMessage.value = error.message;
  }
};
*/
</script>