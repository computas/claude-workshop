import { Link } from 'react-router-dom';
import { LanguageSwitcher } from './LanguageSwitcher.js';
import { useAppContext } from '../../context/AppContext.js';

export function Header() {
  const { t, language, setLanguage, itemCount } = useAppContext();

  return (
    <header style={{
      padding: '12px 24px',
      background: '#1a1a2e',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.4rem', fontWeight: 'bold' }}>
        🧱 {t('products_title')}
      </Link>

      <nav style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>{t('nav_home')}</Link>
        <Link to="/cart" style={{ color: 'white', textDecoration: 'none' }}>
          {t('nav_cart')} {itemCount > 0 && <span style={{ background: '#e53e3e', borderRadius: '50%', padding: '2px 7px', fontSize: '0.8rem', marginLeft: '4px' }}>{itemCount}</span>}
        </Link>
        <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>{t('nav_admin')}</Link>
        <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
      </nav>
    </header>
  );
}
