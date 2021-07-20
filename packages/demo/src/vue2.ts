import Vue from 'vue2'
import input from 'v-input'

Vue.use(input)

Vue.component('MyInput', {
  data() {
    return { myValue: 'test' }
  },
  template: `
<div>
  <input v-model="myValue" v-input:myValue.!0="[-10,20]" />
  <span v-text="myValue"></span>
</div>
`
})

new Vue({
  template: `
<div>
  <h4>Vue ${Vue.version}</h4>
  <MyInput />
</div>`,
}).$mount('#vue2')
