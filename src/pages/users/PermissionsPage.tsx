import React from 'react';
import { Key, Check, X } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const permissions = [
  { group: 'Users', items: ['users.view', 'users.create', 'users.edit', 'users.delete'] },
  { group: 'Content', items: ['content.view', 'content.create', 'content.edit', 'content.delete', 'content.publish'] },
  { group: 'Products', items: ['products.view', 'products.create', 'products.edit', 'products.delete'] },
  { group: 'Orders', items: ['orders.view', 'orders.manage', 'orders.refund'] },
  { group: 'Analytics', items: ['analytics.view', 'analytics.export'] },
  { group: 'Settings', items: ['settings.view', 'settings.edit', 'settings.billing'] },
  { group: 'System', items: ['system.logs', 'system.backup', 'system.api'] },
];

const roles = ['admin', 'moderator', 'user'];

// Define which roles have which permissions
const matrix: Record<string, Record<string, boolean>> = {
  'users.view':         { admin: true,  moderator: true,  user: false },
  'users.create':       { admin: true,  moderator: false, user: false },
  'users.edit':         { admin: true,  moderator: false, user: false },
  'users.delete':       { admin: true,  moderator: false, user: false },
  'content.view':       { admin: true,  moderator: true,  user: true  },
  'content.create':     { admin: true,  moderator: true,  user: true  },
  'content.edit':       { admin: true,  moderator: true,  user: false },
  'content.delete':     { admin: true,  moderator: true,  user: false },
  'content.publish':    { admin: true,  moderator: true,  user: false },
  'products.view':      { admin: true,  moderator: true,  user: true  },
  'products.create':    { admin: true,  moderator: false, user: false },
  'products.edit':      { admin: true,  moderator: false, user: false },
  'products.delete':    { admin: true,  moderator: false, user: false },
  'orders.view':        { admin: true,  moderator: true,  user: false },
  'orders.manage':      { admin: true,  moderator: false, user: false },
  'orders.refund':      { admin: true,  moderator: false, user: false },
  'analytics.view':     { admin: true,  moderator: true,  user: false },
  'analytics.export':   { admin: true,  moderator: false, user: false },
  'settings.view':      { admin: true,  moderator: false, user: false },
  'settings.edit':      { admin: true,  moderator: false, user: false },
  'settings.billing':   { admin: true,  moderator: false, user: false },
  'system.logs':        { admin: true,  moderator: false, user: false },
  'system.backup':      { admin: true,  moderator: false, user: false },
  'system.api':         { admin: true,  moderator: false, user: false },
};

export function PermissionsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Permissions Matrix</h1>
        <p className="text-sm text-muted-foreground">
          Overview of permissions assigned to each role
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-100 dark:bg-emerald-900/30">
            <Check className="h-3 w-3 text-emerald-600" />
          </div>
          <span className="text-muted-foreground">Allowed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-red-100 dark:bg-red-900/30">
            <X className="h-3 w-3 text-red-500" />
          </div>
          <span className="text-muted-foreground">Denied</span>
        </div>
      </div>

      {/* Matrix Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Permission Matrix
          </CardTitle>
          <CardDescription>All permissions across all roles</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium w-64">Permission</th>
                  {roles.map((role) => (
                    <th key={role} className="text-center p-4 font-medium capitalize">
                      <Badge
                        className={
                          role === 'admin'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-0'
                            : role === 'moderator'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-0'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-0'
                        }
                      >
                        {role}
                      </Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissions.map((group) => (
                  <React.Fragment key={group.group}>
                    <tr className="bg-muted/20">
                      <td colSpan={4} className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {group.group}
                      </td>
                    </tr>
                    {group.items.map((perm) => (
                      <tr key={perm} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-mono text-xs">{perm}</td>
                        {roles.map((role) => {
                          const allowed = matrix[perm]?.[role] ?? false;
                          return (
                            <td key={role} className="p-4 text-center">
                              <div className={`inline-flex h-6 w-6 items-center justify-center rounded ${allowed ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                {allowed
                                  ? <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  : <X className="h-3.5 w-3.5 text-red-500" />
                                }
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
