import { createApp, version, ref, h, resolveDirective, withDirectives, watch, onBeforeUnmount, defineComponent } from 'vue'
import type { PropType } from 'vue'
import input from '@satrong/v-input'
import { getTpl, getModifiers } from './template'

const app = createApp({
  template: getTpl(version),
  computed: {
    range() {
      if (this.from && this.to) {
        const from = Number(this.from)
        const to = Number(this.to)
        if (!isNaN(from) && !isNaN(to) && from <= to) {
          return [from, to]
        }
      }
      return undefined
    }
  },
  setup() {
    const list = getModifiers()
    const values = ref([])
    const from = ref('')
    const to = ref('')
    const key = ref('')
    const unwatch = watch([values, from, to], () => {
      key.value = String(Date.now())
    })
    onBeforeUnmount(unwatch)
    return { list, values, from, to, key }
  }
})

app.component('MyInput', defineComponent({
  props: {
    modifiers: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    range: Array as PropType<number[]>
  },
  data() {
    return {
      form: {
        name: ''
      }
    }
  },
  render() {
    const input = resolveDirective('input')
    if (!input) return h('div')

    const inputVNode = h('input', {
      type: 'text',
      placeholder: 'input...',
      value: this.form.name,
      onInput: (evt: any) => {
        this.form.name = evt.target.value
      }
    })

    const modifiers = this.modifiers.reduce((prev, item) => {
      prev[item] = true
      return prev
    }, {} as { [key: string]: boolean })

    const bindValue = Array.isArray(this.range) ? `="[${this.range[0]}, ${this.range[1]}]"` : ''

    return [
      h('pre', `<input v-mode="form.name" v-input:form:name${[''].concat(this.modifiers).join('.') + bindValue} />`),
      withDirectives(inputVNode, [
        [input, this.range, 'form:name', modifiers]
      ]),
      h('div', [this.form.name])
    ]
  }
}))

app.use(input).mount('#vue3')
