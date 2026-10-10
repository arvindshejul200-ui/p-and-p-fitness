import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures all built assets use relative paths (./assets/...) for GitHub Pages, Netlify, Vercel, and subdirectories
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
});
