import { mount } from '@vue/test-utils'
import { directive } from '../src/index'
import { validate } from '../src/filter'
import type { BindValue, Modifier } from '../src/filter'

type TModifier = keyof Modifier | ''

function inputComponent(arg: string, modifier: string, bindValue?: BindValue) {
  const data = arg.split('.').reduceRight((prev, item) => {
    return { [item]: prev }
  }, '' as any)

  return {
    directives: {
      input: directive
    },
    data() {
      return {
        ...data,
        bindValue
      }
    },
    template: `
<div>
  <input type="text" v-model="${arg}" v-input:${arg.replace(/\./g, ':')}${modifier}="bindValue" />
  <span v-text="${arg}"></span>
</div>
`
  }
}

type TestUnitsItem = {
  input: string;
  expect: string;
  checkBindValue?: boolean;
  modifier?: TModifier[];
  bindValue?: BindValue;
  blur?: boolean;
}

type TestUnits = {
  title: string;
  arg: string;
  modifier?: TModifier[];
  bindValue?: BindValue;
  blur?: boolean;
  items: TestUnitsItem[];
}

const testUnits: TestUnits[] = [
  {
    title: 'Any string',
    arg: 'a',
    items: [
      { input: 'abc1', expect: 'abc1' },
      { input: '-abc1', expect: '-abc1', blur: true }
    ]
  },
  {
    title: 'Any number',
    arg: 'a.b',
    modifier: ['number'],
    items: [
      { input: 'a1b2c3', expect: '123' },
      { input: '-a1b2c3.4', expect: '-123.4' }
    ]
  },
  {
    title: 'Not zero',
    arg: 'a.b.c',
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
    title: 'Range',
    arg: 'a',
    bindValue: [-15, 30],
    items: [
      { input: '1', expect: '1' },
      { input: 'a12', expect: '12' },
      { input: 'a-15', expect: '-15' },
      { input: 'a-19', expect: '-19' },
      { input: 'a-19', expect: '', blur: true },
      { input: '2a-19', expect: '219' },
      { input: '2a-19', expect: '', blur: true },
      { input: '3a40', expect: '340' },
      { input: '3a40', expect: '', blur: true },
      { input: 'a0', expect: '0' },
      { input: 'a0', expect: '', modifier: ['!0'], blur: true },
      { input: '+02.20', expect: '2.2', blur: true },
      { input: '+00.00', expect: '0', blur: true },
      { input: '+00.00', expect: '', modifier: ['!0'], blur: true }
    ]
  },
  {
    title: 'range: >= 10',
    arg: 'a',
    bindValue: [10, Infinity],
    items: [
      { input: '9', expect: '', blur: true },
      { input: '9', expect: '9' },
      { input: '10', expect: '10' },
      { input: '10', expect: '10', blur: true }
    ]
  },
  {
    title: 'range: <= 10',
    arg: 'a',
    bindValue: [-Infinity, 10],
    items: [
      { input: '9', expect: '9', blur: true },
      { input: '9', expect: '9' },
      { input: '12', expect: '12' },
      { input: '12', expect: '', blur: true }
    ]
  },
  {
    title: 'Int',
    arg: 'a',
    modifier: ['integer'],
    items: [
      { input: '1.2', expect: '12' },
      { input: 'b1.2a', expect: '12' },
      { input: '-1.2', expect: '-12' },
      { input: '-a1.2', expect: '-12' }
    ]
  },
  {
    title: 'Positive',
    arg: 'a',
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
    title: 'Negative',
    arg: 'a',
    modifier: ['negative'],
    items: [
      { input: '12', expect: '12' },
      { input: '12', expect: '', blur: true },
      { input: '-a12', expect: '-12' },
      { input: '-a1.2', expect: '-1.2' }
    ]
  },
  {
    title: 'Positive integer',
    arg: 'a',
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
    title: 'Negative integer',
    arg: 'a',
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
    title: 'Function',
    arg: 'a',
    items: [
      { input: 'a1b2c3', expect: 'abc', bindValue: val => val.replace(/[^a-z]/gi, '') },
      { input: 'a1b2c3000', expect: '123', modifier: ['number'], bindValue: val => val.replace(/0+/g, '') }
    ]
  },
  {
    title: 'Check bindValue',
    arg: 'a',
    items: [
      { input: '123', expect: '', checkBindValue: true, bindValue: val => val + 1 },
      { input: '123', expect: '', checkBindValue: true, bindValue: [10, 2] }
    ]
  }
]

async function testCb(item: TestUnits, el: TestUnitsItem) {
  const modifiers = (el.modifier ? el.modifier : item.modifier) || []
  const modifier = modifiers.length > 0 ? [''].concat(modifiers) : []
  const wrapper = mount(inputComponent(item.arg, modifier.join('.'), el.bindValue || item.bindValue))
  const ele = wrapper.find('input')

  for (const str of el.input.split('')) {
    await ele.setValue(ele.element.value + str)
  }

  if (el.blur || (el.blur === undefined && item.blur)) {
    await ele.trigger('blur')
  }

  return ele.element.value
}

testUnits.forEach(item => {
  item.items.forEach(el => {
    test(item.title + ' ' + el.input + ' -> ' + el.expect, async() => {
      if (el.checkBindValue) {
        expect(() => validate(el.bindValue)).toThrow()
      } else {
        expect(await testCb(item, el)).toBe(el.expect)
      }
    })
  })
})
