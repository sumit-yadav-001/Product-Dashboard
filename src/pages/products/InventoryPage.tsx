import React, { useState } from 'react';
import { AlertTriangle, Package, TrendingDown, CheckCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/common/Skeletons';
import { useGetProductsQuery } from '@/store/api/productsApi';

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
  if (stock < 10) return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-0">Low Stock</Badge>;
  if (stock < 50) return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-0">Limited</Badge>;
  return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-0">In Stock</Badge>;
}

export function InventoryPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading, error, refetch } = useGetProductsQuery({ limit: 100 });

  const filtered = React.useMemo(() => {
    if (!data?.products) return [];
    const q = search.toLowerCase();
    return data.products.filter(
      (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [data, search]);

  const stats = React.useMemo(() => {
    if (!data?.products) return { total: 0, outOfStock: 0, lowStock: 0, healthy: 0 };
    const products = data.products;
    return {
      total: products.length,
      outOfStock: products.filter((p) => p.stock === 0).length,
      lowStock: products.filter((p) => p.stock > 0 && p.stock < 10).length,
      healthy: products.filter((p) => p.stock >= 10).length,
    };
  }, [data]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Package className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Failed to load inventory</h3>
        <button onClick={() => refetch()} className="text-sm text-primary underline">Try again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Inventory Management</h1>
        <p className="text-sm text-muted-foreground">Monitor stock levels and identify low-stock items</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total SKUs', value: stats.total, icon: Package, color: 'text-blue-600' },
          { label: 'Out of Stock', value: stats.outOfStock, icon: AlertTriangle, color: 'text-red-600' },
          { label: 'Low Stock', value: stats.lowStock, icon: TrendingDown, color: 'text-orange-600' },
          { label: 'Healthy Stock', value: stats.healthy, icon: CheckCircle, color: 'text-green-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  {isLoading ? <Skeleton className="h-8 w-12 mt-1" /> : (
                    <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  )}
                </div>
                <Icon className={`h-8 w-8 ${color} opacity-70`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search products or categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Levels</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `${filtered.length} products`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Product</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-left p-4 font-medium w-40">Stock Level</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-4"><Skeleton className="h-4 w-40" /></td>
                        <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                        <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                        <td className="p-4"><Skeleton className="h-4 w-12" /></td>
                        <td className="p-4"><Skeleton className="h-3 w-full" /></td>
                        <td className="p-4"><Skeleton className="h-5 w-20 rounded-full" /></td>
                      </tr>
                    ))
                  : filtered.map((product) => {
                      const maxStock = 200;
                      const pct = Math.min((product.stock / maxStock) * 100, 100);
                      const progressColor =
                        product.stock === 0
                          ? '[&>div]:bg-red-500'
                          : product.stock < 10
                          ? '[&>div]:bg-orange-500'
                          : product.stock < 50
                          ? '[&>div]:bg-yellow-500'
                          : '[&>div]:bg-green-500';
                      return (
                        <tr key={product.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="h-8 w-8 rounded object-cover"
                              />
                              <span className="font-medium truncate max-w-[180px]">{product.title}</span>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground capitalize">{product.category}</td>
                          <td className="p-4 font-medium">${product.price.toFixed(2)}</td>
                          <td className="p-4 font-semibold">{product.stock}</td>
                          <td className="p-4">
                            <Progress value={pct} className={`h-2 ${progressColor}`} />
                          </td>
                          <td className="p-4">
                            <StockBadge stock={product.stock} />
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
