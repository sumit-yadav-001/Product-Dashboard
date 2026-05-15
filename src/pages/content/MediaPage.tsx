import React, { useState } from 'react';
import { Image, Search, Grid, List } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/common/Skeletons';
import { useGetProductsQuery } from '@/store/api/productsApi';

export function MediaPage() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const { data, isLoading, error, refetch } = useGetProductsQuery({ limit: 20 });

  const mediaItems = React.useMemo(() => {
    if (!data?.products) return [];
    const q = search.toLowerCase();
    return data.products
      .filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .map((p) => ({
        id: p.id,
        title: p.title,
        url: p.thumbnail,
        category: p.category,
        type: 'image/jpeg',
        size: `${(Math.random() * 500 + 100).toFixed(0)} KB`,
      }));
  }, [data, search]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Image className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Failed to load media</h3>
        <button onClick={() => refetch()} className="text-sm text-primary underline">Try again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-sm text-muted-foreground">Browse and manage your media assets</p>
        </div>
        <Button>Upload Media</Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center border rounded-md">
          <Button
            variant={view === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-9 w-9 rounded-r-none"
            onClick={() => setView('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-9 w-9 rounded-l-none"
            onClick={() => setView('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        {!isLoading && (
          <Badge variant="secondary">{mediaItems.length} items</Badge>
        )}
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {isLoading
            ? Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))
            : mediaItems.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg border bg-muted aspect-square">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <Badge className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.size}</p>
                </div>
              ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Preview</th>
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-4"><Skeleton className="h-10 w-10 rounded" /></td>
                          <td className="p-4"><Skeleton className="h-4 w-48" /></td>
                          <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                          <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                          <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                        </tr>
                      ))
                    : mediaItems.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-4">
                            <img src={item.url} alt={item.title} className="h-10 w-10 rounded object-cover" />
                          </td>
                          <td className="p-4 font-medium">{item.title}</td>
                          <td className="p-4">
                            <Badge variant="secondary" className="capitalize">{item.category}</Badge>
                          </td>
                          <td className="p-4 text-muted-foreground">{item.type}</td>
                          <td className="p-4 text-muted-foreground">{item.size}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
