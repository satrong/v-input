import { mount } from '@vue/test-utils'
import { directive } from '../src/index'
import type { BindValue, Modifier } from '../src/filter'

type TModifier = keyof Modifier | ''

function inputComponent(modifier: string, bindValue?: BindValue) {
  return {
    directives: {
      input: directive
    },
    data() {
      return {
        myValue: '',
        bindValue
      }
    },
    template: `
<div>
  <input type="text" v-model="myValue" v-input:myValue${modifier}="bindValue" />
  <span v-text="myValue"></span>
</div>
`
  }
}

type TestUnits = {
  title: string;
  modifier?: TModifier[];
  bindValue?: BindValue;
  blur?: boolean;
  items: {
    input: string;
    expect: string;
    modifier?: TModifier[];
    bindValue?: BindValue;
    blur?: boolean;
  }[]
}[]

const testUnits: TestUnits = [
  {
    title: '任意字符',
    items: [
      { input: 'abc1', expect: 'abc1' },
      { input: '-abc1', expect: '-abc1', blur: true }
    ]
  },
  {
    title: '任意数值',
    modifier: ['number'],
    items: [
      { input: 'a1b2c3', expect: '123' },
      { input: '-a1b2c3.4', expect: '-123.4' }
    ]
  },
  {
    title: '非0',
    modifier: ['!0'],
    blur: true,
    items: [
      { input: '0', expect: '' },
      { input: '-0', expect: '' },
      { input: '-0', expect: '-0', blur: false },
      { input: '0.0', expect: '' }
    ]
  },
  {
    title: '范围取值',
    bindValue: [-15, 30],
    items: [
      { input: '1', expect: '1' },
      { input: 'a12', expect: '12' },
      { input: 'a-15', expect: '-15' },
      { input: 'a-19', expect: '-1' },
      { input: '2a-19', expect: '21' },
      { input: '3a40', expect: '30' },
      { input: 'a0', expect: '0' },
      { input: 'a0', expect: '', modifier: ['!0'], blur: true },
      { input: '+02.20', expect: '2.2', blur: true },
      { input: '+00.00', expect: '0', blur: true },
      { input: '+00.00', expect: '', modifier: ['!0'], blur: true }
    ]
  },
  {
    title: '整数',
    modifier: ['integer'],
    items: [
      { input: '1.2', expect: '12' },
      { input: 'b1.2a', expect: '12' },
      { input: '-1.2', expect: '-12' },
      { input: '-a1.2', expect: '-12' }
    ]
  },
  {
    title: '正数',
    modifier: ['positive'],
    items: [
      { input: 'a12', expect: '12' },
      { input: '-12.3', expect: '12.3' },
      { input: '-1a2', expect: '12' },
      { input: '-1.2', expect: '1.2' },
      { input: '+1.2', expect: '1.2' }
    ]
  },
  {
    title: '负数',
    modifier: ['negative'],
    items: [
      { input: '12', expect: '12' },
      { input: '12', expect: '', blur: true },
      { input: '-a12', expect: '-12' },
      { input: '-a1.2', expect: '-1.2' }
    ]
  },
  {
    title: '正整数',
    modifier: ['positive', 'integer'],
    items: [
      { input: '12', expect: '12' },
      { input: '-12a', expect: '12' },
      { input: '12.5', expect: '125' },
      { input: '00', expect: '0', blur: true },
      { input: '00', expect: '', modifier: ['negative', 'integer', '!0'], blur: true }
    ]
  },
  {
    title: '负整数',
    modifier: ['negative', 'integer'],
    items: [
      { input: '12', expect: '12' },
      { input: '12', expect: '', blur: true },
      { input: '-12a', expect: '-12' },
      { input: '12.5', expect: '125' },
      { input: '00', expect: '0', blur: true },
      { input: '00', expect: '', modifier: ['negative', 'integer', '!0'], blur: true }
    ]
  },
  {
    title: '函数',
    items: [
      { input: 'a1b2c3', expect: 'abc', bindValue: val => val.replace(/[^a-z]/gi, '') },
      { input: 'a1b2c3000', expect: '123', modifier: ['number'], bindValue: val => val.replace(/0+/g, '') }
    ]
  }
]

testUnits.forEach(item => {
  item.items.forEach(el => {
    test(item.title + ' ' + el.input + ' -> ' + el.expect, async() => {
      const modifiers = (el.modifier ? el.modifier : item.modifier) || []
      const modifier = modifiers.length > 0 ? [''].concat(modifiers) : []
      const wrapper = mount(inputComponent(modifier.join('.'), el.bindValue || item.bindValue))
      const ele = wrapper.find('input')

      for (const str of el.input.split('')) {
        await ele.setValue(ele.element.value + str)
      }

      if (el.blur || (el.blur === undefined && item.blur)) {
        await ele.trigger('blur')
      }

      expect(ele.element.value).toBe(el.expect)
    })
  })
})
