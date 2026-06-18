# Gilead Injection Site Reactions Atlas (website)

Static clinical morphology guide modeled on [kavitasarin.github.io/ISR](https://kavitasarin.github.io/ISR/). **Primary morphology** cards use photos, captions, and APA references from the workbook tab **Primary morphology - Website**. **Secondary morphology** matches the ISR layout and uses the **secondary morphology** tab.

## Regenerate from Excel

```bash
export GILEAD_ATLAS_XLSX="/Users/pkale/Downloads/Proposed Gilead Atlas - Draft #3 (3).xlsx"
# optional: export GILEAD_ATLAS_PDF="/path/to/companion.pdf"
python3 scripts/extract_gilead_atlas.py
```

To use the original atlas tab for primary instead of the website tab:

```bash
export GILEAD_PRIMARY_SOURCE=atlas
python3 scripts/extract_gilead_atlas.py
```

Requires `openpyxl` (`pip3 install openpyxl`).

## DAIDS grading tab

The **DAIDS criteria** (`#daids`), **CTCAE** (`#ctcae`), and **FDA Toxicity Grading Scale** (`#fda`) sections include interactive grading tables. Words that match an atlas morphology entry—primary features from **Primary morphology - Website** plus linked secondary terms (e.g. erythema, necrosis, edema)—are underlined; hover for photo + definition, click to jump to that card.

## Preview locally

```bash
python3 -m http.server 8765
```

Open [http://127.0.0.1:8765](http://127.0.0.1:8765).

## Deploy (GitHub Pages)

Push this repo to GitHub and enable Pages from the `main` branch (root folder), same as the upstream ISR project.
