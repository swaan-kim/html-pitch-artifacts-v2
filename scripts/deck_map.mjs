#!/usr/bin/env node
import { readFile, readdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import vm from "node:vm";

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const inputValue = argument("--input");
if (!inputValue) {
  console.error("Usage: node scripts/deck_map.mjs --input /absolute/path/pitch-deck");
  process.exit(2);
}

const input = resolve(inputValue);
if (!(await stat(input)).isDirectory()) throw new Error("--input must be a scaffolded pitch-deck directory");
const contentDirectory = join(input, "content");
const contentFiles = (await readdir(contentDirectory)).filter((name) => name.endsWith(".js")).sort();
const files = [join(input, "deck-config.js"), ...contentFiles.map((name) => join(contentDirectory, name))];
const context = { window: {} };
for (const file of files) {
  const source = await readFile(file, "utf8");
  vm.runInNewContext(source, context, { filename: file, timeout: 1000 });
}
const deck = { ...(context.window.PITCH_CONFIG || {}), slides: context.window.PITCH_SLIDES };
if (!Array.isArray(deck.slides)) throw new Error("PITCH_SLIDES is required");

const pages = deck.slides.map((slide, index) => ({
  number: index + 1,
  id: slide.id,
  layout: slide.layout,
  tone: slide.tone,
  meta: slide.meta,
  claim: slide.claim
}));

console.log(JSON.stringify({ project: deck.project, pageCount: pages.length, pages }, null, 2));
