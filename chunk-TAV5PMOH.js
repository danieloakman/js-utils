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

export {
  pipe,
  limitConcurrentCalls,
  isObjectLike,
  attempt,
  safeCall,
  sleep,
  iife,
  identity,
  constant,
  noop,
  effect,
  isNullish,
  isOk,
  ok,
  okOr,
  raise,
  multiComparator,
  once
};
//# sourceMappingURL=chunk-TAV5PMOH.js.map
