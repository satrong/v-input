!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).VInput={})}(this,(function(e){"use strict";function t(e,t,n,r="input"){if(""===e)return e;let i=String(e);const o=n["!0"]||n.integer||n.negative||n.number||n.positive||Array.isArray(t);if(n.number&&!/^[-.\d]+$/.test(i)&&(i=i.replace(/[^-.\d]+/g,"")),n.integer&&!/^[-\d]+$/.test(i)&&(i=i.replace(/[^-\d]+/g,"")),n.positive&&!n.negative&&(i=i.replace(/[^.\d]+/g,"")),n.negative&&!n.positive&&(i=i.replace(/[^-.\d]+/g,"")),o&&""!==i&&"-"!==i&&!isFinite(+i)){const e=i.match(/-?\d+\.?\d+/);i=e?e[0]:""}if("blur"!==r||!n.negative||n.positive||/^-/.test(i)||0===Number(i)||(i=""),Array.isArray(t)){const[e,n]=t,r=Number(i);(r<e||r>n)&&(i="")}return"blur"===r&&o&&""!==i&&(i=String(Number(i))),"function"==typeof t&&(i=t(i)),i}function n(e,n,r){const i=r.arg||"",o=r.modifiers;if(!Object.prototype.hasOwnProperty.call(e.$data,i))return;!function(e){if(Array.isArray(e)){const[t,n]=e;if(2!==e.length)throw Error("数组长度必须为2");if("number"!=typeof t||"number"!=typeof n)throw Error("取值范围的最小值和最大值必须是数值");if(t>n)throw Error("取值范围的最小值不能大于最大值")}else if(void 0!==e&&"function"!=typeof e)throw Error("绑定值必须是函数")}(r.value),n.vInputUnwatch=e.$watch(i,((n,u)=>{if("string"==typeof n){let a=t(n,r.value,o);""!==n&&""===a&&""!==u&&(a=t(u,r.value,o)),e.$data[i]=a}}));const u=function(e){const t=Object.prototype.toString.call(e).slice(8,-1);return["HTMLInputElement","HTMLTextAreaElement"].indexOf(t)>-1}(n)?n:n.querySelector("input,textarea");if(u){const a=()=>{const n=e.$data[i];let u=n;o["!0"]&&(isNaN(n)||(u=String(Number(n)),"0"===u&&(u=""))),e.$data[i]=t(u,r.value,o,"blur")};u.addEventListener("blur",a),n.vInputBlur=[u,a]}}function r(e){var t;null==(t=e.vInputUnwatch)||t.call(e),e.vInputBlur&&e.vInputBlur[0].removeEventListener("blur",e.vInputBlur[1])}const i={mounted(e,t){const r=t.instance;r&&n(r,e,t)},beforeUnmount:r};var o={install:e=>{if("string"!=typeof e.version)throw new Error("传入参数错误：\nVue 3 请传入 `createApp()`，\nVue 2 请传入 `Vue` 函数");e.version.startsWith("2.")?e.directive("input",{bind(e,t,r){n(r.context,e,t)},unbind:r}):e.version.startsWith("3.")&&e.directive("input",i)}};e.default=o,e.directive=i,Object.defineProperty(e,"__esModule",{value:!0}),e[Symbol.toStringTag]="Module"}));
