import { createApp, version } from 'vue'
import input from 'v-input'

const app = createApp({
  template: `
<div>
  <h4>Vue ${version}</h4>
  <MyInput />
</div>
  `,
})

app.component('MyInput', {
  data() {
    return { myValue: 'test' }
  },
  methods: {
    fn(val: string) {
      return String(Number(val) + 1)
    }
  },
  template: `
<div>
  <input type="text" v-model="myValue" v-input:myValue.number />
  <span v-text="myValue"></span>
</div>
`
})

app.use(input).mount('#vue3')