import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Application web classique : `npm run dev` pour développer, `npm run build` pour déployer le dossier dist/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
})
