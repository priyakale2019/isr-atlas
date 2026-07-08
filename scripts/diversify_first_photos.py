"""
Ensure each morphology category shows a distinct first photo on the site.

When multiple categories share the same lead image, rotates that category's
photo list so the first unused image is shown first.

Usage:
  python scripts/diversify_first_photos.py
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESIONS_PATH = ROOT / "data" / "lesions.js"


def reorder_first_unique(entries: list[dict]) -> list[dict]:
    used: set[str] = set()
    plans: list[tuple[int, dict, list[dict], list[str]]] = []

    for idx, entry in enumerate(entries):
        shots = entry.get("images", []) + entry.get("gallery", [])
        urls: list[str] = []
        seen: set[str] = set()
        for shot in shots:
            if shot["url"] not in seen:
                urls.append(shot["url"])
                seen.add(shot["url"])
        plans.append((idx, entry, shots, urls))

    # Assign constrained categories (fewer unique options) before flexible ones.
    plans.sort(key=lambda item: (len(item[3]), -len(item[2])))

    new_shots_by_idx: dict[int, list[dict]] = {}
    for idx, _entry, shots, urls in plans:
        if not shots:
            new_shots_by_idx[idx] = []
            continue
        pick = next((url for url in urls if url not in used), urls[0])
        used.add(pick)
        start = next(i for i, shot in enumerate(shots) if shot["url"] == pick)
        new_shots_by_idx[idx] = shots[start:] + shots[:start]

    updated: list[dict] = []
    for idx, entry in enumerate(entries):
        shots = new_shots_by_idx[idx]
        entry = dict(entry)
        if shots:
            entry["images"] = [shots[0]]
            entry["gallery"] = shots[1:]
        else:
            entry["images"] = []
            entry["gallery"] = entry.get("gallery", [])
        updated.append(entry)
    return updated


def main() -> None:
    text = LESIONS_PATH.read_text(encoding="utf-8")
    if not text.startswith("window.LESION_DATA"):
        raise SystemExit("Unexpected lesions.js format")
    data = json.loads(text.split("=", 1)[1].strip().rstrip(";"))

    combined = data["primaryLesions"] + data["secondaryLesions"]
    reordered = reorder_first_unique(combined)
    data["primaryLesions"] = reordered[: len(data["primaryLesions"])]
    data["secondaryLesions"] = reordered[len(data["primaryLesions"]) :]

    out = "window.LESION_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n"
    LESIONS_PATH.write_text(out, encoding="utf-8")
    print(f"Updated {LESIONS_PATH}")


if __name__ == "__main__":
    main()
