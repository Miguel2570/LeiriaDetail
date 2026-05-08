import { ref, watch } from 'vue'

const SESSION_STORAGE_NAME = 'leiriadetail_session'

// Inicializa com o valor que estiver no browser ou vazio
const sessionRef = ref(localStorage.getItem(SESSION_STORAGE_NAME) || '')

watch(sessionRef, (newVal) => {
  if (newVal) {
    localStorage.setItem(SESSION_STORAGE_NAME, newVal)
  } else {
    localStorage.removeItem(SESSION_STORAGE_NAME)
  }
})

export const Cache = {
  Session: {
    get value() {
      return sessionRef.value
    },
    set value(val: string) {
      sessionRef.value = val
    }
  },
  // Podes adicionar mais caches aqui (User, Theme, etc.)
  clearAll() {
    sessionRef.value = ''
  }
}