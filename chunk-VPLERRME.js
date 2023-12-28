import {
  raise
} from "./chunk-TAV5PMOH.js";
import {
  __require
} from "./chunk-7FEMDAWU.js";

// src/misc.ts
function nodeOnly(fn) {
  return (..._) => raise("This function is only available in Node compatible run times (e.g. Node, Bun).");
}
var importSync = (name) => __require(name), main = (
  // TODO: browser may be able to work with bun's way of doing things, so perhaps this can be removed.
  (..._) => raise("Cannot have a main function in this runtime environment.")
), sh = () => raise("Cannot run shell commands in browser."), exec = () => raise("Cannot run shell commands in browser."), isInDebug = () => raise("Not implemented for browser."), question = () => raise("Cannot ask questions in browser.");

export {
  nodeOnly,
  importSync,
  main,
  sh,
  exec,
  isInDebug,
  question
};
//# sourceMappingURL=chunk-VPLERRME.js.map
