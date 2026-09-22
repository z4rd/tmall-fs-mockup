import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // 用相对 base，这样构建产物也能从 file:// 直接打开，便于离线交付。
  base: './',
  plugins: [react()],
  build: {
    target: 'es2017',
    assetsInlineLimit: 0,
  },
  server: {
    host: true,
    port: 5273,
  },
});
