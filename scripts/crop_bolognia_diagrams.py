"""
Crop Bolognia TABLE 3.1 diagram column (center slice) per lesion row from PSK PNGs.
Panels: 0 = macule/patch, 1 = papule/plaque/nodule/vesicle, 2 = bulla/pustule/wheal/abscess.
Horizontal slice tuned for 600px-wide figures (text | diagram | photo).

Downloads panels if missing. Run: python scripts/crop_bolognia_diagrams.py
"""
from __future__ import annotations

import urllib.request
from pathlib import Path

from PIL import Image, ImageOps

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

# Diagram band within 600px-wide art (empirically tuned for PSK exports)
DIAG_X0 = 178
DIAG_X1 = 398


def load_panel(idx: int) -> Image.Image:
    p = SCRIPTS / f"_psk_panel_{idx}.png"
    if not p.exists():
        url = PSK_URLS[idx]
        data = urllib.request.urlopen(
            urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=45
        ).read()
        p.write_bytes(data)
    return Image.open(p).convert("RGB")


def crop_row(im: Image.Image, row: int, rows: int) -> Image.Image:
    h = im.height
    row_h = h // rows
    y0 = row * row_h
    y1 = (row + 1) * row_h if row < rows - 1 else h
    return im.crop((DIAG_X0, y0, DIAG_X1, y1))


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
        # Horizontal mirror restores left–right orientation to match the print/Bolognia layout.
        crop = ImageOps.mirror(crop)
        dest = OUT / f"{ident}.png"
        crop.save(dest, optimize=True)
        print(dest, crop.size)

    crop = ImageOps.mirror(crop_row(panels[0], 0, 2))
    crop.save(OUT / "_default.png", optimize=True)
    print(OUT / "_default.png", crop.size)


if __name__ == "__main__":
    main()
