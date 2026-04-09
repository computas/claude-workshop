import type { Product } from '@workshop/shared';
import { useAppContext } from '../../context/AppContext.js';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const { t, addToCart } = useAppContext();
  const [adding, setAdding] = [false, (_: boolean) => {}];
  void adding;
  void setAdding;

  async function handleAdd() {
    try {
      await addToCart(product.id, 1);
    } catch {
      // Error displayed by hook
    }
  }

  const price = product.price.toLocaleString('nb-NO');

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      overflow: 'hidden',
      background: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'box-shadow 0.2s',
    }}>
      <div style={{ position: 'relative', height: '200px', background: '#f7fafc' }}>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e2e8f0' width='200' height='200'/%3E%3Ctext x='100' y='100' text-anchor='middle' dy='.3em' fill='%23718096' font-size='14'%3E${encodeURIComponent(product.name)}%3C/text%3E%3C/svg%3E`;
          }}
        />
        <span style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: '#667eea',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
        }}>
          {product.theme}
        </span>
      </div>

      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', lineHeight: 1.3 }}>{product.name}</h3>
        <p style={{ margin: 0, color: '#718096', fontSize: '0.85rem' }}>
          {product.pieces} {t('products_pieces')} · {t('products_age')} {product.ageMin}+
        </p>
        <p style={{ margin: 0, color: '#4a5568', fontSize: '0.85rem', lineHeight: 1.4 }}>
          {product.description.length > 100 ? `${product.description.slice(0, 100)}…` : product.description}
        </p>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d3748' }}>
            {price} {t('nok')}
          </span>
          <button
            onClick={() => void handleAdd()}
            disabled={product.stock === 0}
            style={{
              background: product.stock === 0 ? '#a0aec0' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
            }}
          >
            {product.stock === 0 ? t('products_out_of_stock') : t('products_add_to_cart')}
          </button>
        </div>
      </div>
    </div>
  );
}
