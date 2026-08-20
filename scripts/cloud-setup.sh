#!/usr/bin/env bash
# Cloud-session setup for OpenMontage.
#
# Anthropic-hosted cloud containers ship without ffmpeg/ffprobe and without the
# project's Python dependencies, which makes every video tool in the registry
# report UNAVAILABLE. This script provisions both from PyPI (reachable on the
# Trusted network level) so a session starts production-ready.
#
# Use it as the environment's Setup script at claude.ai/code, or run it by hand.
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Python dependencies"
pip install -q -r requirements.txt

echo "==> ffmpeg / ffprobe"
# imageio-ffmpeg ships ffmpeg; ffmpeg-binaries ships both. Together they cover
# the tools that shell out to either binary by name.
pip install -q imageio-ffmpeg ffmpeg-binaries

FFMPEG_BIN="$(python3 -c 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())')"
FFPROBE_BIN="$(python3 -c 'import os, ffmpeg; print(os.path.join(os.path.dirname(ffmpeg.__file__), "binaries", "ffprobe"))')"

chmod +x "$FFMPEG_BIN" "$FFPROBE_BIN"
ln -sf "$FFMPEG_BIN"  /usr/local/bin/ffmpeg
ln -sf "$FFPROBE_BIN" /usr/local/bin/ffprobe

ffmpeg  -version | head -1
ffprobe -version | head -1

echo "==> Remotion composer"
if [ -d remotion-composer ] && [ ! -d remotion-composer/node_modules ]; then
  (cd remotion-composer && npm install --no-audit --no-fund --silent)
fi

echo "==> Setup complete"
