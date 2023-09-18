import{d as b} from"./functional.js";import"./chunk-f1e62a083f56e81c.js";function h(K,...c){const o=c.map((i)=>[i,{}]);for(let i of K)for(let[g,N]of o){const T=typeof g==="string"?i?.[g]:g(i);N[T]=(N[T]??[]).concat(i)}return o.length<2?o[0][1]:o.map(([i,g])=>g)}function j(...K){return b(JSON.parse,...K)}export{j as safeJSONParse,h as groupBy};
export{j as a};
