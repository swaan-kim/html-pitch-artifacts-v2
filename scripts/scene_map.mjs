import fs from 'node:fs';import path from 'node:path';
const i=process.argv.indexOf('--input');if(i<0)throw Error('Usage: --input deck-folder');const root=path.resolve(process.argv[i+1]),manifest=JSON.parse(fs.readFileSync(path.join(root,'scene-manifest.json'),'utf8'));
console.log(JSON.stringify(manifest.map(s=>({id:s.id,title:s.title,file:s.file??'index.html',states:s.steps+1,group:s.group,bytes:fs.statSync(path.join(root,fs.existsSync(path.join(root,s.file??''))&&s.file?s.file:'index.html')).size})),null,2));
