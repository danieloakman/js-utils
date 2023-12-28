"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RADIANS_MULT = exports.DEGREES_MULT = void 0;
exports.lerp = lerp;
exports.manhattanDistance = manhattanDistance;
exports.randFloat = randFloat;
exports.randInteger = randInteger;
exports.roundTo = roundTo;
exports.safeParseFloat = safeParseFloat;
exports.safeParseInt = safeParseInt;
exports.toDegrees = toDegrees;
exports.toRadians = toRadians;
require("./chunk-8250b88d1c414ae5.js");
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
var RADIANS_MULT = exports.RADIANS_MULT = Math.PI / 180;
var DEGREES_MULT = exports.DEGREES_MULT = 180 / Math.PI;