import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Eye, EyeOff, Loader2, ArrowRight, Zap,
  BarChart3, Users, ShieldCheck, Globe,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';
import { useLoginMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/hooks/redux';
import { login } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';

// ─── Schema ───────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginFormData = z.infer<typeof loginSchema>;

// ─── Stats ────────────────────────────────────────────────────
const STATS = [
  { icon: Users,      value: '50K+',  label: 'Active Users'    },
  { icon: BarChart3,  value: '99.9%', label: 'Uptime SLA'      },
  { icon: Globe,      value: '120+',  label: 'Countries'       },
  { icon: ShieldCheck,value: 'SOC2',  label: 'Certified'       },
];



export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);
  const [mounted, setMounted]           = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [loginMutation, { isLoading }] = useLoginMutation();
  const dispatch   = useAppDispatch();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = (location.state as any)?.from?.pathname || '/dashboard';

  useEffect(() => { setMounted(true); }, []);

  const { register, handleSubmit, formState: { errors }, watch } =
    useForm<LoginFormData>({
      resolver: zodResolver(loginSchema),
      defaultValues: { email: '', password: '' },
    });

  const emailVal = watch('email');

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await loginMutation(data).unwrap();
      localStorage.setItem('accessToken',  result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      dispatch(login({
        user: {
          id:        result.user?.id        ?? 'user-id',
          email:     result.user?.email     ?? data.email,
          name:      (result.user?.name     || data.email.split('@')[0]) as string,
          role:      ((result.user as any)?.role      || 'user') as any,
          createdAt: ((result.user as any)?.createdAt || new Date().toISOString()) as string,
          updatedAt: ((result.user as any)?.updatedAt || new Date().toISOString()) as string,
          isActive:  true,
        },
        tokens: { accessToken: result.accessToken, refreshToken: result.refreshToken },
      }));
      toast.success(result.message || 'Welcome back!');
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      {/* ── LEFT PANEL ─────────────────────────────────────── */}
      <div className="relative hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[#0f0f1a]" />
        {/* Gradient orbs */}
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute top-1/2 -right-20 h-[400px] w-[400px] rounded-full bg-indigo-500/15 blur-[100px]" />
        <div className="absolute -bottom-40 left-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/20 blur-[120px]" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div
          className={`relative z-10 flex h-full flex-col justify-between p-10 xl:p-14 transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-white leading-none">Nexus</p>
              <p className="text-[11px] text-white/40 mt-0.5">Enterprise Platform</p>
            </div>
          </div>

          {/* Hero text */}
          <div className="space-y-6">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-xs font-medium text-violet-300">Now with AI-powered insights</span>
              </div>
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.15] tracking-tight">
                Run your business<br />
                <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  smarter, faster.
                </span>
              </h1>
              <p className="mt-4 text-sm xl:text-base text-white/50 leading-relaxed max-w-sm">
                One platform for analytics, user management, and real-time monitoring. Built for teams that move fast.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.04] p-3.5 backdrop-blur-sm"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/20">
                    <Icon className="h-4 w-4 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{value}</p>
                    <p className="text-[11px] text-white/40">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/20">© 2026 Nexus. All rights reserved.</p>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-16 bg-background">
        {/* Theme switcher */}
        <div className="absolute right-4 top-4 z-50">
          <ThemeSwitcher />
        </div>

        <div
          className={`w-full max-w-[400px] transition-all duration-700 delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <p className="text-xl font-bold">Nexus</p>
            <p className="text-sm text-muted-foreground mt-1">Enterprise Platform</p>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              disabled={isLoading}
              className="flex h-11 items-center justify-center gap-2.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground transition-all hover:bg-accent hover:border-border/80 disabled:opacity-50"
            >
              <GoogleIcon />
              Google
            </button>
            <button
              type="button"
              disabled={isLoading}
              className="flex h-11 items-center justify-center gap-2.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground transition-all hover:bg-accent hover:border-border/80 disabled:opacity-50"
            >
              <GitHubIcon />
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">or sign in with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email address</label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  autoComplete="email"
                  disabled={isLoading}
                  className={`h-11 rounded-xl border text-sm transition-all pr-4 pl-4
                    ${errors.email
                      ? 'border-destructive focus-visible:ring-destructive/20'
                      : focusedField === 'email'
                        ? 'border-violet-500/60 ring-2 ring-violet-500/20'
                        : 'border-border'
                    }`}
                  {...register('email', {
                    onBlur: () => setFocusedField(null),
                  })}
                  onFocus={() => setFocusedField('email')}
                />
                {emailVal && !errors.email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-emerald-500" />
                )}
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  className={`h-11 rounded-xl border text-sm transition-all pl-4 pr-11
                    ${errors.password
                      ? 'border-destructive focus-visible:ring-destructive/20'
                      : focusedField === 'password'
                        ? 'border-violet-500/60 ring-2 ring-violet-500/20'
                        : 'border-border'
                    }`}
                  {...register('password', {
                    onBlur: () => setFocusedField(null),
                  })}
                  onFocus={() => setFocusedField('password')}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="h-4 w-4 rounded border-border accent-violet-600 cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm cursor-pointer text-muted-foreground select-none">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-200 border-0 group mt-1"
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in…</>
              ) : (
                <>Sign In <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
              )}
            </Button>
          </form>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-violet-600 dark:text-violet-400 hover:underline underline-offset-4">
              Create one free
            </Link>
          </p>

          {/* SSL */}
          <p className="mt-5 text-center text-xs text-muted-foreground/60 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3 w-3" />
            Secured with 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.797 24 17.3 24 12 24 5.373 18.627 0 12 0z"/>
    </svg>
  );
}
