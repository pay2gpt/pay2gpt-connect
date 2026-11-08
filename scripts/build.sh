#!/bin/sh
# dist/store: the files the Chrome Web Store gets, zipped as dist/pay2gpt-connect-<version>.zip.
# dist/dev:   the same extension that also runs on http://localhost and 127.0.0.1, for testing against a local
#             pay2gpt.com server. Load it with chrome://extensions → Load unpacked. Never upload it.
set -eu
cd "$(dirname "$0")/.."
rm -rf dist && mkdir -p dist/store
cp -R manifest.json background.js content.js popup.html popup.css popup.js icons fonts _locales dist/store/
version=$(python3 -c 'import json; print(json.load(open("manifest.json"))["version"])')
(cd dist/store && zip -qr "../pay2gpt-connect-$version.zip" .)

cp -R dist/store dist/dev
python3 - <<'PY'
import json
path = "dist/dev/manifest.json"
manifest = json.load(open(path))
manifest["content_scripts"][0]["matches"] += ["http://localhost/*", "http://127.0.0.1/*"]
manifest["host_permissions"] += ["http://localhost/*", "http://127.0.0.1/*"]
manifest["name"] = "Pay2GPT Connect (dev)"
json.dump(manifest, open(path, "w"), ensure_ascii=False, indent=2)
PY
echo "dist/pay2gpt-connect-$version.zip and dist/dev"
