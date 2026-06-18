# Deploy to GitHub Pages

Your site will be live at:

**https://priyakale2019.github.io/gilead-atlas/**

## One-time setup

1. Create an empty repository on GitHub (no README):
   https://github.com/new?name=gilead-atlas&owner=priyakale2019

2. In Terminal, from this folder:

```bash
cd /Users/pkale/gilead-atlas

# Push (use HTTPS or SSH — whichever you normally use for GitHub)
git push -u origin main
```

If `origin` is missing:

```bash
git remote add origin https://github.com/priyakale2019/gilead-atlas.git
git push -u origin main
```

Or with SSH:

```bash
git remote set-url origin git@github.com:priyakale2019/gilead-atlas.git
git push -u origin main
```

3. Enable Pages: repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.

   The included workflow (`.github/workflows/pages.yml`) deploys on every push to `main`.

## After deploy

Share:

- Home: https://priyakale2019.github.io/gilead-atlas/
- DAIDS: https://priyakale2019.github.io/gilead-atlas/#daids
- CTCAE: https://priyakale2019.github.io/gilead-atlas/#ctcae
- FDA: https://priyakale2019.github.io/gilead-atlas/#fda

Updates: edit the workbook, run `python3 scripts/extract_gilead_atlas.py`, commit, and `git push`.
