import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/The-Everest/' : '/',
  plugins: [react()],
  optimizeDeps: {
    include: ['需要预编译的包名'],
    force: true
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    }
  }
})
