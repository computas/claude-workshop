import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext.js';
import { useFeatureFlags } from '../context/FeatureFlagsContext.js';
import { cat } from '../theme.js';
import { useProducts } from '../hooks/useProducts.js';
import { ProductFilter } from '../components/products/ProductFilter.js';
import { ProductList } from '../components/products/ProductList.js';
import { DadJokePopup } from '../components/products/DadJokePopup.js';

export function ProductsPage() {
  const { t } = useAppContext();
  const { flags } = useFeatureFlags();
  const { products, themes, selectedTheme, setSelectedTheme, searchQuery, setSearchQuery, loading, error } = useProducts();
  const [jokeVisible, setJokeVisible] = useState(false);

  useEffect(() => {
    const noResults = searchQuery.trim() !== '' && !loading && products.length === 0;
    document.documentElement.style.filter = noResults ? 'invert(1)' : '';
    return () => { document.documentElement.style.filter = ''; };
  }, [products, searchQuery, loading]);

  function handleSearchSubmit() {
    if (searchQuery.trim() && flags.dadJokesEnabled) setJokeVisible(true);
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '24px', color: cat.text }}>{t('products_title')}</h1>
      <ProductFilter
        themes={themes}
        selectedTheme={selectedTheme}
        onThemeChange={setSelectedTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />
      <ProductList products={products} loading={loading} error={error} />
      <DadJokePopup visible={jokeVisible} onClose={() => setJokeVisible(false)} />
    </div>
  );
}
