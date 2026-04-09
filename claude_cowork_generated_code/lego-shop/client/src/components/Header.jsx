import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { itemCount } = useCart()
  const { currentLanguage, setLanguage, t } = useLanguage()

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-logo" onClick={closeMobileMenu}>
          {t('common.lego_shop')}
        </Link>

        <button
          className="hamburger"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <Link
            to="/"
            className="nav-link"
            onClick={closeMobileMenu}
          >
            {t('navigation.home')}
          </Link>

          <Link
            to="/cart"
            className="nav-link"
            onClick={closeMobileMenu}
          >
            🛒 {t('navigation.cart')}
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          <Link
            to="/admin"
            className="nav-link"
            onClick={closeMobileMenu}
          >
            ⚙️ {t('navigation.admin')}
          </Link>

          <div className="language-switcher">
            <button
              className={`lang-btn ${currentLanguage === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
              title="English"
            >
              EN
            </button>
            <button
              className={`lang-btn ${currentLanguage === 'no' ? 'active' : ''}`}
              onClick={() => setLanguage('no')}
              title="Norsk"
            >
              NO
            </button>
            <button
              className={`lang-btn ${currentLanguage === 'it' ? 'active' : ''}`}
              onClick={() => setLanguage('it')}
              title="Italiano"
            >
              IT
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
