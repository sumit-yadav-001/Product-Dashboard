import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CheckCircle2, ArrowRight, ArrowLeft, User, Building2,
  Bell, Palette, Rocket, Check,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/utils';
import { useCurrentUser } from '@/hooks/redux';
import { useGetUsersQuery } from '@/store/api/usersApi';
import toast from 'react-hot-toast';

// ─── Schemas ──────────────────────────────────────────────────────────────────
const profileSchema = z.object({
  displayName: z.string().min(2, 'At least 2 characters'),
  jobTitle:    z.string().min(2, 'At least 2 characters'),
  bio:         z.string().max(200, 'Max 200 characters').optional(),
});

const orgSchema = z.object({
  orgName:    z.string().min(2, 'At least 2 characters'),
  orgSize:    z.string().min(1, 'Select a size'),
  industry:   z.string().min(1, 'Select an industry'),
});

type ProfileData = z.infer<typeof profileSchema>;
type OrgData     = z.infer<typeof orgSchema>;

// ─── Steps config ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 0, title: 'Profile',       icon: User,      description: 'Tell us about yourself' },
  { id: 1, title: 'Organization',  icon: Building2, description: 'Set up your workspace' },
  { id: 2, title: 'Notifications', icon: Bell,      description: 'Choose your preferences' },
  { id: 3, title: 'Appearance',    icon: Palette,   description: 'Customize your experience' },
  { id: 4, title: 'All Done!',     icon: Rocket,    description: 'You\'re ready to go' },
];

