import { useNavigate } from 'react-router-dom';
import type { Product } from '@workshop/shared';

interface Props {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="card"
      data-testid="product-card"
      onClick={() => navigate(`/products/${product.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <img
        src={product.image_url ?? 'https://via.placeholder.com/300x200?text=LEGO'}
        alt={product.name}
        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius)' }}
      />
      <h3 style={{ margin: '0.75rem 0 0.25rem' }}>{product.name}</h3>
      <span className="badge">{product.category}</span>
      <p style={{ margin: '0.5rem 0', fontWeight: 600 }}>{product.price} NOK</p>
      {product.piece_count != null && (
        <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: '#64748b' }}>
          {product.piece_count} brikker
        </p>
      )}
      <button
        className="btn btn-primary"
        style={{ marginTop: '0.75rem', width: '100%' }}
        data-testid="add-to-cart-button"
        onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
      >
        Legg i handlekurv
      </button>
    </div>
  );
}
