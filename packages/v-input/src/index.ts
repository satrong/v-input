import type { App, Directive } from 'vue'
import type { VueConstructor } from 'vue2'
import { bind, unbind } from './filter'

export const directive: Directive = {
  mounted(el, binding) {
    const ctx = binding.instance
    if (ctx) bind(ctx, el, binding)
  },
  beforeUnmount: unbind
}

export default {
  install: (vue: App | VueConstructor) => {
    if (vue.version.startsWith('2.')) {
      (vue as VueConstructor).directive('input', {
        bind(el: any, binding: any, vnode) {
          bind(vnode.context as any, el, binding)
        },
        unbind
      })
    } else if (vue.version.startsWith('3.')) {
      (vue as App).directive('input', directive)
    }
  }
}
