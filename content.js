(() => {
  'use strict';

  if (window.top !== window) return;
  if (window.__seciliCeviriLoaded) return;
  window.__seciliCeviriLoaded = true;

  const MAX_SELECTION = 1500;
  const DEFAULTS = { targetLang: 'tr', autoTranslate: false };
  const LANGUAGES = globalThis.SECILI_CEVIRI_LANGUAGES || [{ code: 'tr', name: 'Turkish' }];
  const LANGUAGE_NAMES = Object.fromEntries(
    LANGUAGES.map(({ code, name }) => [code, name])
  );

  const GLOBE_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z"></path></svg>';
  const COPY_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15V5a2 2 0 0 1 2-2h10"></path></svg>';
  const OPEN_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6"></path><path d="M20 4 11 13"></path><path d="M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"></path></svg>';
  const CLOSE_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 6 12 12"></path><path d="M18 6 6 18"></path></svg>';
  const CHECK_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7"></path></svg>';

  const SHADOW_CSS = `
    :host {
      all: initial;
    }

    * {
      box-sizing: border-box;
    }

    .st-trigger,
    .st-card {
      position: fixed;
      z-index: 1;
      font-family: "Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .st-trigger[hidden],
    .st-card[hidden],
    .st-alts[hidden] {
      display: none !important;
    }

    .st-trigger {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      height: 30px;
      padding: 0 10px 0 8px;
      border: 0;
      border-radius: 999px;
      background: #1a73e8;
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      line-height: 1;
      letter-spacing: 0.01em;
      box-shadow: 0 2px 8px rgba(26, 115, 232, 0.35), 0 1px 2px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      pointer-events: auto;
      user-select: none;
      transition: background-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
    }

    .st-trigger:hover {
      background: #1765cc;
      box-shadow: 0 3px 12px rgba(26, 115, 232, 0.45), 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .st-trigger:active {
      transform: scale(0.97);
    }

    .st-trigger:focus-visible {
      outline: 2px solid #a8c7fa;
      outline-offset: 2px;
    }

    .st-trigger svg {
      width: 13px;
      height: 13px;
      flex: none;
    }

    .st-card {
      display: flex;
      flex-direction: column;
      width: min(360px, calc(100vw - 24px));
      max-height: min(60vh, 440px);
      border: 1px solid rgba(60, 64, 67, 0.14);
      border-radius: 14px;
      background: #fff;
      color: #202124;
      box-shadow: 0 12px 36px rgba(32, 33, 36, 0.18), 0 2px 8px rgba(32, 33, 36, 0.08);
      overflow: hidden;
      pointer-events: auto;
      animation: st-in 0.14s ease-out;
    }

    @keyframes st-in {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .st-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex: none;
      padding: 10px 10px 8px 14px;
    }

    .st-langs {
      min-width: 0;
      overflow: hidden;
      color: #5f6368;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.03em;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .st-btns {
      display: flex;
      align-items: center;
      gap: 2px;
      flex: none;
    }

    .st-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      padding: 0;
      border: 0;
      border-radius: 7px;
      background: transparent;
      color: #5f6368;
      font: inherit;
      cursor: pointer;
      pointer-events: auto;
    }

    .st-btn:hover {
      background: rgba(60, 64, 67, 0.08);
      color: #202124;
    }

    .st-btn:active {
      background: rgba(60, 64, 67, 0.14);
    }

    .st-btn:focus-visible {
      outline: 2px solid #a8c7fa;
      outline-offset: 0;
    }

    .st-btn:disabled {
      opacity: 0.35;
      cursor: default;
    }

    .st-btn svg {
      width: 15px;
      height: 15px;
    }

    .st-btn[data-action="close"] svg {
      width: 14px;
      height: 14px;
    }

    .st-btn.is-copied {
      color: #188038;
    }

    .st-content {
      flex: 1 1 auto;
      min-height: 0;
      padding: 0 14px 12px;
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    .st-content::-webkit-scrollbar {
      width: 10px;
    }

    .st-content::-webkit-scrollbar-thumb {
      border: 3px solid transparent;
      border-radius: 999px;
      background: rgba(60, 64, 67, 0.25);
      background-clip: content-box;
    }

    .st-content::-webkit-scrollbar-track {
      background: transparent;
    }

    .st-original {
      display: -webkit-box;
      margin-bottom: 9px;
      padding-bottom: 9px;
      border-bottom: 1px solid rgba(60, 64, 67, 0.12);
      overflow: hidden;
      color: #5f6368;
      font-size: 12.5px;
      line-height: 1.45;
      word-break: break-word;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      user-select: text;
    }

    .st-result {
      min-height: 22px;
      color: #202124;
      font-size: 15px;
      line-height: 1.55;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
      word-break: break-word;
      user-select: text;
    }

    .st-alts {
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid rgba(60, 64, 67, 0.12);
    }

    .st-alts-head {
      margin-bottom: 7px;
      color: #80868b;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .st-alt-group {
      display: flex;
      gap: 8px;
      margin-top: 6px;
      font-size: 12.5px;
      line-height: 1.5;
    }

    .st-alt-group:first-child {
      margin-top: 0;
    }

    .st-alt-pos {
      flex: none;
      min-width: 52px;
      padding-top: 1px;
      color: #5f6368;
      font-size: 11px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .st-alt-words {
      color: #3c4043;
      overflow-wrap: anywhere;
      user-select: text;
    }

    .st-loading {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 4px 0 6px;
      color: #5f6368;
      font-size: 13px;
    }

    .st-spinner {
      width: 14px;
      height: 14px;
      flex: none;
      border: 2px solid rgba(26, 115, 232, 0.22);
      border-top-color: #1a73e8;
      border-radius: 50%;
      animation: st-spin 0.7s linear infinite;
    }

    @keyframes st-spin {
      to {
        transform: rotate(360deg);
      }
    }

    .st-error {
      padding: 2px 0 6px;
      color: #c5221f;
      font-size: 13px;
      line-height: 1.45;
    }

    .st-foot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex: none;
      padding: 7px 12px;
      border-top: 1px solid rgba(60, 64, 67, 0.1);
      background: rgba(248, 249, 250, 0.85);
      color: #80868b;
      font-size: 10px;
      letter-spacing: 0.02em;
    }

    .st-retry {
      padding: 2px 4px;
      border: 0;
      border-radius: 4px;
      background: transparent;
      color: #1a73e8;
      font-family: inherit;
      font-size: 10.5px;
      font-weight: 600;
      cursor: pointer;
      pointer-events: auto;
    }

    .st-retry:hover {
      background: rgba(26, 115, 232, 0.08);
    }

    @media (prefers-color-scheme: dark) {
      .st-card {
        border-color: rgba(255, 255, 255, 0.12);
        background: #202124;
        color: #e8eaed;
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .st-langs,
      .st-original,
      .st-loading {
        color: #9aa0a6;
      }

      .st-original {
        border-color: rgba(255, 255, 255, 0.12);
      }

      .st-result {
        color: #e8eaed;
      }

      .st-alts {
        border-color: rgba(255, 255, 255, 0.12);
      }

      .st-alts-head,
      .st-alt-pos {
        color: #9aa0a6;
      }

      .st-alt-words {
        color: #e8eaed;
      }

      .st-btn {
        color: #9aa0a6;
      }

      .st-btn:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #e8eaed;
      }

      .st-content::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.22);
        background-clip: content-box;
      }

      .st-foot {
        border-color: rgba(255, 255, 255, 0.1);
        background: rgba(32, 33, 36, 0.9);
        color: #9aa0a6;
      }

      .st-error {
        color: #f28b82;
      }

      .st-btn.is-copied {
        color: #81c995;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .st-trigger,
      .st-card {
        transition: none;
        animation: none;
      }

      .st-spinner {
        animation-duration: 1.4s;
      }
    }
  `;

  let settings = { ...DEFAULTS };
  let host = null;
  let shadow = null;
  let trigger = null;
  let card = null;
  let els = null;
  let lastText = '';
  let lastRange = null;
  let lastInput = null;
  let lastAnchorRect = null;
  let activeTarget = settings.targetLang;
  let currentTranslation = '';
  let requestId = 0;
  let selectionTimer = null;
  let flashTimer = null;
  let repositionScheduled = false;

  function languageName(code) {
    if (!code) return 'Auto';
    return LANGUAGE_NAMES[code] || String(code).toUpperCase();
  }

  function normalize(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  function isValidSelection(text) {
    if (!text || text.length > MAX_SELECTION) return false;
    return /[\p{L}\p{N}]/u.test(text);
  }

  function rectToPlain(rect) {
    if (!rect) return null;
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height
    };
  }

  function isInsideHost(event) {
    if (!host) return false;
    try {
      return event.composedPath().includes(host);
    } catch {
      return host.contains(event.target);
    }
  }

  function isUiVisible() {
    return Boolean((trigger && !trigger.hidden) || (card && !card.hidden));
  }

  function readInputSelection(element) {
    if (!element) return '';
    if (typeof element.selectionStart !== 'number' || typeof element.selectionEnd !== 'number') {
      return '';
    }
    if (element.selectionEnd <= element.selectionStart) return '';
    return element.value.slice(element.selectionStart, element.selectionEnd);
  }

  function isTextField(element) {
    return Boolean(element) && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA');
  }

  function caretRect(range) {
    try {
      const collapsed = range.cloneRange();
      collapsed.collapse(false);
      const rect = collapsed.getBoundingClientRect();
      if (rect && (rect.width || rect.height)) return rect;
    } catch {
      /* The range may have become invalid. */
    }
    return null;
  }

  function readSelection() {
    const active = document.activeElement;
    if (isTextField(active)) {
      const inputText = normalize(readInputSelection(active));
      if (inputText) {
        return {
          text: inputText,
          rect: active.getBoundingClientRect(),
          range: null,
          input: active
        };
      }
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;

    const text = normalize(selection.toString());
    if (!text) return null;

    const range = selection.getRangeAt(0).cloneRange();
    const rect = caretRect(range) || range.getBoundingClientRect();
    if (!rect) return null;

    return { text, rect, range, input: null };
  }

  function currentAnchorRect() {
    if (lastInput && lastInput.isConnected) {
      return lastInput.getBoundingClientRect();
    }

    if (lastRange && lastRange.startContainer && lastRange.startContainer.isConnected) {
      try {
        const rect = caretRect(lastRange) || lastRange.getBoundingClientRect();
        if (rect && (rect.width || rect.height || rect.top || rect.left)) return rect;
      } catch {
        /* The range became invalid; use the last known position. */
      }
    }

    return lastAnchorRect;
  }

  function initSettings() {
    try {
      chrome.storage.sync.get(DEFAULTS, (values) => {
        if (chrome.runtime.lastError) return;
        settings = { ...DEFAULTS, ...values };
        activeTarget = settings.targetLang || DEFAULTS.targetLang;
      });

      chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== 'sync') return;
        if (changes.targetLang && changes.targetLang.newValue) {
          settings.targetLang = changes.targetLang.newValue;
        }
        if (changes.autoTranslate) {
          settings.autoTranslate = Boolean(changes.autoTranslate.newValue);
        }
      });
    } catch {
      /* The extension context was reloaded; keep the defaults. */
    }
  }

  function ensureUi() {
    if (host && !host.isConnected) {
      host = null;
      shadow = null;
      trigger = null;
      card = null;
      els = null;
    }
    if (host) return;

    host = document.createElement('div');
    host.id = '__secili_ceviri_root';
    host.style.setProperty('position', 'fixed', 'important');
    host.style.setProperty('top', '0', 'important');
    host.style.setProperty('left', '0', 'important');
    host.style.setProperty('width', '0', 'important');
    host.style.setProperty('height', '0', 'important');
    host.style.setProperty('z-index', '2147483647', 'important');
    host.style.setProperty('overflow', 'visible', 'important');
    host.style.setProperty('pointer-events', 'none', 'important');

    (document.documentElement || document.body).appendChild(host);

    shadow = host.attachShadow({ mode: 'open' });

    try {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(SHADOW_CSS);
      shadow.adoptedStyleSheets = [sheet];
    } catch {
      const style = document.createElement('style');
      style.textContent = SHADOW_CSS;
      shadow.appendChild(style);
    }

    trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'st-trigger';
    trigger.hidden = true;
    trigger.title = 'Translate selected text (Ctrl+Shift+Y)';
    trigger.setAttribute('aria-label', 'Translate selected text');
    trigger.innerHTML = `${GLOBE_SVG}<span>Translate</span>`;
    trigger.addEventListener('mousedown', (event) => event.preventDefault());
    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!lastText) return;
      openTranslation({
        text: lastText,
        rect: currentAnchorRect() || lastAnchorRect,
        range: lastRange,
        input: lastInput
      });
    });
    shadow.appendChild(trigger);

    card = document.createElement('div');
    card.className = 'st-card';
    card.hidden = true;
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', 'Translation');
    card.innerHTML = `
      <div class="st-head">
        <span class="st-langs"></span>
        <div class="st-btns">
          <button type="button" class="st-btn" data-action="copy" title="Copy translation" aria-label="Copy translation" disabled>${COPY_SVG}</button>
          <button type="button" class="st-btn" data-action="open" title="Open in Google Translate" aria-label="Open in Google Translate">${OPEN_SVG}</button>
          <button type="button" class="st-btn" data-action="close" title="Close (Esc)" aria-label="Close">${CLOSE_SVG}</button>
        </div>
      </div>
      <div class="st-content">
        <div class="st-original" dir="auto"></div>
        <div class="st-result" dir="auto" aria-live="polite"></div>
        <div class="st-alts" hidden>
          <div class="st-alts-head">Other meanings</div>
          <div class="st-alts-list"></div>
        </div>
      </div>
      <div class="st-foot">
        <span>Google Translate</span>
        <button type="button" class="st-retry" data-action="retry" hidden>Try again</button>
      </div>
    `;
    card.addEventListener('click', onCardClick);
    shadow.appendChild(card);

    els = {
      langs: card.querySelector('.st-langs'),
      original: card.querySelector('.st-original'),
      result: card.querySelector('.st-result'),
      alts: card.querySelector('.st-alts'),
      altsList: card.querySelector('.st-alts-list'),
      retry: card.querySelector('.st-retry'),
      copy: card.querySelector('[data-action="copy"]'),
      open: card.querySelector('[data-action="open"]')
    };

    for (const type of [
      'mousedown',
      'mouseup',
      'click',
      'dblclick',
      'pointerdown',
      'pointerup',
      'touchstart',
      'touchend'
    ]) {
      host.addEventListener(type, (event) => event.stopPropagation());
    }
  }

  function onCardClick(event) {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    event.stopPropagation();

    switch (button.dataset.action) {
      case 'close':
        hideCard();
        break;
      case 'copy':
        copyCurrent(button);
        break;
      case 'open':
        openInGoogle();
        break;
      case 'retry':
        retryTranslation();
        break;
      default:
        break;
    }
  }

  function placeTrigger(rect) {
    if (!trigger || !rect) return;
    trigger.style.visibility = 'hidden';
    const size = trigger.getBoundingClientRect();
    const position = positionNear(rect, size.width, size.height, 8);
    trigger.style.left = `${position.left}px`;
    trigger.style.top = `${position.top}px`;
    trigger.style.visibility = 'visible';
  }

  function positionNear(rect, width, height, gap) {
    const margin = 8;
    let left = rect.right + gap;
    if (left + width > window.innerWidth - margin) {
      left = rect.left - width - gap;
    }
    if (left < margin) {
      left = Math.min(Math.max(margin, rect.left), window.innerWidth - width - margin);
    }

    let top = rect.bottom + gap;
    if (top + height > window.innerHeight - margin) {
      top = rect.top - height - gap;
    }
    if (top < margin) {
      top = Math.min(
        Math.max(margin, rect.bottom + gap),
        window.innerHeight - height - margin
      );
    }

    return {
      left: Math.max(margin, left),
      top: Math.max(margin, top)
    };
  }

  function positionCard(rect) {
    if (!card || card.hidden || !rect) return;

    card.style.visibility = 'hidden';
    const size = card.getBoundingClientRect();
    const margin = 12;
    const gap = 10;

    let left = rect.left;
    if (left + size.width > window.innerWidth - margin) {
      left = window.innerWidth - size.width - margin;
    }
    left = Math.max(margin, left);

    let top = rect.bottom + gap;
    if (top + size.height > window.innerHeight - margin) {
      top = rect.top - size.height - gap;
      if (top < margin) {
        top = Math.max(margin, (window.innerHeight - size.height) / 2);
      }
    }
    top = Math.max(margin, Math.min(top, window.innerHeight - size.height - margin));

    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
    card.style.visibility = 'visible';
  }

  function showTrigger(info) {
    ensureUi();
    lastText = info.text;
    lastRange = info.range || null;
    lastInput = info.input || null;
    lastAnchorRect = rectToPlain(info.rect);

    trigger.hidden = false;
    placeTrigger(info.rect);
  }

  function hideTrigger() {
    if (trigger) trigger.hidden = true;
  }

  function hideCard() {
    if (!card) return;
    card.hidden = true;
    card.setAttribute('aria-busy', 'false');
    requestId++;
    currentTranslation = '';
  }

  function hideAll() {
    hideTrigger();
    hideCard();
  }

  function renderLoading() {
    card.hidden = false;
    card.setAttribute('aria-busy', 'true');
    els.langs.textContent = `Auto-detect → ${languageName(activeTarget)}`;
    els.original.textContent = lastText;
    els.result.textContent = '';
    els.alts.hidden = true;
    els.altsList.textContent = '';

    const loading = document.createElement('div');
    loading.className = 'st-loading';
    loading.innerHTML =
      '<span class="st-spinner" aria-hidden="true"></span><span>Translating…</span>';
    els.result.appendChild(loading);

    els.retry.hidden = true;
    els.copy.disabled = true;
    clearTimeout(flashTimer);
    els.copy.classList.remove('is-copied');
    els.copy.innerHTML = COPY_SVG;
    currentTranslation = '';
  }

  function renderAlternatives(groups) {
    els.altsList.textContent = '';
    if (!Array.isArray(groups) || groups.length === 0) {
      els.alts.hidden = true;
      return;
    }

    for (const group of groups) {
      if (!group || !Array.isArray(group.words) || group.words.length === 0) continue;

      const row = document.createElement('div');
      row.className = 'st-alt-group';

      const pos = document.createElement('span');
      pos.className = 'st-alt-pos';
      pos.textContent = group.pos || 'Meaning';

      const words = document.createElement('span');
      words.className = 'st-alt-words';
      words.textContent = group.words.join(' · ');

      row.append(pos, words);
      els.altsList.appendChild(row);
    }

    els.alts.hidden = els.altsList.childElementCount === 0;
  }

  function renderResult(response) {
    card.hidden = false;
    card.setAttribute('aria-busy', 'false');

    const sourceName = languageName(response.detected);
    const targetName = languageName(activeTarget);
    els.langs.textContent =
      sourceName === targetName
        ? `${sourceName} (same language)`
        : `${sourceName} → ${targetName}`;
    els.original.textContent = lastText;
    els.result.textContent = response.translated;
    renderAlternatives(response.alternatives);
    els.retry.hidden = true;
    els.copy.disabled = !response.translated;
    currentTranslation = response.translated;
  }

  function renderError(message) {
    card.hidden = false;
    card.setAttribute('aria-busy', 'false');
    els.langs.textContent = `Auto-detect → ${languageName(activeTarget)}`;
    els.original.textContent = lastText;
    els.result.textContent = '';
    els.alts.hidden = true;
    els.altsList.textContent = '';

    const error = document.createElement('div');
    error.className = 'st-error';
    error.textContent = message;
    els.result.appendChild(error);

    els.retry.hidden = false;
    els.copy.disabled = true;
    currentTranslation = '';
  }

  function friendlyContentError(message) {
    if (
      typeof message === 'string' &&
      /Receiving end does not exist|Could not establish connection/i.test(message)
    ) {
      return 'Could not connect to the extension. Refresh the page and try again.';
    }
    return message || 'Translation failed.';
  }

  function sendRuntimeMessage(message) {
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          resolve(response);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  function openTranslation(info) {
    if (!info || !info.text) return;
    ensureUi();
    hideTrigger();

    lastText = info.text;
    lastRange = info.range || null;
    lastInput = info.input || null;
    lastAnchorRect = rectToPlain(info.rect);
    activeTarget = settings.targetLang || DEFAULTS.targetLang;
    currentTranslation = '';

    renderLoading();
    positionCard(info.rect);

    const id = ++requestId;
    sendRuntimeMessage({
      type: 'translate',
      text: info.text,
      targetLang: activeTarget
    })
      .then((response) => {
        if (id !== requestId) return;
        if (!response || response.error) {
          throw new Error(response?.error || 'Translation failed.');
        }
        renderResult(response);
        positionCard(currentAnchorRect() || info.rect);
      })
      .catch((error) => {
        if (id !== requestId) return;
        renderError(friendlyContentError(error?.message));
        positionCard(currentAnchorRect() || info.rect);
      });
  }

  function retryTranslation() {
    if (!lastText) return;
    openTranslation({
      text: lastText,
      rect: currentAnchorRect() || lastAnchorRect,
      range: lastRange,
      input: lastInput
    });
  }

  function fallbackCopy(text) {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
    (document.body || document.documentElement).appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }

  async function copyCurrent(button) {
    if (!currentTranslation) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentTranslation);
      } else {
        fallbackCopy(currentTranslation);
      }
    } catch {
      try {
        fallbackCopy(currentTranslation);
      } catch {
        return;
      }
    }

    button.classList.add('is-copied');
    button.innerHTML = CHECK_SVG;
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => {
      button.classList.remove('is-copied');
      button.innerHTML = COPY_SVG;
    }, 1400);
  }

  function openInGoogle() {
    if (!lastText) return;
    const url =
      'https://translate.google.com/?sl=auto&tl=' +
      encodeURIComponent(activeTarget) +
      '&text=' +
      encodeURIComponent(lastText.slice(0, 5000)) +
      '&op=translate';

    try {
      chrome.runtime.sendMessage({ type: 'openTab', url });
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  function scheduleSelectionCheck() {
    clearTimeout(selectionTimer);
    selectionTimer = setTimeout(handleSelection, 20);
  }

  function handleSelection() {
    const info = readSelection();

    if (!info || !isValidSelection(info.text)) {
      hideTrigger();
      return;
    }

    if (settings.autoTranslate) {
      openTranslation(info);
      return;
    }

    if (card && !card.hidden) hideCard();
    showTrigger(info);
  }

  function scheduleReposition() {
    if (repositionScheduled) return;
    repositionScheduled = true;

    requestAnimationFrame(() => {
      repositionScheduled = false;
      if (!isUiVisible()) return;

      const rect = currentAnchorRect();
      if (!rect) return;

      if (
        rect.bottom < -20 ||
        rect.top > window.innerHeight + 20 ||
        rect.right < 0 ||
        rect.left > window.innerWidth
      ) {
        hideAll();
        return;
      }

      if (trigger && !trigger.hidden) placeTrigger(rect);
      if (card && !card.hidden) positionCard(rect);
    });
  }

  function installListeners() {
    document.addEventListener(
      'mouseup',
      (event) => {
        if (event.button !== 0 || isInsideHost(event)) return;
        scheduleSelectionCheck();
      },
      true
    );

    document.addEventListener(
      'keyup',
      (event) => {
        if (isInsideHost(event)) return;
        const key = event.key;
        if (
          key === 'Shift' ||
          key === 'ArrowUp' ||
          key === 'ArrowDown' ||
          key === 'ArrowLeft' ||
          key === 'ArrowRight' ||
          key === 'Home' ||
          key === 'End' ||
          ((key === 'a' || key === 'A') && (event.ctrlKey || event.metaKey))
        ) {
          scheduleSelectionCheck();
        }
      },
      true
    );

    document.addEventListener(
      'mousedown',
      (event) => {
        if (isInsideHost(event)) return;
        if (card && !card.hidden) hideCard();
      },
      true
    );

    document.addEventListener(
      'keydown',
      (event) => {
        if (event.key === 'Escape' && isUiVisible()) hideAll();
      },
      true
    );

    document.addEventListener('selectionchange', () => {
      if (!trigger || trigger.hidden) return;
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) hideTrigger();
    });

    document.addEventListener(
      'scroll',
      (event) => {
        if (isInsideHost(event)) return;
        scheduleReposition();
      },
      true
    );

    window.addEventListener('resize', scheduleReposition);

    try {
      chrome.runtime.onMessage.addListener((message) => {
        if (!message || message.type !== 'translateSelection') return;
        const info = readSelection();
        if (!info || !isValidSelection(info.text)) {
          hideAll();
          return;
        }
        openTranslation(info);
      });
    } catch {
      /* The extension context was reloaded; fail silently. */
    }
  }

  initSettings();
  installListeners();
})();
