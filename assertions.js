import {
raise
} from "./functional.js";

// node_modules/.pnp
function assert(value, message) {
  if (!value) {
    if (typeof message === "string")
      throw new Error(message);
    else
      throw message ?? new Error("Assertion failed");
  }
}
var throws = () => raise("Can' use `throws` ");
var expectType = (value) => value;
var equal = () => raise("Can't use `equal`, not implemented in browser.");
export {
  throws,
  expectType,
  equal,
  assert
};


