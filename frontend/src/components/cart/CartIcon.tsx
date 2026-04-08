import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

export default function CartIcon() {
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <button
      className="btn btn-secondary btn-sm"
      onClick={() => navigate('/cart')}
      aria-label={`Handlekurv, ${itemCount} varer`}
      style={{ position: 'relative' }}
    >
      🛒
      {itemCount > 0 && (
        <span
          className="badge"
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: 'var(--primary)',
            color: '#fff',
            borderRadius: '50%',
            minWidth: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
          }}
        >
          {itemCount}
        </span>
      )}
    </button>
  );
}
