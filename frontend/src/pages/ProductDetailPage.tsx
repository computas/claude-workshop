import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../hooks/useCart';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(Number(id));
  const { addItem } = useCart();
  const navigate = useNavigate();

  if (loading) return <p className="loading" style={{ padding: '2rem' }}>Laster produkt...</p>;
  if (error) return <p className="error-message" style={{ padding: '2rem' }}>{error}</p>;
  if (!product) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
        ← Tilbake
      </button>
      <div className="card" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <img
          src={product.image_url ?? 'https://via.placeholder.com/300x200?text=LEGO'}
          alt={product.name}
          style={{ width: '300px', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius)' }}
        />
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h1 style={{ marginTop: 0 }}>{product.name}</h1>
          <span className="badge" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
            {product.category}
          </span>
          {product.description && <p>{product.description}</p>}
          <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{product.price} NOK</p>
          {product.piece_count != null && (
            <p style={{ color: '#64748b' }}>{product.piece_count} brikker</p>
          )}
          {product.age_min != null && (
            <p style={{ color: '#64748b' }}>Anbefalt alder: {product.age_min}+</p>
          )}
          <button
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
            onClick={() => addItem(product)}
          >
            Legg i handlekurv
          </button>
        </div>
      </div>
    </div>
  );
}
