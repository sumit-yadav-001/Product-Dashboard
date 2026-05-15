import { useState } from 'react';
import {
  Settings, User, Shield, Bell, Zap, Code2, CreditCard,
  Eye, EyeOff, Plus, Trash2, RefreshCw, Download, Check,
  Globe, Clock, Moon, Smartphone, Mail,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/utils';
import { useCurrentUser } from '@/hooks/redux';
import { useGetUsersQuery } from '@/store/api/usersApi';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProfileForm { name: string; email: string; bio: string; }
interface PasswordForm { current: string; next: string; confirm: string; }
interface NotifPrefs { security: boolean; updates: boolean; marketing: boolean; weekly: boolean; realtime: boolean; mentions: boolean; }
interface PrefForm { language: string; timezone: string; darkMode: boolean; }

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SESSION_DEVICES = [
  { device: 'Chrome on Windows', icon: Globe },
  { device: 'Safari on iPhone',  icon: Smartphone },
  { device: 'Firefox on Linux',  icon: Globe },
];

const INTEGRATIONS = [
  { name: 'Google Analytics', desc: 'Track website analytics',          connected: true  },
  { name: 'Slack',            desc: 'Send notifications to channels',   connected: false },
  { name: 'GitHub',           desc: 'Import repos and sync code',       connected: true  },
  { name: 'Stripe',           desc: 'Process payments and billing',     connected: false },
];

const BILLING_HISTORY = [
  { date: 'May 15, 2026', amount: '$29.00', status: 'Paid' },
  { date: 'Apr 15, 2026', amount: '$29.00', status: 'Paid' },
  { date: 'Mar 15, 2026', amount: '$29.00', status: 'Paid' },
];

// ─── Sub-sections ─────────────────────────────────────────────────────────────
function SectionHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-semibold">{title}</h2>
      {desc && <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>}
    </div>
  );
}

function FieldRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
      <div className="shrink-0 sm:w-48">
        <p className="text-sm font-medium">{label}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

