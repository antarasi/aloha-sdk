import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: {
        main: 'src/main.ts',
        cli: 'src/cli.ts'
      },
      formats: ['es']
    },
    rollupOptions: {
      external: ['fs', 'path'],
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