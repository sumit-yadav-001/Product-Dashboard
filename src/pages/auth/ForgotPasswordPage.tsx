import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mail, AlertCircle, Loader2,
  CheckCircle2, Shield, KeyRound, Lock, RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});
type FormData = z.infer<typeof schema>;

// ─── Shared branding panel ────────────────────────────────────────────────────
interface BrandingPanelProps {
  mounted: boolean;
  title: React.ReactNode;
  subtitle: string;
  bullets: string[];
}

function BrandingPanel({ mounted, title, subtitle, bullets }: BrandingPanelProps) {
  return (
    <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative flex-col bg-gradient-to-br from-primary via-primary/90 to-primary/75 p-10 xl:p-14 text-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

      <div
        className={`relative z-10 flex flex-col justify-between h-full transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none">Admin Portal</p>
            <p className="text-xs text-white/70 mt-0.5">Enterprise Management System</p>
          </div>
        </div>

        {/* Hero */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl xl:text-4xl font-bold leading-tight mb-3">{title}</h2>
            <p className="text-white/75 text-sm xl:text-base leading-relaxed max-w-xs">{subtitle}</p>
          </div>
          <ul className="space-y-3">
            {bullets.map((text, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <span className="text-sm text-white/85">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/50">© 2024 Admin Portal. All rights reserved.</p>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading,   setIsLoading]   = useState(false);
  const [mounted,     setMounted]     = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setMounted(true); }, []);

  const { register, handleSubmit, formState: { errors }, getValues, reset } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: { email: '' },
    });

  const onSubmit = useCallback(async (_data: FormData) => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      setIsSubmitted(true);
      toast.success('Password reset instructions sent!');
    } catch {
      toast.error('Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleTryAgain = useCallback(() => {
    setIsSubmitted(false);
    reset();
  }, [reset]);

  // ── Shared right-panel wrapper ─────────────────────────────────────────────
  const RightPanel = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4 py-10 sm:px-8 lg:px-10 xl:px-16">
      <div
        className={`w-full max-w-[420px] transition-all duration-700 delay-150 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {children}
      </div>
    </div>
  );

  // ── Success state ──────────────────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <div className="flex min-h-screen flex-col lg:flex-row">
        <BrandingPanel
          mounted={mounted}
          title={<>Check Your<br />Email</>}
          subtitle="We've sent you a secure link to reset your password. Follow the instructions in the email."
          bullets={[
            'Check your inbox and spam folder',
            'The reset link expires in 24 hours',
            'Contact support if you need further help',
          ]}
        />

        <RightPanel>
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/30 shadow-sm">
              <Mail className="h-7 w-7 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-xl font-bold">Check Your Email</p>
          </div>

          <Card className="border shadow-xl">
            <CardContent className="px-6 sm:px-8 pt-10 pb-8 space-y-6 text-center">
              {/* Animated success icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  {/* Ping dot */}
                  <span className="absolute -top-1 -right-1 flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                    <span className="relative inline-flex h-5 w-5 rounded-full bg-green-500" />
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-2xl font-bold tracking-tight">Email sent!</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We've sent reset instructions to{' '}
                  <span className="font-semibold text-foreground break-all">{getValues('email')}</span>
                </p>
              </div>

              {/* Tips box */}
              <div className="rounded-lg border border-border bg-muted/40 p-4 text-left space-y-2">
                <p className="text-sm font-semibold text-foreground">Didn't receive it?</p>
                <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                  <li>Check your spam or junk folder</li>
                  <li>Make sure the email address is correct</li>
                  <li>Allow a few minutes for delivery</li>
                </ul>
              </div>

              <div className="space-y-2.5 pt-1">
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full h-11 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Button>
                <Button
                  variant="ghost" onClick={handleTryAgain}
                  className="w-full h-10 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try a different email
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Secured with 256-bit SSL encryption</span>
          </div>
        </RightPanel>
      </div>
    );
  }

  // ── Request form ───────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <BrandingPanel
        mounted={mounted}
        title={<>Forgot Your<br />Password?</>}
        subtitle="No worries — enter your email and we'll send you a secure link to reset your password."
        bullets={[
          'Secure, one-time reset link',
          'Email verification required',
          'Link expires in 24 hours',
        ]}
      />

      <RightPanel>
        {/* Mobile logo */}
        <div className="mb-8 text-center lg:hidden">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
            <KeyRound className="h-7 w-7 text-primary" />
          </div>
          <p className="text-xl font-bold">Reset Password</p>
          <p className="text-sm text-muted-foreground mt-1">We'll send you a reset link</p>
        </div>

        <Card className="border shadow-xl">
          <CardHeader className="pb-5 pt-7 px-6 sm:px-8">
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
              Forgot password?
            </CardTitle>
            <CardDescription className="text-sm sm:text-base mt-1">
              Enter your email and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 sm:px-8 pb-8 space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                <div className="relative group">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="email" type="email" placeholder="name@company.com"
                    autoComplete="email" autoFocus disabled={isLoading}
                    className={`h-11 pl-10 text-sm transition-shadow ${
                      errors.email
                        ? 'border-destructive focus-visible:ring-destructive/30'
                        : 'focus-visible:ring-primary/30'
                    }`}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="flex items-center gap-1.5 text-xs text-destructive animate-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit" disabled={isLoading}
                className="w-full h-11 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200"
              >
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending instructions…</>
                ) : (
                  <><Mail className="mr-2 h-4 w-4" />Send Reset Instructions</>
                )}
              </Button>
            </form>

            {/* Back to login */}
            <div className="text-center pt-1">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>Secured with 256-bit SSL encryption</span>
        </div>
      </RightPanel>
    </div>
  );
}
