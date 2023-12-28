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

// src/number.ts
var number_exports = {};
__export(number_exports, {
  DEGREES_MULT: () => DEGREES_MULT,
  RADIANS_MULT: () => RADIANS_MULT,
  lerp: () => lerp,
  manhattanDistance: () => manhattanDistance,
  randFloat: () => randFloat,
  randInteger: () => randInteger,
  roundTo: () => roundTo,
  safeParseFloat: () => safeParseFloat,
  safeParseInt: () => safeParseInt,
  toDegrees: () => toDegrees,
  toRadians: () => toRadians
});
module.exports = __toCommonJS(number_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=number.js.map
