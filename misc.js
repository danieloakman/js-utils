"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// src/misc.ts
var misc_exports = {};
__export(misc_exports, {
  exec: () => exec,
  importSync: () => importSync,
  isInDebug: () => isInDebug,
  main: () => main,
  nodeOnly: () => nodeOnly,
  question: () => question,
  sh: () => sh
});
module.exports = __toCommonJS(misc_exports);

// src/functional.ts
function isObjectLike(value) {
  return typeof value == "object" && value !== null;
}
function attempt(fn, ...args) {
  try {
    let result = fn(...args);
    return isObjectLike(result) && typeof result.catch == "function" ? result.catch((e) => e) : result;
  } catch (err) {
    return err;
  }
}
var iife = (fn) => fn();

// src/misc.ts
function nodeOnly(fn) {
  return fn;
}
var importSync = (name) => require(name), main = async (module2, mainFn) => {
  require?.main === module2 && mainFn();
}, sh = (...commands) => iife(({ spawn } = importSync("child_process")) => {
  let fullCommand = commands.join(`
`);
  return new Promise((resolve) => {
    let s = attempt(() => spawn(fullCommand, { shell: !0, stdio: "inherit" }));
    if (s instanceof Error)
      return resolve(s);
    s.on("close", (code) => {
      resolve(code ? new Error(`Command "${fullCommand}" exited with code ${code}`) : !0);
    }), s.on("error", (err) => resolve(err));
  });
}), exec = (...commands) => iife(({ spawn } = importSync("child_process")) => {
  let fullCommand = commands.join(`
`);
  return new Promise((resolve) => {
    let s = attempt(() => spawn(fullCommand, { shell: !0 }));
    if (s instanceof Error)
      return resolve(s);
    let data = "", handleData = (chunk) => {
      let str = chunk.toString();
      data += str + `
`;
    };
    s.stdout?.on("data", handleData), s.stderr?.on("data", handleData), s.on("close", (code) => {
      resolve(code ? new Error(`Command "${fullCommand}" exited with code ${code}`) : data);
    }), s.on("error", (err) => resolve(err));
  });
}), isInDebug = () => typeof require("inspector").url() < "u", question = async (questionStr, defaultAnswer = void 0) => {
  if (isInDebug())
    return defaultAnswer || "";
  let r1 = (await import("readline")).createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(
    (resolve) => r1.question(questionStr, (answer) => {
      r1.close(), resolve(answer || defaultAnswer || "");
    })
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  exec,
  importSync,
  isInDebug,
  main,
  nodeOnly,
  question,
  sh
});
//# sourceMappingURL=misc.js.map
