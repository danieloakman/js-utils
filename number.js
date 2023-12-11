// @bun
import"./chunk-1c49e647d94a40b6.js";

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
var RADIANS_MULT = Math.PI / 180;
var DEGREES_MULT = 180 / Math.PI;
export {
  toRadians,
  toDegrees,
  safeParseInt,
  safeParseFloat,
  roundTo,
  randInteger,
  randFloat,
  manhattanDistance,
  lerp,
  RADIANS_MULT,
  DEGREES_MULT
};



//# debugId=92CD95BF823A35FF64756e2164756e21
