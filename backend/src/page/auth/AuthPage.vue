<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Mail, ArrowRight, Shield, LogIn } from 'lucide-vue-next'
import { Cache } from '@/services/cachemanager'

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const name = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const router = useRouter()

const handleLogin = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
        const response = await fetch('/Authentication/Login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        });

        const data = await response.json();

        console.log('📦 Data:', data)

        if (data.HasError) {
            throw new Error(data.Error?.Message || 'Credenciais inválidas.');
        }

        Cache.setAuth(
            data.SessionKey,
            data.CredencialKey?.toString(),
            email.value
        );

        router.push('/dashboard');
        
    } catch (error: any) {
        errorMessage.value = error.message;
    } finally {
        isLoading.value = false;
    }
}

const handleRegister = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
        const nameParts = name.value.split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''

        const response = await fetch('/Authentication/Register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
                firstName: firstName,
                lastName: lastName
            })
        });

        const data = await response.json();
        console.log('Register response:', data);

        if (data.HasError) {
            throw new Error(data.Error?.Message || 'Erro no registo');
        }

        // Após registo, faz login automático
        const loginResponse = await fetch('/Authentication/Login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        });

        const loginData = await loginResponse.json();

        if (loginData.HasError) {
            throw new Error(loginData.Error?.Message || 'Erro ao fazer login');
        }

        Cache.setAuth(
            data.SessionKey,
            data.CredencialKey?.toString(),
            email.value
        );

        router.push('/dashboard');
        
    } catch (error: any) {
        errorMessage.value = error.message;
    } finally {
        isLoading.value = false;
    }
}

const handleSubmit = async () => {
    console.log('🔥 handleSubmit called', { isLogin: isLogin.value, email: email.value, password: password.value })
    
    if (isLogin.value) {
        await handleLogin()
    } else {
        await handleRegister()
    }
}

const toggleMode = (isLoginMode: boolean) => {
  isLogin.value = isLoginMode
  errorMessage.value = ''
  email.value = ''
  password.value = ''
  name.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4 overflow-hidden relative">
    
    <div class="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#3B82F6]/20 rounded-full blur-[120px] pointer-events-none" />
    <div class="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#06B6D4]/20 rounded-full blur-[120px] pointer-events-none" />

    <div class="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <div class="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        
        <div class="flex flex-col items-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#06B6D4]/20">
            <Shield class="w-8 h-8 text-white" />
          </div>
          <h1 class="font-[Poppins] text-3xl font-bold text-white tracking-tight">LeiriaDetail</h1>
          <p class="text-[#94A3B8] font-medium mt-2 text-center">
            Super Admin Portal
          </p>
        </div>

        <div class="flex gap-2 mb-8 p-1 bg-white/5 rounded-xl">
          <button
            type="button"
            @click="toggleMode(true)"
            :class="[
              'flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer',
              isLogin 
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white shadow-lg' 
                : 'text-[#94A3B8] hover:text-white'
            ]"
          >
            Sign In
          </button>
          <button
            type="button"
            @click="toggleMode(false)"
            :class="[
              'flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer',
              !isLogin 
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white shadow-lg' 
                : 'text-[#94A3B8] hover:text-white'
            ]"
          >
            Register
          </button>
        </div>

        <div v-if="errorMessage" class="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p class="text-red-400 text-sm text-center">{{ errorMessage }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          
          <div v-if="!isLogin">
            <label class="block text-sm font-bold text-[#94A3B8] mb-1.5">Full Name</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User class="h-5 w-5 text-[#3B82F6]" />
              </div>
              <input 
                type="text" 
                required
                v-model="name"
                class="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all placeholder-[#475569]"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-[#94A3B8] mb-1.5">Email Address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-[#3B82F6]" />
              </div>
              <input 
                type="email" 
                required
                v-model="email"
                class="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all placeholder-[#475569]"
                placeholder="admin@leiriadetail.pt"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-[#94A3B8] mb-1.5">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-[#06B6D4]" />
              </div>
              <input 
                type="password" 
                required
                v-model="password"
                class="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition-all placeholder-[#475569]"
                placeholder="********"
              />
            </div>
          </div>

          <button 
            type="submit"
            :disabled="isLoading"
            class="w-full mt-4 py-3.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn v-if="!isLoading" class="h-5 w-5" />
            <span v-if="isLoading" class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span v-else>{{ isLogin ? 'Access Dashboard' : 'Create Account' }}</span>
            <ArrowRight v-if="!isLoading" class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <!-- Demo credentials hint -->
        <div class="mt-6 pt-6 border-t border-white/10">
          <p class="text-xs text-center text-[#64748B]">
            Demo: admin@leiriadetail.pt / admin123
          </p>
        </div>

      </div>
    </div>
  </div>
</template>