import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) throw new Error(`Unexpected argument: ${token}`);
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      result[key] = true;
    } else {
      result[key] = next;
      index += 1;
    }
  }
  return result;
}

export function requireArg(args, name) {
  if (!args[name] || args[name] === true) throw new Error(`Missing required --${name}`);
  return args[name];
}

export function parseDimensions(value, label = 'dimensions') {
  const match = String(value).match(/^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)$/i);
  if (!match) throw new Error(`Invalid ${label}: ${value}. Expected WIDTHxHEIGHT.`);
  return { width: Number(match[1]), height: Number(match[2]) };
}

export function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

export function artifactFingerprint(inputPath, resourceUrls = []) {
  const root = path.dirname(path.resolve(inputPath));
  const files = new Set([path.resolve(inputPath)]);
  for (const url of resourceUrls) {
    if (!String(url).startsWith('file:')) continue;
    const resourcePath = fileURLToPath(url);
    if (fs.existsSync(resourcePath) && fs.statSync(resourcePath).isFile()) files.add(path.resolve(resourcePath));
  }

  const entries = [...files].sort().map((filePath) => ({
    path: filePath,
    relativePath: path.relative(root, filePath) || path.basename(filePath),
    sha256: sha256(filePath),
  }));
  const digest = crypto.createHash('sha256');
  for (const entry of entries) {
    digest.update(entry.relativePath);
    digest.update('\0');
    digest.update(entry.sha256);
    digest.update('\n');
  }
  return { sha256: digest.digest('hex'), files: entries };
}

function resolvePlaywrightModule() {
  const candidates = [];
  const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  candidates.push(path.join(skillRoot, 'node_modules', 'playwright', 'index.mjs'));
  if (process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) {
    candidates.push(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright', 'index.mjs'));
  }
  candidates.push('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) {
    throw new Error('Playwright was not found. Set CODEX_PRIMARY_RUNTIME_NODE_MODULES to the bundled runtime node_modules directory.');
  }
  return found;
}

function findSystemBrowser() {
  for (const command of ['chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable']) {
    try {
      return execFileSync('sh', ['-lc', `command -v ${command}`], { encoding: 'utf8' }).trim();
    } catch {
      // Try the next advertised executable name.
    }
  }
  return null;
}

async function resolveBrowserExecutable(explicitPath) {
  if (explicitPath) return { executablePath: path.resolve(explicitPath), args: [] };
  if (process.env.CHROMIUM_EXECUTABLE_PATH) {
    return { executablePath: path.resolve(process.env.CHROMIUM_EXECUTABLE_PATH), args: [] };
  }

  const systemBrowser = findSystemBrowser();
  if (systemBrowser) return { executablePath: systemBrowser, args: [] };

  const providerCandidates = [];
  if (process.env.SPARTICUZ_CHROMIUM_MODULE) providerCandidates.push(process.env.SPARTICUZ_CHROMIUM_MODULE);
  providerCandidates.push('/tmp/pw-runtime/node_modules/@sparticuz/chromium/build/index.js');
  for (const candidate of providerCandidates) {
    if (!fs.existsSync(candidate)) continue;
    const provider = (await import(pathToFileURL(candidate).href)).default;
    return {
      executablePath: await provider.executablePath(),
      args: Array.isArray(provider.args) ? provider.args : [],
    };
  }

  return { executablePath: null, args: [] };
}

export async function launchBrowser({ browserExecutable } = {}) {
  const modulePath = resolvePlaywrightModule();
  const { chromium } = await import(pathToFileURL(modulePath).href);
  const resolved = await resolveBrowserExecutable(browserExecutable);
  const launchOptions = {
    headless: true,
    args: [...resolved.args, '--allow-file-access-from-files'],
  };
  if (resolved.executablePath) launchOptions.executablePath = resolved.executablePath;

  try {
    return await chromium.launch(launchOptions);
  } catch (error) {
    throw new Error(
      `Chromium could not launch. Set CHROMIUM_EXECUTABLE_PATH or SPARTICUZ_CHROMIUM_MODULE. Original error: ${error.message}`,
    );
  }
}

export function ensureParent(filePath) {
  fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
}
