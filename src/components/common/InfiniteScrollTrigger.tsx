import React, { useEffect, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils';

interface InfiniteScrollTriggerProps {
  /** Called when the trigger element becomes visible */
  onLoadMore: () => void;
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Whether currently loading */
  isLoading: boolean;
  /** Custom loading component */
  loadingComponent?: React.ReactNode;
  /** Root margin for IntersectionObserver */
  rootMargin?: string;
  /** Threshold for IntersectionObserver */
  threshold?: number;
  /** CSS class name */
  className?: string;
}

/**
 * Invisible trigger component that fires onLoadMore when it enters the viewport.
 * Drop it at the bottom of a scrollable list to enable infinite scrolling.
 */
export const InfiniteScrollTrigger = React.memo(
  ({
    onLoadMore,
    hasMore,
    isLoading,
    loadingComponent,
    rootMargin = '200px',
    threshold = 0.1,
    className,
  }: InfiniteScrollTriggerProps) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const onLoadMoreRef = useRef(onLoadMore);

    // Keep the callback reference current without re-creating the observer
    useEffect(() => {
      onLoadMoreRef.current = onLoadMore;
    }, [onLoadMore]);

    const observerCallback = useCallback(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        if (entry?.isIntersecting && hasMore && !isLoading) {
          onLoadMoreRef.current();
        }
      },
      [hasMore, isLoading]
    );

    useEffect(() => {
      const element = triggerRef.current;
      if (!element) return;

      const observer = new IntersectionObserver(observerCallback, {
        rootMargin,
        threshold,
      });

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }, [observerCallback, rootMargin, threshold]);

    if (!hasMore && !isLoading) return null;

    return (
      <div
        ref={triggerRef}
        className={cn('flex items-center justify-center py-8', className)}
        role="status"
        aria-label={isLoading ? 'Loading more items' : 'Scroll to load more'}
      >
        {isLoading &&
          (loadingComponent || (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading more products...</span>
            </div>
          ))}
      </div>
    );
  }
);

InfiniteScrollTrigger.displayName = 'InfiniteScrollTrigger';
