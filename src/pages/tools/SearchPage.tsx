import { useState, useMemo } from 'react';
import { Search, Package, Users, FileText, Loader2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGetProductsQuery } from '@/store/api/productsApi';
import { useGetUsersQuery } from '@/store/api/usersApi';
import { useGetPostsQuery } from '@/store/api/postsApi';
import { useDebounce } from '@/hooks/useDebounce';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const { data: productsData, isFetching: pFetching } = useGetProductsQuery(
    { limit: 100, q: debouncedQuery || undefined },
    { skip: debouncedQuery.length < 2 }
  );
  const { data: usersData, isFetching: uFetching } = useGetUsersQuery(
    { limit: 50, q: debouncedQuery || undefined },
    { skip: debouncedQuery.length < 2 }
  );
  const { data: postsData, isFetching: poFetching } = useGetPostsQuery(
    { limit: 50, q: debouncedQuery || undefined },
    { skip: debouncedQuery.length < 2 }
  );

  const isLoading = pFetching || uFetching || poFetching;

  const results = useMemo(() => {
    if (debouncedQuery.length < 2) return { products: [], users: [], posts: [] };
    const q = debouncedQuery.toLowerCase();
    return {
      products: (productsData?.products ?? []).filter(
        p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      ).slice(0, 5),
      users: (usersData?.users ?? []).filter(
        u => `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      ).slice(0, 5),
      posts: (postsData?.posts ?? []).filter(
        p => p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q)
      ).slice(0, 5),
    };
  }, [debouncedQuery, productsData, usersData, postsData]);

  const totalResults = results.products.length + results.users.length + results.posts.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Global Search</h1>
        <p className="text-sm text-muted-foreground mt-1">Search across products, users, and posts</p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search everything… (min 2 characters)"
          className="pl-10 pr-10 h-12 text-base"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Searching…
        </div>
      )}

      {/* Results */}
      {debouncedQuery.length >= 2 && !isLoading && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {totalResults} result{totalResults !== 1 ? 's' : ''} for <span className="font-semibold text-foreground">"{debouncedQuery}"</span>
          </p>

          {/* Products */}
          {results.products.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  Products
                  <Badge variant="secondary">{results.products.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {results.products.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <img src={p.thumbnail} alt={p.title} className="h-10 w-10 rounded object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.category} · ${p.price}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      ★ {p.rating}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Users */}
          {results.users.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Users
                  <Badge variant="secondary">{results.users.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {results.users.map(u => (
                  <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <img src={u.image} alt={u.firstName} className="h-10 w-10 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs capitalize">{u.role}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Posts */}
          {results.posts.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Posts
                  <Badge variant="secondary">{results.posts.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {results.posts.map(p => (
                  <div key={p.id} className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <p className="text-sm font-medium">{p.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{p.body}</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {p.tags.slice(0, 3).map(t => (
                        <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">{t}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {totalResults === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No results found</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {debouncedQuery.length < 2 && !query && (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">Start typing to search</p>
          <p className="text-sm mt-1">Search across products, users, and posts simultaneously</p>
        </div>
      )}
    </div>
  );
}
