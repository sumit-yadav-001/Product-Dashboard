import React, { useState } from 'react';
import { FileText, Eye, ThumbsUp, ThumbsDown, Search } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/common/Skeletons';
import { useGetPostsQuery } from '@/store/api/postsApi';

export function PostsPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading, error, refetch } = useGetPostsQuery({ limit: 30 });

  const filtered = React.useMemo(() => {
    if (!data?.posts) return [];
    const q = search.toLowerCase();
    return data.posts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [data, search]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Failed to load posts</h3>
        <button onClick={() => refetch()} className="text-sm text-primary underline">Try again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Posts</h1>
          <p className="text-sm text-muted-foreground">Manage blog posts and articles</p>
        </div>
        {!isLoading && (
          <Badge variant="secondary" className="w-fit">{data?.total ?? 0} total posts</Badge>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search posts or tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `Showing ${filtered.length} posts`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Title</th>
                  <th className="text-left p-4 font-medium">Tags</th>
                  <th className="text-left p-4 font-medium">Views</th>
                  <th className="text-left p-4 font-medium">Reactions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-4"><Skeleton className="h-4 w-64" /></td>
                        <td className="p-4"><Skeleton className="h-5 w-32 rounded-full" /></td>
                        <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                        <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                      </tr>
                    ))
                  : filtered.map((post) => (
                      <tr key={post.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <div className="max-w-xs">
                            <p className="font-medium truncate">{post.title}</p>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{post.body.slice(0, 60)}…</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Eye className="h-3.5 w-3.5" />
                            <span>{post.views.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-emerald-600 text-xs">
                              <ThumbsUp className="h-3 w-3" />
                              {post.reactions.likes}
                            </span>
                            <span className="flex items-center gap-1 text-red-500 text-xs">
                              <ThumbsDown className="h-3 w-3" />
                              {post.reactions.dislikes}
                            </span>
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
