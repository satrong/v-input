import Vue from 'vue2'
import type { PropType } from 'vue2'
import input from '@satrong/v-input'
import { getTpl, getModifiers } from './template'

Vue.use(input)

Vue.component('MyInput', {
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
  render(h) {
    const modifiers = this.modifiers.reduce((prev, item) => {
      prev[item] = true
      return prev
    }, {} as { [key: string]: boolean })

    const bindValue = Array.isArray(this.range) ? `="[${this.range[0]}, ${this.range[1]}]"` : ''

    return h('div', [
      h('pre', `<input v-mode="form.name" v-input:form:name${[''].concat(this.modifiers).join('.') + bindValue} />`),
      h('input', {
        domProps: {
          type: 'text',
          placeholder: 'input...',
          value: this.$data.form.name
        },
        on: {
          input: (evt: any) => {
            this.$data.form.name = evt.target.value
          }
        },
        directives: [
          {
            name: 'input',
            value: this.range,
            arg: 'form:name',
            modifiers
          }
        ]
      }),
      h('div', [this.$data.form.name])
    ])
  }
})

new Vue({
  template: getTpl(Vue.version),
  data: {
    list: getModifiers(),
    values: [],
    from: '',
    to: '',
    key: ''
  },
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
  created() {
    const unwatch = this.$watch(() => [this.values, this.from, this.to], () => {
      this.key = String(Date.now())
    })
    this.$once('hook:beforeDestroy', unwatch)
  }
}).$mount('#vue2')
