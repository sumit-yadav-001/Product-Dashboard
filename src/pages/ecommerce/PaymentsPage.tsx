import React from 'react';
import { CreditCard, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/common/Skeletons';
import { useGetCartsQuery } from '@/store/api/cartsApi';

const PAYMENT_METHODS = ['Visa', 'Mastercard', 'PayPal', 'Stripe', 'Apple Pay'] as const;
const PAYMENT_STATUSES = ['Completed', 'Completed', 'Completed', 'Pending', 'Refunded'] as const;

function getPaymentMethod(id: number): string {
  const method = PAYMENT_METHODS[id % PAYMENT_METHODS.length];
  return method || 'Visa';
}

function getPaymentStatus(id: number): string {
  const status = PAYMENT_STATUSES[id % PAYMENT_STATUSES.length];
  return status || 'Completed';
}

function getDate(id: number) {
  const d = new Date();
  d.setDate(d.getDate() - (id % 30));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function PaymentStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    Refunded: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? ''}`}>
      {status}
    </span>
  );
}

export function PaymentsPage() {
  const { data, isLoading, error, refetch } = useGetCartsQuery({ limit: 20 });

  const stats = React.useMemo(() => {
    if (!data?.carts) return { total: 0, revenue: 0, completed: 0, pending: 0 };
    const carts = data.carts;
    const revenue = carts.reduce((s, c) => s + c.discountedTotal, 0);
    const completed = carts.filter((_, i) => getPaymentStatus(i + 1) === 'Completed').length;
    const pending = carts.filter((_, i) => getPaymentStatus(i + 1) === 'Pending').length;
    return { total: carts.length, revenue, completed, pending };
  }, [data]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <CreditCard className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Failed to load payments</h3>
        <button onClick={() => refetch()} className="text-sm text-primary underline">Try again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground">Track payment transactions and revenue</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Transactions', value: stats.total.toString(), icon: CreditCard },
          { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign },
          { label: 'Completed', value: stats.completed.toString(), icon: CheckCircle },
          { label: 'Pending', value: stats.pending.toString(), icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  {isLoading ? <Skeleton className="h-8 w-16 mt-1" /> : (
                    <p className="text-2xl font-bold">{value}</p>
                  )}
                </div>
                <Icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `${data?.carts.length ?? 0} transactions`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Transaction ID</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Method</th>
                  <th className="text-left p-4 font-medium">Amount</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i} className="border-b">
                        {Array.from({ length: 6 }).map((_, j) => (
                          <td key={j} className="p-4"><Skeleton className="h-4 w-full" /></td>
                        ))}
                      </tr>
                    ))
                  : data?.carts.map((cart) => {
                      const method = getPaymentMethod(cart.id);
                      const status = getPaymentStatus(cart.id);
                      const date = getDate(cart.id);
                      return (
                        <tr key={cart.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-4 font-mono text-xs font-semibold">TXN-{String(cart.id).padStart(6, '0')}</td>
                          <td className="p-4 text-muted-foreground">User #{cart.userId}</td>
                          <td className="p-4">
                            <Badge variant="outline">{method}</Badge>
                          </td>
                          <td className="p-4 font-semibold">${cart.discountedTotal.toFixed(2)}</td>
                          <td className="p-4 text-muted-foreground">{date}</td>
                          <td className="p-4"><PaymentStatusBadge status={status} /></td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
