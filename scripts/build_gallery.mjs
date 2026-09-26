import fs from 'node:fs';import path from 'node:path';import{getSource,root}from'./source.mjs';import'../gallery/compose.js';import'./build_casebook.mjs';
const s=getSource();fs.writeFileSync(path.join(root,'gallery/payload.js'),'window.PITCH_SOURCE='+JSON.stringify(s)+';');
const versions=JSON.parse(fs.readFileSync(path.join(root,'examples/versions/manifest.json'),'utf8'));fs.writeFileSync(path.join(root,'gallery/catalog.js'),'window.PITCH_CATALOG='+JSON.stringify({versions,scenes:s.scenes.map(({html,...x})=>x)})+';');
const d=PitchCompose.compose(s.scenes.map(x=>x.id),s,'AutoPets — 재사용 편집본');const dir=path.join(root,'assets/templates/autopets');fs.writeFileSync(path.join(dir,'index.html'),d.html);fs.writeFileSync(path.join(dir,'build.mjs'),s.buildScript);
// index needs the full two CSS files for editable regeneration; standalone composition uses their combined content.
let index=fs.readFileSync(path.join(dir,'index.html'),'utf8').replace('<link rel="stylesheet" href="styles.css">','<link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="story.css">');fs.writeFileSync(path.join(dir,'index.html'),index);
console.log(JSON.stringify({scenes:s.scenes.length,payloadBytes:fs.statSync(path.join(root,'gallery/payload.js')).size}));
