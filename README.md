<a href="https://www.npmjs.com/package/vue-model-input">
  <img src="https://img.shields.io/npm/v/vue-model-input.svg" />
</a>
<p>
  English | <a href="README.zh-CN.md">中文</a>
</p>

A Vue directive to control HTML input/textarea element value. Support Vue 2 and Vue 3.

> [Online Demo](https://satrong.github.io/v-input/packages/demo/dist/)


## Installation
```shell
npm install vue-model-input
```

For Vue 2.x:
```js
import Vue from 'vue'
import vInput from 'vue-model-input'

Vue.use(vInput)

new Vue({
  // ...
}).$mount('#app')
```

For Vue 3.x:
```js
import { createApp } from 'vue'
import vInput from 'vue-model-input'

createApp({
  // ...
}).use(vInput).mount('#app')
```

## Usage
The format is as follow:
```html
<input v-model="arg" v-input:arg.modifier="bindValue" />
```

Example:
```html
<template>
  <div>
    <input v-model="age" v-input:age.postive.integer="[0,80]">
    <input v-model="form.total" v-input:form:total.number>
  </div>
</template>

<script>
export default {
  data() {
    return {
      age: '',
      form: {
        total: ''
      }
    }
  }
}
</script>
```


## arg
Corresponding to the value of `v-model` , replace `.` with `:` when the value include `.` . 

For example, the value is `a.b.c` (ie. `v-model="a.b.c"` ), and the `arg` should be `a:b:c` (ie. `v-input:a:b:c`).


## modifier
- `number` Any number string
- `integer`
- `positive`
- `negative`
- `!0` Not zero


## bindValue
- `[min, max]` Limit the value range. Trigger by blur event.
- `(val) => string` Custom function. **⚠ DONOT RETURN DYNAMIC VALUE**
