import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/task-master/',
  build: {
    outDir: 'build',
  },
  plugins: [react()],
  server: {
    open: true,
  },
});
