import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import pkg from './package.json'

export default defineConfig({
  // See: https://vite.dev/config/ssr-options.html
  ssr: {

    // No dependencies are externalized. However, dependencies explicitly listed 
    // in ssr.external (using string[] type) can take priority and still be externalized.
    noExternal: true, 

    // devDependencies are externalized (not included in the bundle)
    external: Object.keys(pkg.devDependencies), 

    // Node.js built-ins will also be externalized by default.
    target: 'node'
  },
  build: {
    ssr: true,
    lib: {
      entry: {
        main: 'src/main.ts',
        cli: 'src/cli.ts'
      },
      formats: ['es']
    },
    rollupOptions: {
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