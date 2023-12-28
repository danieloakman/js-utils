import {
  isObjectLike,
  safeCall
} from "./chunk-TAV5PMOH.js";

// src/object.ts
import { enumerate } from "iteragain-es";
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
    for (let [idx, value] of enumerate(obj))
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
    for (let [i, item] of enumerate(haystack)) {
      for (let [j, needle] of enumerate(needles))
        if (isPartiallyLike(item, needle)) {
          found.push(i), needles.splice(j, 1);
          continue loop;
        }
      notFound.push(i);
    }
  return [found.map((i) => haystack[i]), notFound.map((i) => haystack[i])];
}

export {
  groupBy,
  safeJSONParse,
  propIs,
  sortByKeys,
  isPartiallyLike,
  findItemsFrom
};
//# sourceMappingURL=chunk-IZHTQNHD.js.map
