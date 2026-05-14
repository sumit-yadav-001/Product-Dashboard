import React, { useMemo } from 'react';
import {
  Activity, Users, ShoppingCart, TrendingUp, Eye,
  Clock, DollarSign, Target, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetUsersQuery } from '@/store/api/usersApi';
import { useGetProductsQuery } from '@/store/api/productsApi';
import { useGetPostsQuery } from '@/store/api/postsApi';
import { useGetCartsQuery } from '@/store/api/cartsApi';
import { Skeleton } from '@/components/common/Skeletons';

// ─── Static chart data ────────────────────────────────────────────────────────
const trafficData = [
  { day: 'Mon', sessions: 1200, pageViews: 3400, bounceRate: 42 },
  { day: 'Tue', sessions: 1900, pageViews: 4800, bounceRate: 38 },
  { day: 'Wed', sessions: 1600, pageViews: 4100, bounceRate: 45 },
  { day: 'Thu', sessions: 2200, pageViews: 5600, bounceRate: 35 },
  { day: 'Fri', sessions: 2800, pageViews: 7200, bounceRate: 32 },
  { day: 'Sat', sessions: 1400, pageViews: 3600, bounceRate: 48 },
  { day: 'Sun', sessions: 1100, pageViews: 2900, bounceRate: 52 },
];

const deviceData = [
  { name: 'Desktop', value: 58, color: 'hsl(var(--primary))' },
  { name: 'Mobile',  value: 32, color: 'hsl(var(--primary) / 0.6)' },
  { name: 'Tablet',  value: 10, color: 'hsl(var(--primary) / 0.3)' },
];

// ─── Metric Card ──────────────────────────────────────────────────────────────
interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
}

function MetricCard({ title, value, change, changeType, icon: Icon, loading }: MetricCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  const changeColor = {
    positive: 'text-emerald-600',
    negative: 'text-red-600',
    neutral:  'text-muted-foreground',
  }[changeType];

  const TrendIcon = changeType === 'positive' ? ArrowUpRight : changeType === 'negative' ? ArrowDownRight : null;

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
        <p className={`text-xs flex items-center gap-0.5 mt-1 ${changeColor}`}>
          {TrendIcon && <TrendIcon className="h-3 w-3" />}
          <span className="font-medium">{change}</span>
          <span className="text-muted-foreground ml-1">from last month</span>
        </p>
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
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AnalyticsPage() {
  const { data: usersData,    isLoading: usersLoading }    = useGetUsersQuery({ limit: 10 });
  const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({ limit: 10 });
  const { data: postsData,    isLoading: postsLoading }    = useGetPostsQuery({ limit: 10 });
  const { data: cartsData,    isLoading: cartsLoading }    = useGetCartsQuery({ limit: 10 });

  const isLoading = usersLoading || productsLoading || postsLoading || cartsLoading;

  const metrics = useMemo(() => {
    const totalUsers    = usersData?.total || 0;
    const totalRevenue  = cartsData?.carts.reduce((s, c) => s + c.total, 0) || 0;
    const totalViews    = postsData?.posts.reduce((s, p) => s + p.views, 0) || 0;
    const totalCarts    = cartsData?.total || 0;
    const conversionRate = totalUsers > 0 ? ((totalCarts / totalUsers) * 100).toFixed(1) : '0.0';

    return [
      { title: 'Total Revenue',    value: `$${totalRevenue.toLocaleString()}`, change: '+20.1%', changeType: 'positive' as const, icon: DollarSign },
      { title: 'Active Users',     value: totalUsers.toLocaleString(),         change: '+18.1%', changeType: 'positive' as const, icon: Users },
      { title: 'Page Views',       value: totalViews.toLocaleString(),         change: '+19%',   changeType: 'positive' as const, icon: Eye },
      { title: 'Conversion Rate',  value: `${conversionRate}%`,               change: '-2.4%',  changeType: 'negative' as const, icon: Target },
    ];
  }, [usersData, postsData, cartsData]);

  const topPages = useMemo(() => {
    if (!postsData?.posts) return [];
    return postsData.posts.slice(0, 5).map(post => ({
      path: `/post/${post.id}`,
      views: post.views,
      change: +(((post.reactions.likes - post.reactions.dislikes) / 10).toFixed(1)),
    }));
  }, [postsData]);

  const recentActivity = [
    { action: 'New user registration',   time: '2 min ago',  type: 'user' },
    { action: 'Order #1234 completed',   time: '5 min ago',  type: 'order' },
    { action: 'System backup completed', time: '10 min ago', type: 'system' },
    { action: 'New feature deployed',    time: '15 min ago', type: 'system' },
    { action: 'User profile updated',    time: '20 min ago', type: 'user' },
  ];

  const activityDot: Record<string, string> = {
    user:   'bg-blue-500',
    order:  'bg-emerald-500',
    system: 'bg-slate-400',
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics Overview</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Monitor your application's performance and user engagement
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Last 30 days
          </Button>
          <Button size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <MetricCard key={m.title} {...m} loading={isLoading} />
        ))}
      </div>

      {/* Traffic Chart + Top Pages */}
      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Sessions and page views this week</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trafficData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="hsl(var(--primary) / 0.5)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary) / 0.5)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="sessions"  name="Sessions"   stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorSessions)" />
                <Area type="monotone" dataKey="pageViews" name="Page Views" stroke="hsl(var(--primary) / 0.5)" strokeWidth={2} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                  ))
                : topPages.map((page) => (
                    <div key={page.path} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{page.path}</p>
                        <p className="text-xs text-muted-foreground">{page.views.toLocaleString()} views</p>
                      </div>
                      <Badge
                        variant={page.change >= 0 ? 'default' : 'secondary'}
                        className={`text-xs shrink-0 ${page.change >= 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-0' : ''}`}
                      >
                        {page.change >= 0 ? '+' : ''}{page.change}%
                      </Badge>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Breakdown + Performance + Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Device Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>Traffic by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {deviceData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => `${v}%`} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>System health indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Avg Load Time',       value: '1.2s',  ok: true },
                { label: 'Server Response',     value: '145ms', ok: true },
                { label: 'Uptime',              value: '99.9%', ok: true },
                { label: 'Error Rate',          value: '0.1%',  ok: false },
                { label: 'Bounce Rate',         value: '32.4%', ok: true },
                { label: 'Pages per Session',   value: '3.2',   ok: true },
              ].map(({ label, value, ok }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{label}</span>
                  <span className={`text-sm font-semibold ${ok ? 'text-emerald-600' : 'text-red-600'}`}>{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${activityDot[a.type]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none">{a.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
