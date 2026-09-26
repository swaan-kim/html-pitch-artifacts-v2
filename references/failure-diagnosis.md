# Failure Diagnosis

Use this guide before changing HTML, fonts, or PDF settings.

## Stage isolation

| Comparison | If it differs | Likely fault domain |
|---|---|---|
| Intended HTML vs prepared browser page | First difference here | HTML, assets, fonts, runtime state, overflow |
| Prepared browser page vs captured PNG | First difference here | viewport, device scale, capture selector |
| Captured PNG vs rendered PDF page | First difference here | PDF composition, scaling, image encoding |
| Verified PDF file vs what the user opens | Earlier stages match | stale file, cache, wrong path, viewer |

Never fix a later stage until the earlier comparison passes.

## Known failure classes

### Animation appears at its initial state

Symptoms include `opacity: 0`, an object before its entrance transform, a counter at zero, or a partially drawn line.

Root cause: print or screenshot happened before the animation completed, or a global `animation: none` rule removed the animation while preserving its initial CSS declarations.

Correct response:

- Add or repair `prepareForExport()`.
- Reveal all pages, wait one frame, finish finite animations, resolve counters, and apply explicit final classes for infinite or scripted motion.
- Re-run preflight and capture.

Do not maintain an ever-growing print stylesheet that manually restores opacity and transforms for individual elements.

### Logo or icon disappears

Root causes:

- Essential icon is an emoji or font glyph that the export renderer cannot embed.
- Asset uses a remote URL, inaccessible file path, blob URL, or an image that was not decoded before capture.
- A runtime script copied the source only for the active page.

Correct response:

- Replace essential glyphs with inline SVG, local PNG, or a data URI.
- Fail preflight on broken images and unresolved critical assets.
- Decode every image before capture.

### Badge or text is clipped

Typical cause: a child is shifted outside a parent using negative positioning or transform while an ancestor uses `overflow: hidden`.

Correct response:

- Inspect the first clipping ancestor.
- Keep the item inside the intended content box, or mark a deliberate bleed explicitly with `data-qa-ignore`.
- Re-run geometric and scroll-overflow checks.

Do not shrink all text or remove overflow globally.

### Korean text renders but typography changes

Typical cause: the named font was unavailable, so the browser selected a fallback. A fallback can preserve glyphs while changing width, weight, line breaks, and visual tone.

Correct response:

- Bundle the exact font used by the HTML.
- Wait for `document.fonts.ready`.
- Verify both `document.fonts.check()` and computed family/weight on representative headings and body copy.
- Capture only after those checks pass.

Do not replace Pretendard with Noto Sans KR merely to avoid missing glyphs. That changes the reference design.

### Raster PDF is still visually wrong

Root cause: the raster images were created from an already-wrong vector PDF or from a different HTML revision.

Correct response: capture fresh PNG pages directly from the canonical prepared HTML, record the combined hash of the HTML and its loaded local dependencies, and build the image PDF from those PNGs.

### Blank or missing page

Root causes include transient render failure, hidden inactive pages, a selector mismatch, or an output directory containing stale images.

Correct response:

- Use a fresh temporary capture directory.
- Require exactly one numbered image per selected page.
- Compare expected, selected, captured, and PDF page counts.
- Render the PDF back to images and compare every page.

### First page or only one page looks different

Do not assume a global font problem. Check that page's computed family/weight, image decode status, animation state, clipping ancestors, and source hash. A page-specific discrepancy needs page-specific evidence.

## Wrong directions to reject

- Re-exporting without identifying which stage differs.
- Changing the deck's design to accommodate the PDF renderer.
- Substituting a different font and calling the result font-safe.
- Rasterizing a mismatched PDF rather than the canonical HTML.
- Declaring success because the PDF has zero font resources.
- Checking only a contact sheet or a few "important" pages.
- Editing an old HTML revision while exporting a newer or differently named copy.
