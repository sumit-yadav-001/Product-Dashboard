import React, { useState, useEffect, useRef } from "react";
import {
  User, Mail, Phone, MapPin, Calendar, Edit, Save, X,
  Camera, Shield, Award, Activity, Clock, Users, FileText,
  Globe, Building2, Link as LinkIcon, Trash2,
  Lock, Bell, Key, Eye, EyeOff, Plus,
  AlertTriangle, Smartphone, Monitor, LogOut, Copy, RefreshCw,
  Twitter, Github, Linkedin, TrendingUp, Star, CheckCircle2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/common/Skeletons";
import { useCurrentUser } from "@/hooks/redux";
import { useGetUserQuery, useUpdateUserMutation } from "@/store/api/usersApi";
import { useAppDispatch } from "@/hooks/redux";
import { setUser } from "@/store/slices/authSlice";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  website: string;
  company: string;
  position: string;
  department: string;
  twitter: string;
  github: string;
  linkedin: string;
}

interface PasswordFormData {
  current: string;
  next: string;
  confirm: string;
}

interface PasswordErrors {
  current?: string;
  next?: string;
  confirm?: string;
}

interface SkillItem {
  id: string;
  name: string;
  level: number;
}

interface SessionItem {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
  icon: React.ElementType;
}

interface NotifPrefs {
  emailMarketing: boolean;
  emailSecurity: boolean;
  emailUpdates: boolean;
  pushAll: boolean;
  pushMentions: boolean;
  pushReminders: boolean;
  smsAlerts: boolean;
}

// ─── Static seed data ─────────────────────────────────────────────────────────

const INITIAL_SKILLS: SkillItem[] = [
  { id: "1", name: "React",      level: 95 },
  { id: "2", name: "TypeScript", level: 88 },
  { id: "3", name: "Node.js",    level: 82 },
  { id: "4", name: "Python",     level: 75 },
  { id: "5", name: "AWS",        level: 70 },
  { id: "6", name: "Docker",     level: 65 },
];

const SESSIONS: SessionItem[] = [
  { id: "1", device: "Chrome on Windows", location: "Houston, TX", lastActive: "Active now",  current: true,  icon: Monitor },
  { id: "2", device: "Safari on iPhone",  location: "Houston, TX", lastActive: "2 hours ago", current: false, icon: Smartphone },
  { id: "3", device: "Firefox on macOS",  location: "Austin, TX",  lastActive: "3 days ago",  current: false, icon: Monitor },
];

