#!/usr/bin/env node
import { cp, mkdir, readdir, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const outputValue = argument("--output");
if (!outputValue) {
  console.error("Usage: node scripts/scaffold_deck.mjs --output /absolute/path/my-deck");
  process.exit(2);
}

const output = resolve(outputValue);
const source = resolve(dirname(fileURLToPath(import.meta.url)), "../assets/templates/pitch-deck");

await mkdir(output, { recursive: true });
const existing = await readdir(output);
if (existing.length) {
  console.error(`Refusing to overwrite non-empty directory: ${output}`);
  process.exit(2);
}

await cp(source, output, { recursive: true, errorOnExist: true });
const copied = await readdir(output);
const files = [];
for (const name of copied) {
  const info = await stat(resolve(output, name));
  if (info.isFile()) files.push(name);
}
console.log(JSON.stringify({ status: "created", output, files: files.sort() }));
