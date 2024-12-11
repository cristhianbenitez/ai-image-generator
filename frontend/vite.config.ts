import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'brotli',
      ext: '.br',
    }),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve('.', './src'),
      '@pages': path.resolve('.', './src/pages'),
      '@components': path.resolve('.', './src/components'),
      '@assets': path.resolve('.', './src/assets'),
      '@hooks': path.resolve('.', './src/hooks'),
      '@constants': path.resolve('.', './src/constants'),
      '@config': path.resolve('.', './src/config'),
      '@utils': path.resolve('.', './src/utils'),
      '@types': path.resolve('.', './src/types'),
      '@services': path.resolve('.', './src/services'),
      '@store': path.resolve('.', './src/store'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
