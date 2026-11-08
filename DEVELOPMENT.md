# Translate Selection — Development

This document is for contributors. End-user installation instructions are in
[README.md](README.md).

## Stack

- Manifest V3 Chrome extension
- Plain JavaScript, no build step and no npm dependencies
- Shadow DOM UI for the in-page button and translation card
- Google Translate's public `translate_a/single` endpoint

## Files

- `manifest.json` — extension definition and permissions
- `background.js` — translation requests, dictionary parsing, context menu,
  keyboard shortcut, options page action
- `content.js` — selection detection, in-page button/card, target-language
  selector, alternative meanings, Shadow DOM styles
- `languages.js` — shared alphabetically sorted language list
- `options.html`, `options.css`, `options.js` — settings page
- `icons/` — extension icons
- `assets/` — screenshots used by the README
- `PRIVACY.md` — privacy policy
- `test/harness.html` — UI test page that calls the real endpoint with a local
  fallback
- `test/live.html` — end-to-end test page when the real extension is loaded
- `test/live-csp.html` — strict-CSP rendering test
- `tools/make-icons.ps1` — regenerates icons
- `tools/build-release.ps1` — builds the clean release ZIP

## Translation flow

1. A `mouseup`/selection event finds the selected text and its viewport
   position.
2. The content script asks the background service worker to translate it.
3. The background requests:

   ```text
   https://translate.googleapis.com/translate_a/single
     ?client=gtx&sl=auto&tl=<target>&dt=t[&dt=bd]&q=<text>
   ```

   `dt=bd` is added only for single-word selections; it provides dictionary
   entries grouped by part of speech.
4. The primary translation is rendered first. For single words, dictionary
   alternatives are filtered (duplicate and source-word entries removed) and
   rendered under **Other meanings**.
5. If the first request is slow, a second request starts after 1.2 seconds;
   whichever resolves first wins and the other is aborted.

The endpoint is not officially documented by Google. It may change or be
restricted. A long-term production version should move to an officially
supported translation API behind a backend so credentials are not embedded in
the extension.

## Permissions

- `storage` — target language and auto-open settings
- `contextMenus` — "Translate selected text" right-click item
- `https://translate.googleapis.com/*` — translation requests
- Content script on all sites — display the button/card on any page where the
  user selects text

The content script does not collect page content, URLs, or browsing history.
Only user-selected text is sent, and only when a translation is requested.

## Local testing

1. Open `brave://extensions` (or `chrome://extensions`).
2. Enable Developer mode.
3. Load unpacked → select this repository folder.
4. Refresh open tabs after code changes; click the extension reload button after
   changing `background.js` or the manifest.

Syntax check:

```powershell
node --check background.js
node --check content.js
node --check languages.js
node --check options.js
```

UI harness:

```powershell
python -m http.server 8765
```

- `http://127.0.0.1:8765/test/harness.html` — calls the real endpoint and falls
  back to local sample data
- `http://127.0.0.1:8765/test/live.html` — real extension, real translations
- `http://127.0.0.1:8765/test/live-csp.html` — strict CSP check

## Release

1. Update `version` in `manifest.json` and the version shown in
   `options.html`.
2. Commit and push.
3. Build the clean package (runtime files only, `manifest.json` at ZIP root):

   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File tools/build-release.ps1
   ```

4. Create a GitHub release and upload both:
   - `dist/translate-selection-<version>.zip`
   - `dist/translate-selection.zip` (stable asset name for the
     `/releases/latest/download/translate-selection.zip` link)

The stable download link in the README points at the latest release asset.

## License

MIT
