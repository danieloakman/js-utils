"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InMemoryCache = void 0;
require("./functional.js");
var _object = require("./object.js");
require("./chunk-8250b88d1c414ae5.js");
// node_modules/argpars
class InMemoryCache {
  map = new Map();
  async get(key) {
    const value = this.map.get(key);
    return (0, _object.safeJSONParse)(value ?? "");
  }
  async delete(key) {
    return this.map.delete(key);
  }
  async set(key, value) {
    this.map.set(key, typeof value !== "string" ? JSON.stringify(value) : value);
    return true;
  }
  async has(key) {
    return this.map.has(key);
  }
  async clear() {
    this.map.clear();
    return true;
  }
  async *keys() {
    yield* this.map.keys();
  }
}
exports.InMemoryCache = InMemoryCache;