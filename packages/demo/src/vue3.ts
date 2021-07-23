import { createApp, version } from 'vue'
import input from '@satrong/v-input'

const app = createApp({
  template: `
<div>
  <h4>Vue v${version}</h4>
  <MyInput />
</div>
  `
})

app.component('MyInput', {
  data() {
    return {
      form: {
        name: ''
      }
    }
  },
  methods: {
    fn(val: string) {
      return String(Number(val) + 1)
    }
  },
  template: `
<div>
  <input type="text" v-model="form.name" v-input:form:name.number />
  <span v-text="form.name"></span>
</div>
`
})

app.use(input).mount('#vue3')
