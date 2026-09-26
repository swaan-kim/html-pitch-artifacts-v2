import { pathToFileURL } from 'node:url';

export async function prepareAndInspect(page, options) {
  const {
    inputPath,
    selector,
    expectedPages,
    requiredFont,
    allowExternal = false,
  } = options;

  await page.emulateMedia({ media: 'screen' });
  await page.goto(pathToFileURL(inputPath).href, { waitUntil: 'load', timeout: 120000 });

  const hasPrepare = await page.evaluate(() => typeof window.prepareForExport === 'function');
  if (!hasPrepare) {
    return {
      errors: [{ code: 'missing-export-contract', message: 'window.prepareForExport() is required.' }],
      warnings: [],
      pages: [],
      fonts: [],
    };
  }

  await page.evaluate(async () => {
    await window.prepareForExport({ mode: 'qa' });
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await document.fonts.ready;
    await Promise.all([...document.images].map(async (image) => {
      if (!image.complete) {
        await new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', resolve, { once: true });
        });
      }
      if (image.decode) await image.decode().catch(() => {});
    }));
  });

  return await page.evaluate(
    ({ pageSelector, expected, fontName, externalAllowed }) => {
      const errors = [];
      const warnings = [];
      const selectedPages = [...document.querySelectorAll(pageSelector)];
      const elementLabel = (element) => {
        if (!element) return null;
        const page = element.closest(pageSelector);
        const pageId = page?.dataset.pageId || page?.getAttribute('aria-label') || null;
        const id = element.id ? `#${element.id}` : '';
        const classes = [...element.classList].slice(0, 3).map((name) => `.${name}`).join('');
        return { pageId, element: `${element.tagName.toLowerCase()}${id}${classes}` };
      };
      const pushError = (code, message, element = null) => errors.push({ code, message, ...elementLabel(element) });
      const pushWarning = (code, message, element = null) => warnings.push({ code, message, ...elementLabel(element) });

      if (selectedPages.length !== expected) {
        pushError('page-count', `Expected ${expected} pages but selected ${selectedPages.length}.`);
      }

      const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
      for (const id of new Set(ids)) {
        if (ids.filter((candidate) => candidate === id).length > 1) {
          pushError('duplicate-id', `Duplicate DOM id: ${id}`);
        }
      }

      const pageIds = selectedPages.map((element) => element.dataset.pageId).filter(Boolean);
      for (const pageId of new Set(pageIds)) {
        if (pageIds.filter((candidate) => candidate === pageId).length > 1) {
          pushError('duplicate-page-id', `Duplicate data-page-id: ${pageId}`);
        }
      }
      if (pageIds.length !== selectedPages.length) {
        pushError('missing-page-id', 'Every selected page must have a stable data-page-id.');
      }

      for (const image of document.images) {
        if (!image.complete || image.naturalWidth === 0 || image.naturalHeight === 0) {
          pushError('broken-image', `Image failed to decode: ${image.currentSrc || image.src || '(empty src)'}`, image);
        }
      }

      const externalElements = [...document.querySelectorAll('img[src], video[poster], link[href], source[src]')]
        .filter((element) => {
          const value = element.getAttribute('src') || element.getAttribute('poster') || element.getAttribute('href') || '';
          return /^https?:/i.test(value);
        });
      if (!externalAllowed) {
        for (const element of externalElements) {
          pushError('external-asset', 'Presentation-critical outputs must not depend on remote assets.', element);
        }
      } else if (externalElements.length) {
        pushWarning('external-asset-allowed', `${externalElements.length} remote assets were explicitly allowed.`);
      }

      if (fontName) {
        const escapedFont = fontName.replaceAll('"', '\\"');
        if (!document.fonts.check(`16px "${escapedFont}"`)) {
          pushError('font-unavailable', `Required font did not load: ${fontName}`);
        }
      }

      const runningAnimations = document.getAnimations({ subtree: true })
        .filter((animation) => animation.playState === 'running' || animation.playState === 'pending');
      if (runningAnimations.length) {
        pushError('running-animation', `${runningAnimations.length} animations remain active after prepareForExport().`);
      }

      for (const icon of document.querySelectorAll('[data-artifact-icon]')) {
        if (!icon.matches('img, svg') && !icon.querySelector('img, svg')) {
          pushError('text-icon', 'Essential icons must be SVG or raster images, not text glyphs.', icon);
        }
      }

      const tolerance = 1.5;
      for (const element of document.querySelectorAll('[data-qa-fit]')) {
        if (element.closest('[data-qa-ignore]')) continue;
        const owner = element.closest(pageSelector);
        if (!owner) continue;
        const rect = element.getBoundingClientRect();
        const pageRect = owner.getBoundingClientRect();
        if (
          rect.left < pageRect.left - tolerance ||
          rect.top < pageRect.top - tolerance ||
          rect.right > pageRect.right + tolerance ||
          rect.bottom > pageRect.bottom + tolerance
        ) {
          pushError('fit-boundary', 'Annotated element extends outside its page.', element);
        }
      }

      const textCandidates = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, [data-qa-text]')];
      for (const element of textCandidates) {
        if (element.closest('[data-qa-ignore]')) continue;
        const style = getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') continue;
        const clipsX = ['hidden', 'clip'].includes(style.overflowX);
        const clipsY = ['hidden', 'clip'].includes(style.overflowY);
        if (clipsX && element.scrollWidth > element.clientWidth + 1) {
          pushError('text-clipped-x', 'Text exceeds a horizontally clipped box.', element);
        }
        if (clipsY && element.scrollHeight > element.clientHeight + 1) {
          pushError('text-clipped-y', 'Text exceeds a vertically clipped box.', element);
        }
      }

      const pages = selectedPages.map((element, index) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || rect.width < 1 || rect.height < 1) {
          pushError('hidden-page', `Page ${index + 1} is not capturable.`, element);
        }
        return {
          index: index + 1,
          pageId: element.dataset.pageId,
          width: rect.width,
          height: rect.height,
          backgroundColor: style.backgroundColor,
        };
      });

      if (pages.length) {
        const base = pages[0];
        for (const page of pages.slice(1)) {
          if (Math.abs(page.width - base.width) > tolerance || Math.abs(page.height - base.height) > tolerance) {
            pushError('page-size-mismatch', `Page ${page.index} is ${page.width}x${page.height}; expected ${base.width}x${base.height}.`);
          }
        }
      }

      const sampleSelectors = ['body', `${pageSelector} h1`, `${pageSelector} h2`, `${pageSelector} p`];
      const fonts = sampleSelectors.map((sampleSelector) => {
        const element = document.querySelector(sampleSelector);
        if (!element) return null;
        const style = getComputedStyle(element);
        return {
          selector: sampleSelector,
          family: style.fontFamily,
          weight: style.fontWeight,
          size: style.fontSize,
        };
      }).filter(Boolean);

      const resources = [...new Set([
        location.href,
        ...performance.getEntriesByType('resource').map((entry) => entry.name),
        ...[...document.scripts].map((element) => element.src),
        ...[...document.querySelectorAll('link[href]')].map((element) => element.href),
        ...[...document.images].map((element) => element.currentSrc || element.src),
      ].filter((value) => value && value.startsWith('file:')))];

      return { errors, warnings, pages, fonts, resources };
    },
    { pageSelector: selector, expected: expectedPages, fontName: requiredFont || '', externalAllowed: allowExternal },
  );
}
