import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

export function Header() {
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <header className="header">
      <Link to="/" className="header-brand">
        Lego Fantasi
      </Link>
      <nav className="header-nav">
        <Link to="/">Produkter</Link>
        <Link to="/admin">Admin</Link>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('/cart')}
          aria-label="Handlekurv"
        >
          🛒 {itemCount > 0 && <span className="badge">{itemCount}</span>}
        </button>
      </nav>
    </header>
  );
}
