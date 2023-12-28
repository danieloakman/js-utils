"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findItemsFrom = findItemsFrom;
exports.groupBy = groupBy;
exports.isPartiallyLike = isPartiallyLike;
exports.propIs = propIs;
exports.safeJSONParse = safeJSONParse;
exports.sortByKeys = sortByKeys;
var _functional = require("./functional.js");
require("./chunk-8250b88d1c414ae5.js");
// node_modules/argparse/lib/textwrap.jslterMapIterator
class ConcatIterator {
  constructor(iterators) {
    this.iterators = iterators;
  }
  [Symbol.iterator]() {
    return this;
  }
  next(...args) {
    if (!this.iterators.length) return {
      done: true,
      value: undefined
    };
    const next = this.iterators[0].next(...args);
    if (!next.done) return next;
    this.iterators.shift();
    return this.next(...args);
  }
}
var ConcatIterator_default = ConcatIterator;

// node_modules/argparse/lib/textwrap.jslterMapIterator
class RepeatIterator {
  constructor(value, times) {
    this.value = value;
    this.times = times;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    if (this.times-- > 0) return {
      done: false,
      value: this.value
    };
    return {
      done: true,
      value: undefined
    };
  }
}
var RepeatIterator_default = RepeatIterator;

// node_modules/argparse/lib/textwrap.jslterMapIterator
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
      if (!next2.done) return next2;
      this.inner = null;
      return this.next(...args);
    }
    if (!this.arr.length) return {
      done: true,
      value: undefined
    };
    const next = this.arr.shift();
    if (this.isObject(next[1])) {
      this.inner = new ConcatIterator_default(this.traversal === "post-order-DFS" ? [new ObjectIterator(next[1]), new RepeatIterator_default(next, 1)] : [new RepeatIterator_default(next, 1), new ObjectIterator(next[1])]);
      return this.next(...args);
    }
    return {
      value: next,
      done: false
    };
  }
  isObject(value) {
    return typeof value === "object" && value !== null;
  }
  push(obj) {
    for (const key of Object.keys(obj)) this.arr.push([key, obj[key], obj]);
  }
}
var ObjectIterator_default = ObjectIterator;

// node_modules/argparse/lib/textwrap.jslt
function isIterable(arg) {
  return typeof (arg === null || arg === undefined ? undefined : arg[Symbol.iterator]) === "function";
}
var isIterable_default = isIterable;

// node_modules/argparse/lib/textwrap.jslt
function isIterator(arg) {
  return typeof (arg === null || arg === undefined ? undefined : arg.next) === "function";
}
var isIterator_default = isIterator;

// node_modules/argparse/lib/textwrap.jslterMapIterator.j
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
    return result === this.sentinel ? (this.func = () => this.sentinel, {
      done: true,
      value: undefined
    }) : {
      done: false,
      value: result
    };
  }
}
var FunctionIterator_default = FunctionIterator;

// node_modules/argparse/lib/textwrap.jslt
function toIterator(...args) {
  if (isIterator_default(args[0])) return args[0];
  if (isIterable_default(args[0])) return args[0][Symbol.iterator]();
  if (typeof args[0] === "object" && args[0] !== null) return new ObjectIterator_default(args[0]);
  if (typeof args[0] === "function") return new FunctionIterator_default(args[0], args[1]);
  throw new TypeError(`Cannot convert ${typeof args[0]} to an iterator.`);
}
var toIterator_default = toIterator;

// node_modules/argparse/lib/textwrap.jslterMapItera
class MapIterator {
  constructor(iterator, iteratee) {
    this.iterator = iterator;
    this.iteratee = iteratee;
  }
  [Symbol.iterator]() {
    return this;
  }
  next(...args) {
    const {
      value,
      done
    } = this.iterator.next(...args);
    if (done) return {
      done: true,
      value: undefined
    };
    return {
      value: this.iteratee(value),
      done
    };
  }
}
var MapIterator_default = MapIterator;

// node_modules/argparse/lib/textwrap.jsl
function enumerate(arg) {
  return new MapIterator_default(toIterator_default(arg), ((count = 0) => v => [count++, v])());
}

// node_modules/
function groupBy(arr, ...keys) {
  const results = keys.map(key => [key, {}]);
  for (const value of arr) {
    for (const [key, map] of results) {
      const k = typeof key === "string" ? value?.[key] : key(value);
      map[k] = (map[k] ?? []).concat(value);
    }
  }
  return results.length < 2 ? results[0][1] : results.map(([_, map]) => map);
}
function safeJSONParse(...args) {
  return (0, _functional.safeCall)(JSON.parse, ...args);
}
function propIs(obj, key, type) {
  if (!key.length) return false;
  let currentObj = obj;
  for (const k of key.split(".")) {
    if (!(0, _functional.isObjectLike)(currentObj)) return false;
    currentObj = currentObj[k];
  }
  if (type === "null") return currentObj === null;
  if (type === "nullish") return currentObj === null || currentObj === undefined;
  if (type === "record") return typeof currentObj === "object" && currentObj !== null;
  if (type === "array") return Array.isArray(currentObj);
  if (type === "string[]") return Array.isArray(currentObj) && currentObj.every(v => typeof v === "string");
  return typeof currentObj === type;
}
function sortByKeys(obj, comparator = (a, b) => a.localeCompare(b)) {
  return Object.keys(obj).sort(comparator).reduce((acc, key) => {
    const value = obj[key];
    if (!Array.isArray(value) && (0, _functional.isObjectLike)(value)) acc[key] = sortByKeys(value, comparator);else acc[key] = value;
    return acc;
  }, {});
}
function isPartiallyLike(obj, other) {
  if (!(0, _functional.isObjectLike)(obj) || !(0, _functional.isObjectLike)(other)) return false;
  if (!Object.keys(obj).length) return !Object.keys(other).length;
  if (Array.isArray(obj) && Array.isArray(other)) {
    if (obj.length !== other.length) return false;
    for (const [idx, value] of enumerate(obj)) {
      if ((0, _functional.isObjectLike)(value) && (0, _functional.isObjectLike)(other[idx])) {
        if (!isPartiallyLike(value, other[idx])) return false;
      } else if (other[idx] !== value) return false;
    }
    return true;
  }
  let hasAtleastOne = false;
  for (const [key, value] of Object.entries(obj)) {
    if (!(key in other)) continue;
    if ((0, _functional.isObjectLike)(value) && (0, _functional.isObjectLike)(other[key])) {
      if (!isPartiallyLike(value, other[key])) return false;
      hasAtleastOne = true;
    } else if (other[key] === value) hasAtleastOne = true;else return false;
  }
  return hasAtleastOne;
}
function findItemsFrom(needles, haystack) {
  needles = needles.slice();
  const found = [];
  const notFound = [];
  loop: for (const [i, item] of enumerate(haystack)) {
    for (const [j, needle] of enumerate(needles)) {
      if (isPartiallyLike(item, needle)) {
        found.push(i);
        needles.splice(j, 1);
        continue loop;
      }
    }
    notFound.push(i);
  }
  return [found.map(i => haystack[i]), notFound.map(i => haystack[i])];
}