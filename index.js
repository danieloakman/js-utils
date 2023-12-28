// node_module
var parseArgs = () => raise("Can't parse args in browser.");
// node_modules/iter
function pipe(initialValue, ...funcs) {
  let result = initialValue;
  for (const func of funcs)
    result = func(result);
  return result;
}
function limitConcurrentCalls(func, limit) {
  const resolves = [];
  return async (...args) => {
    if (resolves.length >= limit)
      await new Promise((resolve) => resolves.push(resolve));
    try {
      return await func(...args);
    } finally {
      resolves.shift()?.();
    }
  };
}
function isObjectLike(value) {
  return typeof value === "object" && value !== null;
}
function attempt(fn, ...args) {
  try {
    const result = fn(...args);
    return isObjectLike(result) && typeof result.catch === "function" ? result.catch((e) => e) : result;
  } catch (err) {
    return err;
  }
}
function safeCall(fn, ...args) {
  try {
    const result = fn(...args);
    return isObjectLike(result) && typeof result.catch === "function" ? result.catch(() => null) : result;
  } catch (_) {
    return null;
  }
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(ms), ms));
}
function isNullish(value) {
  return value == null || value == undefined;
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
function raise(exception) {
  throw typeof exception === "string" ? new Error(exception) : exception;
}
function multiComparator(...comparators) {
  return (a, b) => {
    let isBool = false;
    for (const comparator of comparators) {
      const result = comparator(a, b);
      isBool = typeof result === "boolean";
      if (result)
        return result;
    }
    return isBool ? false : 0;
  };
}
var iife = (fn) => fn();
var identity = (v) => v;
var constant = (v) => () => v;
var noop = () => {
};
var effect = (fn) => (v) => {
  fn(v);
  return v;
};
var okOr = (value, defaultValue) => {
  if (value instanceof Error)
    return defaultValue;
  if (isNullish(value))
    return defaultValue;
  return value;
};
var once = (fn) => {
  let called = false;
  let result;
  return (...args) => {
    if (called)
      return result;
    called = true;
    return result = fn(...args);
  };
};

// node_modules/iter
function assert(value, message) {
  if (!value) {
    if (typeof message === "string")
      throw new Error(message);
    else
      throw message ?? new Error("Assertion failed");
  }
}
var throws = () => raise("Can' use `throws` ");
var expectType = (value) => value;
var equal = () => raise("Can't use `equal`, not implemented in browser.");
// node_modules/iterag
class BinarySearch {
  array;
  constructor(array, options = {}) {
    if (array.length < 2)
      throw new Error("Array must be of at least length 2.");
    this.array = array;
    this.comparator = options.comparator || this.comparator;
  }
  has(element) {
    return this.indexOf(element) !== -1;
  }
  indexOf(element) {
    const { found, index } = this.search(element);
    return found ? index : -1;
  }
  closestIndexOf(element) {
    const { found, index } = this.search(element);
    if (found)
      return index;
    let closestIndex = 0;
    let closestDiff = null;
    for (let i = index - 1;i <= index + 1; i++) {
      if (i < 0 || i >= this.array.length)
        continue;
      const diff = Math.abs(this.comparator(element, this.array[i]));
      if (!closestDiff || diff < closestDiff) {
        closestDiff = diff;
        closestIndex = i;
      }
    }
    return closestIndex;
  }
  at(index) {
    return this.array[index];
  }
  comparator = (a, b) => a - b;
  search(element) {
    let left = 0;
    let right = this.array.length - 1;
    let index;
    do {
      index = Math.floor((left + right) / 2);
      const diff = this.comparator(element, this.array[index]);
      if (diff > 0) {
        left = index + 1;
      } else if (diff < 0) {
        right = index - 1;
      } else {
        return { found: true, index };
      }
    } while (left <= right);
    return { found: false, index };
  }
}
// node_modules/iteragain-es/internal/FlatMapIterator.j
class ConcatIterator {
  constructor(iterators) {
    this.iterators = iterators;
  }
  [Symbol.iterator]() {
    return this;
  }
  next(...args) {
    if (!this.iterators.length)
      return { done: true, value: undefined };
    const next = this.iterators[0].next(...args);
    if (!next.done)
      return next;
    this.iterators.shift();
    return this.next(...args);
  }
}
var ConcatIterator_default = ConcatIterator;

// node_modules/iteragain-es/internal/FlatMapIterator.j
class RepeatIterator {
  constructor(value, times) {
    this.value = value;
    this.times = times;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    if (this.times-- > 0)
      return { done: false, value: this.value };
    return { done: true, value: undefined };
  }
}
var RepeatIterator_default = RepeatIterator;

// node_modules/iteragain-es/internal/FlatMapIterator.j
class ObjectIterator {
  constructor(object, traversal = "post-order-DFS") {
    this.traversal = traversal;
    this.inner = null;
    this.arr = [];
    this.push(object);
  }
  [Symbol.iterator]() {
    return this;
  }
  next(...args) {
    if (this.inner) {
      const next2 = this.inner.next(...args);
      if (!next2.done)
        return next2;
      this.inner = null;
      return this.next(...args);
    }
    if (!this.arr.length)
      return { done: true, value: undefined };
    const next = this.arr.shift();
    if (this.isObject(next[1])) {
      this.inner = new ConcatIterator_default(this.traversal === "post-order-DFS" ? [new ObjectIterator(next[1]), new RepeatIterator_default(next, 1)] : [new RepeatIterator_default(next, 1), new ObjectIterator(next[1])]);
      return this.next(...args);
    }
    return { value: next, done: false };
  }
  isObject(value) {
    return typeof value === "object" && value !== null;
  }
  push(obj) {
    for (const key of Object.keys(obj))
      this.arr.push([key, obj[key], obj]);
  }
}
var ObjectIterator_default = ObjectIterator;

// node_modules/iteragain-es/internal/Flat
function isIterable(arg) {
  return typeof (arg === null || arg === undefined ? undefined : arg[Symbol.iterator]) === "function";
}
var isIterable_default = isIterable;

// node_modules/iteragain-es/internal/Flat
function isIterator(arg) {
  return typeof (arg === null || arg === undefined ? undefined : arg.next) === "function";
}
var isIterator_default = isIterator;

// node_modules/iteragain-es/internal/FlatMapIterator.jso
class FunctionIterator {
  constructor(func, sentinel) {
    this.func = func;
    this.sentinel = sentinel;
  }
  [Symbol.iterator]() {
    return this;
  }
  next(...args) {
    const result = this.func(...args);
    return result === this.sentinel ? (this.func = () => this.sentinel, { done: true, value: undefined }) : { done: false, value: result };
  }
}
var FunctionIterator_default = FunctionIterator;

// node_modules/iteragain-es/internal/Flat
function toIterator(...args) {
  if (isIterator_default(args[0]))
    return args[0];
  if (isIterable_default(args[0]))
    return args[0][Symbol.iterator]();
  if (typeof args[0] === "object" && args[0] !== null)
    return new ObjectIterator_default(args[0]);
  if (typeof args[0] === "function")
    return new FunctionIterator_default(args[0], args[1]);
  throw new TypeError(`Cannot convert ${typeof args[0]} to an iterator.`);
}
var toIterator_default = toIterator;

// node_modules/iteragain-es/internal/FlatMapIterato
class MapIterator {
  constructor(iterator, iteratee) {
    this.iterator = iterator;
    this.iteratee = iteratee;
  }
  [Symbol.iterator]() {
    return this;
  }
  next(...args) {
    const { value, done } = this.iterator.next(...args);
    if (done)
      return { done: true, value: undefined };
    return { value: this.iteratee(value), done };
  }
}
var MapIterator_default = MapIterator;

// node_modules/iteragain-es/internal/Fla
function enumerate(arg) {
  return new MapIterator_default(toIterator_default(arg), ((count = 0) => (v) => [count++, v])());
}

// node_modules/
function groupBy(arr, ...keys) {
  const results = keys.map((key) => [key, {}]);
  for (const value of arr) {
    for (const [key, map] of results) {
      const k = typeof key === "string" ? value?.[key] : key(value);
      map[k] = (map[k] ?? []).concat(value);
    }
  }
  return results.length < 2 ? results[0][1] : results.map(([_, map]) => map);
}
function safeJSONParse(...args) {
  return safeCall(JSON.parse, ...args);
}
function propIs(obj, key, type) {
  if (!key.length)
    return false;
  let currentObj = obj;
  for (const k of key.split(".")) {
    if (!isObjectLike(currentObj))
      return false;
    currentObj = currentObj[k];
  }
  if (type === "null")
    return currentObj === null;
  if (type === "nullish")
    return currentObj === null || currentObj === undefined;
  if (type === "record")
    return typeof currentObj === "object" && currentObj !== null;
  if (type === "array")
    return Array.isArray(currentObj);
  if (type === "string[]")
    return Array.isArray(currentObj) && currentObj.every((v) => typeof v === "string");
  return typeof currentObj === type;
}
function sortByKeys(obj, comparator = (a, b) => a.localeCompare(b)) {
  return Object.keys(obj).sort(comparator).reduce((acc, key) => {
    const value = obj[key];
    if (!Array.isArray(value) && isObjectLike(value))
      acc[key] = sortByKeys(value, comparator);
    else
      acc[key] = value;
    return acc;
  }, {});
}
function isPartiallyLike(obj, other) {
  if (!isObjectLike(obj) || !isObjectLike(other))
    return false;
  if (!Object.keys(obj).length)
    return !Object.keys(other).length;
  if (Array.isArray(obj) && Array.isArray(other)) {
    if (obj.length !== other.length)
      return false;
    for (const [idx, value] of enumerate(obj)) {
      if (isObjectLike(value) && isObjectLike(other[idx])) {
        if (!isPartiallyLike(value, other[idx]))
          return false;
      } else if (other[idx] !== value)
        return false;
    }
    return true;
  }
  let hasAtleastOne = false;
  for (const [key, value] of Object.entries(obj)) {
    if (!(key in other))
      continue;
    if (isObjectLike(value) && isObjectLike(other[key])) {
      if (!isPartiallyLike(value, other[key]))
        return false;
      hasAtleastOne = true;
    } else if (other[key] === value)
      hasAtleastOne = true;
    else
      return false;
  }
  return hasAtleastOne;
}
function findItemsFrom(needles, haystack) {
  needles = needles.slice();
  const found = [];
  const notFound = [];
  loop:
    for (const [i, item] of enumerate(haystack)) {
      for (const [j, needle] of enumerate(needles)) {
        if (isPartiallyLike(item, needle)) {
          found.push(i);
          needles.splice(j, 1);
          continue loop;
        }
      }
      notFound.push(i);
    }
  return [found.map((i) => haystack[i]), notFound.map((i) => haystack[i])];
}

// node_modules/iteraga
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
// node_module
function nodeOnly(fn) {
  if (true)
    return (..._) => raise("This function is only available in Node compatible run times (e.g. Node, Bun).");
  return fn;
}
var importSync = (name) => require(name);
var main = (..._) => raise("Cannot have a main function in this runtime environment.");
var sh = () => raise("Cannot run shell commands in browser.");
var exec = () => raise("Cannot run shell commands in browser.");
var isInDebug = () => raise("Not implemented for browser.");
var question = () => raise("Cannot ask questions in browser.");
// node_modules/
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
  const mult = Math.pow(10, places);
  return Math.round(n * mult) / mult;
}
function safeParseInt(str) {
  const n = parseInt(str);
  return isNaN(n) ? null : n;
}
function safeParseFloat(str) {
  const n = parseFloat(str);
  return isNaN(n) ? null : n;
}
var RADIANS_MULT = Math.PI / 180;
var DEGREES_MULT = 180 / Math.PI;
// node_modules/
function fastHash(str, seed = 0) {
  let h1 = 3735928559 ^ seed, h2 = 1103547991 ^ seed;
  for (let i = 0, ch;i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2246822519);
    h2 = Math.imul(h2 ^ ch, 3266489917);
  }
  h1 ^= Math.imul(h1 ^ h2 >>> 15, 1935289751);
  h2 ^= Math.imul(h2 ^ h1 >>> 15, 3405138345);
  h1 ^= h2 >>> 16;
  h2 ^= h1 >>> 16;
  return 2097152 * (h2 >>> 0) + (h1 >>> 11);
}
function hashWithLength(input, length, seed = 0) {
  if (length < 0)
    throw new Error("`length` cannot be less than zero");
  const h = typeof input === "number" ? input : fastHash(input, seed);
  const approxBaseFromLength = Math.max(Math.min(Math.pow(2, Math.ceil(Math.log2(length))), 36), 2);
  let result = h.toString(approxBaseFromLength);
  if (result.length === length)
    return result;
  for (let i = 1;i < length * 2; i++) {
    if (approxBaseFromLength + i > 36)
      continue;
    result = h.toString(approxBaseFromLength + i);
    if (result.length === length)
      return result;
    if (approxBaseFromLength - i < 2)
      continue;
    result = h.toString(approxBaseFromLength - i);
    if (result.length === length)
      return result;
  }
  return h.toString().padEnd(length, "0").slice(0, length);
}
function coerceHash(input, seed = 0) {
  if (typeof input === "string")
    return fastHash(input, seed);
  if (typeof input === "number")
    return fastHash(input.toString(), seed);
  if (Array.isArray(input))
    return fastHash(input.map((v) => coerceHash(v, seed)).join(""));
  if (isObjectLike(input))
    return fastHash(JSON.stringify(sortByKeys(input)), seed);
  if (typeof input === "bigint")
    return fastHash(input.toString());
  if (typeof input === "undefined")
    return fastHash("undefined", seed);
  if (typeof input === "symbol")
    return fastHash(input.toString(), seed);
  return fastHash(JSON.stringify(input), seed);
}
function matches(regex, string) {
  if (!regex.flags.includes("g"))
    regex = new RegExp(regex.source, regex.flags + "g");
  return {
    [Symbol.iterator]() {
      return this;
    },
    next: () => {
      const result = regex.exec(string);
      if (!result)
        return { done: true, value: undefined };
      return { done: false, value: result };
    }
  };
}
function toMatch(value) {
  if (!value || typeof value.index !== "number" || typeof value.input !== "string")
    return null;
  const str = value[0];
  return Object.assign(str, { start: value.index, end: value.index + str.length, input: value.input });
}
function stringSplice(str, index, count = 1, add = "") {
  if (index < 0 || count < 0)
    throw new Error("index and count parameters cannot be less than zero");
  return str.slice(0, index) + add + str.slice(index + count);
}
export {
  toRadians,
  toMatch,
  toDegrees,
  throws,
  stringSplice,
  sortByKeys,
  sleep,
  sh,
  safeParseInt,
  safeParseFloat,
  safeJSONParse,
  safeCall,
  roundTo,
  randInteger,
  randFloat,
  raise,
  question,
  propIs,
  pipe,
  parseArgs,
  once,
  okOr,
  ok,
  noop,
  nodeOnly,
  multiComparator,
  matches,
  manhattanDistance,
  main,
  limitConcurrentCalls,
  lerp,
  isPartiallyLike,
  isOk,
  isObjectLike,
  isNullish,
  isInDebug,
  importSync,
  iife,
  identity,
  hashWithLength,
  groupBy,
  findItemsFrom,
  fastHash,
  expectType,
  exec,
  equal,
  effect,
  constant,
  coerceHash,
  attempt,
  assert,
  RADIANS_MULT,
  InMemoryCache,
  DEGREES_MULT,
  BinarySearch
};
