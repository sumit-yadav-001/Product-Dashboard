import React from 'react';
import { Shield, Crown, User, Check } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const roles = [
  {
    name: 'Administrator',
    slug: 'admin',
    icon: Crown,
    color: 'text-red-600',
    bg: 'bg-red-100 dark:bg-red-900/30',
    description: 'Full system access with all permissions. Can manage users, settings, and all content.',
    userCount: 3,
    permissions: [
      'Manage all users',
      'Manage roles & permissions',
      'Access all content',
      'System configuration',
      'View analytics',
      'Manage billing',
      'API access',
      'Audit logs',
    ],
  },
  {
    name: 'Moderator',
    slug: 'moderator',
    icon: Shield,
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    description: 'Can manage content and users but cannot change system settings or billing.',
    userCount: 12,
    permissions: [
      'Manage content',
      'Moderate posts',
      'View users',
      'Manage comments',
      'View analytics',
      'Send notifications',
    ],
  },
  {
    name: 'User',
    slug: 'user',
    icon: User,
    color: 'text-green-600',
    bg: 'bg-green-100 dark:bg-green-900/30',
    description: 'Standard user with access to their own profile and public content.',
    userCount: 185,
    permissions: [
      'View own profile',
      'Edit own profile',
      'View public content',
      'Create posts',
      'Comment on posts',
    ],
  },
];

export function RolesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">User Roles</h1>
          <p className="text-sm text-muted-foreground">
            Define and manage role-based access control for your application
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">{roles.length} roles defined</Badge>
      </div>

      {/* Roles Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Card key={role.slug} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${role.bg}`}>
                    <Icon className={`h-5 w-5 ${role.color}`} />
                  </div>
                  <Badge variant="outline">{role.userCount} users</Badge>
                </div>
                <CardTitle className="mt-3">{role.name}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Permissions
                </p>
                <ul className="space-y-2">
                  {role.permissions.map((perm) => (
                    <li key={perm} className="flex items-center gap-2 text-sm">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      {perm}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Role Hierarchy */}
      <Card>
        <CardHeader>
          <CardTitle>Role Hierarchy</CardTitle>
          <CardDescription>Roles inherit permissions from lower levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center py-4">
            {roles.map((role, idx) => {
              const Icon = role.icon;
              return (
                <React.Fragment key={role.slug}>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-full ${role.bg}`}>
                      <Icon className={`h-6 w-6 ${role.color}`} />
                    </div>
                    <span className="text-sm font-medium">{role.name}</span>
                    <Badge variant="outline" className="text-xs">{role.userCount} users</Badge>
                  </div>
                  {idx < roles.length - 1 && (
                    <div className="text-muted-foreground text-2xl font-light hidden sm:block">→</div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
