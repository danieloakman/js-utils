// @bun
import"./functional.js";
import {
__require
} from "./chunk-1c49e647d94a40b6.js";

// node_modules/.pnp
function assert(value, message) {
  if (!value) {
    if (typeof message === "string")
      throw new Error(message);
    else
      throw message ?? new Error("Assertion failed");
  }
}
var throws = (block, message) => {
  return import.meta.require("assert").throws(block, message);
};
var expectType = (value) => value;
var equal = (actual, expected, message) => {
  return import.meta.require("assert").deepStrictEqual(actual, expected, message);
};
export {
  throws,
  expectType,
  equal,
  assert
};


