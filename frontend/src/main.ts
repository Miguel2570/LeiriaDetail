// src/main.ts (unificado)
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './assets/css/style.css'
import './assets/css//admin.css'

const app = createApp(App)

// Tratamento global de erros
app.config.errorHandler = (err, instance, info) => {
    const error = err as Error
    console.error("Vue Error Handler:", err)
    
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
    });
}

app.use(i18n)
app.use(router)
app.mount('#app')