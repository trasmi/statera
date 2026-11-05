import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: { 'process.env.NODE_ENV': '"production"' },
  build: {
    lib: { entry: 'src/main.jsx', name: 'Statera', formats: ['iife'], fileName: () => 'app.js' },
    cssCodeSplit: false,
    rollupOptions: { output: { assetFileNames: 'app.[ext]' } },
    outDir: 'dist', emptyOutDir: true, chunkSizeWarningLimit: 4000,
  },
})
