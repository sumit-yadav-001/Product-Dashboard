import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Activity, Users, Eye, MousePointer, Globe,
  Smartphone, Monitor, RefreshCw, Play, Pause, Wifi, WifiOff,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGetUsersQuery } from '@/store/api/usersApi';
import { useGetPostsQuery } from '@/store/api/postsApi';
import { useGetCartsQuery } from '@/store/api/cartsApi';

// ─── Types ────────────────────────────────────────────────────────────────────
interface LiveDataPoint {
  time: string;
  users: number;
  events: number;
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function RealtimePage() {
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [liveData, setLiveData] = useState<LiveDataPoint[]>(() =>
    Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (19 - i) * 3000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      users: Math.floor(Math.random() * 80) + 40,
      events: Math.floor(Math.random() * 200) + 100,
    }))
  );

  const { data: usersData, refetch: refetchUsers } = useGetUsersQuery({ limit: 10 });
  const { data: postsData, refetch: refetchPosts } = useGetPostsQuery({ limit: 10 });
  const { data: cartsData, refetch: refetchCarts } = useGetCartsQuery({ limit: 10 });

  // Simulate live data stream
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const now = new Date();
      setLastUpdate(now);
      setLiveData(prev => {
        const next = [...prev.slice(-19), {
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          users: Math.floor(Math.random() * 80) + 40,
          events: Math.floor(Math.random() * 200) + 100,
        }];
        return next;
      });
      refetchUsers();
      refetchPosts();
      refetchCarts();
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive, refetchUsers, refetchPosts, refetchCarts]);

  const currentMetrics = useMemo(() => {
    const latest = liveData[liveData.length - 1];
    const prev   = liveData[liveData.length - 2];
    const activeUsers   = latest?.users  ?? 0;
    const prevUsers     = prev?.users    ?? activeUsers;
    const totalViews    = postsData?.posts.reduce((s, p) => s + p.views, 0) ?? 0;
    const activeSessions = cartsData?.carts.length ?? 0;
    const totalEvents   = latest?.events ?? 0;

    return [
      { label: 'Active Users',    value: activeUsers,   delta: activeUsers - prevUsers, icon: Users,        color: 'text-blue-600' },
      { label: 'Page Views',      value: totalViews,    delta: 42,                      icon: Eye,          color: 'text-emerald-600' },
      { label: 'Events/Min',      value: totalEvents,   delta: totalEvents - (prev?.events ?? totalEvents), icon: Activity, color: 'text-purple-600' },
      { label: 'Active Sessions', value: activeSessions,delta: 3,                       icon: MousePointer, color: 'text-orange-600' },
    ];
  }, [liveData, postsData, cartsData]);

  const activeUsers = useMemo(() => {
    if (!usersData?.users) return [];
    return usersData.users.slice(0, 6).map(u => ({
      id: u.id.toString(),
      name: `${u.firstName} ${u.lastName}`,
      location: `${u.address.city}, ${u.address.country}`,
      page: ['/dashboard', '/products', '/analytics', '/settings', '/profile'][u.id % 5],
      duration: `${Math.floor(u.age / 10)}m ${u.age % 60}s`,
      device: (['desktop', 'mobile', 'tablet'] as const)[u.id % 3] as 'desktop' | 'mobile' | 'tablet',
    }));
  }, [usersData]);

  const topPages = useMemo(() => {
    if (!postsData?.posts) return [];
    const maxViews = Math.max(...postsData.posts.map(p => p.views), 1);
    return postsData.posts.slice(0, 5).map(p => ({
      page: `/post/${p.id}`,
      views: p.views,
      pct: Math.round((p.views / maxViews) * 100),
    }));
  }, [postsData]);

  const deviceBreakdown = [
    { device: 'Desktop', count: 456, pct: 65 },
    { device: 'Mobile',  count: 198, pct: 28 },
    { device: 'Tablet',  count: 49,  pct: 7 },
  ];

  const DeviceIcon = (d: string) => d === 'mobile' ? Smartphone : Monitor;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Real-time Analytics</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Monitor live user activity and system performance
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isLive ? 'default' : 'secondary'} className="flex items-center gap-1 text-xs">
            {isLive ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isLive ? 'Live' : 'Paused'}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setIsLive(v => !v)}>
            {isLive ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            {isLive ? 'Pause' : 'Resume'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => { refetchUsers(); refetchPosts(); refetchCarts(); }}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Last updated: {lastUpdate.toLocaleTimeString()}
        {isLive && <span className="ml-2 inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />auto-refreshing every 3s</span>}
      </p>

      {/* Live Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {currentMetrics.map(({ label, value, delta, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value.toLocaleString()}</div>
              <p className={`text-xs mt-1 ${delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                {delta > 0 ? '+' : ''}{delta} in last minute
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Live Activity Stream</CardTitle>
          <CardDescription>Active users and events per second (last 60s)</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={liveData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="users"  name="Active Users" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="events" name="Events"       stroke="hsl(var(--primary) / 0.5)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Active Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Active Users Right Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {activeUsers.map((u) => {
                const DIcon = DeviceIcon(u.device);
                return (
                  <div key={u.id} className="flex items-center gap-3 py-1">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <DIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.page} · {u.location}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{u.duration}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Top Pages (Last 30 mins)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPages.map((p) => (
              <div key={p.page} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium truncate">{p.page}</span>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">{p.views.toLocaleString()} views</span>
                </div>
                <Progress value={p.pct} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Device Breakdown + System Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              {deviceBreakdown.map((d) => (
                <div key={d.device} className="space-y-2">
                  <div className="text-2xl font-bold">{d.count}</div>
                  <div className="text-sm text-muted-foreground">{d.device}</div>
                  <Progress value={d.pct} className="h-2" />
                  <div className="text-xs text-muted-foreground">{d.pct}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Server Load',           value: 23,  display: '23%' },
              { label: 'Memory Usage',          value: 67,  display: '67%' },
              { label: 'Database Connections',  value: 12,  display: '12/100' },
              { label: 'Cache Hit Rate',        value: 94,  display: '94%' },
            ].map(({ label, value, display }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{display}</span>
                </div>
                <Progress value={value} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
