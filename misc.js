"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = exports.importSync = exports.exec = void 0;
exports.nodeOnly = nodeOnly;
exports.sh = void 0;
var _functional = require("./functional.js");
require("./chunk-1c49e647d94a40b6.js");
// node_module
function nodeOnly(fn) {
  if (false) ;
  return fn;
}
var importSync = name => require(name);
exports.importSync = importSync;
var main = async (module, mainFn) => {
  if (require?.main === module) mainFn();
};
exports.main = main;
var sh = (...commands) => (0, _functional.iife)(({
  spawn
} = importSync("child_process")) => {
  const fullCommand = commands.join("\n");
  return new Promise(resolve => {
    const s = (0, _functional.attempt)(() => spawn(fullCommand, {
      shell: true,
      stdio: "inherit"
    }));
    if (s instanceof Error) return resolve(s);
    s.on("close", code => {
      if (code) resolve(new Error(`Command "${fullCommand}" exited with code ${code}`));else resolve(true);
    });
    s.on("error", err => resolve(err));
  });
});
exports.sh = sh;
var exec = (...commands) => (0, _functional.iife)(({
  spawn
} = importSync("child_process")) => {
  const fullCommand = commands.join("\n");
  return new Promise(resolve => {
    const s = (0, _functional.attempt)(() => spawn(fullCommand, {
      shell: true
    }));
    if (s instanceof Error) return resolve(s);
    let data = "";
    const handleData = chunk => {
      const str = chunk.toString();
      data += str + "\n";
    };
    s.stdout?.on("data", handleData);
    s.stderr?.on("data", handleData);
    s.on("close", code => {
      if (code) resolve(new Error(`Command "${fullCommand}" exited with code ${code}`));else resolve(data);
    });
    s.on("error", err => resolve(err));
  });
});
exports.exec = exec;