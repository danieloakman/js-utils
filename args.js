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

// src/args.ts
var args_exports = {};
__export(args_exports, {
  parseArgs: () => parseArgs
});
module.exports = __toCommonJS(args_exports);
var parseArgs = (constructorParams, ...args) => {
  let parser = new (require("argparse")).ArgumentParser(constructorParams);
  for (let arg of args)
    parser.add_argument(...arg);
  return parser.parse_args();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parseArgs
});
//# sourceMappingURL=args.js.map
