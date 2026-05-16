import React, { useState } from 'react';
import { ShoppingCart, DollarSign, Package, TrendingUp } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/common/Skeletons';
import { useGetCartsQuery } from '@/store/api/cartsApi';

const ORDER_STATUSES = ['Delivered', 'Processing', 'Shipped', 'Pending', 'Cancelled'] as const;

function getStatus(id: number): string {
  return ORDER_STATUSES[id % ORDER_STATUSES.length] ?? 'Delivered';
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    Shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? ''}`}>
      {status}
    </span>
  );
}

export function OrdersPage() {
  const { data, isLoading, error, refetch } = useGetCartsQuery({ limit: 20 });

  const stats = React.useMemo(() => {
    if (!data?.carts) return { total: 0, revenue: 0, avgValue: 0, products: 0 };
    const carts = data.carts;
    const revenue = carts.reduce((s, c) => s + c.total, 0);
    const products = carts.reduce((s, c) => s + c.totalProducts, 0);
    return {
      total: data.total,
      revenue,
      avgValue: carts.length ? revenue / carts.length : 0,
      products,
    };
  }, [data]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Failed to load orders</h3>
        <button onClick={() => refetch()} className="text-sm text-primary underline">Try again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">Manage and track customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Orders', value: stats.total, icon: ShoppingCart, format: (v: number) => v.toString() },
          { label: 'Total Revenue', value: stats.revenue, icon: DollarSign, format: (v: number) => `$${v.toLocaleString()}` },
          { label: 'Avg Order Value', value: stats.avgValue, icon: TrendingUp, format: (v: number) => `$${v.toFixed(2)}` },
          { label: 'Total Products', value: stats.products, icon: Package, format: (v: number) => v.toString() },
        ].map(({ label, value, icon: Icon, format }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  {isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : (
                    <p className="text-2xl font-bold">{format(value)}</p>
                  )}
                </div>
                <Icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `${data?.carts.length ?? 0} orders shown`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Order ID</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Products</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Discounted</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i} className="border-b">
                        {Array.from({ length: 6 }).map((_, j) => (
                          <td key={j} className="p-4"><Skeleton className="h-4 w-full" /></td>
                        ))}
                      </tr>
                    ))
                  : data?.carts.map((cart) => {
                      const status = getStatus(cart.id);
                      return (
                        <tr key={cart.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-4 font-mono text-xs font-semibold">#{String(cart.id).padStart(4, '0')}</td>
                          <td className="p-4 text-muted-foreground">User #{cart.userId}</td>
                          <td className="p-4">
                            <Badge variant="secondary">{cart.totalProducts} items</Badge>
                          </td>
                          <td className="p-4 font-semibold">${cart.total.toFixed(2)}</td>
                          <td className="p-4 text-emerald-600 font-medium">${cart.discountedTotal.toFixed(2)}</td>
                          <td className="p-4"><StatusBadge status={status} /></td>
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
