import{H as o} from"./functional.js";function b(d,c){if(!d)if(typeof c==="string")throw new Error(c);else throw c??new Error("Assertion failed")}var h=()=>o("Can' use `throws` "),j=(d)=>d,k=()=>o("Can't use `equal`, not implemented in browser.");export{h as throws,j as expectType,k as equal,b as assert};
export{b as a,h as b,j as c,k as d};
