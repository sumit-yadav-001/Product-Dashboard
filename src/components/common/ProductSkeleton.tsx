import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/utils';

interface ProductSkeletonProps {
  count?: number;
  className?: string;
}

export const ProductSkeleton = React.memo(({ count = 8, className }: ProductSkeletonProps) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="aspect-square animate-pulse bg-muted" />
          <CardContent className="p-4">
            <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-6 w-1/4 animate-pulse rounded bg-muted" />
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <div className="h-9 w-full animate-pulse rounded bg-muted" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
});

ProductSkeleton.displayName = 'ProductSkeleton';
