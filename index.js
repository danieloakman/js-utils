"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BinarySearch: () => BinarySearch,
  DEGREES_MULT: () => DEGREES_MULT,
  InMemoryCache: () => InMemoryCache,
  RADIANS_MULT: () => RADIANS_MULT,
  assert: () => assert,
  attempt: () => attempt,
  coerceHash: () => coerceHash,
  constant: () => constant,
  effect: () => effect,
  equal: () => equal,
  exec: () => exec,
  expectType: () => expectType,
  fastHash: () => fastHash,
  findItemsFrom: () => findItemsFrom,
  groupBy: () => groupBy,
  hashWithLength: () => hashWithLength,
  identity: () => identity,
  iife: () => iife,
  importSync: () => importSync,
  isInDebug: () => isInDebug,
  isNullish: () => isNullish,
  isObjectLike: () => isObjectLike,
  isOk: () => isOk,
  isPartiallyLike: () => isPartiallyLike,
  lerp: () => lerp,
  limitConcurrentCalls: () => limitConcurrentCalls,
  main: () => main,
  manhattanDistance: () => manhattanDistance,
  matches: () => matches,
  multiComparator: () => multiComparator,
  nodeOnly: () => nodeOnly,
  noop: () => noop,
  ok: () => ok,
  okOr: () => okOr,
  once: () => once,
  parseArgs: () => parseArgs,
  pipe: () => pipe,
  propIs: () => propIs,
  question: () => question,
  raise: () => raise,
  randFloat: () => randFloat,
  randInteger: () => randInteger,
  roundTo: () => roundTo,
  safeCall: () => safeCall,
  safeJSONParse: () => safeJSONParse,
  safeParseFloat: () => safeParseFloat,
  safeParseInt: () => safeParseInt,
  sh: () => sh,
  sleep: () => sleep,
  sortByKeys: () => sortByKeys,
  stringSplice: () => stringSplice,
  throws: () => throws,
  toDegrees: () => toDegrees,
  toMatch: () => toMatch,
  toRadians: () => toRadians
});
module.exports = __toCommonJS(src_exports);

// src/functional.ts
function pipe(initialValue, ...funcs) {
  let result = initialValue;
  for (let func of funcs)
    result = func(result);
  return result;
}
function limitConcurrentCalls(func, limit) {
  let resolves = [];
  return async (...args) => {
    resolves.length >= limit && await new Promise((resolve) => resolves.push(resolve));
    try {
      return await func(...args);
    } finally {
      resolves.shift()?.();
    }
  };
}
function isObjectLike(value) {
  return typeof value == "object" && value !== null;
}
function attempt(fn, ...args) {
  try {
    let result = fn(...args);
    return isObjectLike(result) && typeof result.catch == "function" ? result.catch((e) => e) : result;
  } catch (err) {
    return err;
  }
}
function safeCall(fn, ...args) {
  try {
    let result = fn(...args);
    return isObjectLike(result) && typeof result.catch == "function" ? result.catch(() => null) : result;
  } catch {
    return null;
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(ms), ms));
}
var iife = (fn) => fn(), identity = (v) => v, constant = (v) => () => v, noop = () => {
}, effect = (fn) => (v) => (fn(v), v);
function isNullish(value) {
  return value == null || value == null;
}
function isOk(value) {
  return !isNullish(value) && !(value instanceof Error);
}
function ok(value) {
  if (value instanceof Error)
    throw value;
  if (isNullish(value))
    throw new TypeError("Expected a non-nullish value.");
  return value;
}
var okOr = (value, defaultValue) => value instanceof Error || isNullish(value) ? defaultValue : value;
function raise(exception) {
  throw typeof exception == "string" ? new Error(exception) : exception;
}
function multiComparator(...comparators) {
  return (a, b) => {
    let isBool = !1;
    for (let comparator of comparators) {
      let result = comparator(a, b);
      if (isBool = typeof result == "boolean", result)
        return result;
    }
    return isBool ? !1 : 0;
  };
}
var once = (fn) => {
  let called = !1, result;
  return (...args) => called ? result : (called = !0, result = fn(...args));
};

