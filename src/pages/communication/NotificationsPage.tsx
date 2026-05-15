import React, { useState } from 'react';
import { Bell, FileText, Eye, ThumbsUp, Check, CheckCheck } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/common/Skeletons';
import { useGetPostsQuery } from '@/store/api/postsApi';
import { cn } from '@/utils';

export function NotificationsPage() {
  const { data, isLoading, error, refetch } = useGetPostsQuery({ limit: 20 });
  const [readIds, setReadIds] = useState<Set<number>>(new Set());

  const notifications = React.useMemo(() => {
    if (!data?.posts) return [];
    return data.posts.map((post, idx) => ({
      id: post.id,
      type: idx % 3 === 0 ? 'post' : idx % 3 === 1 ? 'reaction' : 'view',
      title: idx % 3 === 0
        ? `New post published: "${post.title.slice(0, 40)}…"`
        : idx % 3 === 1
        ? `Your post received ${post.reactions.likes} likes`
        : `Post "${post.title.slice(0, 30)}…" reached ${post.views} views`,
      body: post.body.slice(0, 80) + '…',
      time: `${(idx % 24) + 1}h ago`,
      tags: post.tags.slice(0, 2),
    }));
  }, [data]);

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const markAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  const markRead = (id: number) => {
    setReadIds((prev) => new Set([...prev, id]));
  };

  const typeIcon = {
    post: FileText,
    reaction: ThumbsUp,
    view: Eye,
  };

  const typeColor = {
    post: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
    reaction: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30',
    view: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30',
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Bell className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Failed to load notifications</h3>
        <button onClick={() => refetch()} className="text-sm text-primary underline">Try again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">Stay up to date with your activity</p>
        </div>
        <div className="flex items-center gap-3">
          {!isLoading && unreadCount > 0 && (
            <Badge className="bg-primary text-primary-foreground">{unreadCount} unread</Badge>
          )}
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all read
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4 p-4 border-b">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))
            : notifications.map((notif) => {
                const isRead = readIds.has(notif.id);
                const Icon = typeIcon[notif.type as keyof typeof typeIcon];
                const colorClass = typeColor[notif.type as keyof typeof typeColor];
                return (
                  <div
                    key={notif.id}
                    className={cn(
                      'flex items-start gap-4 p-4 border-b hover:bg-muted/30 transition-colors',
                      !isRead && 'bg-primary/5'
                    )}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn('text-sm', !isRead && 'font-semibold')}>{notif.title}</p>
                        {!isRead && (
                          <button
                            onClick={() => markRead(notif.id)}
                            className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{notif.body}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs text-muted-foreground">{notif.time}</span>
                        {notif.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
        </CardContent>
      </Card>
    </div>
  );
}
