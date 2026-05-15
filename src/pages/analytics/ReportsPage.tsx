import React, { useState } from 'react';
import { 
  Download, 
  Filter, 
  Calendar, 
  FileText, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Mail,
  Eye
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/common/Skeletons';
import { useGetPostsQuery } from '@/store/api/postsApi';

interface ReportCardProps {
  title: string;
  description: string;
  lastGenerated: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'ready' | 'generating' | 'failed';
}

function ReportCard({ title, description, lastGenerated, icon: Icon, status }: ReportCardProps) {
  const statusConfig = {
    ready: { color: 'bg-green-100 text-green-800', text: 'Ready' },
    generating: { color: 'bg-yellow-100 text-yellow-800', text: 'Generating...' },
    failed: { color: 'bg-red-100 text-red-800', text: 'Failed' },
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
        <Badge className={statusConfig[status].color}>
          {statusConfig[status].text}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Last generated: {lastGenerated}
          </span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button size="sm">Generate</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Cycle through report icons for variety
const REPORT_ICONS = [Users, DollarSign, Eye, TrendingUp, Mail, ShoppingCart];

export function ReportsPage() {
  const [dateRange, setDateRange] = useState('last30days');
  const [reportType, setReportType] = useState('all');

  const { data: postsData, isLoading: postsLoading } = useGetPostsQuery({ limit: 6 });

  const quickStats = [
    { label: 'Total Reports',    value: postsData?.total?.toString() ?? '—' },
    { label: 'Generated Today',  value: '6' },
    { label: 'Scheduled',        value: '8' },
    { label: 'Failed',           value: '2' },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Generate and download comprehensive analytics reports
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto text-sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button className="w-full sm:w-auto text-sm">
            <FileText className="mr-2 h-4 w-4" />
            Create Custom Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg md:text-xl">
            <Filter className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="date-range" className="text-sm">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Last 7 days</SelectItem>
                  <SelectItem value="last30days">Last 30 days</SelectItem>
                  <SelectItem value="last90days">Last 90 days</SelectItem>
                  <SelectItem value="lastyear">Last year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-type" className="text-sm">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="user">User Reports</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm">Search Reports</Label>
              <Input
                id="search"
                placeholder="Search by name..."
                className="w-full"
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full text-sm">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {postsLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-full max-w-sm" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-36" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </div>
                ))
              : (postsData?.posts ?? []).map((post, index) => {
                  const Icon = REPORT_ICONS[index % REPORT_ICONS.length]!;
                  const hoursAgo = ((post.id % 12) + 1);
                  const lastGenerated = hoursAgo === 1 ? '1 hour ago' : `${hoursAgo} hours ago`;
                  const status: 'ready' | 'generating' = post.reactions.likes > 5 ? 'ready' : 'generating';
                  const description = post.body.length > 100
                    ? `${post.body.substring(0, 100)}…`
                    : post.body;
                  return (
                    <ReportCard
                      key={post.id}
                      title={post.title}
                      description={description}
                      lastGenerated={lastGenerated}
                      icon={Icon}
                      status={status}
                    />
                  );
                })
            }
          </div>
        </TabsContent>
        
        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Scheduled Reports</h3>
                <p className="text-muted-foreground mb-4">
                  Schedule reports to run automatically at specified intervals
                </p>
                <Button>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Your First Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Custom Report Builder</h3>
                <p className="text-muted-foreground mb-4">
                  Create custom reports with specific metrics and dimensions
                </p>
                <Button>
                  <PieChart className="mr-2 h-4 w-4" />
                  Build Custom Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Monthly Overview', description: 'Complete monthly performance summary' },
              { name: 'User Engagement', description: 'User activity and retention metrics' },
              { name: 'Sales Performance', description: 'Revenue and conversion analytics' },
              { name: 'Marketing ROI', description: 'Campaign effectiveness and ROI analysis' },
              { name: 'System Performance', description: 'Technical performance and uptime metrics' },
              { name: 'Customer Satisfaction', description: 'Support tickets and satisfaction scores' },
            ].map((template) => (
              <Card key={template.name} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}