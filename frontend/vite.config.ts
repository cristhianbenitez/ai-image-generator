import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve('.', './src'),
      '@pages': path.resolve('.', './src/pages'),
      '@components': path.resolve('.', './src/components'),
      '@assets': path.resolve('.', './src/assets'),
      '@hooks': path.resolve('.', './src/hooks'),
      '@constants': path.resolve('.', './src/constants'),
      '@config': path.resolve('.', './src/config'),
      '@context': path.resolve('.', './src/context'),
      '@utils': path.resolve('.', './src/utils'),
    },
  },
});
