import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Save, 
  X,
  Camera,
  Shield,
  Award,
  Activity,
  Clock,
  Users,
  FileText,
  Settings
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/common/Skeletons';
import { useCurrentUser } from '@/hooks/redux';
import { useGetUserQuery } from '@/store/api/usersApi';
import toast from 'react-hot-toast';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  website: string;
  company: string;
  position: string;
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 rounded-lg border bg-card p-6 space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-28" />
            <div className="w-full space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </div>
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-40 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const authUser = useCurrentUser();
  const { data: dummyUser, isLoading, isError } = useGetUserQuery(2);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name:     '',
    email:    '',
    phone:    '',
    location: '',
    bio:      '',
    website:  'https://janedoe.dev',
    company:  '',
    position: '',
  });

  // Populate form once API data arrives
  useEffect(() => {
    if (dummyUser) {
      setFormData({
        name:     `${dummyUser.firstName} ${dummyUser.lastName}`,
        email:    dummyUser.email,
        phone:    dummyUser.phone,
        location: `${dummyUser.address.city}, ${dummyUser.address.state}`,
        bio:      `${dummyUser.company.title} at ${dummyUser.company.name}. Passionate about technology and innovation. Username: @${dummyUser.username}.`,
        website:  'https://janedoe.dev',
        company:  dummyUser.company.name,
        position: dummyUser.company.title,
      });
    }
  }, [dummyUser]);

  const getUserInitials = () => {
    if (!formData.name) return 'U';
    const parts = formData.name.split(' ');
    return parts.length >= 2
      ? `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase()
      : formData.name.substring(0, 2).toUpperCase();
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setIsSaving(false);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (dummyUser) {
      setFormData({
        name:     `${dummyUser.firstName} ${dummyUser.lastName}`,
        email:    dummyUser.email,
        phone:    dummyUser.phone,
        location: `${dummyUser.address.city}, ${dummyUser.address.state}`,
        bio:      `${dummyUser.company.title} at ${dummyUser.company.name}. Passionate about technology and innovation. Username: @${dummyUser.username}.`,
        website:  'https://janedoe.dev',
        company:  dummyUser.company.name,
        position: dummyUser.company.title,
      });
    }
  };

  const activities = [
    { action: 'Updated profile information', time: '2 hours ago', icon: User },
    { action: 'Changed password', time: '1 day ago', icon: Shield },
    { action: 'Logged in from new device', time: '3 days ago', icon: Activity },
    { action: 'Updated email preferences', time: '1 week ago', icon: Mail },
    { action: 'Added new API key', time: '2 weeks ago', icon: Settings },
  ];

  const stats = [
    { label: 'Projects Created', value: '24', icon: FileText },
    { label: 'Team Members', value: '8', icon: Users },
    { label: 'Reports Generated', value: '156', icon: Activity },
    { label: 'Hours This Month', value: '89', icon: Clock },
  ];

  const skills = [
    { name: 'React', level: 95 },
    { name: 'TypeScript', level: 88 },
    { name: 'Node.js', level: 82 },
    { name: 'Python', level: 75 },
    { name: 'AWS', level: 70 },
    { name: 'Docker', level: 65 },
  ];

  if (isLoading) return <ProfileSkeleton />;

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold text-destructive">Failed to load profile</p>
          <p className="text-sm text-muted-foreground">Could not fetch user data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {dummyUser?.image && (
                    <AvatarImage src={dummyUser.image} alt={formData.name} />
                  )}
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    onClick={() => toast('Photo upload coming soon', { icon: '📷' })}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="text-center space-y-1">
                <h3 className="text-xl font-semibold">{formData.name}</h3>
                <p className="text-muted-foreground">{formData.position}</p>
                <p className="text-sm text-muted-foreground">{formData.company}</p>
              </div>

              <div className="flex items-center space-x-1">
                <Badge variant="secondary">
                  <Shield className="w-3 h-3 mr-1" />
                  {authUser?.role ?? dummyUser?.role ?? 'user'}
                </Badge>
                <Badge variant="secondary">
                  <Award className="w-3 h-3 mr-1" />
                  Pro User
                </Badge>
              </div>

              <div className="w-full space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined January 2024</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={stat.label}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-2xl font-bold">{stat.value}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Bio */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  ) : (
                    <p className="text-muted-foreground">{formData.bio}</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      ) : (
                        <div className="p-2 text-sm">{formData.name}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      ) : (
                        <div className="p-2 text-sm">{formData.email}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      ) : (
                        <div className="p-2 text-sm">{formData.phone || 'Not provided'}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      {isEditing ? (
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      ) : (
                        <div className="p-2 text-sm">{formData.location}</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      {isEditing ? (
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        />
                      ) : (
                        <div className="p-2 text-sm">
                          <a href={formData.website} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                            {formData.website}
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      {isEditing ? (
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                      ) : (
                        <div className="p-2 text-sm">{formData.company}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="p-2 bg-muted rounded-lg">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {skills.map((skill) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="mt-4">
                      <Button variant="outline" className="w-full" onClick={() => toast('Add skill coming soon', { icon: '🛠️' })}>
                        Add Skill
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
