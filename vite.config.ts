import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    // One copy of React, always. Guards against a second instance sneaking in
    // through a transitive dependency, which surfaces as "Invalid hook call".
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    /**
     * Declared up front so the dependency optimizer bundles everything in its
     * first pass.
     *
     * Left to discover these lazily, Vite re-optimizes mid-load and bumps the
     * browser hash, so a page that has already imported `react` can end up
     * paired with a newly-hashed `react-dom` — two React instances, and a
     * "Cannot read properties of null (reading 'useState')" on first load that
     * disappears when you refresh. Listing them removes the race.
     */
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-dev-runtime',
      'react/jsx-runtime',
      'react-router-dom',
      'motion/react',
    ],
  },
  build: {
    target: 'es2022',
    cssTarget: 'chrome111',
  },
})
