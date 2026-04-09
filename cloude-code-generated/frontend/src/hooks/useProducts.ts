import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@workshop/shared';
import * as productsApi from '../api/products.js';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchThemes = useCallback(async () => {
    try {
      const data = await productsApi.getThemes();
      setThemes(data);
    } catch {
      // Non-critical
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: Product[];
      if (searchQuery.trim()) {
        data = await productsApi.searchProducts(searchQuery.trim());
      } else {
        data = await productsApi.getProducts(selectedTheme || undefined);
      }
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [selectedTheme, searchQuery]);

  useEffect(() => {
    void fetchThemes();
  }, [fetchThemes]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    themes,
    selectedTheme,
    setSelectedTheme,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    refetch: fetchProducts,
  };
}
