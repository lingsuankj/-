import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

// https://vitejs.dev/config/
export default defineConfig({
  // Use when build
  // base: '/ltcs/',
  plugins: [
    uni(),
  ],
  server: {
    proxy: {
      '/ding': {
        target: 'https://api.dingtalk.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/ding/, ''),
      },
      '/oding': {
        target: 'https://dmq.lingsuankj.com',
        changeOrigin: true,
      },
      '/ling': {
        target: 'https://dmq.lingsuankj.com',
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/ling/, ''),
      },
    },
  },
});
