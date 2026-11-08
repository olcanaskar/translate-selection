'use strict';

const DEFAULTS = { targetLang: 'tr', autoTranslate: false };
const languages = globalThis.SECILI_CEVIRI_LANGUAGES || [];

const select = document.getElementById('targetLang');
const autoTranslate = document.getElementById('autoTranslate');
const saveButton = document.getElementById('save');
const status = document.getElementById('status');

for (const { code, name } of languages) {
  const option = document.createElement('option');
  option.value = code;
  option.textContent = name;
  select.appendChild(option);
}

async function loadSettings() {
  const stored = await chrome.storage.sync.get(DEFAULTS);

  if (![...select.options].some((option) => option.value === stored.targetLang)) {
    const option = document.createElement('option');
    option.value = stored.targetLang;
    option.textContent = String(stored.targetLang).toUpperCase();
    select.appendChild(option);
  }

  select.value = stored.targetLang;
  autoTranslate.checked = Boolean(stored.autoTranslate);
}

let statusTimer;

function showStatus(text, isError = false) {
  clearTimeout(statusTimer);
  status.textContent = text;
  status.classList.toggle('error', isError);
  status.classList.add('show');
  statusTimer = setTimeout(() => status.classList.remove('show'), 1800);
}

saveButton.addEventListener('click', saveSettings);
select.addEventListener('change', saveSettings);
autoTranslate.addEventListener('change', saveSettings);

async function saveSettings() {
  saveButton.disabled = true;
  try {
    await chrome.storage.sync.set({
      targetLang: select.value,
      autoTranslate: autoTranslate.checked
    });
    showStatus('Saved');
  } catch {
    showStatus('Could not save', true);
  } finally {
    saveButton.disabled = false;
  }
}

loadSettings().catch(() => showStatus('Could not load settings', true));
