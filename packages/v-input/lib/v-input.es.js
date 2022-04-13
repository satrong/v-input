function isInputOrTextarea(obj) {
  const t = Object.prototype.toString.call(obj).slice(8, -1);
  return ["HTMLInputElement", "HTMLTextAreaElement"].indexOf(t) > -1;
}
function hasProperty(obj, props) {
  let o = obj;
  return props.split(".").every((item) => {
    if (Object.prototype.hasOwnProperty.call(o, item) || window.Reflect && Reflect.has(o, item)) {
      o = o[item];
      return true;
    }
    return false;
  });
}
function setPropertyVal(obj, props, value) {
  const fn = new Function("obj", "value", `return obj.${props} = value`);
  fn(obj, value);
}
function getPropertyVal(obj, props) {
  return props.split(".").reduce((prev, item) => prev[item], obj);
}
function validate(bindValue) {
  if (Array.isArray(bindValue)) {
    const [min, max] = bindValue;
    if (bindValue.length !== 2) {
      throw Error("Array length must be 2");
    }
    if (typeof min !== "number" || typeof max !== "number") {
      throw Error("Array's elements must be `Number`");
    }
    if (min > max) {
      throw Error("In the array `[min, max]`, min cannot be greater than max");
    }
  } else if (bindValue !== void 0) {
    if (typeof bindValue !== "function") {
      throw Error("The `bindValue` must be `Function`");
    } else {
      const checkList = ["", "123", "12ab", "1.2.3.4"];
      if (checkList.some((el) => {
        const val = bindValue(el);
        return val !== bindValue(val);
      })) {
        throw Error("Make sure `bindValue` function DONOT return dynamic value.");
      }
    }
  }
}
function filter(value, bindValue, modifier, trigger = "input") {
  if (value === "")
    return value;
  let val = String(value);
  const useModifier = modifier["!0"] || modifier.integer || modifier.negative || modifier.number || modifier.positive || Array.isArray(bindValue);
  if (modifier.number && !/^[-.\d]+$/.test(val)) {
    val = val.replace(/[^-.\d]+/g, "");
  }
  if (modifier.integer && !/^[-\d]+$/.test(val)) {
    val = val.replace(/[^-\d]+/g, "");
  }
  if (modifier.positive && !modifier.negative) {
    val = val.replace(/[^.\d]+/g, "");
  }
  if (modifier.negative && !modifier.positive) {
    val = val.replace(/[^-.\d]+/g, "");
  }
  if (useModifier) {
    val = val.replace(/\s+/g, "");
    if (val !== "" && val !== "-") {
      if (!isFinite(+val)) {
        const matched = val.match(/-?\d+\.?\d+/);
        if (matched) {
          val = matched[0];
        } else {
          val = "";
        }
      }
    }
  }
  if (trigger === "blur" && modifier.negative && !modifier.positive && !/^-/.test(val) && Number(val) !== 0) {
    val = "";
  }
  if (Array.isArray(bindValue) && val !== "") {
    const [min, max] = bindValue;
    const v = Number(val);
    if (trigger === "blur") {
      if (v < min || v > max)
        val = "";
    }
  }
  if (trigger === "blur" && useModifier && val !== "") {
    val = String(Number(val));
  }
  if (typeof bindValue === "function") {
    val = bindValue(val);
  }
  return val;
}
function bind(ctx, el, binding) {
  const arg = (binding.arg || "").replace(/:/g, ".");
  const modifiers = binding.modifiers;
  if (!hasProperty(ctx, arg))
    throw new Error(`The expression \`this.${arg}\` not found.`);
  validate(binding.value);
  el.vInputUnwatch = ctx.$watch(arg, (val, oldValue) => {
    if (typeof val === "string") {
      let val1 = filter(val, binding.value, modifiers);
      if (val !== "" && val1 === "" && oldValue !== "") {
        val1 = filter(oldValue, binding.value, modifiers);
      }
      setPropertyVal(ctx, arg, val1);
    }
  });
  const elem = isInputOrTextarea(el) ? el : el.querySelector("input,textarea");
  if (elem) {
    const handler = () => {
      const val = getPropertyVal(ctx, arg);
      let result = val;
      if (modifiers["!0"]) {
        if (!isNaN(val)) {
          result = String(Number(val));
          if (result === "0")
            result = "";
        }
      }
      setPropertyVal(ctx, arg, filter(result, binding.value, modifiers, "blur"));
    };
    elem.addEventListener("blur", handler);
    el.vInputBlur = [elem, handler];
  }
}
function unbind(el) {
  var _a;
  (_a = el.vInputUnwatch) == null ? void 0 : _a.call(el);
  if (el.vInputBlur) {
    el.vInputBlur[0].removeEventListener("blur", el.vInputBlur[1]);
  }
}
const directive = {
  mounted(el, binding) {
    const ctx = binding.instance;
    if (ctx)
      bind(ctx, el, binding);
  },
  beforeUnmount: unbind
};
var index = {
  install: (vue) => {
    if (vue.version.startsWith("2.")) {
      vue.directive("input", {
        bind(el, binding, vnode) {
          bind(vnode.context, el, binding);
        },
        unbind
      });
    } else if (vue.version.startsWith("3.")) {
      vue.directive("input", directive);
    }
  }
};
export { index as default, directive };
