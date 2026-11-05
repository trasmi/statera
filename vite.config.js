import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Le site statique (page d'accueil) vit dans public/ ; l'application React dans outil/.
// `npm run dev` puis /outil/ pour développer l'outil, `npm run build` pour produire dist/.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  build: { rollupOptions: { input: 'outil/index.html' } },
})
