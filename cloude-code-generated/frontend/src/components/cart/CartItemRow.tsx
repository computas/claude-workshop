import type { CartItem } from '@workshop/shared';
import { useAppContext } from '../../context/AppContext.js';

interface Props {
  item: CartItem;
}

export function CartItemRow({ item }: Props) {
  const { t, updateQuantity, removeItem } = useAppContext();

  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      padding: '16px 0',
      borderBottom: '1px solid #e2e8f0',
      alignItems: 'center',
    }}>
      <img
        src={item.product.imageUrl}
        alt={item.product.name}
        style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px', background: '#f7fafc' }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.product.name}</div>
        <div style={{ color: '#718096', fontSize: '0.9rem' }}>{item.product.price.toLocaleString('nb-NO')} {t('nok')} each</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => void updateQuantity(item.productId, item.quantity - 1)}
          style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '1rem' }}
        >−</button>
        <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: '600' }}>{item.quantity}</span>
        <button
          onClick={() => void updateQuantity(item.productId, item.quantity + 1)}
          style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '1rem' }}
        >+</button>
      </div>

      <div style={{ minWidth: '100px', textAlign: 'right', fontWeight: '600' }}>
        {(item.product.price * item.quantity).toLocaleString('nb-NO')} {t('nok')}
      </div>

      <button
        onClick={() => void removeItem(item.productId)}
        style={{ color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
      >
        {t('cart_remove')}
      </button>
    </div>
  );
}
