# Chrome Web Store submission — Translate Selection

Version: **1.3.6**

Upload package: `store/translate-selection-1.3.6.zip`

## Store listing

**Name**

Translate Selection

**Summary (max 132 characters)**

Translate selected text in a small in-page card. See other meanings and switch target languages instantly.

**Detailed description**

Translate Selection is a lightweight browser extension that translates text you
select without opening a new tab. A small Translate button appears next to your
selection; clicking it opens a compact translation card on the same page.

Features:
• In-page translation card with the original text and translation
• Other meanings for single words, grouped by part of speech
• Quick target-language dropdown with about 60 languages
• Copy, open in Google Translate, close, and retry actions
• Ctrl + Shift + Y shortcut (Command + Shift + Y on macOS)
• Right-click menu item for selected text
• Light and dark theme support
• Turkish is the default target language; the interface is English

How to use:
1. Select text on any web page.
2. Click Translate next to the selection, press Ctrl + Shift + Y, or use the
   right-click menu.
3. Change the target language from the card or the extension settings.

Translate Selection is an independent project and is not affiliated with,
endorsed by, or an official product of Google. Translation is provided by
Google Translate; an internet connection is required.

Privacy: selected text is sent to Google Translate only when you request a
translation. The extension does not collect analytics, browsing history, or
account data. See the privacy policy for details.

**Category**

Productivity

**Language**

English

**Homepage URL**

https://github.com/olcanaskar/translate-selection

**Support URL**

https://github.com/olcanaskar/translate-selection/issues

**Privacy policy URL**

https://olcanaskar.github.io/translate-selection/privacy.html

## Images

- Store icon: `icons/icon128.png` (included in the ZIP)
- Screenshot 1 (dark): `store/screenshot-1-1280x800.png`
- Screenshot 2 (light): `store/screenshot-2-1280x800.png`
- Optional small promo tile: not supplied
- Screenshots are 1280x800, full bleed, no padding.

## Privacy practices tab

**Single purpose**

Translate text that the user selects on a web page into the user's chosen
language and display the result in a small in-page card.

**Permission justifications**

- `storage`: Saves the target language and the "open automatically" preference.
- `contextMenus`: Adds the "Translate selected text" item to the right-click
  menu.
- Host permission for `https://translate.googleapis.com/*`: Sends the selected
  text to Google Translate and receives the translation and dictionary result.
- Content script on all websites (`<all_urls>`): Displays the Translate button
  and translation card next to the user's selection on any page. The script
  does not read page content unless the user selects text and requests a
  translation.

**Remote code**

No, this extension does not use remote code.

**Data usage**

- Website content: selected text is transmitted to Google Translate only after
  the user explicitly requests a translation. The developer does not store it.
- No analytics, advertising, browsing history, location, health, financial, or
  authentication data is collected by the extension.
- Settings (target language and auto-open) are stored in `chrome.storage.sync`.

Certify all Limited Use statements. The privacy policy includes:

> The use of information received from Google APIs will adhere to the Chrome
> Web Store User Data Policy, including the Limited Use requirements.

**Data handling summary for reviewers**

- No login or test account is required.
- Test: install the extension, open any page, select a word, click Translate,
  then change the target language in the card.
- Network access to `translate.googleapis.com` is required for translations.
- If the translation endpoint is unreachable, the card shows an error and a
  retry action.

## Before submitting

- [ ] Chrome Web Store developer account registered and email verified
- [ ] 2-Step Verification enabled on the Google account
- [ ] Privacy policy URL is publicly reachable
- [ ] Store screenshot uploaded at 1280x800
- [ ] Store package uploaded (manifest at ZIP root)
- [ ] Version in `manifest.json` matches the uploaded package
- [ ] Privacy practices and permission justifications completed
- [ ] Distribution set to Public and desired regions
- [ ] Submit for review

## Risks / notes

- The extension uses Google's public, undocumented
  `translate.googleapis.com/translate_a/single` endpoint. It works today but is
  not guaranteed to remain available. A long-term commercial release should
  consider an officially supported translation API with a restricted backend.
- The content script requires access to all websites to show the in-page
  button. Reviewers may ask for the justification above; it is necessary for the
  core feature.
- Store review times vary. New developer accounts may take longer.
