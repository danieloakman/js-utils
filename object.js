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

// src/object.ts
var object_exports = {};
__export(object_exports, {
  findItemsFrom: () => findItemsFrom,
  groupBy: () => groupBy,
  isPartiallyLike: () => isPartiallyLike,
  propIs: () => propIs,
  safeJSONParse: () => safeJSONParse,
  sortByKeys: () => sortByKeys
});
module.exports = __toCommonJS(object_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  findItemsFrom,
  groupBy,
  isPartiallyLike,
  propIs,
  safeJSONParse,
  sortByKeys
});
//# sourceMappingURL=object.js.map
