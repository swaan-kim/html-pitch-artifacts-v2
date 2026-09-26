#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

import { prepareAndInspect } from './inspect_artifact.mjs';
import { artifactFingerprint, ensureParent, launchBrowser, parseArgs, parseDimensions, requireArg } from './runtime.mjs';

const args = parseArgs(process.argv.slice(2));
const inputPath = path.resolve(requireArg(args, 'input'));
const selector = requireArg(args, 'selector');
const expectedPages = Number(requireArg(args, 'expected-pages'));
const viewport = parseDimensions(args.viewport || '1600x900', 'viewport');
const reportPath = path.resolve(args.report || `${inputPath}.preflight.json`);

if (!Number.isInteger(expectedPages) || expectedPages < 1) throw new Error('--expected-pages must be a positive integer.');
if (!fs.existsSync(inputPath)) throw new Error(`Input HTML not found: ${inputPath}`);

const browser = await launchBrowser({ browserExecutable: args['browser-executable'] });
let report;
try {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const inspected = await prepareAndInspect(page, {
    inputPath,
    selector,
    expectedPages,
    requiredFont: args['required-font'] || '',
    allowExternal: Boolean(args['allow-external']),
  });
  const fingerprint = artifactFingerprint(inputPath, inspected.resources);
  report = {
    status: inspected.errors.length ? 'failed' : 'passed',
    source: inputPath,
    sourceSha256: fingerprint.sha256,
    sourceFiles: fingerprint.files,
    selector,
    expectedPages,
    viewport,
    ...inspected,
  };
} finally {
  await browser.close();
}

ensureParent(reportPath);
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(`${JSON.stringify({ status: report.status, errors: report.errors.length, warnings: report.warnings.length, report: reportPath })}\n`);
if (report.errors.length) process.exitCode = 1;
