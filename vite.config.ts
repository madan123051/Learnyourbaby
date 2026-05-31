import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Required for Capacitor — assets use relative paths
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
