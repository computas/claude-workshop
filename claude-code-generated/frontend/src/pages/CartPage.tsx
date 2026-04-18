import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext.js';
import { CartItemRow } from '../components/cart/CartItemRow.js';
import { cat } from '../theme.js';

export function CartPage() {
  const { t, cart } = useAppContext();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: cat.text }}>{t('cart_title')}</h1>
        <p style={{ color: cat.subtext0, margin: '24px 0' }}>{t('cart_empty')}</p>
        <Link to="/" style={{ color: cat.blue }}>{t('cart_continue_shopping')}</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '8px', color: cat.text }}>{t('cart_title')}</h1>
      <p style={{ color: cat.subtext0, marginBottom: '24px' }}>{cart.items.length} {t('cart_items')}</p>

      {cart.items.map(item => (
        <CartItemRow key={item.productId} item={item} />
      ))}

      <div style={{ marginTop: '24px', padding: '16px', background: cat.surface0, borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: cat.text }}>
          <span>{t('cart_total')}</span>
          <span>{cart.total.toLocaleString('nb-NO')} {t('nok')}</span>
        </div>
      </div>

      <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <Link to="/" style={{ padding: '10px 20px', border: `1px solid ${cat.surface2}`, borderRadius: '8px', textDecoration: 'none', color: cat.text }}>
          {t('cart_continue_shopping')}
        </Link>
        <button
          onClick={() => navigate('/checkout')}
          style={{ padding: '10px 24px', background: cat.blue, color: cat.crust, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' }}
        >
          {t('cart_checkout')}
        </button>
      </div>
    </div>
  );
}
