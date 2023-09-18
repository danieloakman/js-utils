// @bun
import"./functional.js";import{L as h} from"./object.js";import"./chunk-cf5dc1543f4dddd4.js";import"./chunk-5cded60fc90fa3b9.js";class i{map=new Map;async get(n){const p=this.map.get(n);return h(p??"")}async delete(n){return this.map.delete(n)}async set(n,p){return this.map.set(n,typeof p!=="string"?JSON.stringify(p):p),!0}async has(n){return this.map.has(n)}async clear(){return this.map.clear(),!0}async*keys(){yield*this.map.keys()}}export{i as InMemoryCache};
export{i as f};
