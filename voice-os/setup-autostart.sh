#!/bin/bash

# Voice OS Autostart Installer for Linux (Fedora / GNOME)

AUTOSTART_DIR="$HOME/.config/autostart"
DESKTOP_FILE="$AUTOSTART_DIR/voice-os.desktop"
APP_BINARY="/home/mioynx/Documents/com_assis/voice-os/src-tauri/target/release/app"

mkdir -p "$AUTOSTART_DIR"

cat <<EOF > "$DESKTOP_FILE"
[Desktop Entry]
Type=Application
Name=Voice OS Assistant
Comment=Thai Voice Computer Control Assistant
Exec=$APP_BINARY
Icon=utilities-terminal
Terminal=false
Categories=Utility;System;
X-GNOME-Autostart-enabled=true
EOF

chmod +x "$DESKTOP_FILE"

echo "✅ ตั้งค่าเรียบร้อย! โปรแกรม Voice OS จะเปิดทำงานเบื้องหลังอัตโนมัติเมื่อเปิดเครื่องคอมพิวเตอร์"