// ─── General Tab ─────────────────────────────────────────────────────────────
function GeneralTab() {
  const user = useCurrentUser();
  const [form, setForm] = useState<ProfileForm>({
    name:  user?.name  ?? '',
    email: user?.email ?? '',
    bio:   '',
  });
  const [prefs, setPrefs] = useState<PrefForm>({ language: 'en', timezone: 'utc', darkMode: false });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    toast.success('Profile information saved');
  };

  return (
    <div className="space-y-6">
      {/* Profile info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User className="h-4 w-4 text-primary" />Profile Information</CardTitle>
          <CardDescription>Update your name, email, and bio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {form.name ? form.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{form.name || 'Your Name'}</p>
              <p className="text-xs text-muted-foreground">{form.email || 'your@email.com'}</p>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="s-name">Full Name</Label>
              <Input id="s-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-email">Email Address</Label>
              <Input id="s-email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@example.com" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="s-bio">Bio</Label>
            <Textarea id="s-bio" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell us a bit about yourself…" rows={3} />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} size="sm">
              {saving ? <><RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />Saving…</> : <><Check className="mr-2 h-3.5 w-3.5" />Save Changes</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" />Preferences</CardTitle>
          <CardDescription>Language, timezone, and display settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Language</Label>
              <Select value={prefs.language} onValueChange={v => setPrefs(p => ({ ...p, language: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Timezone</Label>
              <Select value={prefs.timezone} onValueChange={v => setPrefs(p => ({ ...p, timezone: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">Eastern Time (EST)</SelectItem>
                  <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                  <SelectItem value="gmt">GMT</SelectItem>
                  <SelectItem value="ist">India (IST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <FieldRow label="Dark Mode" desc="Switch between light and dark theme">
            <Switch checked={prefs.darkMode} onCheckedChange={v => { setPrefs(p => ({ ...p, darkMode: v })); toast.success(v ? 'Dark mode enabled' : 'Light mode enabled'); }} />
          </FieldRow>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => toast.success('Preferences saved')}>
              <Check className="mr-2 h-3.5 w-3.5" />Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────
function SecurityTab() {
  const { data: sessionsData, isLoading: sessionsLoading } = useGetUsersQuery({ limit: 3 });
  const [pw, setPw] = useState<PasswordForm>({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const handlePasswordSave = async () => {
    if (!pw.current) { toast.error('Enter your current password'); return; }
    if (pw.next.length < 8) { toast.error('New password must be at least 8 characters'); return; }
    if (pw.next !== pw.confirm) { toast.error('Passwords do not match'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    setPw({ current: '', next: '', confirm: '' });
    toast.success('Password updated successfully');
  };

  const EyeToggle = ({ field }: { field: keyof typeof show }) => (
    <button type="button" tabIndex={-1} onClick={() => setShow(s => ({ ...s, [field]: !s[field] }))}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
      {show[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />Change Password</CardTitle>
          <CardDescription>Use a strong password of at least 8 characters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(['current', 'next', 'confirm'] as const).map(field => (
            <div key={field} className="space-y-1.5">
              <Label htmlFor={`pw-${field}`}>
                {field === 'current' ? 'Current Password' : field === 'next' ? 'New Password' : 'Confirm New Password'}
              </Label>
              <div className="relative">
                <Input id={`pw-${field}`} type={show[field] ? 'text' : 'password'}
                  value={pw[field]} onChange={e => setPw(p => ({ ...p, [field]: e.target.value }))}
                  placeholder={field === 'current' ? '••••••••' : field === 'next' ? 'Min. 8 characters' : 'Repeat new password'}
                  className="pr-10" />
                <EyeToggle field={field} />
              </div>
            </div>
          ))}
          <div className="flex justify-end pt-1">
            <Button size="sm" onClick={handlePasswordSave} disabled={saving}>
              {saving ? <><RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />Updating…</> : 'Update Password'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2FA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" />Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldRow label="Enable 2FA" desc="Require a verification code on login">
            <Switch checked={twoFA} onCheckedChange={v => { setTwoFA(v); toast.success(v ? '2FA enabled' : '2FA disabled'); }} />
          </FieldRow>
          <Separator />
          <div>
            <p className="text-sm font-medium mb-1">Backup Codes</p>
            <p className="text-xs text-muted-foreground mb-3">Generate one-time codes to use if you lose access to your authenticator app.</p>
            <Button variant="outline" size="sm" onClick={() => toast.success('Backup codes generated — check your email')}>
              <RefreshCw className="mr-2 h-3.5 w-3.5" />Generate Backup Codes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />Active Sessions</CardTitle>
          <CardDescription>Devices currently signed in to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessionsLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1.5"><div className="h-4 w-40 bg-muted animate-pulse rounded" /><div className="h-3 w-28 bg-muted animate-pulse rounded" /></div>
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                </div>
              ))
            : (sessionsData?.users ?? []).map((u, i) => {
                const d = SESSION_DEVICES[i] ?? SESSION_DEVICES[0]!;
                const Icon = d.icon;
                return (
                  <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted"><Icon className="h-4 w-4 text-muted-foreground" /></div>
                      <div>
                        <p className="text-sm font-medium">{d.device}</p>
                        <p className="text-xs text-muted-foreground">{u.address.city}, {u.address.country}</p>
                      </div>
                    </div>
                    {i === 0
                      ? <Badge variant="success" className="text-xs">Current</Badge>
                      : <Button variant="outline" size="sm" onClick={() => toast.success('Session revoked')}>Revoke</Button>}
                  </div>
                );
              })}
          <div className="pt-1">
            <Button variant="destructive" size="sm" onClick={() => toast.success('All other sessions revoked')}>
              Revoke All Other Sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Notifications Tab ────────────────────────────────────────────────────────
function NotificationsTab() {
  const [prefs, setPrefs] = useState<NotifPrefs>({
    security: true, updates: true, marketing: false, weekly: true,
    realtime: true, mentions: true,
  });

  const toggle = (key: keyof NotifPrefs) => {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
    toast.success('Notification preference updated');
  };

  const emailItems: { key: keyof NotifPrefs; label: string; desc: string }[] = [
    { key: 'security',  label: 'Security alerts',  desc: 'Login attempts and security events' },
    { key: 'updates',   label: 'Product updates',  desc: 'New features and improvements' },
    { key: 'marketing', label: 'Marketing emails', desc: 'Promotions and offers' },
    { key: 'weekly',    label: 'Weekly reports',   desc: 'Weekly summary of your activity' },
  ];
  const pushItems: { key: keyof NotifPrefs; label: string; desc: string }[] = [
    { key: 'realtime', label: 'Real-time alerts', desc: 'Immediate notifications for critical events' },
    { key: 'mentions', label: 'Team mentions',    desc: 'When someone mentions you in a comment' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" />Email Notifications</CardTitle>
          <CardDescription>Choose which emails you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {emailItems.map(({ key, label, desc }) => (
            <FieldRow key={key} label={label} desc={desc}>
              <Switch checked={prefs[key]} onCheckedChange={() => toggle(key)} />
            </FieldRow>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4 text-primary" />Push Notifications</CardTitle>
          <CardDescription>In-app and browser push notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pushItems.map(({ key, label, desc }) => (
            <FieldRow key={key} label={label} desc={desc}>
              <Switch checked={prefs[key]} onCheckedChange={() => toggle(key)} />
            </FieldRow>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Integrations Tab ─────────────────────────────────────────────────────────
function IntegrationsTab() {
  const [connected, setConnected] = useState<Record<string, boolean>>(
    Object.fromEntries(INTEGRATIONS.map(i => [i.name, i.connected]))
  );

  const toggle = (name: string) => {
    setConnected(c => {
      const next = !c[name];
      toast.success(next ? `${name} connected` : `${name} disconnected`);
      return { ...c, [name]: next };
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" />Connected Services</CardTitle>
        <CardDescription>Manage third-party integrations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {INTEGRATIONS.map(svc => (
          <div key={svc.name} className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/30 transition-colors">
            <div>
              <p className="text-sm font-medium">{svc.name}</p>
              <p className="text-xs text-muted-foreground">{svc.desc}</p>
            </div>
            <div className="flex items-center gap-3">
              {connected[svc.name] && <Badge variant="success" className="text-xs">Connected</Badge>}
              <Button
                variant={connected[svc.name] ? 'outline' : 'default'}
                size="sm"
                onClick={() => toggle(svc.name)}
              >
                {connected[svc.name] ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── API Tab ──────────────────────────────────────────────────────────────────
function ApiTab() {
  const [keys] = useState([
    { name: 'Production API Key', lastUsed: '2 hours ago', created: 'Jan 15, 2026', masked: 'sk_live_••••••••••••4242' },
    { name: 'Development API Key', lastUsed: '1 day ago',  created: 'Jan 10, 2026', masked: 'sk_test_••••••••••••8f3a' },
  ]);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEvent, setWebhookEvent] = useState('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Code2 className="h-4 w-4 text-primary" />API Keys</CardTitle>
          <CardDescription>Authenticate requests to the API. Keep keys secure.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {keys.map((k, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/30 transition-colors">
              <div>
                <p className="text-sm font-medium">{k.name}</p>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">{k.masked}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Last used: {k.lastUsed} · Created: {k.created}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toast.success('Key regenerated')}>
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => toast.success('Key deleted')}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
          <Button size="sm" onClick={() => toast.success('New API key created — check your email')}>
            <Plus className="mr-2 h-3.5 w-3.5" />Create New API Key
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" />Webhooks</CardTitle>
          <CardDescription>Receive real-time event notifications via HTTP POST</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Webhook URL</Label>
            <Input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://your-app.com/webhooks" />
          </div>
          <div className="space-y-1.5">
            <Label>Event</Label>
            <Select value={webhookEvent} onValueChange={setWebhookEvent}>
              <SelectTrigger><SelectValue placeholder="Select an event" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="user.created">user.created</SelectItem>
                <SelectItem value="user.updated">user.updated</SelectItem>
                <SelectItem value="order.completed">order.completed</SelectItem>
                <SelectItem value="payment.failed">payment.failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" onClick={() => { if (!webhookUrl) { toast.error('Enter a webhook URL'); return; } toast.success('Webhook added'); }}>
            <Plus className="mr-2 h-3.5 w-3.5" />Add Webhook
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Billing Tab ──────────────────────────────────────────────────────────────
function BillingTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" />Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div>
              <p className="font-semibold">Pro Plan</p>
              <p className="text-sm text-muted-foreground">$29 / month · Next billing: Jun 15, 2026</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast('Plan change coming soon', { icon: '💳' })}>Change Plan</Button>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Payment Method</p>
            <div className="flex items-center justify-between p-3 rounded-xl border">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-12 items-center justify-center rounded bg-blue-600 text-white text-xs font-bold">VISA</div>
                <div>
                  <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/2027</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast('Card update coming soon', { icon: '💳' })}>Update</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Download className="h-4 w-4 text-primary" />Billing History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-left p-4 font-medium">Amount</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {BILLING_HISTORY.map((inv, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4">{inv.date}</td>
                  <td className="p-4 font-medium">{inv.amount}</td>
                  <td className="p-4"><Badge variant="success">{inv.status}</Badge></td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast.success('Invoice downloaded')}>
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function SettingsPage() {
  const TABS = [
    { value: 'general',       label: 'General',       icon: Settings },
    { value: 'security',      label: 'Security',      icon: Shield },
    { value: 'notifications', label: 'Notifications', icon: Bell },
    { value: 'integrations',  label: 'Integrations',  icon: Zap },
    { value: 'api',           label: 'API',            icon: Code2 },
    { value: 'billing',       label: 'Billing',        icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-5">
        {/* Tab list — scrollable on mobile */}
        <div className="overflow-x-auto -mx-1 px-1">
          <TabsList className="inline-flex h-10 gap-0.5 rounded-xl bg-muted p-1">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap',
                  'data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground',
                  'text-muted-foreground transition-all'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="general">       <GeneralTab />       </TabsContent>
        <TabsContent value="security">      <SecurityTab />      </TabsContent>
        <TabsContent value="notifications"> <NotificationsTab /> </TabsContent>
        <TabsContent value="integrations">  <IntegrationsTab />  </TabsContent>
        <TabsContent value="api">           <ApiTab />           </TabsContent>
        <TabsContent value="billing">       <BillingTab />       </TabsContent>
      </Tabs>
    </div>
  );
}
