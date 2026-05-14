import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * Custom hook for observing element visibility using Intersection Observer API.
 * Useful for lazy loading, infinite scrolling, and triggering animations.
 *
 * @param options - Intersection Observer options
 * @returns Ref to attach to element and intersection entry
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): [React.RefObject<T>, IntersectionObserverEntry | null] {
  const { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = options;

  const elementRef = useRef<T>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    const element = elementRef.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !element) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry) {
        setEntry(firstEntry);
      }
    }, observerParams);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold, root, rootMargin, frozen]);

  return [elementRef, entry];
}

/**
 * Simplified hook that returns only the visibility state
 */
export function useIsVisible<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): [React.RefObject<T>, boolean] {
  const [ref, entry] = useIntersectionObserver<T>(options);
  return [ref, !!entry?.isIntersecting];
}
