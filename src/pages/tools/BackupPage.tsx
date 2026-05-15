import { useState } from 'react';
import { Database, Download, RefreshCw, CheckCircle2, Clock, AlertCircle, Loader2, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import toast from 'react-hot-toast';

const BACKUPS = [
  { id: 1, name: 'Full Backup', date: 'May 15, 2026 02:00 AM', size: '2.4 GB', status: 'success', type: 'auto' },
  { id: 2, name: 'Full Backup', date: 'May 14, 2026 02:00 AM', size: '2.3 GB', status: 'success', type: 'auto' },
  { id: 3, name: 'Manual Backup', date: 'May 13, 2026 11:32 AM', size: '2.3 GB', status: 'success', type: 'manual' },
  { id: 4, name: 'Full Backup', date: 'May 13, 2026 02:00 AM', size: '2.2 GB', status: 'failed', type: 'auto' },
  { id: 5, name: 'Full Backup', date: 'May 12, 2026 02:00 AM', size: '2.2 GB', status: 'success', type: 'auto' },
];

export function BackupPage() {
  const [creating, setCreating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleCreateBackup = async () => {
    setCreating(true);
    setProgress(0);
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 80));
      setProgress(i);
    }
    setCreating(false);
    setProgress(0);
    toast.success('Backup created successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Backup Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and restore system backups</p>
        </div>
        <Button onClick={handleCreateBackup} disabled={creating}>
          {creating
            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating…</>
            : <><Database className="mr-2 h-4 w-4" />Create Backup</>
          }
        </Button>
      </div>

      {/* Progress */}
      {creating && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Creating backup…</span>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: CheckCircle2, label: 'Last Backup', value: '13 hours ago', color: 'text-emerald-600' },
          { icon: Database,     label: 'Total Backups', value: '47 backups', color: 'text-blue-600' },
          { icon: Shield,       label: 'Storage Used', value: '18.2 GB / 50 GB', color: 'text-violet-600' },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Backup schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-primary" />
            Backup Schedule
          </CardTitle>
          <CardDescription>Automated backup configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Daily Full Backup', time: '2:00 AM UTC', enabled: true },
              { label: 'Weekly Archive', time: 'Sunday 3:00 AM', enabled: true },
              { label: 'Monthly Snapshot', time: '1st of month', enabled: false },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
                <Badge className={item.enabled
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-muted text-muted-foreground'
                }>
                  {item.enabled ? 'Active' : 'Disabled'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Backup history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Backup History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {BACKUPS.map(backup => (
              <div key={backup.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  {backup.status === 'success'
                    ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    : <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                  }
                  <div>
                    <p className="text-sm font-medium">{backup.name}</p>
                    <p className="text-xs text-muted-foreground">{backup.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground hidden sm:block">{backup.size}</span>
                  <Badge variant="outline" className="text-xs capitalize">{backup.type}</Badge>
                  {backup.status === 'success' && (
                    <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => toast.success('Download started')}>
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => toast.success('Restore initiated')}>
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
