"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__toESM = exports.__require = exports.__commonJS = void 0;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
    value: mod,
    enumerable: true
  }) : target;
  for (let key of __getOwnPropNames(mod)) if (!__hasOwnProp.call(to, key)) __defProp(to, key, {
    get: () => mod[key],
    enumerable: true
  });
  return to;
};
exports.__toESM = __toESM;
var __commonJS = (cb, mod) => () => (mod || cb((mod = {
  exports: {}
}).exports, mod), mod.exports);
exports.__commonJS = __commonJS;
var __require = id => {
  return require(id);
};
exports.__require = __require;