import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:5000' } },
  build: {
    rollupOptions: {
      output: { manualChunks: { motion: ['framer-motion'], gsap: ['gsap'], react: ['react', 'react-dom', 'react-router-dom'] } },
    },
  },
  test: { environment: 'jsdom', globals: true, setupFiles: './src/tests/setup.js' },
});
