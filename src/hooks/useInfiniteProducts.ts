import { useState, useCallback, useRef, useEffect } from 'react';
import { useGetProductsQuery, useGetProductsByCategoryQuery } from '@/store/api/productsApi';
import { Product, ProductsResponse } from '@/types';

interface UseInfiniteProductsOptions {
  limit?: number;
  category?: string;
  search?: string;
}

interface UseInfiniteProductsReturn {
  products: Product[];
  isLoading: boolean;
  isFetching: boolean;
  hasMore: boolean;
  error: unknown;
  loadMore: () => void;
  reset: () => void;
  total: number;
}

/**
 * Custom hook for infinite scroll product loading.
 * Manages pagination state and accumulates products as user scrolls.
 */
export function useInfiniteProducts(
  options: UseInfiniteProductsOptions = {}
): UseInfiniteProductsReturn {
  const { limit = 20, category, search } = options;
  const [page, setPage] = useState(0);
  const [accumulatedProducts, setAccumulatedProducts] = useState<Product[]>([]);
  const previousParamsRef = useRef({ category, search });

  // Reset on filter/search change
  useEffect(() => {
    const prev = previousParamsRef.current;
    if (prev.category !== category || prev.search !== search) {
      setPage(0);
      setAccumulatedProducts([]);
      previousParamsRef.current = { category, search };
    }
  }, [category, search]);

  const skip = page * limit;

  // Use category-specific endpoint if category is selected
  const useCategoryQuery = category && category !== 'all';

  const productQuery = useGetProductsQuery(
    {
      limit,
      skip,
      q: search || undefined,
    },
    {
      skip: !!useCategoryQuery,
    }
  );

  const categoryQuery = useGetProductsByCategoryQuery(
    {
      category: category || '',
      limit,
      skip,
    },
    {
      skip: !useCategoryQuery,
    }
  );

  const activeQuery = useCategoryQuery ? categoryQuery : productQuery;
  const data = activeQuery.data as ProductsResponse | undefined;

  // Accumulate products when new data arrives
  useEffect(() => {
    if (data?.products) {
      setAccumulatedProducts((prev) => {
        if (page === 0) return data.products;
        // Deduplicate by ID
        const existingIds = new Set(prev.map((p) => p.id));
        const newProducts = data.products.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newProducts];
      });
    }
  }, [data, page]);

  const total = data?.total ?? 0;
  const hasMore = accumulatedProducts.length < total;

  const loadMore = useCallback(() => {
    if (hasMore && !activeQuery.isFetching) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, activeQuery.isFetching]);

  const reset = useCallback(() => {
    setPage(0);
    setAccumulatedProducts([]);
  }, []);

  return {
    products: accumulatedProducts,
    isLoading: activeQuery.isLoading,
    isFetching: activeQuery.isFetching,
    hasMore,
    error: activeQuery.error,
    loadMore,
    reset,
    total,
  };
}
