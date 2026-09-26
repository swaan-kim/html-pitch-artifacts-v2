/* Shared pure composer: no DOM, no network, identical in gallery and CLI. */
(()=>{
const ending=['closing-position','closing-media','feedback'];
function normalize(ids,source){const valid=new Set(source.scenes.map(s=>s.id));if(!ids.length)throw Error('화면을 하나 이상 선택하세요.');for(const id of ids)if(!valid.has(id))throw Error('Unknown scene: '+id);const result=[];for(const id of ids){for(const x of ending.includes(id)?ending:[id])if(!result.includes(x))result.push(x);}return result;}
function escape(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
function compose(ids,source,title='나의 HTML 발표'){
ids=normalize(ids,source);const scenes=ids.map(id=>source.scenes.find(s=>s.id===id));
let html=source.head.replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(title)}</title>`)+scenes.map(s=>s.html).join('\n')+(ids.includes('closing-position')?source.closing:'')+source.tail;
// Retain shared CSS. Remove image-bearing rules only if their required class is absent.
const classes=new Set([...html.matchAll(/class="([^"]+)"/g)].flatMap(m=>m[1].split(/\s+/)));
let css=source.css.replace(/([^{}]+)\{([^{}]*url\([^{}]+)\}/g,(rule,selectors)=>{const any=selectors.split(',').some(s=>{const names=[...s.matchAll(/\.([a-zA-Z_-][\w-]*)/g)].map(m=>m[1]).filter(x=>!['is-active','is-current','is-selected','is-recommended','is-transforming','is-overflowing','reduced-motion','greeting'].includes(x));return !names.length||names.every(x=>classes.has(x));});return any?rule:'';});
html=html.replace(/<link rel="stylesheet" href="styles.css">/,'<link rel="stylesheet" href="styles.css">').replace(/<link rel="stylesheet" href="story.css">/,'');
html=html.replace('<script src="deck.js"></script>','<script src="runtime.js"></script>');
const refs=new Set([...((html+css).matchAll(/assets\/([^"')\s]+)/g))].map(m=>'assets/'+m[1]));
const assets={};for(const key of refs){if(!source.assets[key])throw Error('Missing asset '+key);assets[key]=source.assets[key];}
let embeddedCSS=css,embeddedHTML=html;for(const [key,a]of Object.entries(assets)){const uri=`data:${a.mime};base64,${a.base64}`;embeddedHTML=embeddedHTML.split(key).join(uri);embeddedCSS=embeddedCSS.split(key).join(uri);}
const standalone=embeddedHTML.replace('<link rel="stylesheet" href="styles.css">',()=>`<style>${embeddedCSS}</style>`).replace('<script src="runtime.js"></script>',()=>`<script>${source.runtime.replace(/<\/script/gi,'<\\/script')}</script>`);
return {ids,scenes:scenes.map(({html,...s})=>s),html,css,runtime:source.runtime,assets,standalone};
}
globalThis.PitchCompose=Object.freeze({normalize,compose});
})();
