#!/usr/bin/env python3
import argparse
import hashlib
import json
import math
from pathlib import Path
import shutil
import subprocess
import tempfile

from PIL import Image, ImageChops, ImageDraw, ImageStat
from pypdf import PdfReader


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def font_resource_count(reader: PdfReader) -> int:
    total = 0
    for page in reader.pages:
        resources = page.get("/Resources")
        if not resources:
            continue
        resources = resources.get_object()
        fonts = resources.get("/Font")
        if fonts:
            total += len(fonts.get_object())
    return total


def compare_images(reference: Path, rendered: Path) -> dict:
    with Image.open(reference).convert("RGB") as ref, Image.open(rendered).convert("RGB") as got:
        if got.size != ref.size:
            got = got.resize(ref.size, Image.Resampling.LANCZOS)
        difference = ImageChops.difference(ref, got)
        stats = ImageStat.Stat(difference)
        mean_abs = sum(stats.mean) / len(stats.mean)
        grayscale = difference.convert("L")
        histogram = grayscale.histogram()
        changed = sum(histogram[13:])
        changed_ratio = changed / (ref.width * ref.height)
        rendered_stddev = sum(ImageStat.Stat(got).stddev) / 3
        reference_stddev = sum(ImageStat.Stat(ref).stddev) / 3
        return {
            "width": ref.width,
            "height": ref.height,
            "meanAbsoluteDifference": mean_abs,
            "changedPixelRatioOver12": changed_ratio,
            "referenceStddev": reference_stddev,
            "renderedStddev": rendered_stddev,
        }


def make_contact_sheet(images: list[Path], output: Path) -> None:
    opened = [Image.open(path).convert("RGB") for path in images]
    try:
        columns = min(4, max(1, math.ceil(math.sqrt(len(opened)))))
        rows = math.ceil(len(opened) / columns)
        thumb_width = 400
        sample_ratio = opened[0].height / opened[0].width
        thumb_height = round(thumb_width * sample_ratio)
        label_height = 28
        sheet = Image.new("RGB", (columns * thumb_width, rows * (thumb_height + label_height)), "white")
        draw = ImageDraw.Draw(sheet)
        for index, image in enumerate(opened):
            thumb = image.copy()
            thumb.thumbnail((thumb_width, thumb_height), Image.Resampling.LANCZOS)
            x = (index % columns) * thumb_width
            y = (index // columns) * (thumb_height + label_height)
            sheet.paste(thumb, (x, y))
            draw.text((x + 8, y + thumb_height + 6), f"Page {index + 1}", fill="black")
        output.parent.mkdir(parents=True, exist_ok=True)
        sheet.save(output)
    finally:
        for image in opened:
            image.close()


parser = argparse.ArgumentParser(description="Round-trip and compare an image PDF against browser captures.")
parser.add_argument("--pdf", required=True, type=Path)
parser.add_argument("--reference-dir", required=True, type=Path)
parser.add_argument("--expected-pages", required=True, type=int)
parser.add_argument("--report", required=True, type=Path)
parser.add_argument("--contact-sheet", required=True, type=Path)
parser.add_argument("--source", type=Path)
parser.add_argument("--manifest", type=Path)
parser.add_argument("--max-mean-diff", type=float, default=5.0)
parser.add_argument("--expect-image-only", action="store_true")
args = parser.parse_args()

errors: list[dict] = []
warnings: list[dict] = []
references = sorted(args.reference_dir.glob("page-*.png"))
if len(references) != args.expected_pages:
    errors.append({"code": "reference-count", "message": f"Expected {args.expected_pages} captures, found {len(references)}."})

reader = PdfReader(str(args.pdf))
if len(reader.pages) != args.expected_pages:
    errors.append({"code": "pdf-page-count", "message": f"Expected {args.expected_pages} PDF pages, found {len(reader.pages)}."})

fonts = font_resource_count(reader)
if args.expect_image_only and fonts:
    errors.append({"code": "pdf-font-resources", "message": f"Image-only PDF contains {fonts} font resources."})

if args.source and args.manifest:
    manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
    source_files = manifest.get("sourceFiles") or []
    if source_files:
        for entry in source_files:
            source_path = Path(entry["path"])
            if not source_path.is_file():
                errors.append({"code": "source-file-missing", "message": f"Manifest source file is missing: {source_path}"})
            elif sha256(source_path) != entry.get("sha256"):
                errors.append({"code": "source-file-hash", "message": f"Manifest source file changed after capture: {source_path}"})
    else:
        current_hash = sha256(args.source)
        if manifest.get("sourceSha256") != current_hash:
            errors.append({"code": "source-hash", "message": "Manifest source hash does not match the current HTML."})

rendered_paths: list[Path] = []
comparisons: list[dict] = []
pdftoppm = shutil.which("pdftoppm")
if not pdftoppm:
    errors.append({"code": "missing-poppler", "message": "pdftoppm is required for PDF round-trip verification."})
elif references and len(reader.pages) == args.expected_pages:
    with tempfile.TemporaryDirectory(prefix="html-pitch-pdf-") as temporary:
        temporary_path = Path(temporary)
        for index, reference in enumerate(references, start=1):
            with Image.open(reference) as image:
                width, height = image.size
            prefix = temporary_path / f"rendered-{index:03d}"
            subprocess.run(
                [
                    pdftoppm,
                    "-png",
                    "-f",
                    str(index),
                    "-l",
                    str(index),
                    "-singlefile",
                    "-scale-to-x",
                    str(width),
                    "-scale-to-y",
                    str(height),
                    str(args.pdf),
                    str(prefix),
                ],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.PIPE,
            )
            rendered = prefix.with_suffix(".png")
            comparison = compare_images(reference, rendered)
            comparison["page"] = index
            comparisons.append(comparison)
            if comparison["meanAbsoluteDifference"] > args.max_mean_diff:
                errors.append({
                    "code": "visual-difference",
                    "page": index,
                    "message": f"Mean pixel difference {comparison['meanAbsoluteDifference']:.3f} exceeds {args.max_mean_diff:.3f}.",
                })
            if comparison["renderedStddev"] < 0.5 and comparison["referenceStddev"] > 2:
                errors.append({"code": "blank-page", "page": index, "message": "Rendered PDF page appears blank."})
            persistent = args.report.parent / "rendered-pages" / f"page-{index:03d}.png"
            persistent.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(rendered, persistent)
            rendered_paths.append(persistent)

if rendered_paths:
    make_contact_sheet(rendered_paths, args.contact_sheet)

report = {
    "status": "failed" if errors else "passed",
    "pdf": str(args.pdf.resolve()),
    "pdfSha256": sha256(args.pdf),
    "expectedPages": args.expected_pages,
    "pdfPages": len(reader.pages),
    "fontResources": fonts,
    "maxMeanDifference": args.max_mean_diff,
    "comparisons": comparisons,
    "errors": errors,
    "warnings": warnings,
}
args.report.parent.mkdir(parents=True, exist_ok=True)
args.report.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"status": report["status"], "errors": len(errors), "report": str(args.report)}))
if errors:
    raise SystemExit(1)
