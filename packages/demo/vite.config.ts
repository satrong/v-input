import { defineConfig } from 'vite'
import * as Path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      vue2: Path.resolve('./node_modules/vue2/dist/vue.esm.js'),
      vue: Path.resolve('./node_modules/vue/dist/vue.esm-bundler.js')
    }
  },
  base: './',
  build: {
    emptyOutDir: true
  },
  server: {
    port: 3300
  }
})
