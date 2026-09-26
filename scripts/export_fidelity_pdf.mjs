#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { prepareAndInspect } from './inspect_artifact.mjs';
import { artifactFingerprint, ensureParent, launchBrowser, parseArgs, parseDimensions, requireArg, sha256 } from './runtime.mjs';

const args = parseArgs(process.argv.slice(2));
const inputPath = path.resolve(requireArg(args, 'input'));
const outputPath = path.resolve(requireArg(args, 'output'));
const selector = requireArg(args, 'selector');
const expectedPages = Number(requireArg(args, 'expected-pages'));
const viewport = parseDimensions(args.viewport || '1600x900', 'viewport');
const scale = Number(args.scale || 2);
const maxMeanDiff = Number(args['max-mean-diff'] || 5);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const python = process.env.CODEX_PRIMARY_RUNTIME_PYTHON || 'python3';

if (!fs.existsSync(inputPath)) throw new Error(`Input HTML not found: ${inputPath}`);
if (!Number.isInteger(expectedPages) || expectedPages < 1) throw new Error('--expected-pages must be a positive integer.');
if (!(scale > 0 && scale <= 4)) throw new Error('--scale must be greater than 0 and at most 4.');

ensureParent(outputPath);
const stem = path.basename(outputPath, path.extname(outputPath));
const outputDir = path.dirname(outputPath);
const preflightPath = path.join(outputDir, `${stem}.preflight.json`);
const manifestPath = path.join(outputDir, `${stem}.manifest.json`);
const qaReportPath = path.join(outputDir, `${stem}.qa.json`);
const contactSheetPath = path.join(outputDir, `${stem}.contact-sheet.png`);
const buildDir = fs.mkdtempSync(path.join(os.tmpdir(), 'html-pitch-export-'));
const captureDir = path.join(buildDir, 'captures');
fs.mkdirSync(captureDir, { recursive: true });

const browser = await launchBrowser({ browserExecutable: args['browser-executable'] });
let inspected;
try {
  const page = await browser.newPage({ viewport, deviceScaleFactor: scale });
  inspected = await prepareAndInspect(page, {
    inputPath,
    selector,
    expectedPages,
    requiredFont: args['required-font'] || '',
    allowExternal: Boolean(args['allow-external']),
  });

  const fingerprint = artifactFingerprint(inputPath, inspected.resources);
  const preflight = {
    status: inspected.errors.length ? 'failed' : 'passed',
    source: inputPath,
    sourceSha256: fingerprint.sha256,
    sourceFiles: fingerprint.files,
    selector,
    expectedPages,
    viewport,
    scale,
    ...inspected,
  };
  fs.writeFileSync(preflightPath, `${JSON.stringify(preflight, null, 2)}\n`);
  if (inspected.errors.length) {
    throw new Error(`Preflight failed with ${inspected.errors.length} error(s). See ${preflightPath}`);
  }

  const elements = await page.locator(selector).all();
  if (elements.length !== expectedPages) throw new Error(`Capture count changed after preflight: ${elements.length}`);
  for (let index = 0; index < elements.length; index += 1) {
    const capturePath = path.join(captureDir, `page-${String(index + 1).padStart(3, '0')}.png`);
    await elements[index].scrollIntoViewIfNeeded();
    await elements[index].screenshot({ path: capturePath, type: 'png', animations: 'disabled' });
  }
} finally {
  await browser.close();
}

const firstPage = inspected.pages[0];
const ratio = firstPage.width / firstPage.height;
let pagePoints;
if (args['page-points']) {
  pagePoints = parseDimensions(args['page-points'], 'page points');
} else if (Math.abs(ratio - 16 / 9) < 0.015) {
  pagePoints = { width: 960, height: 540 };
} else if (Math.abs(ratio - 210 / 297) < 0.015) {
  pagePoints = { width: 595.276, height: 841.89 };
} else {
  pagePoints = { width: firstPage.width * 0.75, height: firstPage.height * 0.75 };
}

const manifest = {
  version: 1,
  status: 'captured',
  source: inputPath,
  sourceSha256: artifactFingerprint(inputPath, inspected.resources).sha256,
  sourceFiles: artifactFingerprint(inputPath, inspected.resources).files,
  selector,
  expectedPages,
  viewport,
  scale,
  pagePoints,
  fonts: inspected.fonts,
  warnings: inspected.warnings,
};
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (result.status !== 0) {
    throw new Error(`${command} failed (${result.status}).\n${result.stdout}\n${result.stderr}`);
  }
  if (result.stdout) process.stdout.write(result.stdout);
}

run(python, [
  path.join(scriptDir, 'build_image_pdf.py'),
  '--images-dir', captureDir,
  '--output', outputPath,
  '--expected-pages', String(expectedPages),
  '--page-points', `${pagePoints.width}x${pagePoints.height}`,
]);

run(python, [
  path.join(scriptDir, 'verify_pdf.py'),
  '--pdf', outputPath,
  '--reference-dir', captureDir,
  '--expected-pages', String(expectedPages),
  '--report', qaReportPath,
  '--contact-sheet', contactSheetPath,
  '--source', inputPath,
  '--manifest', manifestPath,
  '--max-mean-diff', String(maxMeanDiff),
  '--expect-image-only',
]);

manifest.status = 'verified';
manifest.pdf = outputPath;
manifest.pdfSha256 = sha256(outputPath);
manifest.qaReport = qaReportPath;
manifest.contactSheet = contactSheetPath;
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

if (args['keep-captures']) {
  const permanentCaptureDir = path.join(outputDir, `${stem}.captures`);
  fs.rmSync(permanentCaptureDir, { recursive: true, force: true });
  fs.cpSync(captureDir, permanentCaptureDir, { recursive: true });
}
fs.rmSync(buildDir, { recursive: true, force: true });
process.stdout.write(`${JSON.stringify({ status: 'verified', pdf: outputPath, pages: expectedPages, manifest: manifestPath, qa: qaReportPath })}\n`);
