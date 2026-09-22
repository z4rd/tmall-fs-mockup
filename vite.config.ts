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
  // `vite preview` 默认只绑 localhost，同事的手机进不来。host: true 等价于 0.0.0.0，
  // 这样局域网内可以直接访问 http://<本机 IP>:5276/ —— 真机验收（尤其是
  // 「添加到主屏幕」后的 standalone 全屏）只能在手机上做。
  preview: {
    host: true,
    port: 5276,
  },
});
