import fs from 'node:fs';import path from 'node:path';import{fileURLToPath}from'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const mime={'.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.ico':'image/x-icon','.jpg':'image/jpeg','.jpeg':'image/jpeg'};
const uri=file=>{const bytes=fs.readFileSync(path.join(root,file)),type=bytes.subarray(0,8).toString('hex')==='89504e470d0a1a0a'?'image/png':mime[path.extname(file)];return `data:${type};base64,${bytes.toString('base64')}`;};
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const m of [...html.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)]){let css=fs.readFileSync(path.join(root,m[1]),'utf8');for(const a of [...css.matchAll(/url\(["']?(assets\/[^"')\s]+)["']?\)/g)])css=css.split(a[1]).join(uri(a[1]));html=html.replace(m[0],()=>'<style>'+css+'</style>');}
for(const m of [...html.matchAll(/src="(assets\/[^"\s]+)"/g)])html=html.replace(m[0],()=>`src="${uri(m[1])}"`);
for(const m of [...html.matchAll(/<script src="([^"]+)"><\/script>/g)])html=html.replace(m[0],()=>'<script>'+fs.readFileSync(path.join(root,m[1]),'utf8').replace(/<\/script/gi,'<\\/script')+'</script>');
fs.writeFileSync(path.join(root,'presentation.html'),html);console.log('presentation.html · '+(Buffer.byteLength(html)/1048576).toFixed(2)+' MiB');
