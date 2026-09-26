---
name: html-pitch-artifacts-v2
description: Create or refine HTML presentations with reusable scenes, prompt-led examples, click-anywhere motion, offline packaging, and visual/file-size QA. Use for HTML slide decks and presentation revisions; PDF is an optional export.
---

# HTML Pitch V2

Preserve the user's story, audience, duration and reference style. Produce the requested HTML presentation, not just isolated product mockups. Reuse the supplied deck before inventing a new design. The AutoPets case is a reference, not a required theme or slide count.

## Start with the smallest useful context

- Locate the editable source. Read its scene/page map, the user's latest corrections and the target scene. Do not read a giant standalone HTML, Base64 payload or every image into model context.
- `node scripts/scene_map.mjs --input <deck-folder>` lists V2 scenes. The legacy `scripts/deck_map.mjs` supports the V1 page format.
- If purpose, audience, duration or required content is missing, ask only what changes the result. Infer settled choices from the session.
- Reuse a scene with `node scripts/compose_deck.mjs --scenes cover,gurumi-intro --output <new-folder>`. Use `--list` first. The source folder must contain `scene-manifest.json`, scene fragments, head/tail, CSS, runtime and assets.
- For a new neutral deck use `assets/templates/minimal-white/`. For a requested longer business pitch, the V1 `assets/templates/pitch-deck/` and `scripts/scaffold_deck.mjs` remain optional. Neither 20 nor 34 pages is a default requirement.

## Edit and validate

1. Identify the intended audience takeaway and primary action of the scene. Keep spoken explanations out of the screen unless requested. Use real logos when recognition matters; preserve proportions and record sources.
2. Separate content, shared style, runtime and assets. Keep stable scene identifiers when page order changes. A repeated symbol keeps the same meaning; encode independent concepts with distinct visual variables.
3. For presentation mode, make any ordinary screen click progress one cue. Pause after motion. Ignore duplicate next clicks while busy, cancel timers on previous/direct navigation, and render a complete current state with reduced motion. Do not turn a slide into a multi-click app workflow unless asked.
4. Keep observed evidence, hypotheses, concept screens and verified implementation separate. Cite experiment conditions and dates. Stars/installs are not users or quality. Never invent missing historical screens or statistics.
5. Inspect the changed scene first. Expand checks to all affected scenes when shared runtime/style/assets change. Follow [quality-checks](references/quality-checks.md) for release, and record what actually ran.
6. Build and test an offline standalone HTML. Keep editable source separately. Optimize large photos according to rendered size, preserve originals, and compare appearance. Do not blindly apply lossy compression to logos, text images or pixel sprites.

## Load only relevant references

- Visual/interaction decisions and reusable prompts: search [prompt-casebook](references/prompt-casebook.md) by topic, or inspect one entry in `data/changes.json`. The [web gallery](https://swaan-kim.github.io/html-pitch-artifacts-v2/) supplies actual before/after examples; the repository/offline-gallery package also has `index.html`. The smaller skill ZIP contains the reusable final source, not all archive downloads.
- Source conventions and selection/export boundaries: [scene-authoring](references/scene-authoring.md).
- Scope-aware reading and honest efficiency measurement: [context-efficiency](references/context-efficiency.md).
- Release, size, accessibility and offline checks: [quality-checks](references/quality-checks.md).
- Only when PDF is requested: [export-qa](references/export-qa.md), the retained fidelity-PDF scripts and Python requirements. HTML-only tasks do not need PDF output.

## Handoff

Provide the standalone HTML, editable ZIP and a concise summary of changes and real validation results. Keep historical snapshots immutable. Publishing, replacing an existing repository, or sharing private material needs authorization from the current task; the AutoPets publication authorization does not transfer to future users.
