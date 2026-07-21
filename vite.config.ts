import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

import tailwindcss from '@tailwindcss/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@shared/types': path.resolve(__dirname, '../server/src/types/index.ts'),
    },
  },
  server: {
    port: 5173,
  },
});
