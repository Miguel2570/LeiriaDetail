import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 5175,
    strictPort: true,
    proxy: {
        '/Authentication': {
            target: 'http://localhost:3001',
            changeOrigin: true
        },
        '/Dashboard': {
            target: 'http://localhost:3001',
            changeOrigin: true
        },
        '/CRM': { 
          target: 'http://localhost:3001', 
          changeOrigin: true 
        },
        '/Appointments': { 
          target: 'http://localhost:3001', 
          changeOrigin: true 
        },
        '/Services': { target: 'http://localhost:3001', changeOrigin: true },
        '/Staff': { target: 'http://localhost:3001', changeOrigin: true },
        '/Financial': { target: 'http://localhost:3001', changeOrigin: true }
    }
  }
})