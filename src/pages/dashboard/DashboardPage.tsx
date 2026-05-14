import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Package,
  ShoppingCart,
  Eye,
  RefreshCw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useCurrentUser } from '@/hooks/redux';
import { useGetUsersQuery } from '@/store/api/usersApi';
import { useGetProductsQuery } from '@/store/api/productsApi';
import { useGetPostsQuery } from '@/store/api/postsApi';
import { useGetCartsQuery } from '@/store/api/cartsApi';
import { Skeleton } from '@/components/common/Skeletons';

// ─── Static chart data ────────────────────────────────────────────────────────
const revenueData = [
  { month: 'Jan', revenue: 18400, users: 240 },
  { month: 'Feb', revenue: 22100, users: 310 },
  { month: 'Mar', revenue: 19800, users: 280 },
  { month: 'Apr', revenue: 26500, users: 390 },
  { month: 'May', revenue: 31200, users: 450 },
  { month: 'Jun', revenue: 28900, users: 420 },
  { month: 'Jul', revenue: 35600, users: 510 },
  { month: 'Aug', revenue: 38200, users: 560 },
  { month: 'Sep', revenue: 33100, users: 490 },
  { month: 'Oct', revenue: 41800, users: 620 },
  { month: 'Nov', revenue: 45200, users: 680 },
  { month: 'Dec', revenue: 52100, users: 750 },
];

const categoryData = [
  { name: 'Electronics', value: 4200 },
  { name: 'Clothing', value: 3100 },
  { name: 'Furniture', value: 2800 },
  { name: 'Groceries', value: 1900 },
  { name: 'Beauty', value: 1400 },
];

// ─── Metric Card ──────────────────────────────────────────────────────────────
interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
}

function MetricCard({ title, value, change, trend, icon: Icon, loading }: MetricCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded" />
          </div>
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-32" />
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
        <div className="flex items-center text-xs mt-1">
          {trend === 'up' ? (
            <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
          ) : (
            <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
          )}
          <span className={trend === 'up' ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
            {change}
          </span>
          <span className="ml-1 text-muted-foreground">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Recent Activity ──────────────────────────────────────────────────────────
interface RecentActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  status: 'success' | 'warning' | 'error';
}

const recentActivity: RecentActivityItem[] = [
  { id: '1', user: 'John Doe', action: 'Created new project', time: '2 min ago', status: 'success' },
  { id: '2', user: 'Jane Smith', action: 'Updated user profile', time: '5 min ago', status: 'success' },
  { id: '3', user: 'Bob Johnson', action: 'Failed login attempt', time: '10 min ago', status: 'error' },
  { id: '4', user: 'Alice Brown', action: 'Exported data report', time: '15 min ago', status: 'warning' },
  { id: '5', user: 'Charlie Wilson', action: 'Deleted old records', time: '1 hr ago', status: 'success' },
];

const statusConfig = {
  success: { dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  warning: { dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  error:   { dot: 'bg-red-500',   badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

function RecentActivityList() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions from your team</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View all</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuItem>Filter</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.map((item) => {
            const cfg = statusConfig[item.status];
            return (
              <div key={item.id} className="flex items-start gap-3">
                <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate">{item.user}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-muted-foreground truncate">{item.action}</p>
                    <span className={`shrink-0 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${cfg.badge}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.dataKey === 'revenue' ? `$${p.value.toLocaleString()}` : p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function DashboardPage() {
  const { t } = useTranslation();
  const user = useCurrentUser();

  const { data: usersData,    isLoading: usersLoading,    refetch: refetchUsers }    = useGetUsersQuery({ limit: 10 });
  const { data: productsData, isLoading: productsLoading, refetch: refetchProducts } = useGetProductsQuery({ limit: 10 });
  const { data: postsData,    isLoading: postsLoading,    refetch: refetchPosts }    = useGetPostsQuery({ limit: 10 });
  const { data: cartsData,    isLoading: cartsLoading }                              = useGetCartsQuery({ limit: 10 });

  const isLoading = usersLoading || productsLoading || postsLoading || cartsLoading;

  const metrics = useMemo(() => {
    const totalUsers    = usersData?.total    || 0;
    const totalProducts = productsData?.total || 0;
    const totalRevenue  = cartsData?.carts.reduce((s, c) => s + c.total, 0) || 0;
    const totalViews    = postsData?.posts.reduce((s, p) => s + p.views, 0) || 0;

    return [
      { title: 'Total Users',    value: totalUsers.toLocaleString(),    change: '+20.1%', trend: 'up'   as const, icon: Users },
      { title: 'Total Products', value: totalProducts.toLocaleString(), change: '+15.3%', trend: 'up'   as const, icon: Package },
      { title: 'Revenue',        value: `$${totalRevenue.toLocaleString()}`, change: '+12.5%', trend: 'up' as const, icon: DollarSign },
      { title: 'Page Views',     value: totalViews.toLocaleString(),    change: '-2.4%',  trend: 'down' as const, icon: Eye },
    ];
  }, [usersData, productsData, postsData, cartsData]);

  const handleRefresh = () => {
    refetchUsers();
    refetchProducts();
    refetchPosts();
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t('dashboard.welcome', 'Dashboard')}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            {user?.name ? `Welcome back, ${user.name}! ` : ''}
            Here's what's happening with your application today.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="shrink-0"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <MetricCard key={i} {...metric} loading={isLoading} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Revenue Area Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue and user growth</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="lg:col-span-3">
          <RecentActivityList />
        </div>
      </div>

      {/* Bar Chart + Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Category Bar Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Top performing product categories</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Users,       label: 'Add User',       color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30' },
                { icon: TrendingUp,  label: 'View Reports',   color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' },
                { icon: DollarSign,  label: 'Manage Billing', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30' },
                { icon: Activity,    label: 'System Health',  color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/30' },
                { icon: Package,     label: 'Add Product',    color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/30' },
                { icon: ShoppingCart,label: 'View Orders',    color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/30' },
              ].map(({ icon: Icon, label, color }) => (
                <Button
                  key={label}
                  variant="outline"
                  className="h-16 flex-col gap-1.5 text-xs font-medium hover:shadow-sm transition-all"
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
