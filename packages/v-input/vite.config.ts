import { UserConfigFn } from 'vite'
import * as Path from 'path'

export default <UserConfigFn>(({ command, mode }) => {
  console.log(command, mode)
  return {
    resolve: {
      alias: {
        vue2: Path.resolve('./node_modules/vue2/dist/vue.esm.js'),
        vue: Path.resolve('./node_modules/vue/dist/vue.esm-bundler.js')
      }
    },
    build: {
      lib: {
        entry: Path.resolve('./src/index.ts'),
        name: 'VInput'
      },
      rollupOptions: {
        external: ['vue', 'vue2']
      },
      outDir: 'lib',
      emptyOutDir: true
    },
    server: {
      port: 3300
    }
  }
})