// src/args.ts
var parseArgs = (constructorParams, ...args) => {
  let parser = new (require("argparse")).ArgumentParser(constructorParams);
  for (let arg of args)
    parser.add_argument(...arg);
  return parser.parse_args();
};

// src/assertions.ts
function assert(value, message) {
  if (!value)
    throw typeof message == "string" ? new Error(message) : message ?? new Error("Assertion failed");
}
var throws = (block, message) => require("assert").throws(block, message), expectType = (value) => value, equal = (actual, expected, message) => require("assert").deepStrictEqual(actual, expected, message);

// src/BinarySearch.ts
var BinarySearch = class {
  array;
  /**
   * Binary search through an array of numbers, or with a custom comparator and any type.
   */
  // constructor(array: number[], options?: { comparator?: Comparator<number> }); // For T numbers it's optional, otherwise required.
  // constructor(array: T[], options: { comparator: Comparator<T> });
  constructor(array, options = {}) {
    if (array.length < 2)
      throw new Error("Array must be of at least length 2.");
    this.array = array, this.comparator = options.comparator || this.comparator;
  }
  /**
   * @param element The element to search for.
   * @returns True if element is found in the array, false if not.
   */
  has(element) {
    return this.indexOf(element) !== -1;
  }
  /**
   * @param element The element to search for.
   * @returns The index of the element in the input array. If unfound, will return -1.
   */
  indexOf(element) {
    let { found, index } = this.search(element);
    return found ? index : -1;
  }
  /**
   * Similar to `indexOf`, except when the exact element isn't found, it will find the closest element nearby. This will
   * never return -1;
   */
  closestIndexOf(element) {
    let { found, index } = this.search(element);
    if (found)
      return index;
    let closestIndex = 0, closestDiff = null;
    for (let i = index - 1; i <= index + 1; i++) {
      if (i < 0 || i >= this.array.length)
        continue;
      let diff = Math.abs(this.comparator(element, this.array[i]));
      (!closestDiff || diff < closestDiff) && (closestDiff = diff, closestIndex = i);
    }
    return closestIndex;
  }
  /**
   * @param index corresponding index in the input array.
   * @returns The element at index.
   */
  at(index) {
    return this.array[index];
  }
  comparator = (a, b) => a - b;
  /** Applies the binary search algorithm and returns the index  */
  search(element) {
    let left = 0, right = this.array.length - 1, index;
    do {
      index = Math.floor((left + right) / 2);
      let diff = this.comparator(element, this.array[index]);
      if (diff > 0)
        left = index + 1;
      else if (diff < 0)
        right = index - 1;
      else
        return { found: !0, index };
    } while (left <= right);
    return { found: !1, index };
  }
};

