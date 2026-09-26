# Token-efficient Deck Production

Use this workflow for a new full deck, a topic conversion, or a major rewrite. The goal is not merely fewer tokens; it is to keep narrative, content, layout, and export decisions from contaminating one another.

## Working set

Keep four layers separate:

1. **Brief** — audience, decision, duration, central takeaway, available proof.
2. **Page map** — page ID, role, layout, tone, and one claim per page.
3. **Content modules** — claims, numbers, labels, sources, and UI copy.
4. **Visual system** — shared tokens, layout primitives, runtime, and export contract.

Do not embed large screenshots or base64 assets into the content modules. Keep them as local files during authoring. A single-file handoff may be created only after the modular source passes QA.

## Start from the reusable system

```bash
node scripts/scaffold_deck.mjs --output /absolute/path/my-deck
node scripts/deck_map.mjs --input /absolute/path/my-deck > /absolute/path/my-deck-map.json
```

The scaffold contains a complete 34-page sequence derived from the proven Follome deck structure. Preserve all 34 pages when the user asks to follow that full framework. Remove or merge pages only when the audience, time limit, or explicit request requires a shorter deck.

Read [34-page-blueprint.md](34-page-blueprint.md) when selecting or changing page roles.

## Conversion workflow

1. Write one communication job: audience + desired decision + central takeaway.
2. Run `deck_map.mjs`; review the small map instead of opening every source file.
3. Map available evidence to the 34 page contracts. Mark missing proof before writing copy.
4. Edit only the matching file under `content/`:
   - `01-problem.js`: pages 1–7
   - `02-solution.js`: pages 8–12
   - `03-product.js`: pages 13–20
   - `04-business.js`: pages 21–28
   - `05-technical.js`: pages 29–32
   - `06-close.js`: pages 33–34
5. Replace `XX`, `XXX`, generic sources, and demo UI with verified project evidence.
6. Capture the changed page by stable ID and inspect it at full size.
7. Run full preflight only after the local page passes. Export the PDF after preflight passes.

## Token routing

| Change | Read or edit first | Avoid loading |
|---|---|---|
| One sentence, number, or source | `deck-map.json` → one `content/*.js` block | `theme.css`, runtime, embedded images |
| One page layout | matching content block → relevant layout in `theme.css` | unrelated content sections |
| Global color or typography | `deck-config.js` and `theme.css` | every page body |
| Navigation or export state | `runtime.js` and authoring contract | business copy |
| PDF mismatch | failure diagnosis and QA report | narrative references |

Use `rg 'id: "page-id"' content` to locate a page. Patch the smallest object or component. Do not perform broad string replacement across the deck.

## Page-level loop

```bash
node scripts/capture_page.mjs \
  --input /absolute/path/my-deck/index.html \
  --page-id product-action \
  --output /absolute/path/build/product-action.png
```

Review the target page for claim clarity, hierarchy, clipping, font selection, and asset fidelity. If the edit touched only content, continue with the next requested page. If it touched shared CSS or runtime, inspect representative dark, light, product, data, team, architecture, and closing pages before full-deck QA.

## Quality rules

- One audience-facing claim and one dominant proof per page.
- Statistics need an interpretation and original source, not only a large number.
- Real UI should carry product pages; annotations explain only the decision path.
- Shorten or restructure copy before reducing type size.
- Maintain dark problem pages → bright solution/product pages → controlled dark emphasis → bright close.
- Decorative motion is optional. Export state must be deterministic.
- Finish content structure before polishing micro-layout; finish HTML fidelity before building the PDF.
