import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
  ],
  build: {
    chunkSizeWarningLimit: 800, // kB
  },
  // GitHub Pages hosts this project under /mobile-dungeon-toolkit/.
  // Keep local development at the root path.
  base: command === 'build' ? '/mobile-dungeon-toolkit/' : '/',
}));
