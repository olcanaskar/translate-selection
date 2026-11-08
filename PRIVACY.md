# Translate Selection — Privacy Policy

**Effective date:** November 8, 2026

Translate Selection is an independent browser extension that translates text
selected by the user into a small card on the same page. It is not affiliated
with, endorsed by, or an official product of Google.

## Data the extension processes

- **Selected text.** When you select text and explicitly ask for a translation
  (by clicking the Translate button, using the keyboard shortcut, or using the
  context menu), the selected text is sent over HTTPS to Google's translation
  service (`translate.googleapis.com`) to produce the translation and
  alternative meanings. The extension does not store the selected text on any
  server operated by the developer.
- **Settings.** Your target language and automatic-open preference are stored
  using `chrome.storage.sync`. If you are signed in to a browser account,
  browser settings sync may store these preferences in your account. They are
  used only to remember your choices.
- **No analytics, ads, accounts, or tracking.** The extension does not collect
  analytics, advertising identifiers, browsing history, page URLs, cookies, or
  account credentials for the developer.

## How the data is used

Selected text is used only to request the translation and dictionary result
that you asked for. Settings are used only to apply your chosen language and
behavior.

## Third-party service

Translation requests are sent to Google Translate, a service provided by
Google. Google's handling of data is described in
[Google's privacy policy](https://policies.google.com/privacy). The developer
does not sell data or share it with any party other than this translation
service as necessary to provide the feature.

## Permissions

- **All websites:** a content script displays the Translate button and in-page
  card on pages where you select text. The extension does not read page content
  unless you select text and request a translation.
- **Storage:** saves your target language and automatic-open preference.
- **Context menus:** adds the "Translate selected text" option to the
  right-click menu.
- **translate.googleapis.com:** sends the selected text to Google Translate to
  obtain the translation.

## Retention and control

The extension does not retain selected text. Settings remain in browser storage
until you change them or uninstall the extension. Translation requests are
handled by Google according to Google's policies and retention practices. You
can avoid sending sensitive text by not selecting it and requesting a
translation; you can uninstall the extension at any time.

## Security

Translation requests are made over HTTPS. No method of transmission over the
internet is completely secure, so avoid translating highly sensitive
information.

## Children

The extension is not directed to children under 13 and does not knowingly
collect personal information from children.

## Limited Use

The use of information received from Google APIs will adhere to the Chrome Web
Store User Data Policy, including the Limited Use requirements.

## Changes to this policy

This policy may be updated when the extension's data practices change. The
effective date at the top of this page will be updated accordingly.

## Contact

For privacy questions, open an issue at
[github.com/olcanaskar/translate-selection/issues](https://github.com/olcanaskar/translate-selection/issues)
or email [aabdullaholcan@gmail.com](mailto:aabdullaholcan@gmail.com).
