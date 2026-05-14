import React from 'react';
import { cn } from '@/utils';

interface SkeletonProps {
  className?: string;
}

/** Base animated skeleton pulse element */
export const Skeleton = React.memo(({ className }: SkeletonProps) => (
  <div className={cn('animate-pulse rounded-md bg-muted', className)} />
));
Skeleton.displayName = 'Skeleton';

// ============================================================
// Dashboard Skeleton
// ============================================================

export const DashboardSkeleton = React.memo(() => (
  <div className="space-y-6 md:space-y-8">
    {/* Header */}
    <div className="space-y-2">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-5 w-96" />
    </div>

    {/* Metrics */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </div>
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>

    {/* Content */}
    <div className="grid gap-4 lg:grid-cols-7">
      <div className="rounded-lg border bg-card p-6 lg:col-span-4 space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-[250px] w-full" />
      </div>
      <div className="rounded-lg border bg-card p-6 lg:col-span-3 space-y-4">
        <Skeleton className="h-6 w-40" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
));
DashboardSkeleton.displayName = 'DashboardSkeleton';

// ============================================================
// Product Detail Skeleton
// ============================================================

export const ProductDetailSkeleton = React.memo(() => (
  <div className="space-y-6">
    <Skeleton className="h-10 w-40" />
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-lg" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  </div>
));
ProductDetailSkeleton.displayName = 'ProductDetailSkeleton';

// ============================================================
// Table Skeleton
// ============================================================

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton = React.memo(({ rows = 5, columns = 5 }: TableSkeletonProps) => (
  <div className="rounded-lg border bg-card">
    {/* Header */}
    <div className="border-b p-4">
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="border-b last:border-0 p-4">
        <div className="flex items-center space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn(
                'h-4 flex-1',
                colIndex === 0 ? 'w-12' : '',
                colIndex === columns - 1 ? 'w-20' : ''
              )}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
));
TableSkeleton.displayName = 'TableSkeleton';

// ============================================================
// Page Loading Skeleton (full page)
// ============================================================

export const PageLoadingSkeleton = React.memo(() => (
  <div className="flex min-h-[400px] items-center justify-center">
    <div className="text-center space-y-4">
      <div className="relative">
        <div className="h-12 w-12 mx-auto rounded-full border-4 border-muted animate-pulse" />
        <div className="absolute inset-0 h-12 w-12 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
));
PageLoadingSkeleton.displayName = 'PageLoadingSkeleton';
