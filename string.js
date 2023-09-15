// @bun
import"./chunk-8165a1189c11e043.js";function f(M,a=0){let b=3735928559^a,u=1103547991^a;for(let w=0,x;w<M.length;w++)x=M.charCodeAt(w),b=Math.imul(b^x,2246822519),u=Math.imul(u^x,3266489917);return b^=Math.imul(b^u>>>15,1935289751),u^=Math.imul(u^b>>>15,3405138345),b^=u>>>16,u^=b>>>16,2097152*(u>>>0)+(b>>>11)}export{f as fastHash};
export{f as a};
