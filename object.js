import{x as b} from"./functional.js";function h(K,...c){const o=c.map((i)=>[i,{}]);for(let i of K)for(let[g,N]of o){const T=typeof g==="string"?i?.[g]:g(i);N[T]=(N[T]??[]).concat(i)}return o.length<2?o[0][1]:o.map(([i,g])=>g)}function j(...K){return b(JSON.parse,...K)}export{j as safeJSONParse,h as groupBy};
export{h as J,j as K};
