import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import VitePluginHtmlEnv from 'vite-plugin-html-env'
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'

const pwaOptions: Partial<VitePWAOptions> = {
  mode: 'development',
  base: '/',
  srcDir: 'src',
  filename: 'sw.ts',
  includeAssets: ['favicon.svg'],
  registerType: 'autoUpdate',
  manifest: {
    name: 'El Bibi',
    short_name: 'LBB',
    theme_color: '#ffffff',
    display: 'fullscreen',
    orientation: 'portrait',
    background_color: '#ffffff',
    lang: 'fr',
    ...require('./public/manifest.json')
  },
  devOptions: {
    enabled: true,
    /* when using generateSW the PWA plugin will switch to classic */
    type: 'module',
    navigateFallback: 'index.html',
  },
}


export default defineConfig({
  plugins: [
    vue(),
    VitePWA(pwaOptions),
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
  base: '/elbibi/'
})
