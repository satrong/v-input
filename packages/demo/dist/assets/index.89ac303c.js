import{V as e,c as t,v as n,r,w as i,o as a,d as o,h as u,a as s,b as l}from"./vendor.de39a8cf.js";function m(e,t,n){new Function("obj","value",`return obj.${t} = value`)(e,n)}function p(e,t,n,r="input"){if(""===e)return e;let i=String(e);const a=n["!0"]||n.integer||n.negative||n.number||n.positive||Array.isArray(t);if(n.number&&!/^[-.\d]+$/.test(i)&&(i=i.replace(/[^-.\d]+/g,"")),n.integer&&!/^[-\d]+$/.test(i)&&(i=i.replace(/[^-\d]+/g,"")),n.positive&&!n.negative&&(i=i.replace(/[^.\d]+/g,"")),n.negative&&!n.positive&&(i=i.replace(/[^-.\d]+/g,"")),a&&(i=i.replace(/\s+/g,""),""!==i&&"-"!==i&&!isFinite(+i))){const e=i.match(/-?\d+\.?\d+/);i=e?e[0]:""}if("blur"!==r||!n.negative||n.positive||/^-/.test(i)||0===Number(i)||(i=""),Array.isArray(t)&&""!==i){const[e,n]=t,a=Number(i);"blur"===r&&(a<e||a>n)&&(i="")}return"blur"===r&&a&&""!==i&&(i=String(Number(i))),"function"==typeof t&&(i=t(i)),i}function v(e,t,n){const r=(n.arg||"").replace(/:/g,"."),i=n.modifiers;if(!function(e,t){let n=e;return t.split(".").every((e=>!!(Object.prototype.hasOwnProperty.call(n,e)||window.Reflect&&Reflect.has(n,e))&&(n=n[e],!0)))}(e,r))throw new Error(`The expression \`this.${r}\` not found.`);!function(e){if(Array.isArray(e)){const[t,n]=e;if(2!==e.length)throw Error("Array length must be 2");if("number"!=typeof t||"number"!=typeof n)throw Error("Array's elements must be `Number`");if(t>n)throw Error("In the array `[min, max]`, min cannot be greater than max")}else if(void 0!==e){if("function"!=typeof e)throw Error("The `bindValue` must be `Function`");if(["","123","12ab","1.2.3.4"].some((t=>{const n=e(t);return n!==e(n)})))throw Error("Make sure `bindValue` function DONOT return dynamic value.")}}(n.value),t.vInputUnwatch=e.$watch(r,((t,a)=>{if("string"==typeof t){let o=p(t,n.value,i);""!==t&&""===o&&""!==a&&(o=p(a,n.value,i)),m(e,r,o)}}));const a=function(e){const t=Object.prototype.toString.call(e).slice(8,-1);return["HTMLInputElement","HTMLTextAreaElement"].indexOf(t)>-1}(t)?t:t.querySelector("input,textarea");if(a){const o=()=>{const t=(a=e,r.split(".").reduce(((e,t)=>e[t]),a));var a;let o=t;i["!0"]&&(isNaN(t)||(o=String(Number(t)),"0"===o&&(o=""))),m(e,r,p(o,n.value,i,"blur"))};a.addEventListener("blur",o),t.vInputBlur=[a,o]}}function c(e){var t;null==(t=e.vInputUnwatch)||t.call(e),e.vInputBlur&&e.vInputBlur[0].removeEventListener("blur",e.vInputBlur[1])}const f={mounted(e,t){const n=t.instance;n&&v(n,e,t)},beforeUnmount:c};var d={install:e=>{e.version.startsWith("2.")?e.directive("input",{bind(e,t,n){v(n.context,e,t)},unbind:c}):e.version.startsWith("3.")&&e.directive("input",f)}};function h(e){return`\n  <div>\n    <h2>Vue ${e} demo：</h2>\n    <div>\n      <p>\n        Modifier:\n        <label v-for="item in list" style="margin-left:1em;">\n          <input type="checkbox" v-model="values" :value="item.value"> {{item.label}}\n        </label>\n      </p>\n      <p>\n        Range bindValue:\n        <label style="margin-left:1em">\n          <input type="text" v-model.lazy="from" v-input:from.number class="range-input" />\n          -\n          <input type="text" v-model.lazy="to" v-input:to.number class="range-input" />\n        </label>\n      </p>\n  \n    </div>\n    <MyInput :key="key" :modifiers="values" :range="range" />\n  </div>\n    `}e.use(d),e.component("MyInput",{props:{modifiers:{type:Array,default:()=>[]},range:Array},data:()=>({form:{name:""}}),render(e){const t=this.modifiers.reduce(((e,t)=>(e[t]=!0,e)),{}),n=Array.isArray(this.range)?`="[${this.range[0]}, ${this.range[1]}]"`:"";return e("div",[e("pre",`<input v-mode="form.name" v-input:form:name${[""].concat(this.modifiers).join(".")+n} />`),e("input",{domProps:{type:"text",placeholder:"input...",value:this.$data.form.name},on:{input:e=>{this.$data.form.name=e.target.value}},directives:[{name:"input",value:this.range,arg:"form:name",modifiers:t}]}),e("div",[this.$data.form.name])])}}),new e({template:h(e.version),data:{list:[{label:"number",value:"number"},{label:"integer",value:"integer"},{label:"positive",value:"positive"},{label:"negative",value:"negative"},{label:"non-zero",value:"!0"}],values:[],from:"",to:"",key:""},computed:{range(){if(this.from&&this.to){const e=Number(this.from),t=Number(this.to);if(!isNaN(e)&&!isNaN(t)&&e<=t)return[e,t]}}},created(){const e=this.$watch((()=>[this.values,this.from,this.to]),(()=>{this.key=String(Date.now())}));this.$once("hook:beforeDestroy",e)}}).$mount("#vue2");const b=t({template:h(n),computed:{range(){if(this.from&&this.to){const e=Number(this.from),t=Number(this.to);if(!isNaN(e)&&!isNaN(t)&&e<=t)return[e,t]}}},setup(){const e=[{label:"number",value:"number"},{label:"integer",value:"integer"},{label:"positive",value:"positive"},{label:"negative",value:"negative"},{label:"non-zero",value:"!0"}],t=r([]),n=r(""),o=r(""),u=r(""),s=i([t,n,o],(()=>{u.value=String(Date.now())}));return a(s),{list:e,values:t,from:n,to:o,key:u}}});b.component("MyInput",o({props:{modifiers:{type:Array,default:()=>[]},range:Array},data:()=>({form:{name:""}}),render(){const e=l("input");if(!e)return u("div");const t=u("input",{type:"text",placeholder:"input...",value:this.form.name,onInput:e=>{this.form.name=e.target.value}}),n=this.modifiers.reduce(((e,t)=>(e[t]=!0,e)),{}),r=Array.isArray(this.range)?`="[${this.range[0]}, ${this.range[1]}]"`:"";return[u("pre",`<input v-mode="form.name" v-input:form:name${[""].concat(this.modifiers).join(".")+r} />`),s(t,[[e,this.range,"form:name",n]]),u("div",[this.form.name])]}})),b.use(d).mount("#vue3");
