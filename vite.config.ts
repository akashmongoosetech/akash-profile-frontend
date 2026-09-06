import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'ckeditor': ['@ckeditor/ckeditor5-react', '@ckeditor/ckeditor5-build-classic', '@ckeditor/ckeditor5-core', '@ckeditor/ckeditor5-utils'],
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          'pdf': ['jspdf', 'jspdf-autotable'],
          'vendor': ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react', 'react-helmet-async', 'react-markdown', 'react-syntax-highlighter'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
