import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.js';
import { CartItemRow } from '../components/cart/CartItemRow.js';

export function CartPage() {
  const { t, cart } = useAppContext();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h1>{t('cart_title')}</h1>
        <p style={{ color: '#718096', margin: '24px 0' }}>{t('cart_empty')}</p>
        <Link to="/" style={{ color: '#0070f3' }}>{t('cart_continue_shopping')}</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '8px' }}>{t('cart_title')}</h1>
      <p style={{ color: '#718096', marginBottom: '24px' }}>{cart.items.length} {t('cart_items')}</p>

      {cart.items.map(item => (
        <CartItemRow key={item.productId} item={item} />
      ))}

      <div style={{ marginTop: '24px', padding: '16px', background: '#f7fafc', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
          <span>{t('cart_total')}</span>
          <span>{cart.total.toLocaleString('nb-NO')} {t('nok')}</span>
        </div>
      </div>

      <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <Link to="/" style={{ padding: '10px 20px', border: '1px solid #e2e8f0', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }}>
          {t('cart_continue_shopping')}
        </Link>
        <button
          onClick={() => navigate('/checkout')}
          style={{ padding: '10px 24px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' }}
        >
          {t('cart_checkout')}
        </button>
      </div>
    </div>
  );
}
