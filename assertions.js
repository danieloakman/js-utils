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

// src/assertions.ts
var assertions_exports = {};
__export(assertions_exports, {
  assert: () => assert,
  equal: () => equal,
  expectType: () => expectType,
  throws: () => throws
});
module.exports = __toCommonJS(assertions_exports);
function assert(value, message) {
  if (!value)
    throw typeof message == "string" ? new Error(message) : message ?? new Error("Assertion failed");
}
var throws = (block, message) => require("assert").throws(block, message), expectType = (value) => value, equal = (actual, expected, message) => require("assert").deepStrictEqual(actual, expected, message);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assert,
  equal,
  expectType,
  throws
});
//# sourceMappingURL=assertions.js.map
