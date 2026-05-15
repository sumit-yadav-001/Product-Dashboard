import { useMemo, useState } from 'react';
import { FileText, RefreshCw, Filter, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/common/Skeletons';
import { useGetUsersQuery } from '@/store/api/usersApi';

type LogLevel = 'info' | 'success' | 'warning' | 'error';

const LOG_ACTIONS = [
  'User logged in', 'Profile updated', 'Password changed', 'Data exported',
  'Settings saved', 'API key generated', 'Report generated', 'User created',
  'Permission granted', 'Session expired', 'Login failed', 'Backup completed',
];

const LOG_LEVELS: LogLevel[] = ['info', 'success', 'warning', 'error'];

const levelConfig: Record<LogLevel, { icon: typeof Info; color: string; bg: string }> = {
  info:    { icon: Info,          color: 'text-blue-600',   bg: 'bg-blue-100 dark:bg-blue-900/30' },
  success: { icon: CheckCircle2,  color: 'text-emerald-600',bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  warning: { icon: AlertTriangle, color: 'text-amber-600',  bg: 'bg-amber-100 dark:bg-amber-900/30' },
  error:   { icon: AlertCircle,   color: 'text-red-600',    bg: 'bg-red-100 dark:bg-red-900/30' },
};

export function LogsPage() {
  const [filter, setFilter] = useState<LogLevel | 'all'>('all');
  const [search, setSearch] = useState('');
  const { data: usersData, isLoading, refetch } = useGetUsersQuery({ limit: 20 });

  const logs = useMemo(() => {
    if (!usersData?.users) return [];
    return usersData.users.map((u, i) => {
      const level = LOG_LEVELS[i % 4] as LogLevel;
      const action = LOG_ACTIONS[i % LOG_ACTIONS.length]!;
      const minutesAgo = i * 7 + Math.floor(i / 3) * 15;
      const time = minutesAgo < 60
        ? `${minutesAgo}m ago`
        : `${Math.floor(minutesAgo / 60)}h ${minutesAgo % 60}m ago`;
      return {
        id: u.id,
        user: `${u.firstName} ${u.lastName}`,
        email: u.email,
        action,
        level,
        time,
        ip: `192.168.${(u.id % 5) + 1}.${(u.id * 13) % 255}`,
      };
    });
  }, [usersData]);

  const filtered = useMemo(() => {
    return logs.filter(l => {
      const matchLevel = filter === 'all' || l.level === filter;
      const matchSearch = !search || l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase());
      return matchLevel && matchSearch;
    });
  }, [logs, filter, search]);

  const counts = useMemo(() => ({
    info:    logs.filter(l => l.level === 'info').length,
    success: logs.filter(l => l.level === 'success').length,
    warning: logs.filter(l => l.level === 'warning').length,
    error:   logs.filter(l => l.level === 'error').length,
  }), [logs]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">System Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor system activity and audit trail</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Level summary */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {(Object.entries(levelConfig) as [LogLevel, typeof levelConfig[LogLevel]][]).map(([level, cfg]) => {
          const Icon = cfg.icon;
          return (
            <button
              key={level}
              onClick={() => setFilter(filter === level ? 'all' : level)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                filter === level ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/40'
              }`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cfg.bg}`}>
                <Icon className={`h-4 w-4 ${cfg.color}`} />
              </div>
              <div>
                <p className="text-lg font-bold">{counts[level]}</p>
                <p className="text-xs text-muted-foreground capitalize">{level}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter by user or action…"
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'info', 'success', 'warning', 'error'] as const).map(l => (
            <Button
              key={l}
              variant={filter === l ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(l)}
              className="capitalize"
            >
              {l}
            </Button>
          ))}
        </div>
      </div>

      {/* Log table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Activity Log
            <Badge variant="secondary">{filtered.length} entries</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-1.5">
              {filtered.map(log => {
                const cfg = levelConfig[log.level];
                const Icon = cfg.icon;
                return (
                  <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}>
                      <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{log.user}</p>
                        <p className="text-xs text-muted-foreground truncate">{log.email}</p>
                      </div>
                      <p className="text-sm text-muted-foreground self-center">{log.action}</p>
                      <div className="flex items-center gap-2 sm:justify-end">
                        <span className="text-xs text-muted-foreground font-mono hidden md:block">{log.ip}</span>
                        <span className="text-xs text-muted-foreground">{log.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No logs match your filter</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
