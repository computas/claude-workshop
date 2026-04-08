import type { Product } from '@workshop/shared';
import { ProductCard } from './ProductCard';

interface Props {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductList({ products, onAddToCart }: Props) {
  if (products.length === 0) {
    return <p style={{ textAlign: 'center', color: '#64748b' }}>Ingen produkter funnet</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
