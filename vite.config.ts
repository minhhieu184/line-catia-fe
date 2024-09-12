import basicSSL from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react-swc';
// import { readFileSync } from 'node:fs';
// import { dirname, resolve } from 'node:path';
// import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path, { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    basicSSL()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    APP_VERSION: JSON.stringify('v1.2.11'),
  },
});
