import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // "@/..." menunjuk ke src/ (konvensi shadcn), mis. "@/Components/ui/logo-marquee"
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
