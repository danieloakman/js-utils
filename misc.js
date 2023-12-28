import {
raise
} from "./functional.js";

// node_module
function nodeOnly(fn) {
  if (true)
    return (..._) => raise("This function is only available in Node compatible run times (e.g. Node, Bun).");
  return fn;
}
var importSync = (name) => require(name);
var main = (..._) => raise("Cannot have a main function in this runtime environment.");
var sh = () => raise("Cannot run shell commands in browser.");
var exec = () => raise("Cannot run shell commands in browser.");
var isInDebug = () => raise("Not implemented for browser.");
var question = () => raise("Cannot ask questions in browser.");
export {
  sh,
  question,
  nodeOnly,
  main,
  isInDebug,
  importSync,
  exec
};
