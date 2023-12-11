// @bun
import {
attempt,
iife
} from "./functional.js";
import"./chunk-1c49e647d94a40b6.js";

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
export {
  sh,
  nodeOnly,
  main,
  importSync,
  exec
};



//# debugId=CF33326157FFA40964756e2164756e21
