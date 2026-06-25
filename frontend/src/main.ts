// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { createHead } from '@vueuse/head'
import './assets/css/style.css'
import './assets/css/admin.css'
import './Helpers/apiInterceptor'

const app = createApp(App)
const head = createHead()

app.config.errorHandler = (err, instance, info) => {
    const error = err as Error
    console.error("Vue Error Handler:", err)
    
    // Evita loop se já estiver na página de erro
    if (router.currentRoute.value.name === 'ErrorPage' || 
        router.currentRoute.value.name === 'error') {
        console.error('Já está na página de erro, a evitar loop.')
        return
    }
    
    router.push({
        name: "ErrorPage",
        state: {
            layer: "FRONTEND",
            title: "Exception",
            subTitle: "An unexpected error occurred",
            message: error?.message || "Ocorreu um erro inesperado na aplicação.",
            details: error?.message || "",
            stacktrace: error?.stack || ""
        }
    })
}

app.use(i18n)
app.use(head)
app.use(router)
app.mount('#app')