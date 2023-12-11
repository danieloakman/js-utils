import"./functional.js";
import {
safeJSONParse
} from "./object.js";

// node_modules/.pnpm/i
class InMemoryCache {
  map = new Map;
  async get(key) {
    const value = this.map.get(key);
    return safeJSONParse(value ?? "");
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
  async* keys() {
    yield* this.map.keys();
  }
}
export {
  InMemoryCache
};



//# debugId=C04EB2882BD0C66A64756e2164756e21
