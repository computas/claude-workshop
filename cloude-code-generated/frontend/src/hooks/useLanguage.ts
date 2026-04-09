import { useState } from 'react';
import type { Language } from '@workshop/shared';
import { detectLanguage, t, type TranslationKey } from '../i18n/index.js';

const STORAGE_KEY = 'lego_language';

function getInitialLanguage(): Language {
  const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
  if (stored && ['en', 'no', 'it'].includes(stored)) return stored;
  return detectLanguage();
}

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  function setLanguage(lang: Language) {
    localStorage.setItem(STORAGE_KEY, lang);
    setLanguageState(lang);
  }

  function translate(key: TranslationKey): string {
    return t(key, language);
  }

  return { language, setLanguage, t: translate };
}
