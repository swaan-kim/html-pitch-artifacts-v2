#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { ensureParent, launchBrowser, parseArgs, parseDimensions, requireArg } from './runtime.mjs';

const args = parseArgs(process.argv.slice(2));
const inputPath = path.resolve(requireArg(args, 'input'));
const outputPath = path.resolve(requireArg(args, 'output'));
const pageId = requireArg(args, 'page-id');
const selector = args.selector || '.artifact-page';
const viewport = parseDimensions(args.viewport || '1600x900', 'viewport');
const scale = Number(args.scale || 1);

if (!fs.existsSync(inputPath)) throw new Error(`Input HTML not found: ${inputPath}`);
if (!(scale > 0 && scale <= 4)) throw new Error('--scale must be greater than 0 and at most 4.');

ensureParent(outputPath);
const browser = await launchBrowser({ browserExecutable: args['browser-executable'] });
try {
  const page = await browser.newPage({ viewport, deviceScaleFactor: scale });
  await page.emulateMedia({ media: 'screen' });
  await page.goto(pathToFileURL(inputPath).href, { waitUntil: 'load', timeout: 120000 });
  const result = await page.evaluate(async ({ pageSelector, targetId }) => {
    const pages = [...document.querySelectorAll(pageSelector)];
    const target = pages.find((element) => element.dataset.pageId === targetId);
    if (!target) return { found: false, available: pages.map((element) => element.dataset.pageId) };
    pages.forEach((element) => element.classList.toggle('is-active', element === target));
    document.querySelectorAll('[data-qa-ignore]').forEach((element) => {
      element.style.display = 'none';
    });
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    for (const animation of target.getAnimations({ subtree: true })) {
      try { animation.finish(); } catch { animation.cancel(); }
    }
    await document.fonts.ready;
    await Promise.all([...target.querySelectorAll('img')].map((image) => image.decode?.().catch(() => {})));
    return { found: true };
  }, { pageSelector: selector, targetId: pageId });

  if (!result.found) throw new Error(`Unknown page id: ${pageId}. Available: ${result.available.join(', ')}`);
  const target = page.locator(`${selector}[data-page-id="${pageId.replaceAll('"', '\\"')}"]`);
  await target.screenshot({ path: outputPath, type: 'png', animations: 'disabled' });
} finally {
  await browser.close();
}

process.stdout.write(`${JSON.stringify({ status: 'captured', pageId, output: outputPath })}\n`);
