import {
assert,
equal,
expectType,
throws
} from "./assertions.js";
import {
BinarySearch
} from "./BinarySearch.js";
import {
exec,
importSync,
main,
nodeOnly,
sh
} from "./misc.js";
import {
DEGREES_MULT,
RADIANS_MULT,
lerp,
manhattanDistance,
randFloat,
randInteger,
roundTo,
safeParseFloat,
safeParseInt,
toDegrees,
toRadians
} from "./number.js";
import {
attempt,
constant,
effect,
identity,
iife,
isNullish,
isObjectLike,
isOk,
limitConcurrentCalls,
multiComparator,
noop,
ok,
okOr,
once,
pipe,
raise,
safeCall,
sleep
} from "./functional.js";
import"./types.js";
import {
InMemoryCache
} from "./InMemoryCache.js";
import {
findItemsFrom,
groupBy,
isPartiallyLike,
propIs,
safeJSONParse,
sortByKeys
} from "./object.js";
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
// node_module
var parseArgs = () => raise("Can't parse args in browser.");
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

//# debugId=AD2ED5CACD4A6F1E64756e2164756e21
