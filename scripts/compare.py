"""
Section-by-section fidelity check of the rendered build against the Canva export.

    pip install pillow numpy
    node scripts/shot.mjs      # produces .verify/build.png
    python3 scripts/compare.py

Prints mean absolute pixel difference per section plus the whole page, and
writes side-by-side strips to .verify/cmp/ so you can eyeball what moved.

Healthy baseline for the approved static recreation:
    page height 6520, overall diff ~2.6, no section above ~9.
A jump in one section means something in that section has shifted.
"""

import os
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF = os.path.join(ROOT, "1.png")
BUILD = os.path.join(ROOT, ".verify", "build.png")
OUT = os.path.join(ROOT, ".verify", "cmp")

# artboard row ranges, matching the section map in CLAUDE.md
SECTIONS = [
    ("hero", 0, 768),
    ("edit", 768, 1690),
    ("better", 1690, 2360),
    ("aura", 2360, 4160),
    ("snack", 4160, 5020),
    ("insta", 5020, 5682),
    ("footer", 5682, 6520),
]


def main() -> int:
    for path, what in ((REF, "reference"), (BUILD, "build")):
        if not os.path.exists(path):
            print(f"missing {what}: {path}")
            if path == BUILD:
                print("run `node scripts/shot.mjs` first")
            return 1

    ref_img = Image.open(REF).convert("RGB")
    bld_img = Image.open(BUILD).convert("RGB")

    print(f"reference {ref_img.size}   build {bld_img.size}")
    if ref_img.size != bld_img.size:
        print("  ! sizes differ — the page height or width has changed")
        print("    comparison below is clipped to the overlap")

    w = min(ref_img.width, bld_img.width)
    h = min(ref_img.height, bld_img.height)
    ref = np.asarray(ref_img).astype(np.int16)[:h, :w]
    bld = np.asarray(bld_img).astype(np.int16)[:h, :w]
    diff = np.abs(ref - bld).mean(axis=2)

    print(f"\nwhole page mean abs diff: {diff.mean():.2f}\n")
    print(f"  {'section':10s}{'rows':>14s}{'diff':>8s}")
    for name, y0, y1 in SECTIONS:
        if y0 >= h:
            continue
        band = diff[y0 : min(y1, h)]
        flag = "   <-- check" if band.mean() > 9 else ""
        print(f"  {name:10s}{f'{y0}-{y1}':>14s}{band.mean():8.2f}{flag}")

    os.makedirs(OUT, exist_ok=True)
    for name, y0, y1 in SECTIONS:
        if y0 >= h:
            continue
        y1 = min(y1, h)
        band_h = y1 - y0
        strip = Image.new("RGB", (w, band_h * 2 + 16), (255, 0, 255))
        strip.paste(ref_img.crop((0, y0, w, y1)), (0, 0))
        strip.paste(bld_img.crop((0, y0, w, y1)), (0, band_h + 16))
        scale = min(1.0, 1500 / strip.height)
        strip.resize((int(w * scale), int(strip.height * scale))).save(
            os.path.join(OUT, f"{name}.png")
        )

    print(f"\nside-by-side strips (reference above, build below): {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
