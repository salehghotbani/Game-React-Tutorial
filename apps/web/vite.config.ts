import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { previewPlugin } from './previewPlugin';
import { serverTimePlugin } from './serverTimePlugin';
import { visitorLocalePlugin } from './visitorLocalePlugin';

const isolationHeaders = { 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'credentialless', 'Cross-Origin-Resource-Policy': 'cross-origin' };

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), previewPlugin(), serverTimePlugin(), visitorLocalePlugin()],
  optimizeDeps: { include: ['@webcontainer/api', '@monaco-editor/react', 'monaco-editor/esm/vs/editor/editor.api.js', 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution', 'monaco-editor/esm/vs/language/typescript/monaco.contribution.js', '@babel/standalone'] },
  server: { host: '127.0.0.1', headers: isolationHeaders },
  preview: { headers: isolationHeaders },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@dimforge') || id.includes('@react-three/rapier')) return 'physics';
          if (id.includes('/three/') || id.includes('@react-three/fiber')) return 'scene';
        }
      }
    }
  }
});
