import type { Product } from '@workshop/shared';
import { ProductCard } from './ProductCard.js';
import { useAppContext } from '../../context/AppContext.js';
import { cat } from '../../theme.js';

interface Props {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export function ProductList({ products, loading, error }: Props) {
  const { t } = useAppContext();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '48px', color: cat.subtext0 }}>{t('loading')}</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '48px', color: cat.red }}>{t('error')}: {error}</div>;
  }

  if (products.length === 0) {
    return <div style={{ textAlign: 'center', padding: '48px', color: cat.subtext0 }}>{t('products_no_results')}</div>;
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px',
    }}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
