import type { ComponentPublicInstance, DirectiveBinding } from 'vue'

export type BindValue = ((str: string) => string) | [number, number] | undefined

export type Modifier = {
  /** 任意数值 */
  number: true;
  /** 整数 */
  integer: true;
  /** 正数 */
  positive: true;
  /** 负数 */
  negative: true;
  /** 不能为0 */
  '!0': true;
}

function isInputOrTextarea(obj: HTMLElement) {
  const t = Object.prototype.toString.call(obj).slice(8, -1)
  return ['HTMLInputElement', 'HTMLTextAreaElement'].indexOf(t) > -1
}

function hasProperty(obj: any, props: string) {
  let o = obj
  return props.split('.').every(item => {
    if (Object.prototype.hasOwnProperty.call(o, item) || (window.Reflect && Reflect.has(o, item))) {
      o = o[item]
      return true
    }
    return false
  })
}

function setPropertyVal(obj: any, props: string, value: any) {
  const arr = props.split('.')
  arr.reduce((prev, item, index) => {
    if (index === arr.length - 1) {
      prev[item] = value
      return null
    }
    return prev[item]
  }, obj)
}

function getPropertyVal(obj: any, props: string) {
  return props.split('.').reduce((prev, item) => prev[item], obj)
}

export function validate(bindValue: BindValue) {
  if (Array.isArray(bindValue)) {
    const [min, max] = bindValue
    if (bindValue.length !== 2) {
      throw Error('Array length must be 2')
    }
    if (typeof min !== 'number' || typeof max !== 'number') {
      throw Error('Array\'s elements must be `Number`')
    }
    if (min > max) {
      throw Error('In the array `[min, max]`, min cannot be greater than max')
    }
  } else if (bindValue !== undefined) {
    if (typeof bindValue !== 'function') {
      throw Error('The `bindValue` must be `Function`')
    } else {
      // try to check. May misjudge
      const checkList = ['', '123', '12ab', '1.2.3.4']
      if (checkList.some(el => {
        const val = bindValue(el)
        return val !== bindValue(val)
      })) {
        throw Error('Make sure `bindValue` function DONOT return dynamic value.')
      }
    }
  }
}

function filter(value: string, bindValue: BindValue, modifier: Modifier, trigger: 'input' | 'blur' = 'input') {
  if (value === '') return value
  let val = String(value)
  const useModifier = modifier['!0'] || modifier.integer || modifier.negative || modifier.number || modifier.positive || Array.isArray(bindValue)

  if (modifier.number && !/^[-.\d]+$/.test(val)) {
    val = val.replace(/[^-.\d]+/g, '')
  }

  // 整数判断
  if (modifier.integer && !/^[-\d]+$/.test(val)) {
    val = val.replace(/[^-\d]+/g, '')
  }

  // 正数判断
  if (modifier.positive && !modifier.negative) {
    val = val.replace(/[^.\d]+/g, '')
  }

  // 负数判断
  if (modifier.negative && !modifier.positive) {
    val = val.replace(/[^-.\d]+/g, '')
  }

  if (useModifier) {
    val = val.replace(/\s+/g, '')
    if (val !== '' && val !== '-') {
      if (!isFinite(+val)) {
        const matched = val.match(/-?\d+\.?\d+/)
        if (matched) {
          val = matched[0]
        } else {
          val = ''
        }
      }
    }
  }

  // 失去焦点时，val包含负号且值转换成数字等于0，处理负号
  if (trigger === 'blur' && modifier.negative && !modifier.positive && !/^-/.test(val) && Number(val) !== 0) {
    val = ''
  }

  if (Array.isArray(bindValue) && val !== '') {
    const [min, max] = bindValue
    const v = Number(val)
    if (trigger === 'blur') {
      if (v < min || v > max) val = ''
    }
  }

  // 失去焦点时处理 0001 和 1.000 的情况
  if (trigger === 'blur' && useModifier && val !== '') {
    val = String(Number(val))
  }

  if (typeof bindValue === 'function') {
    val = bindValue(val)
  }

  return val
}

export function bind(ctx: ComponentPublicInstance, el: any, binding: DirectiveBinding) {
  const arg = (binding.arg || '').replace(/:/g, '.')
  const modifiers = binding.modifiers as Modifier
  if (!hasProperty(ctx, arg)) throw (new Error(`The expression \`this.${arg}\` not found.`))
  validate(binding.value)

  el.vInputUnwatch = ctx.$watch(arg, (val: unknown, oldValue: any) => {
    if (typeof val === 'string') {
      let val1 = filter(val, binding.value, modifiers)
      if (val !== '' && val1 === '' && oldValue !== '') {
        val1 = filter(oldValue, binding.value, modifiers)
      }
      setPropertyVal(ctx, arg, val1)
    }
  })

  const elem = isInputOrTextarea(el) ? el : el.querySelector('input,textarea')
  if (elem) {
    const handler = () => {
      const val = getPropertyVal(ctx, arg)

      let result = val
      if (modifiers['!0']) {
        if (!isNaN(val)) {
          result = String(Number(val))
          if (result === '0') result = ''
        }
      }

      setPropertyVal(ctx, arg, filter(result, binding.value, modifiers, 'blur'))
    }
    elem.addEventListener('blur', handler)
    el.vInputBlur = [elem, handler]
  }
}

export function unbind(el: any) {
  el.vInputUnwatch?.()
  if (el.vInputBlur) {
    el.vInputBlur[0].removeEventListener('blur', el.vInputBlur[1])
  }
}