const ORG_SIZES    = ['1–10', '11–50', '51–200', '201–500', '500+'];
const INDUSTRIES   = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Other'];
const THEMES_LIST  = [
  { id: 'light',     label: 'Light',    bg: 'bg-white border-2',          text: 'text-slate-900' },
  { id: 'dark',      label: 'Dark',     bg: 'bg-slate-900 border-2',      text: 'text-white' },
  { id: 'corporate', label: 'Corporate',bg: 'bg-blue-50 border-2',        text: 'text-blue-900' },
];

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((step, i) => {
        const done    = i < current;
        const active  = i === current;
        const Icon    = step.icon;
        return (
          <React.Fragment key={step.id}>
            <div className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all',
              done   ? 'bg-primary border-primary text-primary-foreground' :
              active ? 'border-primary text-primary bg-primary/10' :
                       'border-muted text-muted-foreground bg-muted/30'
            )}>
              {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('h-0.5 w-8 transition-all', i < current ? 'bg-primary' : 'bg-muted')} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function OnboardingPage() {
  const user     = useCurrentUser();
  const navigate = useNavigate();
  const [step, setStep]       = useState(0);
  const [orgSize, setOrgSize] = useState('');
  const [industry, setIndustry] = useState('');
  const [notifications, setNotifications] = useState({
    security: true, updates: true, marketing: false, weekly: true,
  });
  const [selectedTheme, setSelectedTheme] = useState('light');

  // Fetch first user to suggest org name
  const { data: usersData } = useGetUsersQuery({ limit: 1 });
  const suggestedOrgName = usersData?.users?.[0]?.company?.name ?? '';

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: user?.name ?? '', jobTitle: '', bio: '' },
  });

  const progress = Math.round((step / (STEPS.length - 1)) * 100);

  const handleNext = async () => {
    if (step === 0) {
      const ok = await profileForm.trigger();
      if (!ok) return;
    }
    if (step === 1 && (!orgSize || !industry)) {
      toast.error('Please fill in all organization fields');
      return;
    }
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 0));

  const handleFinish = () => {
    toast.success('Onboarding complete! Welcome aboard 🎉');
    navigate('/dashboard');
  };

  const currentStep = STEPS[step]!;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <Badge variant="secondary" className="mb-3">Getting Started</Badge>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {step < STEPS.length - 1 ? 'Set up your account' : 'You\'re all set!'}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Step {step + 1} of {STEPS.length} — {currentStep.description}
          </p>
        </div>

        {/* Progress */}
        <Progress value={progress} className="mb-6 h-1.5" />

        {/* Step Indicator */}
        <StepIndicator current={step} />

        {/* Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <currentStep.icon className="h-5 w-5 text-primary" />
              {currentStep.title}
            </CardTitle>
            <CardDescription>{currentStep.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* ── Step 0: Profile ── */}
            {step === 0 && (
              <form className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="displayName">Display Name *</Label>
                  <Input id="displayName" placeholder="John Doe" {...profileForm.register('displayName')} />
                  {profileForm.formState.errors.displayName && (
                    <p className="text-xs text-destructive">{profileForm.formState.errors.displayName.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input id="jobTitle" placeholder="Senior Developer" {...profileForm.register('jobTitle')} />
                  {profileForm.formState.errors.jobTitle && (
                    <p className="text-xs text-destructive">{profileForm.formState.errors.jobTitle.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bio">Bio <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <Textarea id="bio" placeholder="Tell us a bit about yourself…" rows={3} {...profileForm.register('bio')} />
                </div>
              </form>
            )}

            {/* ── Step 1: Organization ── */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Organization Name *</Label>
                  <Input placeholder={suggestedOrgName || 'Acme Corp'} />
                </div>
                <div className="space-y-2">
                  <Label>Company Size *</Label>
                  <div className="flex flex-wrap gap-2">
                    {ORG_SIZES.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setOrgSize(s)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg border text-sm font-medium transition-all',
                          orgSize === s
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Industry *</Label>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map(ind => (
                      <button
                        key={ind}
                        type="button"
                        onClick={() => setIndustry(ind)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg border text-sm font-medium transition-all',
                          industry === ind
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 2: Notifications ── */}
            {step === 2 && (
              <div className="space-y-4">
                {([
                  { key: 'security',  label: 'Security Alerts',   desc: 'Login attempts and security events' },
                  { key: 'updates',   label: 'Product Updates',   desc: 'New features and improvements' },
                  { key: 'marketing', label: 'Marketing Emails',  desc: 'Promotions and offers' },
                  { key: 'weekly',    label: 'Weekly Digest',     desc: 'Summary of your weekly activity' },
                ] as const).map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <Switch
                      checked={notifications[key]}
                      onCheckedChange={(v) => setNotifications(n => ({ ...n, [key]: v }))}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ── Step 3: Appearance ── */}
            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Choose a theme that suits your style. You can change this anytime in Settings.</p>
                <div className="grid grid-cols-3 gap-3">
                  {THEMES_LIST.map(({ id, label, bg, text }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedTheme(id)}
                      className={cn(
                        'relative rounded-xl p-4 text-center transition-all',
                        bg,
                        selectedTheme === id ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'
                      )}
                    >
                      {selectedTheme === id && (
                        <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      <div className={cn('text-sm font-medium', text)}>{label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 4: Done ── */}
            {step === 4 && (
              <div className="text-center space-y-4 py-4">
                <div className="flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">You're all set, {user?.name?.split(' ')[0] ?? 'there'}!</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Your account is configured and ready to use. Head to the dashboard to get started.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-left">
                  {[
                    { icon: User,      label: 'Profile',       done: true },
                    { icon: Building2, label: 'Organization',  done: !!orgSize },
                    { icon: Bell,      label: 'Notifications', done: true },
                    { icon: Palette,   label: 'Appearance',    done: true },
                  ].map(({ icon: Icon, label, done }) => (
                    <div key={label} className="flex items-center gap-2 p-2 rounded-lg bg-muted/40">
                      <div className={cn('flex h-6 w-6 items-center justify-center rounded-full', done ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-muted')}>
                        {done ? <Check className="h-3 w-3 text-emerald-600" /> : <Icon className="h-3 w-3 text-muted-foreground" />}
                      </div>
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 0}
            className={step === 0 ? 'invisible' : ''}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleFinish} className="bg-emerald-600 hover:bg-emerald-700">
              <Rocket className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
