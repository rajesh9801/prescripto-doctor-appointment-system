import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'  // usually needed
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),        // add react plugin
    tailwindcss(),  // tailwind plugin
  ],
  server: {
    port: 5176,     // correct placement
  },
})
