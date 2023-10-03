// @bun
import"./functional.js";import{K as h} from"./object.js";import"./chunk-7addb8353c391495.js";class i{map=new Map;async get(n){const p=this.map.get(n);return h(p??"")}async delete(n){return this.map.delete(n)}async set(n,p){return this.map.set(n,typeof p!=="string"?JSON.stringify(p):p),!0}async has(n){return this.map.has(n)}async clear(){return this.map.clear(),!0}async*keys(){yield*this.map.keys()}}export{i as InMemoryCache};
export{i as L};
