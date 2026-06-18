#!/bin/bash
# Fixes the live site by replacing the flat browser upload with the full project layout.
set -e
cd "$(dirname "$0")"

echo "Pushing correct site (data/, assets/, etc.) to GitHub..."
/usr/bin/git push --force-with-lease origin main

echo ""
echo "Done. Wait 1–2 minutes, then open:"
echo "  https://priyakale2019.github.io/gilead-atlas/"
echo ""
echo "Check this URL returns 200 (not 404):"
echo "  https://priyakale2019.github.io/gilead-atlas/data/lesions.js"
