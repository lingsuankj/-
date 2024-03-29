import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
// https://vitejs.dev/config/
export default defineConfig({
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
        target: 'https://oapi.dingtalk.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/oding/, ''),
      },
      '/ling': {
        target: 'http://10.0.1.224:7001',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/ling/, ''),
      },
    },
  },
});
