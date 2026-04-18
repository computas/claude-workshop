import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LanguageSwitcher } from './LanguageSwitcher.js';
import { useAppContext } from '../../context/AppContext.js';
import { FeatureFlagsPopup } from './FeatureFlagsPopup.js';
import { cat } from '../../theme.js';

export function Header() {
  const { t, language, setLanguage, itemCount } = useAppContext();
  const [flagsOpen, setFlagsOpen] = useState(false);

  return (
    <header style={{
      padding: '12px 24px',
      background: cat.crust,
      color: cat.text,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(17,17,27,0.8)',
    }}>
      <button
        onClick={() => setFlagsOpen(true)}
        style={{ color: cat.text, background: 'none', border: 'none', fontSize: '1.4rem', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
      >
        🧱 {t('products_title')}
      </button>
      {flagsOpen && <FeatureFlagsPopup onClose={() => setFlagsOpen(false)} />}

      <nav style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Link to="/" style={{ color: cat.text, textDecoration: 'none' }}>{t('nav_home')}</Link>
        <Link to="/cart" style={{ color: cat.text, textDecoration: 'none' }}>
          {t('nav_cart')} {itemCount > 0 && <span style={{ background: cat.red, color: cat.crust, borderRadius: '50%', padding: '2px 7px', fontSize: '0.8rem', marginLeft: '4px' }}>{itemCount}</span>}
        </Link>
        <Link to="/admin" style={{ color: cat.text, textDecoration: 'none' }}>{t('nav_admin')}</Link>
        <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
      </nav>
    </header>
  );
}
