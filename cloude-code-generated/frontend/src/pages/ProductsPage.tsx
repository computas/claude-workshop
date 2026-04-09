import { useAppContext } from '../context/AppContext.js';
import { useProducts } from '../hooks/useProducts.js';
import { ProductFilter } from '../components/products/ProductFilter.js';
import { ProductList } from '../components/products/ProductList.js';

export function ProductsPage() {
  const { t } = useAppContext();
  const { products, themes, selectedTheme, setSelectedTheme, searchQuery, setSearchQuery, loading, error } = useProducts();

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '24px', color: '#1a1a2e' }}>{t('products_title')}</h1>
      <ProductFilter
        themes={themes}
        selectedTheme={selectedTheme}
        onThemeChange={setSelectedTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <ProductList products={products} loading={loading} error={error} />
    </div>
  );
}
