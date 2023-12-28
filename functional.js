"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attempt = attempt;
exports.iife = exports.identity = exports.effect = exports.constant = void 0;
exports.isNullish = isNullish;
exports.isObjectLike = isObjectLike;
exports.isOk = isOk;
exports.limitConcurrentCalls = limitConcurrentCalls;
exports.multiComparator = multiComparator;
exports.noop = void 0;
exports.ok = ok;
exports.once = exports.okOr = void 0;
exports.pipe = pipe;
exports.raise = raise;
exports.safeCall = safeCall;
exports.sleep = sleep;
require("./chunk-8250b88d1c414ae5.js");
// node_modules/argp
function pipe(initialValue, ...funcs) {
  let result = initialValue;
  for (const func of funcs) result = func(result);
  return result;
}
function limitConcurrentCalls(func, limit) {
  const resolves = [];
  return async (...args) => {
    if (resolves.length >= limit) await new Promise(resolve => resolves.push(resolve));
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
    return isObjectLike(result) && typeof result.catch === "function" ? result.catch(e => e) : result;
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
  return new Promise(resolve => setTimeout(() => resolve(ms), ms));
}
function isNullish(value) {
  return value == null || value == undefined;
}
function isOk(value) {
  return !isNullish(value) && !(value instanceof Error);
}
function ok(value) {
  if (value instanceof Error) throw value;
  if (isNullish(value)) throw new TypeError("Expected a non-nullish value.");
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
      if (result) return result;
    }
    return isBool ? false : 0;
  };
}
var iife = fn => fn();
exports.iife = iife;
var identity = v => v;
exports.identity = identity;
var constant = v => () => v;
exports.constant = constant;
var noop = () => {};
exports.noop = noop;
var effect = fn => v => {
  fn(v);
  return v;
};
exports.effect = effect;
var okOr = (value, defaultValue) => {
  if (value instanceof Error) return defaultValue;
  if (isNullish(value)) return defaultValue;
  return value;
};
exports.okOr = okOr;
var once = fn => {
  let called = false;
  let result;
  return (...args) => {
    if (called) return result;
    called = true;
    return result = fn(...args);
  };
};
exports.once = once;