import React, { useMemo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, User } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/common/Skeletons';
import { useGetUsersQuery } from '@/store/api/usersApi';
import { cn } from '@/utils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function CalendarPage() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const { data, isLoading } = useGetUsersQuery({ limit: 20 });

  // Build events from user birthDates (show birthday in current month)
  const events = useMemo(() => {
    if (!data?.users) return {};
    const map: Record<number, Array<{ name: string; image: string; type: string }>> = {};
    data.users.forEach((user) => {
      if (!user.birthDate) return;
      const bd = new Date(user.birthDate);
      // Show birthday if month matches view month
      if (bd.getMonth() === viewDate.getMonth()) {
        const day = bd.getDate();
        if (!map[day]) map[day] = [];
        map[day].push({
          name: `${user.firstName} ${user.lastName}`,
          image: user.image,
          type: 'birthday',
        });
      }
    });
    return map;
  }, [data, viewDate]);

  // Calendar grid
  const { days, startOffset } = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { days: daysInMonth, startOffset: firstDay };
  }, [viewDate]);

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const upcomingEvents = useMemo(() => {
    return Object.entries(events)
      .sort(([a], [b]) => Number(a) - Number(b))
      .flatMap(([day, evts]) => evts.map((e) => ({ ...e, day: Number(day) })));
  }, [events]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-sm text-muted-foreground">View events and team birthdays</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Grid */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {d}
                </div>
              ))}
            </div>
            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for offset */}
              {Array.from({ length: startOffset }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {/* Day cells */}
              {Array.from({ length: days }).map((_, i) => {
                const day = i + 1;
                const isToday =
                  day === today.getDate() &&
                  viewDate.getMonth() === today.getMonth() &&
                  viewDate.getFullYear() === today.getFullYear();
                const dayEvents = events[day] ?? [];
                return (
                  <div
                    key={day}
                    className={cn(
                      'min-h-[60px] rounded-lg p-1.5 border border-transparent hover:border-border transition-colors cursor-pointer',
                      isToday && 'bg-primary/10 border-primary/30'
                    )}
                  >
                    <span
                      className={cn(
                        'text-xs font-medium flex h-6 w-6 items-center justify-center rounded-full',
                        isToday && 'bg-primary text-primary-foreground'
                      )}
                    >
                      {day}
                    </span>
                    {isLoading ? null : dayEvents.slice(0, 2).map((evt, idx) => (
                      <div
                        key={idx}
                        className="mt-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded px-1 truncate"
                        title={evt.name}
                      >
                        🎂 {evt.name.split(' ')[0]}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-muted-foreground mt-0.5">+{dayEvents.length - 2}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Birthdays
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <User className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No birthdays this month</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((evt, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={evt.image} />
                      <AvatarFallback className="text-xs">{evt.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{evt.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {MONTHS[viewDate.getMonth()]} {evt.day}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">🎂</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
