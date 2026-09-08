#!/usr/bin/env bash
# Install Lato (Light/Regular/Bold/Black) as a system font for Remotion renders.
#
# Remotion renders in headless Chromium. On hosts behind a TLS-inspecting proxy,
# a fonts.googleapis.com <link> fails silently and compositions re-typeset in a
# fallback face; loading woff2 through FontFace + delayRender() hangs the
# renderer instead. Installing the family via fontconfig removes the problem at
# the source: the composition just names "Lato" and Chromium resolves it locally.
#
# Google serves Lato only as woff/woff2, which fontconfig cannot read, so we
# convert to TTF and rewrite the name table — otherwise weights 300 and 900 land
# under the separate families "Lato Light"/"Lato Black" and CSS font-weight on
# family "Lato" synthesises them instead of using the real cuts.
set -euo pipefail

DEST=${DEST:-/usr/share/fonts/truetype/lato}
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

python3 -c "import fontTools, brotli" 2>/dev/null || pip install -q fonttools brotli

UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
for w in 300 400 700 900; do
  url=$(curl -sS -H "User-Agent: $UA" \
    "https://fonts.googleapis.com/css2?family=Lato:wght@${w}&display=swap" \
    | grep -oE "https://fonts.gstatic.com[^)]+" | tail -1)
  [ -n "$url" ] || { echo "could not resolve Lato $w" >&2; exit 1; }
  curl -sS -o "$WORK/lato-$w.woff2" "$url"
done

python3 - "$WORK" <<'PY'
import sys
from fontTools.ttLib import TTFont

work = sys.argv[1]
SUB = {300: "Light", 400: "Regular", 700: "Bold", 900: "Black"}
# Legacy name IDs 1/2 must stay within the 4-style RIBBI model that old
# rasterisers assume; IDs 16/17 carry the real typographic family and style.
LEGACY_FAMILY = {300: "Lato Light", 400: "Lato", 700: "Lato", 900: "Lato Black"}
LEGACY_STYLE = {300: "Regular", 400: "Regular", 700: "Bold", 900: "Regular"}

for w, sub in SUB.items():
    font = TTFont(f"{work}/lato-{w}.woff2")
    font.flavor = None
    font["OS/2"].usWeightClass = w
    name = font["name"]
    for platform_id, encoding_id, lang_id in ((3, 1, 0x409), (1, 0, 0)):
        name.setName(LEGACY_FAMILY[w], 1, platform_id, encoding_id, lang_id)
        name.setName(LEGACY_STYLE[w], 2, platform_id, encoding_id, lang_id)
        name.setName(f"Lato {sub}", 4, platform_id, encoding_id, lang_id)
        name.setName(f"Lato-{sub}", 6, platform_id, encoding_id, lang_id)
        name.setName("Lato", 16, platform_id, encoding_id, lang_id)
        name.setName(sub, 17, platform_id, encoding_id, lang_id)
    font.save(f"{work}/Lato-{sub}.ttf")
PY

sudo mkdir -p "$DEST"
sudo cp "$WORK"/Lato-*.ttf "$DEST/"
sudo fc-cache -f >/dev/null
fc-list | grep -i lato
