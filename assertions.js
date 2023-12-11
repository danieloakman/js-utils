"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assert = assert;
exports.throws = exports.expectType = exports.equal = void 0;
require("./functional.js");
var _chunk1c49e647d94a40b = require("./chunk-1c49e647d94a40b6.js");
// node_modules/.pnp
function assert(value, message) {
  if (!value) {
    if (typeof message === "string") throw new Error(message);else throw message ?? new Error("Assertion failed");
  }
}
var throws = (block, message) => {
  return (0, _chunk1c49e647d94a40b.__require)("assert").throws(block, message);
};
exports.throws = throws;
var expectType = value => value;
exports.expectType = expectType;
var equal = (actual, expected, message) => {
  return (0, _chunk1c49e647d94a40b.__require)("assert").deepStrictEqual(actual, expected, message);
};
exports.equal = equal;