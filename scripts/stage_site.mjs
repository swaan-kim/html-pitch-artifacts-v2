import fs from'node:fs';import path from'node:path';import{root}from'./source.mjs';
const out=path.join(root,'.build/site');fs.mkdirSync(out,{recursive:true});for(const name of ['index.html','.nojekyll','gallery','examples','references','reports','SKILL.md','THIRD_PARTY.md'])fs.cpSync(path.join(root,name),path.join(out,name),{recursive:true});console.log('Staged curated static site');
