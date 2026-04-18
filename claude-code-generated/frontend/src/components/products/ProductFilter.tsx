import { useAppContext } from '../../context/AppContext.js';
import { cat } from '../../theme.js';

interface Props {
  themes: string[];
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit?: () => void;
}

export function ProductFilter({ themes, selectedTheme, onThemeChange, searchQuery, onSearchChange, onSearchSubmit }: Props) {
  const { t } = useAppContext();

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
      <input
        type="text"
        placeholder={t('products_search')}
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSearchSubmit?.()}
        style={{
          padding: '8px 16px',
          border: `1px solid ${cat.surface2}`,
          borderRadius: '8px',
          fontSize: '0.95rem',
          minWidth: '250px',
          flex: 1,
          background: cat.surface0,
          color: cat.text,
        }}
      />

      <select
        value={selectedTheme}
        onChange={e => onThemeChange(e.target.value)}
        style={{
          padding: '8px 12px',
          border: `1px solid ${cat.surface2}`,
          borderRadius: '8px',
          fontSize: '0.95rem',
          background: cat.surface0,
          color: cat.text,
        }}
      >
        <option value="">{t('products_all_themes')}</option>
        {themes.map(theme => (
          <option key={theme} value={theme}>{theme}</option>
        ))}
      </select>
    </div>
  );
}
