// src/number.ts
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

export {
  RADIANS_MULT,
  DEGREES_MULT,
  toRadians,
  toDegrees,
  manhattanDistance,
  lerp,
  randInteger,
  randFloat,
  roundTo,
  safeParseInt,
  safeParseFloat
};
//# sourceMappingURL=chunk-VKPAWI2X.js.map
