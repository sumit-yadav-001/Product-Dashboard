import React from 'react';
import { Archive, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/common/Skeletons';
import { useGetCategoriesQuery } from '@/store/api/productsApi';
import { useGetProductsQuery } from '@/store/api/productsApi';

const CATEGORY_COLORS = [
  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
];

export function CategoriesPage() {
  const { data: categories, isLoading: catLoading, error: catError, refetch } = useGetCategoriesQuery();
  const { data: productsData, isLoading: prodLoading } = useGetProductsQuery({ limit: 100 });

  const isLoading = catLoading || prodLoading;

  // Count products per category
  const productCountByCategory = React.useMemo(() => {
    if (!productsData?.products) return {};
    return productsData.products.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
  }, [productsData]);

  if (catError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Archive className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Failed to load categories</h3>
        <p className="text-sm text-muted-foreground">There was an error fetching product categories.</p>
        <button onClick={() => refetch()} className="text-sm text-primary underline">Try again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Product Categories</h1>
          <p className="text-sm text-muted-foreground">
            Browse and manage all product categories
          </p>
        </div>
        {!isLoading && (
          <Badge variant="secondary" className="w-fit text-sm px-3 py-1">
            {categories?.length ?? 0} categories
          </Badge>
        )}
      </div>

      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Categories</p>
                {isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : (
                  <p className="text-2xl font-bold">{categories?.length ?? 0}</p>
                )}
              </div>
              <Archive className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                {isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : (
                  <p className="text-2xl font-bold">{productsData?.total ?? 0}</p>
                )}
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg per Category</p>
                {isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : (
                  <p className="text-2xl font-bold">
                    {categories?.length ? Math.round((productsData?.total ?? 0) / categories.length) : 0}
                  </p>
                )}
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))
          : categories?.map((cat, idx) => {
              const colorClass = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
              const count = productCountByCategory[cat.slug] ?? 0;
              return (
                <Link key={cat.slug} to={`/products?category=${cat.slug}`}>
                  <Card className="hover:shadow-md transition-all hover:border-primary/50 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg mb-3 ${colorClass}`}>
                        <Archive className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-sm leading-tight mb-1 group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {count} product{count !== 1 ? 's' : ''}
                        </span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
      </div>
    </div>
  );
}
