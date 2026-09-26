import fs from 'node:fs';import path from 'node:path';import{getSource}from'./source.mjs';import'../gallery/compose.js';
const arg=n=>process.argv[process.argv.indexOf(n)+1],source=getSource(process.argv.includes('--input')?path.resolve(arg('--input')):undefined);
if(process.argv.includes('--list')){console.log(JSON.stringify(source.scenes.map(({html,...s})=>s),null,2));process.exit(0);}
if(!process.argv.includes('--scenes')||!process.argv.includes('--output'))throw Error('Usage: --scenes cover,gurumi-intro --output new-folder [--title text]');
const out=path.resolve(arg('--output'));if(fs.existsSync(out)&&fs.readdirSync(out).length)throw Error('Refusing to overwrite a non-empty output folder');
const d=globalThis.PitchCompose.compose(arg('--scenes').split(','),source,process.argv.includes('--title')?arg('--title'):'나의 HTML 발표');fs.mkdirSync(out,{recursive:true});
for(const[n,v]of Object.entries({'index.html':d.html,'styles.css':d.css,'runtime.js':d.runtime,'presentation.html':d.standalone,'build.mjs':source.buildScript,'SOURCES.md':source.sources,'scene-manifest.json':JSON.stringify(d.scenes,null,2)}))fs.writeFileSync(path.join(out,n),v);
for(const[n,a]of Object.entries(d.assets)){fs.mkdirSync(path.dirname(path.join(out,n)),{recursive:true});fs.writeFileSync(path.join(out,n),Buffer.from(a.base64,'base64'));}console.log(JSON.stringify({output:out,scenes:d.ids,bytes:Buffer.byteLength(d.standalone),assets:Object.keys(d.assets).length}));
