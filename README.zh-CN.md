<a href="https://www.npmjs.com/package/vue-model-input">
  <img src="https://img.shields.io/npm/v/vue-model-input.svg" />
</a>
<p>
  中文 | <a href="README.md">English</a>
</p>

用于控制 input/textarea 元素 value 值的指令。支持 Vue 2 和 Vue 3 。

> [在线demo](https://satrong.github.io/v-input/packages/demo/dist/)


## 安装
```shell
npm install vue-model-input
```

Vue 2.x:
```js
import Vue from 'vue'
import vInput from 'vue-model-input'

Vue.use(vInput)

new Vue({
  // ...
}).$mount('#app')
```

Vue 3.x:
```js
import { createApp } from 'vue'
import vInput from 'vue-model-input'

createApp({
  // ...
}).use(vInput).mount('#app')
```

## 使用
格式如下：
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
> 指令的参数
对应 `v-model` 的值，如果值中包含 `.` 则需要将 `.` 替换为 `:` 。

例如，`v-model` 绑定的值为 `a.b.c` （即 `v-model="a.b.c"` ），那么传给指令的参数应该为 `a:b:c` （即 `v-input:a:b:c` ）。


## modifier
> 指令的修饰符
- `number` 任意数值
- `integer` 整数
- `positive` 正数
- `negative` 负数
- `!0` 非0


## bindValue
> 指令绑定的值
- `[min, max]` 限制输入值的范围。失去焦点时触发。
- `(val) => string` 自定义函数。 **⚠ 注意：不要返回动态值** （意思是要确保 `fn(val) === fn(fn(val))` 成立）
