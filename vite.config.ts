import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import VitePluginHtmlEnv from 'vite-plugin-html-env'

export default defineConfig({
  plugins: [
    vue(),
    VitePluginHtmlEnv({
      compiler: true,
      // compiler: false // old
      compress: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8080,
    strictPort: true
  },
  test: {
    globals: true,
    environment: 'happy-dom'
  },
  base: "/elbibi/"
})
