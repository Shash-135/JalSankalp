import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';


const certPath = path.resolve('ssl/cert.pem');
const keyPath = path.resolve('ssl/key.pem');
const hasCerts = fs.existsSync(certPath) && fs.existsSync(keyPath);

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: true,
    https: hasCerts ? { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) } : false,
    proxy: {
      
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
