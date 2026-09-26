// node build.mjs — embed the editable source and assets into one offline HTML.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const read=name=>fs.readFile(path.join(root,name),'utf8');
const mime={'.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.ico':'image/x-icon','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
const asset=async file=>'data:'+(mime[path.extname(file).toLowerCase()]||'application/octet-stream')+';base64,'+(await fs.readFile(path.join(root,'assets',file))).toString('base64');
let html=await read('index.html'),css=await read('styles.css')+'\n'+await read('story.css');
for(const match of [...css.matchAll(/url\("assets\/([^"]+)"\)/g)])css=css.replace(match[0],'url("'+await asset(match[1])+'")');
html=html.replace('<link rel="stylesheet" href="styles.css">','<style>\n'+css+'\n</style>');
html=html.replace('<link rel="stylesheet" href="story.css">','');
for(const match of [...html.matchAll(/src="assets\/([^"]+)"/g)])html=html.replace(match[0],'src="'+await asset(match[1])+'"');
html=html.replace('<script src="deck.js"></script>','<script>\n'+await read('deck.js')+'\n</script>');
await fs.writeFile(path.join(root,'AutoPets_5분발표.html'),html);
console.log('AutoPets_5분발표.html');
