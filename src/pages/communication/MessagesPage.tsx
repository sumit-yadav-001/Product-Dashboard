import React, { useState } from 'react';
import { Mail, Search } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/common/Skeletons';
import { useGetUsersQuery } from '@/store/api/usersApi';
import { useGetQuotesQuery } from '@/store/api/quotesApi';
import { cn } from '@/utils';

export function MessagesPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery({ limit: 15 });
  const { data: quotesData, isLoading: quotesLoading } = useGetQuotesQuery({ limit: 15 });

  const isLoading = usersLoading || quotesLoading;

  const messages = React.useMemo(() => {
    if (!usersData?.users || !quotesData?.quotes) return [];
    return usersData.users.map((user, idx) => {
      const quote = (quotesData.quotes[idx % quotesData.quotes.length] || { 
        quote: "No message content", 
        author: "System" 
      }) as { quote: string; author: string };
      return {
        id: user.id,
        user,
        quote,
        time: `${(idx % 12) + 1}:${String((idx * 7) % 60).padStart(2, '0')} ${idx % 2 === 0 ? 'AM' : 'PM'}`,
        unread: idx % 3 === 0,
      };
    });
  }, [usersData, quotesData]);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return messages.filter(
      (m) =>
        `${m.user.firstName} ${m.user.lastName}`.toLowerCase().includes(q) ||
        (m.quote?.quote ?? '').toLowerCase().includes(q)
    );
  }, [messages, search]);

  const selectedMessage = selected !== null ? messages.find((m) => m.id === selected) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-sm text-muted-foreground">Your inbox and conversations</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 h-[600px]">
        {/* Message List */}
        <Card className="lg:col-span-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 border-b">
                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))
              : filtered.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => setSelected(msg.id)}
                    className={cn(
                      'w-full flex items-start gap-3 p-4 border-b text-left hover:bg-muted/50 transition-colors',
                      selected === msg.id && 'bg-muted'
                    )}
                  >
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={msg.user.image} />
                      <AvatarFallback>{msg.user.firstName[0]}{msg.user.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={cn('text-sm truncate', msg.unread && 'font-semibold')}>
                          {msg.user.firstName} {msg.user.lastName}
                        </p>
                        <span className="text-xs text-muted-foreground shrink-0 ml-2">{msg.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.quote.quote.slice(0, 50)}…</p>
                    </div>
                    {msg.unread && (
                      <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                    )}
                  </button>
                ))}
          </div>
        </Card>

        {/* Message Detail */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden">
          {selectedMessage ? (
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-4 p-4 border-b">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedMessage.user.image} />
                  <AvatarFallback>
                    {selectedMessage.user.firstName[0]}{selectedMessage.user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {selectedMessage.user.firstName} {selectedMessage.user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{selectedMessage.user.email}</p>
                </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-lg">
                  <div className="bg-muted rounded-2xl rounded-tl-sm p-4">
                    <p className="text-sm leading-relaxed">"{selectedMessage.quote.quote}"</p>
                    <p className="text-xs text-muted-foreground mt-2">— {selectedMessage.quote.author}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{selectedMessage.time}</p>
                </div>
              </div>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input placeholder="Type a reply..." className="flex-1" />
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg">Select a message</h3>
              <p className="text-sm text-muted-foreground mt-1">Choose a conversation from the list to read it</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
