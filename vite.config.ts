import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue-router')) {
              return 'vendor-router';
            }

            if (id.includes('axios')) {
              return 'vendor-axios';
            }

            if (id.includes('@vueuse')) {
              return 'vendor-vueuse';
            }

            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        // target: 'http://localhost:8443',
        target: 'https://konceptbuildui.onrender.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/konceptbuild'),
      },
    },
  },
});
