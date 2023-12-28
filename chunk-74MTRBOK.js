import {
  safeJSONParse
} from "./chunk-IZHTQNHD.js";

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

export {
  InMemoryCache
};
//# sourceMappingURL=chunk-74MTRBOK.js.map
