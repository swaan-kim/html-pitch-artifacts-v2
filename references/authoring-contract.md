# HTML Authoring Contract

Use the contract for new artifacts and add it before exporting repaired artifacts.

## Canonical structure

```html
<main class="artifact" data-artifact-kind="deck">
  <section class="artifact-page is-active" data-page-id="cover" data-page-number="1">
    ...
  </section>
</main>
```

- Use stable `data-page-id` values. Do not target pages by `nth-child()` or a mutable numeric class.
- Use `.artifact-page` for every output page.
- Keep visible copy in content objects or clearly scoped page markup. Do not use broad string replacement against the full document.
- Generate page numbers from the final DOM order.
- For a full modular deck, keep page copy in sectioned `content/*.js`, shared design decisions in `theme.css`, and export/navigation behavior in `runtime.js`. Do not duplicate one concern across these layers.

## Assets and fonts

- Critical images and logos: local files, inline SVG, or data URIs.
- Critical icons: `<svg>` or `<img data-artifact-icon>`. Never a text glyph.
- Fonts: local `@font-face` with the exact families and weights used by the artifact.
- Remote assets may be used only when explicitly allowed and captured into local assets before final export.

## Geometry annotations

- Add `data-qa-fit` to important titles, statistics, logos, UI frames, and badges that must remain inside their page.
- Add `data-qa-ignore` only to intentional bleed, off-canvas decoration, or hidden navigation.
- Do not combine negative translation with a clipping ancestor unless the visible intersection is intentional and annotated.

## Export API

The HTML must expose a deterministic function:

```js
window.prepareForExport = async function prepareForExport() {
  document.documentElement.dataset.artifactExport = "true";

  document.querySelectorAll("[data-count]").forEach((element) => {
    const value = Number(element.dataset.count);
    const decimals = Number(element.dataset.decimals || 0);
    element.textContent = `${value.toFixed(decimals)}${element.dataset.suffix || ""}`;
  });

  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  for (const animation of document.getAnimations()) {
    if (Number.isFinite(animation.effect?.getTiming?.().iterations)) {
      try { animation.finish(); } catch { animation.cancel(); }
    } else {
      animation.cancel();
    }
  }

  await document.fonts.ready;
  await Promise.all([...document.images].map(async (image) => {
    if (!image.complete) await new Promise((resolve) => {
      image.addEventListener("load", resolve, { once: true });
      image.addEventListener("error", resolve, { once: true });
    });
    if (image.decode) await image.decode().catch(() => {});
  }));
};
```

Pair it with export-only visibility rules that do not change page geometry:

```css
html[data-artifact-export="true"] body {
  display: block;
  overflow: visible;
}

html[data-artifact-export="true"] .artifact-page {
  position: relative;
  display: block;
}

html[data-artifact-export="true"] .artifact-nav {
  display: none !important;
}
```

If the deck reorders nodes, copies runtime image sources, or calculates labels, perform those operations inside `prepareForExport()` before capturing. Do not duplicate that business logic in the exporter.

## Edit procedure

1. Identify the page by `data-page-id`.
2. Change the smallest scoped component or content value.
3. Render that page and run overflow checks.
4. Run full-deck preflight because page count, numbering, or shared styles may change.
5. Export from the same source hash that passed preflight.

For a modular deck, the source hash must cover the HTML entrypoint and every loaded local dependency. An unchanged `index.html` is not sufficient evidence when content, CSS, fonts, scripts, or images changed.
