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

// src/string.ts
var string_exports = {};
__export(string_exports, {
  coerceHash: () => coerceHash,
  fastHash: () => fastHash,
  hashWithLength: () => hashWithLength,
  matches: () => matches,
  stringSplice: () => stringSplice,
  toMatch: () => toMatch
});
module.exports = __toCommonJS(string_exports);

// src/functional.ts
function isObjectLike(value) {
  return typeof value == "object" && value !== null;
}

// src/object.ts
var import_iteragain_es = require("iteragain-es");
function sortByKeys(obj, comparator = (a, b) => a.localeCompare(b)) {
  return Object.keys(obj).sort(comparator).reduce((acc, key) => {
    let value = obj[key];
    return !Array.isArray(value) && isObjectLike(value) ? acc[key] = sortByKeys(value, comparator) : acc[key] = value, acc;
  }, {});
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
  coerceHash,
  fastHash,
  hashWithLength,
  matches,
  stringSplice,
  toMatch
});
//# sourceMappingURL=string.js.map
