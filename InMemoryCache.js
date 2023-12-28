"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// src/InMemoryCache.ts
var InMemoryCache_exports = {};
__export(InMemoryCache_exports, {
  InMemoryCache: () => InMemoryCache
});
module.exports = __toCommonJS(InMemoryCache_exports);

// src/object.ts
var import_iteragain_es = require("iteragain-es");

// src/functional.ts
function isObjectLike(value) {
  return typeof value == "object" && value !== null;
}
function safeCall(fn, ...args) {
  try {
    let result = fn(...args);
    return isObjectLike(result) && typeof result.catch == "function" ? result.catch(() => null) : result;
  } catch {
    return null;
  }
}

// src/object.ts
function safeJSONParse(...args) {
  return safeCall(JSON.parse, ...args);
}

// src/InMemoryCache.ts
var InMemoryCache = class {
  map = /* @__PURE__ */ new Map();
  async get(key) {
    let value = this.map.get(key);
    return safeJSONParse(value ?? "");
  }
  async delete(key) {
    return this.map.delete(key);
  }
  async set(key, value) {
    return this.map.set(key, typeof value != "string" ? JSON.stringify(value) : value), !0;
  }
  async has(key) {
    return this.map.has(key);
  }
  async clear() {
    return this.map.clear(), !0;
  }
  async *keys() {
    yield* this.map.keys();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryCache
});
//# sourceMappingURL=InMemoryCache.js.map
