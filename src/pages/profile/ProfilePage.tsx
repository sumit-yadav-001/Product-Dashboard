import React, { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Edit, Save, X,
  Camera, Shield, Award, Activity, Clock, Users, FileText,
  Settings, Globe, Building2, Link as LinkIcon,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useCurrentUser } from '@/hooks/redux';
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

const activities = [
  { action: 'Updated profile information', time: '2 hours ago',  icon: User },
  { action: 'Changed password',            time: '1 day ago',    icon: Shield },
  { action: 'Logged in from new device',   time: '3 days ago',   icon: Activity },
  { action: 'Updated email preferences',   time: '1 week ago',   icon: Mail },
  { action: 'Added new API key',           time: '2 weeks ago',  icon: Settings },
];

const skills = [
  { name: 'React',       level: 95 },
  { name: 'TypeScript',  level: 88 },
  { name: 'Node.js',     level: 82 },
  { name: 'Python',      level: 75 },
  { name: 'AWS',         level: 70 },
  { name: 'Docker',      level: 65 },
];

export function ProfilePage() {
  const user = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name:     user?.name  || '',
    email:    user?.email || '',
    phone:    '+1 (555) 000-0000',
    location: 'San Francisco, CA',
    bio:      'Software developer passionate about creating amazing user experiences and building scalable enterprise applications.',
    website:  'https://johndoe.dev',
    company:  'Tech Corp',
    position: 'Senior Frontend Developer',
  });

  const getUserInitials = () => {
    if (!formData.name) return 'U';
    const parts = formData.name.split(' ');
    return parts.length >= 2
      ? `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase()
      : formData.name.substring(0, 2).toUpperCase();
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800)); // simulate API call
    setIsSaving(false);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name:     user?.name  || '',
      email:    user?.email || '',
      phone:    '+1 (555) 000-0000',
      location: 'San Francisco, CA',
      bio:      'Software developer passionate about creating amazing user experiences and building scalable enterprise applications.',
      website:  'https://johndoe.dev',
      company:  'Tech Corp',
      position: 'Senior Frontend Developer',
    });
  };

  const stats = [
    { label: 'Projects',  value: '24', icon: FileText },
    { label: 'Team',      value: '8',  icon: Users },
    { label: 'Reports',   value: '156',icon: Activity },
    { label: 'Hours/Mo',  value: '89', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage your personal information and preferences
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
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
        {/* ── Profile Card ── */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-2xl font-bold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-md"
                    onClick={() => toast('Photo upload coming soon', { icon: '📷' })}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Name & Role */}
              <div className="text-center space-y-1">
                <h3 className="text-xl font-semibold">{formData.name}</h3>
                <p className="text-sm text-muted-foreground">{formData.position}</p>
                <p className="text-xs text-muted-foreground">{formData.company}</p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap justify-center gap-1.5">
                <Badge variant="secondary" className="text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  {user?.role ?? 'user'}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <Award className="w-3 h-3 mr-1" />
                  Pro User
                </Badge>
              </div>

              <Separator />

              {/* Contact Info */}
              <div className="w-full space-y-2.5 text-sm">
                {[
                  { icon: Mail,      value: formData.email },
                  { icon: Phone,     value: formData.phone || 'Not provided' },
                  { icon: MapPin,    value: formData.location },
                  { icon: Building2, value: formData.company },
                  { icon: Calendar,  value: 'Joined January 2024' },
                ].map(({ icon: Icon, value }) => (
                  <div key={value} className="flex items-center gap-2 text-muted-foreground">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{value}</span>
                  </div>
                ))}
                {formData.website && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="h-4 w-4 shrink-0" />
                    <a
                      href={formData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate"
                    >
                      {formData.website.replace('https://', '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Main Content ── */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                {stats.map(({ label, value, icon: Icon }) => (
                  <Card key={label}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-2xl font-bold">{value}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">About</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself…"
                      rows={4}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed">{formData.bio}</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Details */}
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {([
                      { id: 'name',     label: 'Full Name',    key: 'name',     type: 'text' },
                      { id: 'email',    label: 'Email',        key: 'email',    type: 'email' },
                      { id: 'phone',    label: 'Phone',        key: 'phone',    type: 'tel' },
                      { id: 'location', label: 'Location',     key: 'location', type: 'text' },
                      { id: 'company',  label: 'Company',      key: 'company',  type: 'text' },
                      { id: 'position', label: 'Position',     key: 'position', type: 'text' },
                    ] as const).map(({ id, label, key, type }) => (
                      <div key={id} className="space-y-1.5">
                        <Label htmlFor={id} className="text-sm">{label}</Label>
                        {isEditing ? (
                          <Input
                            id={id}
                            type={type}
                            value={formData[key]}
                            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground py-2 px-3 rounded-md bg-muted/40">
                            {formData[key] || '—'}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="website" className="text-sm">Website</Label>
                    {isEditing ? (
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          className="pl-9"
                        />
                      </div>
                    ) : (
                      <p className="text-sm py-2 px-3 rounded-md bg-muted/40">
                        {formData.website
                          ? <a href={formData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{formData.website}</a>
                          : '—'}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity */}
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map(({ action, time, icon: Icon }, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{action}</p>
                          <p className="text-xs text-muted-foreground">{time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills */}
            <TabsContent value="skills" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skills.map(({ name, level }) => (
                    <div key={name} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{name}</span>
                        <span className="text-xs text-muted-foreground">{level}%</span>
                      </div>
                      <Progress value={level} className="h-2" />
                    </div>
                  ))}
                  {isEditing && (
                    <Button variant="outline" className="w-full mt-2" onClick={() => toast('Add skill coming soon', { icon: '🛠️' })}>
                      + Add Skill
                    </Button>
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
