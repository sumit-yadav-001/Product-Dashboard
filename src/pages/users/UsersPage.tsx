import React, { useState, useMemo, useCallback } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Edit, Trash2, Mail, Shield, Clock, Users as UsersIcon, UserCheck, UserX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/common/DataTable';
import { User, UserRole } from '@/types';
import { formatDate } from '@/utils';
import { useGetUsersQuery, DummyUser } from '@/store/api/usersApi';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';

// Convert DummyUser to our User type
function convertToUser(dummyUser: DummyUser): User {
  return {
    id: dummyUser.id.toString(),
    name: `${dummyUser.firstName} ${dummyUser.lastName}`,
    firstName: dummyUser.firstName,
    lastName: dummyUser.lastName,
    email: dummyUser.email,
    role: dummyUser.role === 'admin' ? UserRole.ADMIN : 
          dummyUser.role === 'moderator' ? UserRole.MODERATOR : UserRole.USER,
    avatar: dummyUser.image,
    isActive: true, // DummyJSON doesn't have this field
    createdAt: dummyUser.birthDate, // Using birthDate as placeholder
    updatedAt: new Date().toISOString(),
  };
}

function UserActions({ user }: { user: User }) {
  const handleEdit = useCallback(() => {
    toast.success(`Edit user: ${user.name}`);
  }, [user.name]);

  const handleDelete = useCallback(() => {
    toast.error(`Delete user: ${user.name}`);
  }, [user.name]);

  const handleSendEmail = useCallback(() => {
    toast.success(`Email sent to: ${user.email}`);
  }, [user.email]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
          Copy user ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit user
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSendEmail}>
          <Mail className="mr-2 h-4 w-4" />
          Send email
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const roleConfig = {
    [UserRole.ADMIN]: {
      label: 'Admin',
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      icon: Shield,
    },
    [UserRole.MODERATOR]: {
      label: 'Moderator',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      icon: Shield,
    },
    [UserRole.USER]: {
      label: 'User',
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      icon: Shield,
    },
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${config.className}`}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </span>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
        isActive
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      }`}
    >
      <div
        className={`mr-1 h-2 w-2 rounded-full ${
          isActive ? 'bg-green-400' : 'bg-gray-400'
        }`}
      />
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}

export function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Fetch users from API
  const {
    data: usersData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetUsersQuery({
    limit: ITEMS_PER_PAGE,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  // Convert API users to our User type
  const users = useMemo(() => {
    if (!usersData?.users) return [];
    return usersData.users.map(convertToUser);
  }, [usersData]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalUsers = usersData?.total || 0;
    const activeUsers = users.filter(u => u.isActive).length;
    const adminUsers = users.filter(u => u.role === UserRole.ADMIN).length;
    
    return {
      total: totalUsers,
      active: activeUsers,
      admins: adminUsers,
      newThisMonth: Math.floor(totalUsers * 0.1), // Simulated
    };
  }, [users, usersData]);

  const columns: ColumnDef<User>[] = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-3">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => <RoleBadge role={row.getValue('role')} />,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => <StatusBadge isActive={row.getValue('isActive')} />,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return (
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{formatDate(date)}</span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => <UserActions user={row.original} />,
      enableSorting: false,
      enableHiding: false,
    },
  ], []);

  const handleSelectionChange = useCallback((selectedUsers: User[]) => {
    console.log('Selected users:', selectedUsers);
  }, []);

  const handleExport = useCallback((selectedUsers: User[]) => {
    toast.success(`Exporting ${selectedUsers.length} users...`);
  }, []);

  const handleDelete = useCallback((selectedUsers: User[]) => {
    if (confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
      toast.success(`${selectedUsers.length} users deleted!`);
    }
  }, []);

  // Loading state
  if (isLoading) {
    return <Loader size="lg" text="Loading users..." className="min-h-[400px]" />;
  }

  // Error state
  if (error) {
    return (
      <EmptyState
        icon={UsersIcon}
        title="Failed to load users"
        description="There was an error loading the users. Please try again."
        action={{
          label: 'Retry',
          onClick: () => refetch(),
        }}
      />
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage users, roles, and permissions for your application.
          </p>
        </div>
        <Button className="w-full sm:w-auto">Add User</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Total Users</h3>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              From DummyJSON API
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Active Users</h3>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Admins</h3>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{stats.admins}</div>
            <p className="text-xs text-muted-foreground">
              Administrator accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">New This Month</h3>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{stats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.round((stats.newThisMonth / stats.total) * 100)}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        data={users}
        columns={columns}
        searchPlaceholder="Search users..."
        onSelectionChange={handleSelectionChange}
        onExport={handleExport}
        onDelete={handleDelete}
        enableSearch={true}
        enableFilters={true}
        enableSelection={true}
        enableExport={true}
        enableColumnVisibility={true}
        pageSize={10}
      />
    </div>
  );
}