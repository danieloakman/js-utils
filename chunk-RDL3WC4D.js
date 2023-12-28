import {
  raise
} from "./chunk-TAV5PMOH.js";

// src/assertions.ts
function assert(value, message) {
  if (!value)
    throw typeof message == "string" ? new Error(message) : message ?? new Error("Assertion failed");
}
var throws = () => raise("Can' use `throws` "), expectType = (value) => value, equal = () => raise("Can't use `equal`, not implemented in browser.");

export {
  assert,
  throws,
  expectType,
  equal
};
//# sourceMappingURL=chunk-RDL3WC4D.js.map
