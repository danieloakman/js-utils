"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assert = assert;
exports.throws = exports.expectType = exports.equal = void 0;
require("./functional.js");
var _chunk8250b88d1c414ae = require("./chunk-8250b88d1c414ae5.js");
// node_modules/argp
function assert(value, message) {
  if (!value) {
    if (typeof message === "string") throw new Error(message);else throw message ?? new Error("Assertion failed");
  }
}
var throws = (block, message) => {
  return (0, _chunk8250b88d1c414ae.__require)("assert").throws(block, message);
};
exports.throws = throws;
var expectType = value => value;
exports.expectType = expectType;
var equal = (actual, expected, message) => {
  return (0, _chunk8250b88d1c414ae.__require)("assert").deepStrictEqual(actual, expected, message);
};
exports.equal = equal;