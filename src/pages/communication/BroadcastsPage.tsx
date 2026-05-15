import React from 'react';
import { Globe, Send, Users, CheckCircle, Clock, XCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const broadcasts = [
  {
    id: 1,
    title: 'Summer Sale Announcement',
    message: 'Exciting summer deals are here! Get up to 50% off on selected products.',
    audience: 'All Users',
    recipients: 2847,
    opened: 1923,
    status: 'Sent',
    sentAt: 'Jun 15, 2024 10:00 AM',
  },
  {
    id: 2,
    title: 'New Feature: Dark Mode',
    message: 'We\'ve launched dark mode! Update your preferences in Settings.',
    audience: 'Active Users',
    recipients: 1456,
    opened: 1102,
    status: 'Sent',
    sentAt: 'Jun 10, 2024 2:30 PM',
  },
  {
    id: 3,
    title: 'Scheduled Maintenance Notice',
    message: 'The platform will be down for maintenance on June 20 from 2-4 AM UTC.',
    audience: 'All Users',
    recipients: 2847,
    opened: 2100,
    status: 'Sent',
    sentAt: 'Jun 8, 2024 9:00 AM',
  },
  {
    id: 4,
    title: 'Monthly Newsletter - June',
    message: 'Check out what\'s new this month: product updates, tips, and community highlights.',
    audience: 'Newsletter Subscribers',
    recipients: 890,
    opened: 0,
    status: 'Scheduled',
    sentAt: 'Jun 30, 2024 8:00 AM',
  },
  {
    id: 5,
    title: 'Security Update Required',
    message: 'Please update your password to comply with our new security policy.',
    audience: 'All Users',
    recipients: 2847,
    opened: 0,
    status: 'Draft',
    sentAt: '—',
  },
  {
    id: 6,
    title: 'Welcome to Premium',
    message: 'Congratulations on upgrading! Here\'s everything you can do with your new plan.',
    audience: 'Premium Users',
    recipients: 312,
    opened: 298,
    status: 'Sent',
    sentAt: 'May 28, 2024 11:00 AM',
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Sent: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    Failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    Sent: CheckCircle,
    Scheduled: Clock,
    Draft: XCircle,
  };
  const Icon = icons[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? ''}`}>
      {Icon && <Icon className="h-3 w-3" />}
      {status}
    </span>
  );
}

export function BroadcastsPage() {
  const stats = {
    total: broadcasts.length,
    sent: broadcasts.filter((b) => b.status === 'Sent').length,
    scheduled: broadcasts.filter((b) => b.status === 'Scheduled').length,
    totalReach: broadcasts.filter((b) => b.status === 'Sent').reduce((s, b) => s + b.recipients, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Broadcasts</h1>
          <p className="text-sm text-muted-foreground">Send mass communications to your users</p>
        </div>
        <Button>
          <Send className="h-4 w-4 mr-2" />
          New Broadcast
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Broadcasts', value: stats.total, icon: Globe },
          { label: 'Sent', value: stats.sent, icon: CheckCircle },
          { label: 'Scheduled', value: stats.scheduled, icon: Clock },
          { label: 'Total Reach', value: stats.totalReach.toLocaleString(), icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
                <Icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Broadcasts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Broadcast History</CardTitle>
          <CardDescription>All past and scheduled broadcasts</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Title</th>
                  <th className="text-left p-4 font-medium">Audience</th>
                  <th className="text-left p-4 font-medium">Recipients</th>
                  <th className="text-left p-4 font-medium">Open Rate</th>
                  <th className="text-left p-4 font-medium">Sent At</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {broadcasts.map((b) => {
                  const openRate = b.recipients > 0 && b.opened > 0
                    ? `${Math.round((b.opened / b.recipients) * 100)}%`
                    : '—';
                  return (
                    <tr key={b.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <p className="font-medium">{b.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{b.message}</p>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="text-xs">{b.audience}</Badge>
                      </td>
                      <td className="p-4 font-semibold">{b.recipients.toLocaleString()}</td>
                      <td className="p-4 text-muted-foreground">{openRate}</td>
                      <td className="p-4 text-muted-foreground text-xs">{b.sentAt}</td>
                      <td className="p-4"><StatusBadge status={b.status} /></td>
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