const ACTIVITIES = [
  { action: "Updated profile information", time: "2 hours ago", icon: User,    color: "text-blue-500",   bg: "bg-blue-500/10" },
  { action: "Changed password",            time: "1 day ago",   icon: Shield,  color: "text-green-500",  bg: "bg-green-500/10" },
  { action: "Logged in from new device",   time: "3 days ago",  icon: Monitor, color: "text-amber-500",  bg: "bg-amber-500/10" },
  { action: "Updated email preferences",   time: "1 week ago",  icon: Mail,    color: "text-purple-500", bg: "bg-purple-500/10" },
  { action: "Added new API key",           time: "2 weeks ago", icon: Key,     color: "text-rose-500",   bg: "bg-rose-500/10" },
  { action: "Joined the platform",         time: "Jan 2024",    icon: Star,    color: "text-yellow-500", bg: "bg-yellow-500/10" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcCompletion(f: ProfileFormData): number {
  const fields: (keyof ProfileFormData)[] = ["name","email","phone","location","bio","website","company","position"];
  const filled = fields.filter(k => (f[k] as string)?.trim()).length;
  return Math.round((filled / fields.length) * 100);
}

function validatePassword(p: PasswordFormData): PasswordErrors {
  const errs: PasswordErrors = {};
  if (!p.current) errs.current = "Current password is required";
  if (!p.next) {
    errs.next = "New password is required";
  } else if (p.next.length < 8) {
    errs.next = "Must be at least 8 characters";
  } else if (!/[A-Z]/.test(p.next)) {
    errs.next = "Must contain at least one uppercase letter";
  } else if (!/[0-9]/.test(p.next)) {
    errs.next = "Must contain at least one number";
  }
  if (!p.confirm) {
    errs.confirm = "Please confirm your password";
  } else if (p.next !== p.confirm) {
    errs.confirm = "Passwords do not match";
  }
  return errs;
}

function passwordStrength(pwd: string): { score: number; label: string; color: string } {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8)          score++;
  if (pwd.length >= 12)         score++;
  if (/[A-Z]/.test(pwd))        score++;
  if (/[0-9]/.test(pwd))        score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { score: 20,  label: "Very Weak",   color: "bg-red-500" };
  if (score === 2) return { score: 40,  label: "Weak",        color: "bg-orange-500" };
  if (score === 3) return { score: 60,  label: "Fair",        color: "bg-yellow-500" };
  if (score === 4) return { score: 80,  label: "Strong",      color: "bg-blue-500" };
  return                        { score: 100, label: "Very Strong", color: "bg-green-500" };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

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
        <div className="md:col-span-1 rounded-xl border bg-card p-6 space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-28 w-28 rounded-full" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-2 w-full rounded-full" />
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
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, trend }: {
  label: string; value: string; icon: React.ElementType; trend?: string;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          {trend && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" />{trend}
            </span>
          )}
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProfilePage() {
  const authUser = useCurrentUser();
  const dispatch = useAppDispatch();
  const { data: dummyUser, isLoading, isError } = useGetUserQuery(1);
  const [updateUser] = useUpdateUserMutation();

  // ── Core state ──
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving,  setIsSaving]  = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Form state ──
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "", email: "", phone: "", location: "", bio: "",
    website: "", company: "", position: "", department: "",
    twitter: "", github: "", linkedin: "",
  });
  const [savedForm, setSavedForm] = useState<ProfileFormData | null>(null);

  // ── Password state ──
  const [pwForm, setPwForm]       = useState<PasswordFormData>({ current: "", next: "", confirm: "" });
  const [pwErrors, setPwErrors]   = useState<PasswordErrors>({});
  const [pwSaving, setPwSaving]   = useState(false);
  const [showPw, setShowPw]       = useState({ current: false, next: false, confirm: false });

  // ── Skills state ──
  const [skills, setSkills]       = useState<SkillItem[]>(INITIAL_SKILLS);
  const [newSkill, setNewSkill]   = useState("");
  const [sessions, setSessions]   = useState<SessionItem[]>(SESSIONS);

  // ── 2FA state ──
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  // ── Notification prefs ──
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>({
    emailMarketing: false,
    emailSecurity:  true,
    emailUpdates:   true,
    pushAll:        true,
    pushMentions:   true,
    pushReminders:  false,
    smsAlerts:      false,
  });

  // ── API keys ──
  const [apiKeys, setApiKeys] = useState([
    { id: "1", name: "Production Key", key: "sk-prod-••••••••••••••••", created: "Jan 15, 2024", lastUsed: "2 hours ago" },
    { id: "2", name: "Development Key", key: "sk-dev-••••••••••••••••", created: "Feb 3, 2024",  lastUsed: "1 day ago" },
  ]);

  // ── Danger zone ──
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput]             = useState("");

  // ── Populate form from API + auth user ──
  useEffect(() => {
    if (dummyUser) {
      const populated: ProfileFormData = {
        // Prefer auth user name (from login/register) over dummyJSON
        name:       authUser?.name ?? `${dummyUser.firstName} ${dummyUser.lastName}`,
        email:      authUser?.email ?? dummyUser.email,
        phone:      dummyUser.phone,
        location:   `${dummyUser.address.city}, ${dummyUser.address.state}`,
        bio:        `${dummyUser.company.title} at ${dummyUser.company.name}. Passionate about technology and innovation. Username: @${dummyUser.username}.`,
        website:    "https://johndoe.dev",
        company:    dummyUser.company.name,
        position:   dummyUser.company.title,
        department: dummyUser.company.department,
        twitter:    "",
        github:     "",
        linkedin:   "",
      };
      setFormData(populated);
      setSavedForm(populated);
      if (dummyUser.image && avatarSrc === null) {
        setAvatarSrc(dummyUser.image);
      }
    }
  }, [dummyUser, authUser]);

  // ── Helpers ──
  const getUserInitials = () => {
    const name = formData.name || authUser?.name || "U";
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const completion = calcCompletion(formData);

  // ── Avatar upload ──
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select a valid image file"); return; }
    if (file.size > 5 * 1024 * 1024)    { toast.error("Image must be smaller than 5 MB");  return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") {
        setAvatarSrc(result);
        toast.success("Profile photo updated");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleAvatarRemove = () => { setAvatarSrc(null); toast.success("Profile photo removed"); };

  // ── Save profile ──
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (dummyUser) {
        const [firstName, ...rest] = formData.name.trim().split(" ");
        await updateUser({
          id: dummyUser.id,
          data: {
            firstName,
            lastName: rest.join(" "),
            email:    formData.email,
            phone:    formData.phone,
          },
        }).unwrap();
      }
      // Update Redux auth user so name shows everywhere
      if (authUser) {
        dispatch(setUser({ ...authUser, name: formData.name, email: formData.email }));
      }
      setSavedForm({ ...formData });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (savedForm) setFormData({ ...savedForm });
    setIsEditing(false);
  };

  // ── Password change ──
  const handlePasswordSave = async () => {
    const errs = validatePassword(pwForm);
    if (Object.keys(errs).length > 0) { setPwErrors(errs); return; }
    setPwSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setPwSaving(false);
    setPwForm({ current: "", next: "", confirm: "" });
    setPwErrors({});
    toast.success("Password changed successfully!");
  };

  // ── Skills ──
  const handleAddSkill = () => {
    const name = newSkill.trim();
    if (!name) return;
    if (skills.find(s => s.name.toLowerCase() === name.toLowerCase())) {
      toast.error("Skill already exists"); return;
    }
    setSkills(prev => [...prev, { id: Date.now().toString(), name, level: 50 }]);
    setNewSkill("");
    toast.success(`"${name}" added`);
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id));
    toast.success("Skill removed");
  };

  const handleSkillLevel = (id: string, level: number) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, level } : s));
  };

  // ── Sessions ──
  const handleRevokeSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    toast.success("Session revoked");
  };

  // ── API Keys ──
  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key).then(() => toast.success("Copied to clipboard"));
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
    toast.success("API key deleted");
  };

  const handleRegenerateKey = (id: string) => {
    setApiKeys(prev => prev.map(k =>
      k.id === id ? { ...k, key: `sk-${k.name.toLowerCase().includes("prod") ? "prod" : "dev"}-••••••••••••••••` } : k
    ));
    toast.success("API key regenerated");
  };

  // ── Notif prefs ──
  const toggleNotif = (key: keyof NotifPrefs) => {
    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success("Preference updated");
  };

  // ── Stats ──
  const stats = [
    { label: "Projects Created",    value: "24",  icon: FileText,  trend: "+3" },
    { label: "Team Members",        value: "8",   icon: Users,     trend: "+1" },
    { label: "Reports Generated",   value: "156", icon: Activity,  trend: "+12" },
    { label: "Hours This Month",    value: "89",  icon: Clock,     trend: "+5" },
  ];

  if (isLoading) return <ProfileSkeleton />;

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center space-y-3">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto" />
          <p className="text-lg font-semibold text-destructive">Failed to load profile</p>
          <p className="text-sm text-muted-foreground">Could not fetch user data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const pwStrength = passwordStrength(pwForm.next);

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground text-sm md:text-base mt-0.5">
            Manage your personal information and preferences
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="shrink-0">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* ── Left: Profile Card ── */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                {/* Avatar */}
                <div className="relative group">
                  <Avatar className="h-28 w-28 ring-4 ring-background shadow-lg">
                    {avatarSrc && <AvatarImage src={avatarSrc} alt={formData.name} />}
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-3xl font-bold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}>
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  )}
                  {isEditing && (
                    <div className="absolute -bottom-1 -right-1 flex gap-1">
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                      <Button size="icon" className="h-8 w-8 rounded-full shadow-md" title="Upload photo"
                        onClick={() => fileInputRef.current?.click()}>
                        <Camera className="h-3.5 w-3.5" />
                      </Button>
                      {avatarSrc && (
                        <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full shadow-md"
                          title="Remove photo" onClick={handleAvatarRemove}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Name & Role */}
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-semibold leading-tight">{formData.name || authUser?.name || "—"}</h3>
                  <p className="text-sm text-muted-foreground">{formData.position || "—"}</p>
                  <p className="text-xs text-muted-foreground">{formData.company || "—"}</p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap justify-center gap-1.5">
                  <Badge variant="secondary" className="text-xs capitalize">
                    <Shield className="w-3 h-3 mr-1" />
                    {authUser?.role ?? dummyUser?.role ?? "user"}
                  </Badge>
                  <Badge variant="success" className="text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    Pro User
                  </Badge>
                  {twoFAEnabled && (
                    <Badge variant="info" className="text-xs">
                      <Lock className="w-3 h-3 mr-1" />
                      2FA On
                    </Badge>
                  )}
                </div>

                {/* Profile Completion */}
                <div className="w-full space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Profile completion</span>
                    <span className="font-semibold text-foreground">{completion}%</span>
                  </div>
                  <Progress value={completion} className="h-1.5" />
                  {completion < 100 && (
                    <p className="text-xs text-muted-foreground">
                      Fill in all fields to complete your profile
                    </p>
                  )}
                </div>

                <Separator />

                {/* Contact Info */}
                <div className="w-full space-y-2.5 text-sm">
                  {[
                    { icon: Mail,      value: formData.email || authUser?.email },
                    { icon: Phone,     value: formData.phone || "Not provided" },
                    { icon: MapPin,    value: formData.location || "Not provided" },
                    { icon: Building2, value: formData.company || "Not provided" },
                    { icon: Calendar,  value: authUser?.createdAt
                        ? `Joined ${new Date(authUser.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
                        : "Joined January 2024" },
                  ].map(({ icon: Icon, value }, i) => (
                    <div key={i} className="flex items-center gap-2 text-muted-foreground">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate text-xs">{value}</span>
                    </div>
                  ))}
                  {formData.website && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-4 w-4 shrink-0" />
                      <a href={formData.website} target="_blank" rel="noopener noreferrer"
                        className="text-primary hover:underline truncate text-xs">
                        {formData.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {(formData.twitter || formData.github || formData.linkedin) && (
                  <>
                    <Separator />
                    <div className="flex gap-2">
                      {formData.twitter && (
                        <a href={`https://twitter.com/${formData.twitter}`} target="_blank" rel="noopener noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted hover:bg-accent transition-colors">
                          <Twitter className="h-4 w-4" />
                        </a>
                      )}
                      {formData.github && (
                        <a href={`https://github.com/${formData.github}`} target="_blank" rel="noopener noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted hover:bg-accent transition-colors">
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {formData.linkedin && (
                        <a href={`https://linkedin.com/in/${formData.linkedin}`} target="_blank" rel="noopener noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted hover:bg-accent transition-colors">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Right: Tabs ── */}
        <div className="md:col-span-2 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 h-auto">
              <TabsTrigger value="overview"  className="text-xs sm:text-sm py-2">Overview</TabsTrigger>
              <TabsTrigger value="details"   className="text-xs sm:text-sm py-2">Details</TabsTrigger>
              <TabsTrigger value="security"  className="text-xs sm:text-sm py-2">Security</TabsTrigger>
              <TabsTrigger value="notifs"    className="text-xs sm:text-sm py-2">Alerts</TabsTrigger>
              <TabsTrigger value="skills"    className="text-xs sm:text-sm py-2">Skills</TabsTrigger>
            </TabsList>

            {/* ── Overview Tab ── */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                {stats.map(s => <StatCard key={s.label} {...s} />)}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">About</CardTitle>
                  <CardDescription>A short bio about yourself</CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea value={formData.bio}
                      onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
                      placeholder="Tell us about yourself…" rows={4} />
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {formData.bio || "No bio added yet."}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ACTIVITIES.map(({ action, time, icon: Icon, color, bg }, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                          <Icon className={`h-4 w-4 ${color}`} />
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

            {/* ── Details Tab ── */}
            <TabsContent value="details" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {([
                      { id: "name",       label: "Full Name",   key: "name",       type: "text"  },
                      { id: "email",      label: "Email",       key: "email",      type: "email" },
                      { id: "phone",      label: "Phone",       key: "phone",      type: "tel"   },
                      { id: "location",   label: "Location",    key: "location",   type: "text"  },
                      { id: "company",    label: "Company",     key: "company",    type: "text"  },
                      { id: "position",   label: "Position",    key: "position",   type: "text"  },
                      { id: "department", label: "Department",  key: "department", type: "text"  },
                    ] as const).map(({ id, label, key, type }) => (
                      <div key={id} className="space-y-1.5">
                        <Label htmlFor={id} className="text-sm">{label}</Label>
                        {isEditing ? (
                          <Input id={id} type={type} value={formData[key]}
                            onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))} />
                        ) : (
                          <p className="text-sm text-muted-foreground py-2 px-3 rounded-md bg-muted/40 min-h-[38px] flex items-center">
                            {formData[key] || "—"}
                          </p>
                        )}
                      </div>
                    ))}
                    <div className="space-y-1.5">
                      <Label htmlFor="website" className="text-sm">Website</Label>
                      {isEditing ? (
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="website" value={formData.website} className="pl-9"
                            onChange={e => setFormData(p => ({ ...p, website: e.target.value }))} />
                        </div>
                      ) : (
                        <p className="text-sm py-2 px-3 rounded-md bg-muted/40 min-h-[38px] flex items-center">
                          {formData.website
                            ? <a href={formData.website} target="_blank" rel="noopener noreferrer"
                                className="text-primary hover:underline">{formData.website}</a>
                            : "—"}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Social Links</CardTitle>
                  <CardDescription>Connect your social profiles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {([
                    { id: "twitter",  label: "Twitter / X",  key: "twitter",  icon: Twitter,  prefix: "twitter.com/" },
                    { id: "github",   label: "GitHub",        key: "github",   icon: Github,   prefix: "github.com/" },
                    { id: "linkedin", label: "LinkedIn",      key: "linkedin", icon: Linkedin, prefix: "linkedin.com/in/" },
                  ] as const).map(({ id, label, key, icon: Icon, prefix }) => (
                    <div key={id} className="space-y-1.5">
                      <Label htmlFor={id} className="text-sm flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5" />{label}
                      </Label>
                      {isEditing ? (
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground select-none">
                            {prefix}
                          </span>
                          <Input id={id} value={formData[key]}
                            className="pl-[calc(0.75rem+var(--prefix-w,80px))]"
                            style={{ paddingLeft: `${prefix.length * 7 + 12}px` }}
                            onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))}
                            placeholder="username" />
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground py-2 px-3 rounded-md bg-muted/40 min-h-[38px] flex items-center">
                          {formData[key] ? `${prefix}${formData[key]}` : "—"}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Security Tab ── */}
            <TabsContent value="security" className="space-y-4 mt-4">
              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lock className="h-4 w-4" />Change Password
                  </CardTitle>
                  <CardDescription>Use a strong password with at least 8 characters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current */}
                  <div className="space-y-1.5">
                    <Label className="text-sm">Current Password</Label>
                    <div className="relative">
                      <Input type={showPw.current ? "text" : "password"} value={pwForm.current}
                        onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
                        className={pwErrors.current ? "border-destructive" : ""} />
                      <button type="button" onClick={() => setShowPw(p => ({ ...p, current: !p.current }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPw.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {pwErrors.current && <p className="text-xs text-destructive">{pwErrors.current}</p>}
                  </div>
                  {/* New */}
                  <div className="space-y-1.5">
                    <Label className="text-sm">New Password</Label>
                    <div className="relative">
                      <Input type={showPw.next ? "text" : "password"} value={pwForm.next}
                        onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))}
                        className={pwErrors.next ? "border-destructive" : ""} />
                      <button type="button" onClick={() => setShowPw(p => ({ ...p, next: !p.next }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPw.next ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {pwForm.next && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex gap-1">
                          {[0,1,2,3,4].map(i => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                              i < Math.ceil(pwStrength.score / 20) ? pwStrength.color : "bg-muted"}`} />
                          ))}
                        </div>
                        {pwStrength.label && (
                          <p className="text-xs text-muted-foreground">Strength: <span className="font-medium">{pwStrength.label}</span></p>
                        )}
                      </div>
                    )}
                    {pwErrors.next && <p className="text-xs text-destructive">{pwErrors.next}</p>}
                  </div>
                  {/* Confirm */}
                  <div className="space-y-1.5">
                    <Label className="text-sm">Confirm New Password</Label>
                    <div className="relative">
                      <Input type={showPw.confirm ? "text" : "password"} value={pwForm.confirm}
                        onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                        className={pwErrors.confirm ? "border-destructive" : ""} />
                      <button type="button" onClick={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPw.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {pwErrors.confirm && <p className="text-xs text-destructive">{pwErrors.confirm}</p>}
                  </div>
                  <Button onClick={handlePasswordSave} disabled={pwSaving} className="w-full sm:w-auto">
                    {pwSaving ? "Updating…" : "Update Password"}
                  </Button>
                </CardContent>
              </Card>

              {/* 2FA */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4" />Two-Factor Authentication
                  </CardTitle>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Authenticator App</p>
                      <p className="text-xs text-muted-foreground">
                        {twoFAEnabled ? "2FA is currently enabled" : "Use an app like Google Authenticator"}
                      </p>
                    </div>
                    <Switch checked={twoFAEnabled} onCheckedChange={v => {
                      setTwoFAEnabled(v);
                      toast.success(v ? "2FA enabled" : "2FA disabled");
                    }} />
                  </div>
                  {twoFAEnabled && (
                    <div className="mt-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <p className="text-xs text-emerald-700 dark:text-emerald-400">
                        Your account is protected with two-factor authentication
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Active Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Monitor className="h-4 w-4" />Active Sessions
                  </CardTitle>
                  <CardDescription>Manage devices where you are logged in</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {sessions.map(({ id, device, location, lastActive, current, icon: Icon }) => (
                    <div key={id} className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-muted/20">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">{device}</p>
                            {current && <Badge variant="success" className="text-[10px] py-0">Current</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">{location} · {lastActive}</p>
                        </div>
                      </div>
                      {!current && (
                        <Button size="sm" variant="outline" className="shrink-0 text-destructive hover:text-destructive"
                          onClick={() => handleRevokeSession(id)}>
                          <LogOut className="h-3.5 w-3.5 mr-1" />Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* API Keys */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Key className="h-4 w-4" />API Keys
                      </CardTitle>
                      <CardDescription className="mt-0.5">Manage your API access keys</CardDescription>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => {
                      const newKey = { id: Date.now().toString(), name: `Key ${apiKeys.length + 1}`,
                        key: "sk-new-••••••••••••••••", created: "Today", lastUsed: "Never" };
                      setApiKeys(p => [...p, newKey]);
                      toast.success("New API key created");
                    }}>
                      <Plus className="h-3.5 w-3.5 mr-1" />New Key
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {apiKeys.map(({ id, name, key, created, lastUsed }) => (
                    <div key={id} className="p-3 rounded-lg border bg-muted/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{name}</p>
                        <div className="flex gap-1">
                          <Button size="icon-sm" variant="ghost" title="Copy" onClick={() => handleCopyKey(key)}>
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon-sm" variant="ghost" title="Regenerate" onClick={() => handleRegenerateKey(id)}>
                            <RefreshCw className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon-sm" variant="ghost" title="Delete"
                            className="text-destructive hover:text-destructive" onClick={() => handleDeleteKey(id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono block">{key}</code>
                      <p className="text-xs text-muted-foreground">Created {created} · Last used {lastUsed}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-destructive/30">
                <CardHeader>
                  <CardTitle className="text-base text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />Danger Zone
                  </CardTitle>
                  <CardDescription>Irreversible and destructive actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                    <div>
                      <p className="text-sm font-medium">Delete Account</p>
                      <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
                      Delete
                    </Button>
                  </div>
                  {showDeleteConfirm && (
                    <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5 space-y-3">
                      <p className="text-sm font-medium text-destructive">Are you absolutely sure?</p>
                      <p className="text-xs text-muted-foreground">
                        Type <strong>DELETE</strong> to confirm. This action cannot be undone.
                      </p>
                      <Input value={deleteInput} onChange={e => setDeleteInput(e.target.value)}
                        placeholder="Type DELETE to confirm" className="border-destructive/40" />
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}>
                          Cancel
                        </Button>
                        <Button size="sm" variant="destructive" disabled={deleteInput !== "DELETE"}
                          onClick={() => toast.error("Account deletion is disabled in demo mode")}>
                          Confirm Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Notifications Tab ── */}
            <TabsContent value="notifs" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Mail className="h-4 w-4" />Email Notifications
                  </CardTitle>
                  <CardDescription>Choose which emails you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {([
                    { key: "emailSecurity",  label: "Security alerts",       desc: "Login attempts, password changes" },
                    { key: "emailUpdates",   label: "Product updates",        desc: "New features and improvements" },
                    { key: "emailMarketing", label: "Marketing & promotions", desc: "Tips, offers, and newsletters" },
                  ] as const).map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      <Switch checked={notifPrefs[key]} onCheckedChange={() => toggleNotif(key)} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bell className="h-4 w-4" />Push Notifications
                  </CardTitle>
                  <CardDescription>Manage in-app and browser notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {([
                    { key: "pushAll",       label: "All notifications",  desc: "Receive all push notifications" },
                    { key: "pushMentions",  label: "Mentions only",      desc: "Only when someone mentions you" },
                    { key: "pushReminders", label: "Reminders",          desc: "Task and calendar reminders" },
                  ] as const).map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      <Switch checked={notifPrefs[key]} onCheckedChange={() => toggleNotif(key)} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />SMS Notifications
                  </CardTitle>
                  <CardDescription>Receive critical alerts via SMS</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Critical security alerts</p>
                      <p className="text-xs text-muted-foreground">SMS for suspicious login activity</p>
                    </div>
                    <Switch checked={notifPrefs.smsAlerts} onCheckedChange={() => toggleNotif("smsAlerts")} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Skills Tab ── */}
            <TabsContent value="skills" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Skills & Expertise</CardTitle>
                  <CardDescription>Showcase your technical skills and proficiency levels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {skills.map(({ id, name, level }) => (
                    <div key={id} className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{name}</span>
                        <div className="flex items-center gap-2">
                          {isEditing && (
                            <input type="range" min={0} max={100} value={level}
                              onChange={e => handleSkillLevel(id, Number(e.target.value))}
                              className="w-20 accent-primary cursor-pointer" />
                          )}
                          <span className="text-xs text-muted-foreground w-8 text-right">{level}%</span>
                          {isEditing && (
                            <Button size="icon-sm" variant="ghost"
                              className="text-destructive hover:text-destructive h-6 w-6"
                              onClick={() => handleRemoveSkill(id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <Progress value={level} className="h-2" />
                    </div>
                  ))}

                  {isEditing && (
                    <div className="flex gap-2 pt-2">
                      <Input value={newSkill} onChange={e => setNewSkill(e.target.value)}
                        placeholder="Add a skill (e.g. GraphQL)"
                        onKeyDown={e => e.key === "Enter" && handleAddSkill()} />
                      <Button variant="outline" onClick={handleAddSkill} className="shrink-0">
                        <Plus className="h-4 w-4 mr-1" />Add
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

// NOTE: Notifications, Skills tabs and closing brackets are appended below
