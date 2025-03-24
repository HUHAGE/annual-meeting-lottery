import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    base: './',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'xlsx': ['xlsx']
        }
      }
    },
    copyPublicDir: true
  },
  
  server: {
    port: 5173,
    open: true
  }
}) 