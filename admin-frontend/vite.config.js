import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'icons-vendor': ['react-icons'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
