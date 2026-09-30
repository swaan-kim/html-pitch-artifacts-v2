import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const data=JSON.parse(read('data/presentation-preferences.json'));
const categories=new Set(data.categories.map(x=>x.id));
const sources=new Set(data.sources.map(x=>x.id));
for(const key of ['categories','sources','rules','templates']) {
  assert.equal(new Set(data[key].map(x=>x.id)).size,data[key].length,`Duplicate ${key} IDs`);
}
for(const rule of data.rules) {
  assert(categories.has(rule.category),`${rule.id}: category missing`);
  assert(rule.prompt&&rule.check&&rule.scope&&rule.sources.length,`${rule.id}: incomplete reusable rule`);
  for(const source of rule.sources) assert(sources.has(source),`${rule.id}: unknown source ${source}`);
}
for(const relation of data.relations) {
  assert(sources.has(relation.from_source)&&sources.has(relation.to_source),'Missing relation source');
  assert(relation.type&&relation.detail,'Missing relation interpretation');
}
const covered=new Set(data.rules.flatMap(r=>r.legacy));
for(const entry of JSON.parse(read('data/changes.json'))) assert(covered.has(entry.id),`Legacy case ${entry.id} omitted`);
const page=read('prompt-library.html');
const embedded=JSON.parse(page.match(/<script id="library-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
assert.deepEqual(embedded,data,'Search page data is stale; rebuild prompt library');
assert(!/<(?:script|link|img)\b[^>]*(?:src|href)="https?:\/\//i.test(page),'Unexpected external asset dependency');
new vm.Script(page.match(/<script>([\s\S]*?)<\/script>/)[1]);
assert(read('index.html').includes('href="prompt-library.html"'),'Gallery entry missing');
for(const document of ['references/presentation-style.md','references/presentation-prompt-pack.md','references/presentation-request-catalog.md']) {
  for(const [,link] of read(document).matchAll(/\]\(([^)]+)\)/g)) {
    if(!link.startsWith('http')) assert(fs.existsSync(path.resolve(root,path.dirname(document),link.split('#')[0])),`Broken link ${document}: ${link}`);
  }
}
for(const file of ['prompt-library.html','data','downloads']) assert(read('scripts/stage_site.mjs').includes(`'${file}'`),`Pages staging excludes ${file}`);
assert(fs.existsSync(path.join(root,'downloads/presentation-prompts-2026-09-30.zip')),'Public download missing');
console.log(JSON.stringify({status:'passed',rules:data.rules.length,sources:data.sources.length,templates:data.templates.length,legacyCoverage:covered.size}));
