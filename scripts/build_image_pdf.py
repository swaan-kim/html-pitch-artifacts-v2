#!/usr/bin/env python3
import argparse
from pathlib import Path
import re

from pypdf import PdfReader, PdfWriter
from pypdf.generic import DecodedStreamObject, NameObject
from reportlab.pdfgen import canvas


def parse_dimensions(value: str) -> tuple[float, float]:
    match = re.fullmatch(r"(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)", value)
    if not match:
        raise argparse.ArgumentTypeError("Expected WIDTHxHEIGHT")
    return float(match.group(1)), float(match.group(2))


parser = argparse.ArgumentParser(description="Build an image-only PDF from numbered PNG pages.")
parser.add_argument("--images-dir", required=True, type=Path)
parser.add_argument("--output", required=True, type=Path)
parser.add_argument("--expected-pages", required=True, type=int)
parser.add_argument("--page-points", required=True, type=parse_dimensions)
args = parser.parse_args()

images = sorted(args.images_dir.glob("page-*.png"))
if len(images) != args.expected_pages:
    raise RuntimeError(f"Expected {args.expected_pages} images, found {len(images)}")

args.output.parent.mkdir(parents=True, exist_ok=True)
page_width, page_height = args.page_points
pdf = canvas.Canvas(
    str(args.output),
    pagesize=(page_width, page_height),
    pageCompression=1,
    invariant=1,
)

for image_path in images:
    pdf.drawImage(
        str(image_path),
        0,
        0,
        width=page_width,
        height=page_height,
        preserveAspectRatio=False,
        mask="auto",
    )
    pdf.showPage()
pdf.save()

# ReportLab registers an unused default font. Remove it so the delivered PDF
# cannot substitute fonts in another viewer.
reader = PdfReader(str(args.output))
writer = PdfWriter()
for source_page in reader.pages:
    writer.add_page(source_page)
    page = writer.pages[-1]
    resources = page.get("/Resources")
    if resources:
        resources.pop(NameObject("/Font"), None)
    content = page.get_contents()
    if content is not None:
        data = re.sub(rb"\s*BT\s+/F1\s+12\s+Tf\s+14\.4\s+TL\s+ET\s*", b"\n", content.get_data())
        stream = DecodedStreamObject()
        stream.set_data(data)
        page[NameObject("/Contents")] = writer._add_object(stream)

temporary = args.output.with_suffix(".fontless.pdf")
with temporary.open("wb") as handle:
    writer.write(handle)
temporary.replace(args.output)
