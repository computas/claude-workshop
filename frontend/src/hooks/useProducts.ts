import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductFilters } from '@workshop/shared';
import { fetchProducts } from '../api/products';

export function useProducts(filters?: ProductFilters): {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchProducts(filters)
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Ukjent feil');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters?.category,
    filters?.search,
    filters?.minPrice,
    filters?.maxPrice,
    tick,
  ]);

  return { products, loading, error, refetch };
}
