import React, { useState, useMemo, useCallback } from 'react';
import { Package, SlidersHorizontal, Grid3x3, List, RefreshCw, Infinity } from 'lucide-react';
import { useGetProductsQuery, useGetCategoriesQuery } from '@/store/api/productsApi';
import { ProductGrid } from '@/components/common/ProductGrid';
import { ProductListItem } from '@/components/common/ProductListItem';
import { ProductSkeleton } from '@/components/common/ProductSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { InfiniteScrollTrigger } from '@/components/common/InfiniteScrollTrigger';
import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useDebounce, useInfiniteProducts, useLocalStorage } from '@/hooks';
import { Product } from '@/types';

const ITEMS_PER_PAGE = 20;

type PaginationMode = 'paginated' | 'infinite';

export function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'title'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useLocalStorage<'grid' | 'list'>('product-view-mode', 'grid');
  const [paginationMode, setPaginationMode] = useLocalStorage<PaginationMode>('pagination-mode', 'paginated');

  // Debounce search query to avoid excessive API calls
  const debouncedSearch = useDebounce(searchQuery, 500);

  // ============================================================
  // Paginated mode queries
  // ============================================================

  const {
    data: productsData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetProductsQuery(
    {
      limit: ITEMS_PER_PAGE,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      q: debouncedSearch || undefined,
    },
    {
      skip: paginationMode === 'infinite',
    }
  );

  // ============================================================
  // Infinite scroll mode
  // ============================================================

  const {
    products: infiniteProducts,
    isLoading: infiniteLoading,
    isFetching: infiniteFetching,
    hasMore,
    error: infiniteError,
    loadMore,
    reset: resetInfinite,
    total: infiniteTotal,
  } = useInfiniteProducts({
    limit: ITEMS_PER_PAGE,
    search: paginationMode === 'infinite' ? debouncedSearch : undefined,
    category: paginationMode === 'infinite' && selectedCategory !== 'all' ? selectedCategory : undefined,
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();

  // Calculate total pages (paginated mode)
  const totalPages = useMemo(() => {
    if (!productsData) return 0;
    return Math.ceil(productsData.total / ITEMS_PER_PAGE);
  }, [productsData]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const source =
      paginationMode === 'infinite' ? infiniteProducts : productsData?.products || [];

    if (!source.length) return [];

    let filtered = [...source];

    // Filter by category (only in paginated mode — infinite uses API-level filtering)
    if (paginationMode === 'paginated' && selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [productsData, infiniteProducts, selectedCategory, sortBy, sortOrder, paginationMode]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle search
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  // Handle category change
  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  }, []);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('title');
    setSortOrder('asc');
    setCurrentPage(1);
    resetInfinite();
  }, [resetInfinite]);

  // Toggle pagination mode
  const handleTogglePaginationMode = useCallback(() => {
    setPaginationMode((prev) => (prev === 'paginated' ? 'infinite' : 'paginated'));
    setCurrentPage(1);
    resetInfinite();
  }, [setPaginationMode, resetInfinite]);

  const hasActiveFilters = searchQuery || selectedCategory !== 'all';
  const activeIsLoading = paginationMode === 'infinite' ? infiniteLoading : isLoading;
  const activeIsFetching = paginationMode === 'infinite' ? infiniteFetching : isFetching;
  const activeError = paginationMode === 'infinite' ? infiniteError : error;
  const totalCount =
    paginationMode === 'infinite' ? infiniteTotal : productsData?.total || 0;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-3 md:space-y-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Browse and manage your product catalog
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Pagination mode toggle */}
          <Button
            variant={paginationMode === 'infinite' ? 'default' : 'outline'}
            size="sm"
            onClick={handleTogglePaginationMode}
            className="hidden sm:flex items-center gap-1.5"
            aria-label={`Switch to ${paginationMode === 'paginated' ? 'infinite scroll' : 'paginated'} mode`}
          >
            <Infinity className="h-3.5 w-3.5" />
            <span className="text-xs">{paginationMode === 'infinite' ? 'Infinite' : 'Pages'}</span>
          </Button>

          {/* View mode toggle */}
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>

          {/* Refresh */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (paginationMode === 'infinite') {
                resetInfinite();
              } else {
                refetch();
              }
            }}
            disabled={activeIsFetching}
            aria-label="Refresh products"
            className="hidden sm:flex"
          >
            <RefreshCw className={`h-4 w-4 ${activeIsFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <CardTitle className="flex items-center text-base md:text-lg">
              <SlidersHorizontal className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Filters
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="md:col-span-2">
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products..."
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoriesLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  categories?.map((category) => (
                    <SelectItem key={category.slug} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {/* Sort */}
            <div className="flex space-x-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                aria-label="Toggle sort order"
                className="shrink-0"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-3 md:mt-4 flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="text-xs">
                  Search: {searchQuery}
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Category: {categories?.find((c) => c.slug === selectedCategory)?.name}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Count */}
      {totalCount > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedProducts.length} of {totalCount} products
            {paginationMode === 'infinite' && (
              <span className="ml-1 text-xs">(infinite scroll)</span>
            )}
          </p>
          {activeIsFetching && (
            <Badge variant="outline" className="animate-pulse">
              Updating...
            </Badge>
          )}
        </div>
      )}

      {/* Products Grid/List */}
      {activeIsLoading ? (
        <ProductSkeleton count={ITEMS_PER_PAGE} />
      ) : activeError ? (
        <EmptyState
          icon={Package}
          title="Failed to load products"
          description="There was an error loading the products. Please try again."
          action={{
            label: 'Retry',
            onClick: () => {
              if (paginationMode === 'infinite') {
                resetInfinite();
              } else {
                refetch();
              }
            },
          }}
        />
      ) : filteredAndSortedProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description={
            hasActiveFilters
              ? "Try adjusting your filters to find what you're looking for."
              : 'There are no products available at the moment.'
          }
          action={
            hasActiveFilters
              ? {
                  label: 'Clear Filters',
                  onClick: handleClearFilters,
                }
              : undefined
          }
        />
      ) : viewMode === 'grid' ? (
        <ProductGrid products={filteredAndSortedProducts} />
      ) : (
        <div className="space-y-3">
          {filteredAndSortedProducts.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination / Infinite Scroll */}
      {paginationMode === 'paginated' && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {paginationMode === 'infinite' && (
        <InfiniteScrollTrigger
          onLoadMore={loadMore}
          hasMore={hasMore}
          isLoading={infiniteFetching}
        />
      )}
    </div>
  );
}
