import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

export function CartSummary() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Handlekurven er tom</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Fortsett å handle
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <h2>Handlekurv</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.5rem 0' }}>
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="card"
            style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <div style={{ flex: 1 }}>
              <strong>{product.name}</strong>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                {product.price} NOK per stk
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => updateQuantity(product.id, quantity - 1)}
              >
                −
              </button>
              <span style={{ minWidth: '2rem', textAlign: 'center' }}>{quantity}</span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => updateQuantity(product.id, quantity + 1)}
              >
                +
              </button>
            </div>
            <div style={{ minWidth: '100px', textAlign: 'right', fontWeight: 600 }}>
              {product.price * quantity} NOK
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => removeItem(product.id)}
            >
              Fjern
            </button>
          </div>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '2px solid var(--border)',
          paddingTop: '1rem',
        }}
      >
        <strong style={{ fontSize: '1.25rem' }}>Totalt: {total} NOK</strong>
        <button className="btn btn-primary" onClick={() => navigate('/checkout')}>
          Gå til kassen
        </button>
      </div>
    </div>
  );
}
