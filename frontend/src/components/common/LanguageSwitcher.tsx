import type { Language } from '@workshop/shared';

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'no', label: 'NO' },
  { code: 'it', label: 'IT' },
];

export function LanguageSwitcher({ language, onLanguageChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {LANGUAGES.map(lang => (
        <button
          key={lang.code}
          onClick={() => onLanguageChange(lang.code)}
          style={{
            padding: '4px 8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: language === lang.code ? '#0070f3' : 'transparent',
            color: language === lang.code ? 'white' : 'inherit',
            cursor: 'pointer',
            fontWeight: language === lang.code ? 'bold' : 'normal',
          }}
          aria-pressed={language === lang.code}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
