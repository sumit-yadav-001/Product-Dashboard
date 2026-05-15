import React, { useMemo } from 'react';
import { Users, Building2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/common/Skeletons';
import { useGetUsersQuery } from '@/store/api/usersApi';

export function GroupsPage() {
  const { data, isLoading, error, refetch } = useGetUsersQuery({ limit: 30 });

  const groups = useMemo(() => {
    if (!data?.users) return [];
    const map: Record<string, { department: string; company: string; members: typeof data.users }> = {};
    data.users.forEach((u) => {
      const dept = u.company?.department ?? 'General';
      if (!map[dept]) map[dept] = { department: dept, company: u.company?.name ?? '', members: [] };
      map[dept].members.push(u);
    });
    return Object.values(map).sort((a, b) => b.members.length - a.members.length);
  }, [data]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Users className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Failed to load groups</h3>
        <button onClick={() => refetch()} className="text-sm text-primary underline">Try again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">User Groups</h1>
          <p className="text-sm text-muted-foreground">
            Users organized by department and company
          </p>
        </div>
        {!isLoading && (
          <Badge variant="secondary" className="w-fit">{groups.length} groups</Badge>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Groups</p>
                {isLoading ? <Skeleton className="h-8 w-12 mt-1" /> : (
                  <p className="text-2xl font-bold">{groups.length}</p>
                )}
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                {isLoading ? <Skeleton className="h-8 w-12 mt-1" /> : (
                  <p className="text-2xl font-bold">{data?.total ?? 0}</p>
                )}
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Group Size</p>
                {isLoading ? <Skeleton className="h-8 w-12 mt-1" /> : (
                  <p className="text-2xl font-bold">
                    {groups.length ? Math.round((data?.users.length ?? 0) / groups.length) : 0}
                  </p>
                )}
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Groups Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          : groups.map((group) => (
              <Card key={group.department} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{group.department}</CardTitle>
                    <Badge variant="secondary">{group.members.length}</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {group.company || 'Various companies'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {group.members.slice(0, 4).map((member) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={member.image} alt={`${member.firstName} ${member.lastName}`} />
                          <AvatarFallback className="text-xs">
                            {member.firstName[0]}{member.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{member.company?.title}</p>
                        </div>
                      </div>
                    ))}
                    {group.members.length > 4 && (
                      <p className="text-xs text-muted-foreground pl-10">
                        +{group.members.length - 4} more members
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}
