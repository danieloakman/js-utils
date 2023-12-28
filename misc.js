// @bun
import {
attempt,
iife
} from "./functional.js";
import {
__require,
__toESM
} from "./chunk-8250b88d1c414ae5.js";

// node_module
function nodeOnly(fn) {
  if (false)
    ;
  return fn;
}
var importSync = (name) => import.meta.require(name);
var main = async (module, mainFn) => {
  if (module === Bun.main)
    mainFn();
};
var sh = (...commands) => iife(({ spawn } = importSync("child_process")) => {
  const fullCommand = commands.join("\n");
  return new Promise((resolve) => {
    const s = attempt(() => spawn(fullCommand, { shell: true, stdio: "inherit" }));
    if (s instanceof Error)
      return resolve(s);
    s.on("close", (code) => {
      if (code)
        resolve(new Error(`Command "${fullCommand}" exited with code ${code}`));
      else
        resolve(true);
    });
    s.on("error", (err) => resolve(err));
  });
});
var exec = (...commands) => iife(({ spawn } = importSync("child_process")) => {
  const fullCommand = commands.join("\n");
  return new Promise((resolve) => {
    const s = attempt(() => spawn(fullCommand, { shell: true }));
    if (s instanceof Error)
      return resolve(s);
    let data = "";
    const handleData = (chunk) => {
      const str = chunk.toString();
      data += str + "\n";
    };
    s.stdout?.on("data", handleData);
    s.stderr?.on("data", handleData);
    s.on("close", (code) => {
      if (code)
        resolve(new Error(`Command "${fullCommand}" exited with code ${code}`));
      else
        resolve(data);
    });
    s.on("error", (err) => resolve(err));
  });
});
var isInDebug = () => typeof import.meta.require("inspector").url() !== "undefined";
var question = async (questionStr, defaultAnswer = undefined) => {
  if (isInDebug())
    return defaultAnswer || "";
  const readline = await import("readline");
  const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => r1.question(questionStr, (answer) => {
    r1.close();
    resolve(answer || defaultAnswer || "");
  }));
};
export {
  sh,
  question,
  nodeOnly,
  main,
  isInDebug,
  importSync,
  exec
};
