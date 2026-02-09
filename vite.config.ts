
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY || '')
  },
  server: {
    port: 3000,
    // 允许热更新
    hmr: true
  },
  // 确保资源路径正确
  base: './'
});
