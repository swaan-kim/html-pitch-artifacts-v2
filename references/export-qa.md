# Export and QA Runbook

## Gate 1: Canonical source

- Confirm the user-approved HTML path.
- Compute the combined SHA-256 of the HTML entrypoint and every loaded local dependency; retain the per-file hashes.
- Use a fresh temporary capture directory; never reuse old page images.

## Gate 2: Browser preflight

Run `scripts/preflight.mjs` with the expected selector, page count, viewport, and required font.

The gate fails on:

- missing `prepareForExport()`;
- page-count mismatch;
- duplicate IDs or page IDs;
- broken images;
- required font unavailable;
- running animations after preparation;
- clipped text or annotated fit violations;
- text-based critical icons;
- external critical assets unless explicitly allowed.

Warnings require visual inspection and a written disposition; errors block export.

## Gate 3: Direct page capture

Run `scripts/export_fidelity_pdf.mjs`. It uses screen media, calls the HTML's export function, captures each page individually, and creates a font-independent image PDF.

Do not use a browser's print-media layout as the reference capture. Print CSS can change display, dimensions, animation declarations, and typography.

## Gate 4: PDF round trip

`scripts/verify_pdf.py` renders every final PDF page back to PNG and compares it with the direct browser capture.

Require:

- expected = selected = captured = PDF page count;
- zero missing or blank pages;
- zero PDF font resources for presentation-safe image PDFs;
- combined source SHA and every per-file hash match the current canonical artifact;
- per-page mean pixel difference below the configured tolerance;
- a generated contact sheet for deck-level visual review.

Inspect every page at full size when any page approaches the tolerance or contains a warning. A contact sheet alone is insufficient.

## Gate 5: Delivery

Deliver only outputs produced from the passing manifest. Keep the filename stable so the user does not open an older similarly named file. Report the page count, source hash prefix, and verification status.

## Stopping condition

One failed correction triggers a new diagnosis report. Two occurrences of the same unresolved failure class stop automated retries. Do not keep exporting, substitute a renderer, or change typography without evidence that the differing stage requires it.
