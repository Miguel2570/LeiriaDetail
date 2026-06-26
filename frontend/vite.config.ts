import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@portaladmin': fileURLToPath(new URL('./src/portaladmin', import.meta.url))
    }
  },
  server: {
    host: true,
    port: 5174,
    strictPort: true,
    proxy: {
        '/Authentication': { target: 'http://localhost:3001', changeOrigin: true },
        '/Profile': { target: 'http://localhost:3001', changeOrigin: true },
        //'/Portfolio': { target: 'http://localhost:3001', changeOrigin: true },
    }
  }
})