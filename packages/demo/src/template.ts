
export function getTpl(version: string) {
  return `
  <div>
    <h2>Vue ${version} demo：</h2>
    <div>
      <p>
        Modifier:
        <label v-for="item in list" style="margin-left:1em;">
          <input type="checkbox" v-model="values" :value="item.value"> {{item.label}}
        </label>
      </p>
      <p>
        Range bindValue:
        <label style="margin-left:1em">
          <input type="text" v-model.lazy="from" v-input:from.number class="range-input" />
          -
          <input type="text" v-model.lazy="to" v-input:to.number class="range-input" />
        </label>
      </p>
  
    </div>
    <MyInput :key="key" :modifiers="values" :range="range" />
  </div>
    `
}

export function getModifiers() {
  return [
    { label: 'number', value: 'number' },
    { label: 'integer', value: 'integer' },
    { label: 'positive', value: 'positive' },
    { label: 'negative', value: 'negative' },
    { label: 'non-zero', value: '!0' }
  ]
}
