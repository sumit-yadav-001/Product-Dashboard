import React from 'react';
import { AlertTriangle, RefreshCw, WifiOff, ServerCrash, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils';

type ErrorVariant = 'default' | 'network' | 'server' | 'notFound';

interface ErrorStateProps {
  /** Error title */
  title?: string;
  /** Error description */
  description?: string;
  /** Error variant for icon/messaging */
  variant?: ErrorVariant;
  /** Retry callback */
  onRetry?: () => void;
  /** Custom action */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Whether to show as a full-page error */
  fullPage?: boolean;
  /** Custom class name */
  className?: string;
}

const variantConfig: Record<
  ErrorVariant,
  {
    icon: React.ComponentType<{ className?: string }>;
    defaultTitle: string;
    defaultDescription: string;
    color: string;
  }
> = {
  default: {
    icon: AlertTriangle,
    defaultTitle: 'Something went wrong',
    defaultDescription: 'An unexpected error occurred. Please try again.',
    color: 'text-destructive',
  },
  network: {
    icon: WifiOff,
    defaultTitle: 'Connection lost',
    defaultDescription: 'Please check your internet connection and try again.',
    color: 'text-yellow-600 dark:text-yellow-400',
  },
  server: {
    icon: ServerCrash,
    defaultTitle: 'Server error',
    defaultDescription: 'Our servers are temporarily unavailable. Please try again later.',
    color: 'text-destructive',
  },
  notFound: {
    icon: FileQuestion,
    defaultTitle: 'Not found',
    defaultDescription: "The resource you're looking for doesn't exist or has been removed.",
    color: 'text-muted-foreground',
  },
};

/**
 * Reusable error state component with multiple variants.
 * Can render inline or full-page, with retry and custom action buttons.
 */
export const ErrorState = React.memo(
  ({
    title,
    description,
    variant = 'default',
    onRetry,
    action,
    fullPage = false,
    className,
  }: ErrorStateProps) => {
    const config = variantConfig[variant];
    const Icon = config.icon;

    const content = (
      <div
        className={cn(
          'flex flex-col items-center justify-center text-center p-8',
          fullPage ? 'min-h-[60vh]' : 'min-h-[300px]',
          className
        )}
      >
        <div
          className={cn(
            'flex h-16 w-16 items-center justify-center rounded-full mb-4',
            variant === 'default' || variant === 'server'
              ? 'bg-destructive/10'
              : variant === 'network'
                ? 'bg-yellow-100 dark:bg-yellow-900/30'
                : 'bg-muted'
          )}
        >
          <Icon className={cn('h-8 w-8', config.color)} />
        </div>

        <h3 className="text-lg font-semibold mb-2">{title || config.defaultTitle}</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {description || config.defaultDescription}
        </p>

        <div className="flex items-center gap-3">
          {onRetry && (
            <Button onClick={onRetry} variant="default" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
          {action && (
            <Button onClick={action.onClick} variant="outline">
              {action.label}
            </Button>
          )}
        </div>
      </div>
    );

    if (fullPage) {
      return content;
    }

    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-0">{content}</CardContent>
      </Card>
    );
  }
);

ErrorState.displayName = 'ErrorState';

// ============================================================
// Loading State Component
// ============================================================

interface LoadingStateProps {
  message?: string;
  className?: string;
  fullPage?: boolean;
}

export const LoadingState = React.memo(
  ({ message = 'Loading...', className, fullPage = false }: LoadingStateProps) => (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        fullPage ? 'min-h-[60vh]' : 'min-h-[300px]',
        className
      )}
      role="status"
      aria-label={message}
    >
      <div className="relative mb-4">
        <div className="h-12 w-12 rounded-full border-4 border-muted" />
        <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
);

LoadingState.displayName = 'LoadingState';
