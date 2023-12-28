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

// src/functional.ts
var functional_exports = {};
__export(functional_exports, {
  attempt: () => attempt,
  constant: () => constant,
  effect: () => effect,
  identity: () => identity,
  iife: () => iife,
  isNullish: () => isNullish,
  isObjectLike: () => isObjectLike,
  isOk: () => isOk,
  limitConcurrentCalls: () => limitConcurrentCalls,
  multiComparator: () => multiComparator,
  noop: () => noop,
  ok: () => ok,
  okOr: () => okOr,
  once: () => once,
  pipe: () => pipe,
  raise: () => raise,
  safeCall: () => safeCall,
  sleep: () => sleep
});
module.exports = __toCommonJS(functional_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=functional.js.map