// src/object.ts
var import_iteragain_es = require("iteragain-es");
function groupBy(arr, ...keys) {
  let results = keys.map((key) => [key, {}]);
  for (let value of arr)
    for (let [key, map] of results) {
      let k = typeof key == "string" ? value?.[key] : key(value);
      map[k] = (map[k] ?? []).concat(value);
    }
  return results.length < 2 ? results[0][1] : results.map(([_, map]) => map);
}
function safeJSONParse(...args) {
  return safeCall(JSON.parse, ...args);
}
function propIs(obj, key, type) {
  if (!key.length)
    return !1;
  let currentObj = obj;
  for (let k of key.split(".")) {
    if (!isObjectLike(currentObj))
      return !1;
    currentObj = currentObj[k];
  }
  return type === "null" ? currentObj === null : type === "nullish" ? currentObj == null : type === "record" ? typeof currentObj == "object" && currentObj !== null : type === "array" ? Array.isArray(currentObj) : type === "string[]" ? Array.isArray(currentObj) && currentObj.every((v) => typeof v == "string") : typeof currentObj === type;
}
function sortByKeys(obj, comparator = (a, b) => a.localeCompare(b)) {
  return Object.keys(obj).sort(comparator).reduce((acc, key) => {
    let value = obj[key];
    return !Array.isArray(value) && isObjectLike(value) ? acc[key] = sortByKeys(value, comparator) : acc[key] = value, acc;
  }, {});
}
function isPartiallyLike(obj, other) {
  if (!isObjectLike(obj) || !isObjectLike(other))
    return !1;
  if (!Object.keys(obj).length)
    return !Object.keys(other).length;
  if (Array.isArray(obj) && Array.isArray(other)) {
    if (obj.length !== other.length)
      return !1;
    for (let [idx, value] of (0, import_iteragain_es.enumerate)(obj))
      if (isObjectLike(value) && isObjectLike(other[idx])) {
        if (!isPartiallyLike(value, other[idx]))
          return !1;
      } else if (other[idx] !== value)
        return !1;
    return !0;
  }
  let hasAtleastOne = !1;
  for (let [key, value] of Object.entries(obj))
    if (key in other)
      if (isObjectLike(value) && isObjectLike(other[key])) {
        if (!isPartiallyLike(value, other[key]))
          return !1;
        hasAtleastOne = !0;
      } else if (other[key] === value)
        hasAtleastOne = !0;
      else
        return !1;
  return hasAtleastOne;
}
function findItemsFrom(needles, haystack) {
  needles = needles.slice();
  let found = [], notFound = [];
  loop:
    for (let [i, item] of (0, import_iteragain_es.enumerate)(haystack)) {
      for (let [j, needle] of (0, import_iteragain_es.enumerate)(needles))
        if (isPartiallyLike(item, needle)) {
          found.push(i), needles.splice(j, 1);
          continue loop;
        }
      notFound.push(i);
    }
  return [found.map((i) => haystack[i]), notFound.map((i) => haystack[i])];
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

// src/misc.ts
function nodeOnly(fn) {
  return fn;
}
var importSync = (name) => require(name), main = async (module2, mainFn) => {
  require?.main === module2 && mainFn();
}, sh = (...commands) => iife(({ spawn } = importSync("child_process")) => {
  let fullCommand = commands.join(`
`);
  return new Promise((resolve) => {
    let s = attempt(() => spawn(fullCommand, { shell: !0, stdio: "inherit" }));
    if (s instanceof Error)
      return resolve(s);
    s.on("close", (code) => {
      resolve(code ? new Error(`Command "${fullCommand}" exited with code ${code}`) : !0);
    }), s.on("error", (err) => resolve(err));
  });
}), exec = (...commands) => iife(({ spawn } = importSync("child_process")) => {
  let fullCommand = commands.join(`
`);
  return new Promise((resolve) => {
    let s = attempt(() => spawn(fullCommand, { shell: !0 }));
    if (s instanceof Error)
      return resolve(s);
    let data = "", handleData = (chunk) => {
      let str = chunk.toString();
      data += str + `
`;
    };
    s.stdout?.on("data", handleData), s.stderr?.on("data", handleData), s.on("close", (code) => {
      resolve(code ? new Error(`Command "${fullCommand}" exited with code ${code}`) : data);
    }), s.on("error", (err) => resolve(err));
  });
}), isInDebug = () => typeof require("inspector").url() < "u", question = async (questionStr, defaultAnswer = void 0) => {
  if (isInDebug())
    return defaultAnswer || "";
  let r1 = (await import("readline")).createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(
    (resolve) => r1.question(questionStr, (answer) => {
      r1.close(), resolve(answer || defaultAnswer || "");
    })
  );
};

// src/number.ts
var RADIANS_MULT = Math.PI / 180, DEGREES_MULT = 180 / Math.PI;
function toRadians(degrees) {
  return degrees * RADIANS_MULT;
}
function toDegrees(radians) {
  return radians * DEGREES_MULT;
}
function manhattanDistance(a, b) {
  return a.reduce((sum, v, i) => sum + Math.abs(v - b[i]), 0);
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function randInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randFloat(min, max) {
  return Math.random() * (max - min) + min;
}
function roundTo(n, places) {
  let mult = Math.pow(10, places);
  return Math.round(n * mult) / mult;
}
function safeParseInt(str) {
  let n = parseInt(str);
  return isNaN(n) ? null : n;
}
function safeParseFloat(str) {
  let n = parseFloat(str);
  return isNaN(n) ? null : n;
}

// src/string.ts
function fastHash(str, seed = 0) {
  let h1 = 3735928559 ^ seed, h2 = 1103547991 ^ seed;
  for (let i = 0, ch; i < str.length; i++)
    ch = str.charCodeAt(i), h1 = Math.imul(h1 ^ ch, 2246822519), h2 = Math.imul(h2 ^ ch, 3266489917);
  return h1 ^= Math.imul(h1 ^ h2 >>> 15, 1935289751), h2 ^= Math.imul(h2 ^ h1 >>> 15, 3405138345), h1 ^= h2 >>> 16, h2 ^= h1 >>> 16, 2097152 * (h2 >>> 0) + (h1 >>> 11);
}
function hashWithLength(input, length, seed = 0) {
  if (length < 0)
    throw new Error("`length` cannot be less than zero");
  let h = typeof input == "number" ? input : fastHash(input, seed), approxBaseFromLength = Math.max(Math.min(Math.pow(2, Math.ceil(Math.log2(length))), 36), 2), result = h.toString(approxBaseFromLength);
  if (result.length === length)
    return result;
  for (let i = 1; i < length * 2; i++)
    if (!(approxBaseFromLength + i > 36)) {
      if (result = h.toString(approxBaseFromLength + i), result.length === length)
        return result;
      if (!(approxBaseFromLength - i < 2) && (result = h.toString(approxBaseFromLength - i), result.length === length))
        return result;
    }
  return h.toString().padEnd(length, "0").slice(0, length);
}
function coerceHash(input, seed = 0) {
  return typeof input == "string" ? fastHash(input, seed) : typeof input == "number" ? fastHash(input.toString(), seed) : Array.isArray(input) ? fastHash(input.map((v) => coerceHash(v, seed)).join("")) : isObjectLike(input) ? fastHash(JSON.stringify(sortByKeys(input)), seed) : typeof input == "bigint" ? fastHash(input.toString()) : fastHash(typeof input > "u" ? "undefined" : typeof input == "symbol" ? input.toString() : JSON.stringify(input), seed);
}
function matches(regex, string) {
  return regex.flags.includes("g") || (regex = new RegExp(regex.source, regex.flags + "g")), {
    [Symbol.iterator]() {
      return this;
    },
    next: () => {
      let result = regex.exec(string);
      return result ? { done: !1, value: result } : { done: !0, value: void 0 };
    }
  };
}
function toMatch(value) {
  if (!value || typeof value.index != "number" || typeof value.input != "string")
    return null;
  let str = value[0];
  return Object.assign(str, { start: value.index, end: value.index + str.length, input: value.input });
}
function stringSplice(str, index, count = 1, add = "") {
  if (index < 0 || count < 0)
    throw new Error("index and count parameters cannot be less than zero");
  return str.slice(0, index) + add + str.slice(index + count);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BinarySearch,
  DEGREES_MULT,
  InMemoryCache,
  RADIANS_MULT,
  assert,
  attempt,
  coerceHash,
  constant,
  effect,
  equal,
  exec,
  expectType,
  fastHash,
  findItemsFrom,
  groupBy,
  hashWithLength,
  identity,
  iife,
  importSync,
  isInDebug,
  isNullish,
  isObjectLike,
  isOk,
  isPartiallyLike,
  lerp,
  limitConcurrentCalls,
  main,
  manhattanDistance,
  matches,
  multiComparator,
  nodeOnly,
  noop,
  ok,
  okOr,
  once,
  parseArgs,
  pipe,
  propIs,
  question,
  raise,
  randFloat,
  randInteger,
  roundTo,
  safeCall,
  safeJSONParse,
  safeParseFloat,
  safeParseInt,
  sh,
  sleep,
  sortByKeys,
  stringSplice,
  throws,
  toDegrees,
  toMatch,
  toRadians
});
//# sourceMappingURL=index.js.map
