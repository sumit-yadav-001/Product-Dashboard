import React, { useMemo } from 'react';
import { TrendingUp, Star, DollarSign, ShoppingCart, Users, Zap } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/common/Skeletons';
import { useGetProductsQuery } from '@/store/api/productsApi';
import { useGetUsersQuery } from '@/store/api/usersApi';
import { useGetCartsQuery } from '@/store/api/cartsApi';

function KpiCard({
  title, value, sub, icon: Icon, trend, loading,
}: {
  title: string; value: string; sub: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down'; loading?: boolean;
}) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-36" />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          {trend === 'up' && <TrendingUp className="h-3 w-3 text-emerald-500" />}
          {sub}
        </p>
      </CardContent>
    </Card>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
}

export function PerformancePage() {
  const { data: productsData, isLoading: prodLoading } = useGetProductsQuery({ limit: 100 });
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery({ limit: 30 });
  const { data: cartsData, isLoading: cartsLoading } = useGetCartsQuery({ limit: 20 });

  const isLoading = prodLoading || usersLoading || cartsLoading;

  const kpis = useMemo(() => {
    const products = productsData?.products ?? [];
    const carts = cartsData?.carts ?? [];
    const totalUsers = usersData?.total ?? 0;

    const avgRating = products.length
      ? (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(2)
      : '0.00';
    const totalRevenue = carts.reduce((s, c) => s + c.total, 0);
    const totalOrders = cartsData?.total ?? 0;
    const conversionRate = totalUsers > 0 ? ((totalOrders / totalUsers) * 100).toFixed(1) : '0.0';
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / carts.length).toFixed(2) : '0.00';

    return { avgRating, totalRevenue, totalOrders, conversionRate, avgOrderValue, totalUsers };
  }, [productsData, usersData, cartsData]);

  // Rating distribution chart data
  const ratingDistribution = useMemo(() => {
    const products = productsData?.products ?? [];
    const buckets = { '1-2': 0, '2-3': 0, '3-4': 0, '4-5': 0 };
    products.forEach((p) => {
      if (p.rating < 2) buckets['1-2']++;
      else if (p.rating < 3) buckets['2-3']++;
      else if (p.rating < 4) buckets['3-4']++;
      else buckets['4-5']++;
    });
    return Object.entries(buckets).map(([range, count]) => ({ range, count }));
  }, [productsData]);

  // Revenue by cart (simulated trend)
  const revenueTrend = useMemo(() => {
    const carts = cartsData?.carts ?? [];
    return carts.slice(0, 10).map((c, i) => ({
      order: `#${c.id}`,
      revenue: c.total,
      discounted: c.discountedTotal,
    }));
  }, [cartsData]);

  // Category performance
  const categoryPerf = useMemo(() => {
    const products = productsData?.products ?? [];
    const map: Record<string, { count: number; totalRating: number; totalStock: number }> = {};
    products.forEach((p) => {
      if (!map[p.category]) map[p.category] = { count: 0, totalRating: 0, totalStock: 0 };
      map[p.category]!.count++;
      map[p.category]!.totalRating += p.rating;
      map[p.category]!.totalStock += p.stock;
    });
    return Object.entries(map)
      .map(([cat, v]) => ({
        category: cat.replace(/-/g, ' '),
        avgRating: parseFloat((v.totalRating / v.count).toFixed(2)),
        products: v.count,
        stock: v.totalStock,
      }))
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 8);
  }, [productsData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Performance Metrics</h1>
        <p className="text-sm text-muted-foreground">
          Key performance indicators across products, users, and revenue
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <KpiCard title="Avg Product Rating" value={kpis.avgRating} sub="Across all products" icon={Star} trend="up" loading={isLoading} />
        <KpiCard title="Total Revenue" value={`$${kpis.totalRevenue.toLocaleString()}`} sub="From all orders" icon={DollarSign} trend="up" loading={isLoading} />
        <KpiCard title="Total Orders" value={kpis.totalOrders.toString()} sub="Carts processed" icon={ShoppingCart} trend="up" loading={isLoading} />
        <KpiCard title="Total Users" value={kpis.totalUsers.toString()} sub="Registered accounts" icon={Users} loading={isLoading} />
        <KpiCard title="Conversion Rate" value={`${kpis.conversionRate}%`} sub="Orders / Users" icon={Zap} loading={isLoading} />
        <KpiCard title="Avg Order Value" value={`$${kpis.avgOrderValue}`} sub="Per cart" icon={TrendingUp} trend="up" loading={isLoading} />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Discounted</CardTitle>
            <CardDescription>Order revenue comparison (last 10 orders)</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[240px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={revenueTrend} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="order" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="discounted" name="Discounted" stroke="hsl(var(--primary) / 0.5)" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Products grouped by rating range</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[240px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={ratingDistribution} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Products" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>Average rating and stock by category</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Products</th>
                  <th className="text-left p-4 font-medium">Avg Rating</th>
                  <th className="text-left p-4 font-medium">Total Stock</th>
                  <th className="text-left p-4 font-medium">Rating</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td key={j} className="p-4"><Skeleton className="h-4 w-full" /></td>
                        ))}
                      </tr>
                    ))
                  : categoryPerf.map((cat) => (
                      <tr key={cat.category} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium capitalize">{cat.category}</td>
                        <td className="p-4 text-muted-foreground">{cat.products}</td>
                        <td className="p-4 font-semibold">{cat.avgRating}</td>
                        <td className="p-4 text-muted-foreground">{cat.stock.toLocaleString()}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < Math.round(cat.avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
