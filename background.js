'use strict';

const DEFAULTS = { targetLang: 'tr', autoTranslate: false };
const MENU_ID = 'secili-ceviri-translate';
const MAX_ALTERNATIVES = 60;
const REQUEST_TIMEOUT_MS = 10000;

function recreateMenu() {
  chrome.contextMenus.removeAll(() => {
    void chrome.runtime.lastError;
    chrome.contextMenus.create(
      {
        id: MENU_ID,
        title: 'Translate selected text',
        contexts: ['selection']
      },
      () => {
        void chrome.runtime.lastError;
      }
    );
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync
    .get(DEFAULTS)
    .then((values) => chrome.storage.sync.set({ ...DEFAULTS, ...values }))
    .catch(() => {});
  recreateMenu();
});

chrome.runtime.onStartup.addListener(recreateMenu);

const POS_NAMES = new Map([
  ['isim', 'noun'],
  ['fiil', 'verb'],
  ['sıfat', 'adjective'],
  ['zarf', 'adverb'],
  ['zamir', 'pronoun'],
  ['edat', 'preposition'],
  ['bağlaç', 'conjunction'],
  ['ünlem', 'interjection'],
  ['ifade', 'phrase'],
  ['deyim', 'idiom']
]);

function singleWordTerm(text) {
  const trimmed = String(text || '').trim();
  if (!trimmed || /\s/.test(trimmed)) return '';

  const term = trimmed.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, '').trim();
  return /[\p{L}\p{N}]/u.test(term) ? term : '';
}

function normalizePos(pos) {
  const value = String(pos || '').trim();
  if (!value) return 'Meaning';
  return POS_NAMES.get(value.toLocaleLowerCase()) || value;
}

function parseAlternatives(data, primary, source) {
  const entries = Array.isArray(data?.[1]) ? data[1] : [];
  const seen = new Set(
    [primary, source]
      .map((value) => String(value || '').trim().toLocaleLowerCase())
      .filter(Boolean)
  );
  const groups = [];
  let total = 0;

  for (const entry of entries) {
    if (!Array.isArray(entry)) continue;

    const meanings = Array.isArray(entry[1]) ? entry[1] : [];
    const words = [];

    for (const meaning of meanings) {
      if (typeof meaning !== 'string') continue;

      const word = meaning.trim();
      const key = word.toLocaleLowerCase();
      if (!word || seen.has(key)) continue;

      seen.add(key);
      words.push(word);
      total += 1;
      if (total >= MAX_ALTERNATIVES) break;
    }

    if (words.length) groups.push({ pos: normalizePos(entry[0]), words });
    if (total >= MAX_ALTERNATIVES) break;
  }

  return groups;
}

async function requestTranslation(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Google Translate responded with HTTP ${response.status}.`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function translateText(text, targetLang) {
  const target = /^[a-zA-Z-]{2,12}$/.test(targetLang || '') ? targetLang : 'tr';
  const dictionaryTerm = singleWordTerm(text);
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'auto');
  url.searchParams.set('tl', target);
  url.searchParams.append('dt', 't');
  if (dictionaryTerm) url.searchParams.append('dt', 'bd');
  url.searchParams.set('q', text);

  let data;
  try {
    data = await requestTranslation(url);
  } catch (error) {
    if (error?.name !== 'AbortError') throw error;
    data = await requestTranslation(url);
  }

  const translated = Array.isArray(data?.[0])
    ? data[0]
        .map((part) => (Array.isArray(part) ? part[0] || '' : ''))
        .join('')
        .trim()
    : '';

  if (!translated) {
    throw new Error('The translation came back empty.');
  }

  return {
    translated,
    detected: typeof data?.[2] === 'string' ? data[2] : '',
    alternatives: dictionaryTerm
      ? parseAlternatives(data, translated, dictionaryTerm)
      : []
  };
}

function friendlyError(error) {
  if (error?.name === 'AbortError') return 'The request timed out.';
  if (error?.name === 'TypeError') {
    return 'Could not reach the translation service. Check your internet connection.';
  }
  if (
    typeof error?.message === 'string' &&
    (error.message.startsWith('Google Translate responded with HTTP') ||
      error.message === 'The translation came back empty.')
  ) {
    return error.message;
  }
  return 'Translation failed. Please try again.';
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'translate' && typeof message.text === 'string') {
    const text = message.text.slice(0, 5000);
    if (!text.trim()) {
      sendResponse({ error: 'There is no text to translate.' });
      return false;
    }

    translateText(text, message.targetLang)
      .then(sendResponse)
      .catch((error) => sendResponse({ error: friendlyError(error) }));
    return true;
  }

  if (message?.type === 'openTab' && typeof message.url === 'string') {
    if (message.url.startsWith('https://translate.google.com/')) {
      chrome.tabs.create({ url: message.url }).catch(() => {});
    }
  }

  return false;
});

function sendTranslateCommand(tabId) {
  if (!tabId) return;
  chrome.tabs.sendMessage(tabId, { type: 'translateSelection' }).catch(() => {});
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === MENU_ID) sendTranslateCommand(tab?.id);
});

chrome.commands.onCommand.addListener((command) => {
  if (command !== 'translate-selection') return;
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    sendTranslateCommand(tab?.id);
  });
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage().catch(() => {});
});
