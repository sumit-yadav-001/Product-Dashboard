import React from 'react';
import { FileText, Mail, ShoppingCart, Key, Bell, UserPlus, Star } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const templates = [
  {
    id: 1,
    name: 'Welcome Email',
    description: 'Sent to new users upon registration. Includes onboarding steps and getting started guide.',
    icon: UserPlus,
    category: 'Onboarding',
    lastModified: '2 days ago',
    status: 'Active',
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30',
  },
  {
    id: 2,
    name: 'Password Reset',
    description: 'Triggered when a user requests a password reset. Contains a secure reset link.',
    icon: Key,
    category: 'Security',
    lastModified: '1 week ago',
    status: 'Active',
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30',
  },
  {
    id: 3,
    name: 'Order Confirmation',
    description: 'Sent after a successful purchase. Includes order details, items, and estimated delivery.',
    icon: ShoppingCart,
    category: 'E-commerce',
    lastModified: '3 days ago',
    status: 'Active',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
  },
  {
    id: 4,
    name: 'Shipping Notification',
    description: 'Notifies customers when their order has been shipped with tracking information.',
    icon: Mail,
    category: 'E-commerce',
    lastModified: '5 days ago',
    status: 'Active',
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30',
  },
  {
    id: 5,
    name: 'Newsletter',
    description: 'Monthly newsletter template with product highlights, news, and promotions.',
    icon: Bell,
    category: 'Marketing',
    lastModified: '2 weeks ago',
    status: 'Draft',
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30',
  },
  {
    id: 6,
    name: 'Review Request',
    description: 'Sent after order delivery to request a product review from the customer.',
    icon: Star,
    category: 'Marketing',
    lastModified: '1 month ago',
    status: 'Active',
    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30',
  },
  {
    id: 7,
    name: 'Account Suspended',
    description: 'Notification sent when a user account is suspended due to policy violations.',
    icon: FileText,
    category: 'Security',
    lastModified: '3 weeks ago',
    status: 'Active',
    color: 'bg-red-100 text-red-600 dark:bg-red-900/30',
  },
  {
    id: 8,
    name: 'Subscription Renewal',
    description: 'Reminder sent before subscription expiry with renewal options and pricing.',
    icon: Bell,
    category: 'Billing',
    lastModified: '4 days ago',
    status: 'Active',
    color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30',
  },
];

export function TemplatesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Email Templates</h1>
          <p className="text-sm text-muted-foreground">Manage your email communication templates</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Templates</p>
            <p className="text-2xl font-bold">{templates.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {templates.filter((t) => t.status === 'Active').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Drafts</p>
            <p className="text-2xl font-bold text-yellow-600">
              {templates.filter((t) => t.status === 'Draft').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${template.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge
                    className={
                      template.status === 'Active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-0'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-0'
                    }
                  >
                    {template.status}
                  </Badge>
                </div>
                <CardTitle className="text-base mt-3">{template.name}</CardTitle>
                <CardDescription className="text-xs">{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{template.category}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{template.lastModified}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">Edit</Button>
                  <Button variant="ghost" size="sm" className="flex-1 text-xs">Preview</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
