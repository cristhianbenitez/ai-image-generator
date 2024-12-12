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
      threshold: 512,
      compressionOptions: { level: 11 },
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
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'ui-vendor': ['react-helmet-async', 'react-masonry-css'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
});
