import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Alias "@/..." tro vao "src/..." - dung nhu trong UI goc
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
