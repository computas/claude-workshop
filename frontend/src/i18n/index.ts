import { en, type TranslationKey } from './en.js';
import { no } from './no.js';
import { it } from './it.js';
import type { Language } from '@workshop/shared';

const translations: Record<Language, Record<TranslationKey, string>> = { en, no, it };

export function detectLanguage(): Language {
  const lang = navigator.language?.toLowerCase() ?? '';
  if (lang.startsWith('no') || lang.startsWith('nb') || lang.startsWith('nn')) return 'no';
  if (lang.startsWith('it')) return 'it';
  return 'en';
}

export function t(key: TranslationKey, lang: Language): string {
  return translations[lang][key] ?? translations['en'][key] ?? key;
}

export type { TranslationKey, Language };
export { translations };
