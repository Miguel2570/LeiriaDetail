<template>
  <div class="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4 overflow-hidden relative">
    <!-- Background Glows -->
    <div class="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#3B82F6]/20 rounded-full blur-[120px] pointer-events-none" />
    <div class="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#06B6D4]/20 rounded-full blur-[120px] pointer-events-none" />

    <div class="w-full max-w-md relative z-10">
      <div class="text-center mb-8">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#06B6D4] flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5)]">
            <Shield class="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 class="text-4xl font-[Poppins] font-bold text-white mb-2 tracking-wide">LeiriaDetail</h1>
        <p class="text-[#94A3B8] font-medium">Super Admin Portal</p>
      </div>

      <div class="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-[16px] shadow-2xl relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        <div class="flex gap-4 mb-8 relative z-10">
          <button 
            @click="isLogin = true"
            :class="['flex-1 pb-3 font-[Poppins] font-bold transition-all border-b-2', isLogin ? 'text-white border-[#06B6D4]' : 'text-[#64748B] border-transparent hover:text-[#94A3B8]']"
          >
            Sign In
          </button>
          <button 
            @click="isLogin = false"
            :class="['flex-1 pb-3 font-[Poppins] font-bold transition-all border-b-2', !isLogin ? 'text-white border-[#06B6D4]' : 'text-[#64748B] border-transparent hover:text-[#94A3B8]']"
          >
            Register
          </button>
        </div>

        <form @submit="handleSubmit" class="space-y-5 relative z-10">
          <div v-if="!isLogin">
            <label class="block text-sm font-bold text-[#94A3B8] mb-1.5">Full Name</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User class="h-5 w-5 text-[#06B6D4]" />
              </div>
              <input 
                type="text" 
                required
                v-model="name"
                class="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition-all placeholder-[#475569]"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-[#94A3B8] mb-1.5">Email Address</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-[#06B6D4]" />
              </div>
              <input 
                type="email" 
                required
                v-model="email"
                class="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:border-[#06B6D4] focus:ring-1 focus:ring-[#06B6D4] transition-all placeholder-[#475569]"
                placeholder="admin@leiriadetail.com"
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
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            class="w-full mt-4 py-3.5 bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white rounded-xl font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all flex items-center justify-center gap-2 group"
          >
            {{ isLogin ? 'Access Dashboard' : 'Create Account' }}
            <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Mail, ArrowRight, Shield } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'

// Estado local
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const name = ref('')

// Hooks
const { login } = useAuth()
const router = useRouter()

// Método de submit
const handleSubmit = (e: Event) => {
  e.preventDefault()
  
  if (isLogin.value) {
    // Login
    login(email.value)
  } else {
    // Register - também faz login após registrar
    // Aqui você pode adicionar lógica de registro
    login(email.value)
  }
  
  router.push('/')
}
</script>