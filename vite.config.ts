import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: ['src/main.ts'],
      formats: ['es']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    target: 'node20',
    minify: false,
    sourcemap: true
  },
  plugins: [dts()]
}) 