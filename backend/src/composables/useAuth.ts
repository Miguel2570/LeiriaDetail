// src/composables/useAuth.ts
import { ref, computed, type Ref } from 'vue'

export interface User {
  email: string
  name: string
}

const user = ref<User | null>(null)

export function useAuth() {
  const login = (email: string) => {
    user.value = {
      email,
      name: email.split('@')[0]
    }
    // Persistir no localStorage (opcional)
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  const checkAuth = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
    return !!user.value
  }

  const isAuthenticated = computed(() => !!user.value)

  return {
    user: user as Ref<User | null>,
    login,
    logout,
    checkAuth,
    isAuthenticated
  }
}