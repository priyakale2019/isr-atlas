"""
Crop Bolognia TABLE 3.1 diagram illustrations (no text) per lesion row from PSK PNGs.
Panels: 0 = macule/patch, 1 = papule/plaque/nodule/vesicle, 2 = bulla/pustule/wheal/abscess.

Each output is the 3D skin block centered on a square canvas matching the flip-card back.

Downloads panels if missing. Run: python scripts/crop_bolognia_diagrams.py
"""
from __future__ import annotations

import urllib.request
from pathlib import Path

from PIL import Image

PSK_URLS = [
    "https://plasticsurgerykey.com/wp-content/uploads/2016/04/B9781455726387000031_t0010_group0-0.png",
    "https://plasticsurgerykey.com/wp-content/uploads/2016/04/B9781455726387000031_t0010_group0-1.png",
    "https://plasticsurgerykey.com/wp-content/uploads/2016/04/B9781455726387000031_t0010_group0-2.png",
]

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "bolognia-crops"
SCRIPTS = Path(__file__).resolve().parent

# (panel_file_stem, row_index_0based) — row order matches Plastic Surgery Key figures
PRIMARY_ROWS: dict[str, tuple[int, int]] = {
    "macule": (0, 0),
    "patch": (0, 1),
    "papule": (1, 0),
    "plaque": (1, 1),
    "nodule": (1, 2),
    "vesicle": (1, 3),
    "bulla": (2, 0),
    "pustule": (2, 1),
    "wheal": (2, 2),
    "abscess": (2, 3),
    # Not on this table — nearest visual analogues
    "ulcer": (2, 3),  # abscess / deep tissue
    "phlebitis": (1, 2),  # nodule / deep
    "ecchymosis": (0, 1),  # patch-like color change
}

# Secondary morphology: reuse closest primary diagram
SECONDARY_ROWS: dict[str, tuple[int, int]] = {
    "erythema": (0, 1),
    "color": (0, 0),
    "necrosis": (2, 3),
    "drainage": (2, 1),
    "edema": (2, 2),
    "induration": (1, 2),
    "hyperpigmentation": (0, 0),
    "hypopigmentation": (0, 1),
    "annular": (1, 1),
    "atrophy": (1, 3),
    "crust": (2, 1),
    "erosion": (1, 3),
    "scar": (1, 2),
}

# Diagram column within 600px-wide PSK panels (text | examples | diagram | photo).
DIAG_X0 = 265
DIAG_X1 = 418
ROW_TRIM_TOP = 12
ROW_TRIM_BOTTOM = 4
ILLUSTRATION_ROW_THRESH = 35
CONTENT_MARGIN = 6
CANVAS_PADDING = 22
CANVAS_FILL = (238, 242, 247)  # matches .figure-face--back background


def load_panel(idx: int) -> Image.Image:
    p = SCRIPTS / f"_psk_panel_{idx}.png"
    if not p.exists():
        url = PSK_URLS[idx]
        data = urllib.request.urlopen(
            urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=45
        ).read()
        p.write_bytes(data)
    return Image.open(p).convert("RGB")


def _is_illustration_pixel(p: tuple[int, ...]) -> bool:
    r, g, b = p[:3]
    if max(r, g, b) < 120:
        return False
    if r < 95 and g < 95 and b < 95:
        return False
    if r > 228 and g > 232 and b > 236:
        return False
    if abs(r - g) < 12 and abs(g - b) < 12 and r > 205:
        return False
    return True


def _row_illustration_counts(band: Image.Image) -> list[int]:
    px = band.load()
    w, h = band.size
    return [sum(1 for x in range(w) if _is_illustration_pixel(px[x, y])) for y in range(h)]


def _main_vertical_span(counts: list[int], thresh: int = ILLUSTRATION_ROW_THRESH) -> tuple[int, int]:
    best = (0, len(counts), 0)
    start: int | None = None
    for y, count in enumerate(counts):
        if count >= thresh:
            if start is None:
                start = y
        elif start is not None:
            score = sum(counts[start:y])
            if score > best[2]:
                best = (start, y, score)
            start = None
    if start is not None:
        score = sum(counts[start:])
        if score > best[2]:
            best = (start, len(counts), score)
    return best[0], best[1]


def _illustration_bbox(im: Image.Image) -> tuple[int, int, int, int]:
    px = im.load()
    w, h = im.size
    minx, miny, maxx, maxy = w, h, 0, 0
    found = False
    for y in range(h):
        for x in range(w):
            if _is_illustration_pixel(px[x, y]):
                found = True
                minx = min(minx, x)
                miny = min(miny, y)
                maxx = max(maxx, x)
                maxy = max(maxy, y)
    if not found:
        return 0, 0, w, h
    return minx, miny, maxx + 1, maxy + 1


def _center_on_square(content: Image.Image) -> Image.Image:
    side = max(content.size) + CANVAS_PADDING * 2
    canvas = Image.new("RGB", (side, side), CANVAS_FILL)
    ox = (side - content.width) // 2
    oy = (side - content.height) // 2
    canvas.paste(content, (ox, oy))
    return canvas


def crop_row(im: Image.Image, row: int, rows: int) -> Image.Image:
    h = im.height
    row_h = h // rows
    y0 = row * row_h
    y1 = (row + 1) * row_h if row < rows - 1 else h
    if row > 0:
        y0 = max(0, y0 - ROW_TRIM_TOP)
    if row < rows - 1:
        y1 = min(h, y1 + ROW_TRIM_BOTTOM)

    band = im.crop((DIAG_X0, y0, DIAG_X1, y1))
    vy0, vy1 = _main_vertical_span(_row_illustration_counts(band))
    band = band.crop((0, vy0, band.width, vy1))

    bx0, by0, bx1, by1 = _illustration_bbox(band)
    m = CONTENT_MARGIN
    content = band.crop(
        (
            max(0, bx0 - m),
            max(0, by0 - m),
            min(band.width, bx1 + m),
            min(band.height, by1 + m),
        )
    )
    return _center_on_square(content)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    panels = {0: load_panel(0), 1: load_panel(1), 2: load_panel(2)}
    rows_per_panel = {0: 2, 1: 4, 2: 4}

    for ident, (pi, ri) in {**PRIMARY_ROWS, **SECONDARY_ROWS}.items():
        im = panels[pi]
        rows = rows_per_panel[pi]
        if ri >= rows:
            raise ValueError(ident, pi, ri)
        crop = crop_row(im, ri, rows)
        dest = OUT / f"{ident}.png"
        crop.save(dest, optimize=True)
        print(dest, crop.size)

    crop = crop_row(panels[0], 0, 2)
    crop.save(OUT / "_default.png", optimize=True)
    print(OUT / "_default.png", crop.size)


if __name__ == "__main__":
    main()
