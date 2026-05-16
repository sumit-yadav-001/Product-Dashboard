import React, { useMemo } from 'react';
import { Tag } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/common/Skeletons';
import { useGetPostsQuery } from '@/store/api/postsApi';

const TAG_COLORS = [
  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
];

export function TagsPage() {
  const { data, isLoading, error, refetch } = useGetPostsQuery({ limit: 100 });

  const tags = useMemo(() => {
    if (!data?.posts) return [];
    const map: Record<string, number> = {};
    data.posts.forEach((post) => {
      post.tags.forEach((tag) => {
        map[tag] = (map[tag] || 0) + 1;
      });
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Tag className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Failed to load tags</h3>
        <button onClick={() => refetch()} className="text-sm text-primary underline">Try again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Content Tags</h1>
          <p className="text-sm text-muted-foreground">All tags extracted from posts</p>
        </div>
        {!isLoading && (
          <Badge variant="secondary" className="w-fit">{tags.length} unique tags</Badge>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Unique Tags</p>
            {isLoading ? <Skeleton className="h-8 w-12 mt-1" /> : (
              <p className="text-2xl font-bold">{tags.length}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Most Used</p>
            {isLoading ? <Skeleton className="h-8 w-24 mt-1" /> : (
              <p className="text-2xl font-bold">{tags[0]?.name ?? '—'}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Tag Uses</p>
            {isLoading ? <Skeleton className="h-8 w-12 mt-1" /> : (
              <p className="text-2xl font-bold">{tags.reduce((s, t) => s + t.count, 0)}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tag Cloud */}
      <Card>
        <CardHeader>
          <CardTitle>Tag Cloud</CardTitle>
          <CardDescription>Size indicates usage frequency</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} style={{ width: `${(i % 3 === 0 ? 80 : i % 3 === 1 ? 60 : 100)}px` }}>
                  <Skeleton className="h-7 rounded-full w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => {
                const colorClass = TAG_COLORS[idx % TAG_COLORS.length];
                const maxCount = tags[0]?.count ?? 1;
                const size = tag.count / maxCount;
                const textSize = size > 0.7 ? 'text-base' : size > 0.4 ? 'text-sm' : 'text-xs';
                return (
                  <span
                    key={tag.name}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-medium cursor-pointer hover:opacity-80 transition-opacity ${colorClass} ${textSize}`}
                  >
                    <Tag className="h-3 w-3" />
                    {tag.name}
                    <span className="opacity-60 text-xs">({tag.count})</span>
                  </span>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tags Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tag Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Tag</th>
                  <th className="text-left p-4 font-medium">Usage Count</th>
                  <th className="text-left p-4 font-medium">Popularity</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-4"><Skeleton className="h-5 w-24 rounded-full" /></td>
                        <td className="p-4"><Skeleton className="h-4 w-12" /></td>
                        <td className="p-4"><Skeleton className="h-2 w-32" /></td>
                      </tr>
                    ))
                  : tags.slice(0, 20).map((tag, idx) => {
                      const maxCount = tags[0]?.count ?? 1;
                      const pct = Math.round((tag.count / maxCount) * 100);
                      const colorClass = TAG_COLORS[idx % TAG_COLORS.length];
                      return (
                        <tr key={tag.name} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
                              <Tag className="h-3 w-3" />
                              {tag.name}
                            </span>
                          </td>
                          <td className="p-4 font-semibold">{tag.count}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-muted rounded-full h-2 max-w-[120px]">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{pct}%</span>
                            </div>
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
