#!/usr/bin/env bash
set -euo pipefail

# Optional one-time Fedora setup for offline Thai speech in Yabo Desktop.
# Review before running. Downloads an open-source CLI and multilingual model.
echo "Installing offline Thai voice dependencies (Fedora)..."
sudo dnf install -y git cmake gcc gcc-c++ make ffmpeg curl

DATA_DIR="${XDG_DATA_HOME:-$HOME/.local/share}/yabo"
BIN_DIR="$HOME/.local/bin"
SRC_DIR="$DATA_DIR/whisper.cpp"
mkdir -p "$DATA_DIR" "$BIN_DIR"

if [ ! -d "$SRC_DIR/.git" ]; then
  git clone --depth 1 https://github.com/ggml-org/whisper.cpp.git "$SRC_DIR"
else
  git -C "$SRC_DIR" pull --ff-only
fi
cmake -S "$SRC_DIR" -B "$SRC_DIR/build" -DCMAKE_BUILD_TYPE=Release
cmake --build "$SRC_DIR/build" -j 2 --config Release
install -m 0755 "$SRC_DIR/build/bin/whisper-cli" "$BIN_DIR/whisper-cli"

MODEL="$DATA_DIR/ggml-base.bin"
if [ ! -s "$MODEL" ]; then
  echo "Downloading multilingual Whisper base model (~148 MB)..."
  curl --fail --location --retry 3 \
    "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin" \
    --output "$MODEL.part"
  mv "$MODEL.part" "$MODEL"
fi

echo "Ready: $BIN_DIR/whisper-cli"
echo "Model: $MODEL"
echo "To use Yabo, run: npm run desktop:dev"
echo "If recording fails, check your microphone via GNOME Settings > Sound > Input."
