import { useState } from 'react';
import type { ProductFilters } from '@workshop/shared';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { ProductFilters as ProductFiltersComponent } from '../components/products/ProductFilters';
import { ProductList } from '../components/products/ProductList';
import type { Product } from '@workshop/shared';

export function HomePage() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const { products, loading, error } = useProducts(filters);
  const { addItem } = useCart();

  function handleAddToCart(product: Product) {
    addItem(product);
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Lego Fantasi</h1>
      <ProductFiltersComponent filters={filters} onFiltersChange={setFilters} />
      {loading && <p className="loading">Laster produkter...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <ProductList products={products} onAddToCart={handleAddToCart} />
      )}
    </div>
  );
}
