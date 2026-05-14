import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for managing AbortController-based request cancellation.
 * Automatically cancels pending requests on unmount.
 */
export function useRequestCancellation() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const createAbortSignal = useCallback((): AbortSignal => {
    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current.signal;
  }, []);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelRequest();
    };
  }, [cancelRequest]);

  return { createAbortSignal, cancelRequest };
}

/**
 * Custom hook for retrying failed operations with exponential backoff.
 */
export function useRetry() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const retry = useCallback(
    async <T>(
      fn: () => Promise<T>,
      options: {
        maxRetries?: number;
        baseDelay?: number;
        maxDelay?: number;
        onRetry?: (attempt: number, error: unknown) => void;
      } = {}
    ): Promise<T> => {
      const {
        maxRetries = 3,
        baseDelay = 1000,
        maxDelay = 10000,
        onRetry,
      } = options;

      let lastError: unknown;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await fn();
        } catch (error) {
          lastError = error;

          if (attempt < maxRetries) {
            const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
            onRetry?.(attempt + 1, error);

            await new Promise<void>((resolve) => {
              timeoutRef.current = setTimeout(resolve, delay);
            });
          }
        }
      }

      throw lastError;
    },
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { retry };
}
