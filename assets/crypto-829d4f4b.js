(function(){"use strict";function A(e){const n=[];for(let t=0;t<e.length;t++){const s=e.charCodeAt(t);n.push(s&255)}return n}const u=e=>{e=e[0].toLowerCase();const n=parseInt(e);if(!isNaN(n))return n;if(e=="a")return 10;if(e=="b")return 11;if(e=="c")return 12;if(e=="d")return 13;if(e=="e")return 14;if(e=="f")return 15},M=[["63","7C","77","7B","F2","6B","6F","C5","30","01","67","2B","FE","D7","AB","76"],["CA","82","C9","7D","FA","59","47","F0","AD","D4","A2","AF","9C","A4","72","C0"],["B7","FD","93","26","36","3F","F7","CC","34","A5","E5","F1","71","D8","31","15"],["04","C7","23","C3","18","96","05","9A","07","12","80","E2","EB","27","B2","75"],["09","83","2C","1A","1B","6E","5A","A0","52","3B","D6","B3","29","E3","2F","84"],["53","D1","00","ED","20","FC","B1","5B","6A","CB","BE","39","4A","4C","58","CF"],["D0","EF","AA","FB","43","4D","33","85","45","F9","02","7F","50","3C","9F","A8"],["51","A3","40","8F","92","9D","38","F5","BC","B6","DA","21","10","FF","F3","D2"],["CD","0C","13","EC","5F","97","44","17","C4","A7","7E","3D","64","5D","19","73"],["60","81","4F","DC","22","2A","90","88","46","EE","B8","14","DE","5E","0B","DB"],["E0","32","3A","0A","49","06","24","5C","C2","D3","AC","62","91","95","E4","79"],["E7","C8","37","6D","8D","D5","4E","A9","6C","56","F4","EA","65","7A","AE","08"],["BA","78","25","2E","1C","A6","B4","C6","E8","DD","74","1F","4B","BD","8B","8A"],["70","3E","B5","66","48","03","F6","0E","61","35","57","B9","86","C1","1D","9E"],["E1","F8","98","11","69","D9","8E","94","9B","1E","87","E9","CE","55","28","DF"],["8C","A1","89","0D","BF","E6","42","68","41","99","2D","0F","B0","54","BB","16"]],j=[["52","09","6a","d5","30","36","a5","38","bf","40","a3","9e","81","f3","d7","fb"],["7c","e3","39","82","9b","2f","ff","87","34","8e","43","44","c4","de","e9","cb"],["54","7b","94","32","a6","c2","23","3d","ee","4c","95","0b","42","fa","c3","4e"],["08","2e","a1","66","28","d9","24","b2","76","5b","a2","49","6d","8b","d1","25"],["72","f8","f6","64","86","68","98","16","d4","a4","5c","cc","5d","65","b6","92"],["6c","70","48","50","fd","ed","b9","da","5e","15","46","57","a7","8d","9d","84"],["90","d8","ab","00","8c","bc","d3","0a","f7","e4","58","05","b8","b3","45","06"],["d0","2c","1e","8f","ca","3f","0f","02","c1","af","bd","03","01","13","8a","6b"],["3a","91","11","41","4f","67","dc","ea","97","f2","cf","ce","f0","b4","e6","73"],["96","ac","74","22","e7","ad","35","85","e2","f9","37","e8","1c","75","df","6e"],["47","f1","1a","71","1d","29","c5","89","6f","b7","62","0e","aa","18","be","1b"],["fc","56","3e","4b","c6","d2","79","20","9a","db","c0","fe","78","cd","5a","f4"],["1f","dd","a8","33","88","07","c7","31","b1","12","10","59","27","80","ec","5f"],["60","51","7f","a9","19","b5","4a","0d","2d","e5","7a","9f","93","c9","9c","ef"],["a0","e0","3b","4d","ae","2a","f5","b0","c8","eb","bb","3c","83","53","99","61"],["17","2b","04","7e","ba","77","d6","26","e1","69","14","63","55","21","0c","7d"]],N=[[0,0,0,0],[1,0,0,0],[2,0,0,0],[4,0,0,0],[8,0,0,0],[16,0,0,0],[32,0,0,0],[64,0,0,0],[128,0,0,0],[27,0,0,0],[54,0,0,0]],D=16,b=e=>{const n=e.toString(16);return n.length===2?n:"0"+n},C=e=>parseInt(e,16),p=(e,n)=>{const t=a(e),s=[];for(let o=0;o<4;o++){const c=[];for(let r=0;r<4;r++){const l=t[o][r]^n[o][r];c.push(l)}s.push(c)}return s},E=(e,n)=>{const t=[];for(let s=0;s<n;s++){const o=[];for(let c=0;c<n;c++){const r=c*n+s,l=e[r];typeof l>"u"?o.push(65):o.push(l)}t.push(o)}return t},x=(e,n)=>{const t=[];let s=!0;for(let o=0;o<16;o++){const c=n*16+o,r=e[c];typeof r<"u"?t.push(r):s?(s=!1,t.push(66)):t.push(65)}return t},O=e=>{const n=a(e),t=[];for(let s=0;s<4;s++){const o=[];for(let c=0;c<4;c++){const r=n[s][c],l=m(r),f=C(l);o.push(f)}t.push(o)}return t},S=e=>{const n=a(e),t=[];for(let s=0;s<4;s++){const o=[];for(let c=0;c<4;c++){const r=n[s][c],l=T(r),f=C(l);o.push(f)}t.push(o)}return t},K=e=>{const n=[];for(let t=0;t<e.length;t++){const s=e[t],o=m(s),c=C(o);n.push(c)}return n},g=e=>{const n=[];for(let t=0;t<4;t++)for(let s=0;s<4;s++)n.push(e[s][t]);return n},m=e=>{const n=b(e),t=u(n[0]),s=u(n[1]);return M[t][s]},T=e=>{const n=b(e),t=u(n[0]),s=u(n[1]);return j[t][s]},U=e=>{const n=[];for(const t of e)n.push(t);return n},y=(e,n,t)=>{const s=U(e);for(let o=0;o<n;o++)if(t){const c=s[s.length-1];for(let r=s.length-1;r>=1;r--)s[r]=s[r-1];s[0]=c}else{const c=s[0];for(let r=0;r<s.length;r++)s[r]=s[r+1];s[s.length-1]=c}return s},k=e=>{const s=D,o=new Array(s+1);let c=new Array(4);for(let f=0;f<4;f++){const i=[e[4*f],e[4*f+1],e[4*f+2],e[4*f+3]];o[f]=i}for(var r=4;r<4*(s+1);r++){o[r]=new Array(4);for(var l=0;l<4;l++)c[l]=o[r-1][l];if(r%4==0){c=K(y(c,1,!1));for(var l=0;l<4;l++)c[l]^=N[r/4%11][l]}for(var l=0;l<4;l++)o[r][l]=o[r-4][l]^c[l]}return o},B=(e,n)=>{const t=[];for(let s=0;s<4;s++){const o=e[n*4+s];t.push(o)}return t},F=(e,n)=>Math.floor(e/n),w=e=>{const n=[2,3,5,7,11,13,17,19,23,29,31];let t=new Map,s=0;for(;e>1;)e%n[s]===0?(e=F(e,n[s]),t.set(n[s],!0)):s++;return t.size},a=e=>{const n=[];for(const t of e){const s=[...t];n.push(s)}return n},v=(e,n,t,s)=>{const o=a(e);let c=[];for(let r=0;r<4;r++)c.push(e[r][n]);c=y(c,t,!s);for(let r=0;r<4;r++)o[r][n]=c[r];return o},R=(e,n)=>{const t=g(n);let s=a(e);for(let o=0;o<t.length;o++){const c=t[o],r=b(c),l=u(r[0]),f=u(r[1]),i=w(l*f),h=l%4,d=f%4;i%2===0?s=v(s,d,d,!0):s[h]=y(s[h],d,!0)}return s},_=(e,n)=>{const t=g(n);let s=a(e);for(let o=t.length-1;o>=0;o--){const c=t[o],r=b(c),l=u(r[0]),f=u(r[1]),i=w(l*f),h=l%4,d=f%4;i%2===0?s=v(s,d,d,!1):s[h]=y(s[h],d,!1)}return s},G=(e,n)=>{let t=a(e),s=B(n,0);t=p(t,s);for(let o=1;o<D+1;o++){let c=B(n,o);t=O(t),t=R(t,c),t=p(t,c)}return t},H=(e,n)=>{let t=a(e);for(let o=D;o>=1;o--){let c=B(n,o);t=p(t,c),t=_(t,c),t=S(t)}let s=B(n,0);return t=p(t,s),t},I=(e,n)=>{let t=F(e.length,16),s=0;if(e.length%16!==0&&(s=16-e.length%16,t++),s!=0){const c=new Uint8Array(e.length+s);c.set(e),c.set(Array(s).fill(0),e.length),e=c}const o=k(A(n));for(let c=0;c<t;c++){let r=E(x(e,c),4);r=G(r,o);for(let l=0;l<4;l++)for(let f=0;f<4;f++){const i=r[f][l];e[c*16+(l*4+f)]=i}}return e},L=(e,n)=>{let t=F(e.length,16);e.length%16!==0&&t++;const s=k(A(n));for(let o=0;o<t;o++){let c=E(x(e,o),4);c=H(c,s);for(let r=0;r<4;r++)for(let l=0;l<4;l++){const f=c[l][r];e[o*16+(r*4+l)]=f}}return e};console.log("Crypto handler has started"),self.onmessage=async e=>{const n=e.data;console.log(`Get new Request ${n.id}:`,n);const t=await $(n);if(!t.success){self.postMessage(t);return}const s=t.data,o={id:t.id,message:t.message,success:t.success};self.postMessage(o),self.postMessage(s,{transfer:[s.buffer]})};const $=async e=>{const n=e.action;if(n!=="encrypt"&&n!=="decrypt")return{id:e.id,success:!1,message:"Action should be encrypt or decrypt"};const t=e.key;if(!t||t.length===0)return{id:e.id,success:!1,message:"Key is required"};if(!e.data)return{id:e.id,success:!1,message:"Data is required"};try{const s=new Uint8Array(A(e.data)),c=(n==="encrypt"?I:L)(s,t);return{id:e.id,success:!0,data:c,message:""}}catch(s){const o=s;return{id:e.id,success:!1,message:o.message}}}})();