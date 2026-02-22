import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // vite doesn't support .lottie files out of the box, so we need to tell it to treat them as assets
  assetsInclude: ['**/*.lottie'],
})