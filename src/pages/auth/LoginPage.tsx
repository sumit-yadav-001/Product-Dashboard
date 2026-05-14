import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  AlertCircle,
  Shield,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';

import { useLoginMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/hooks/redux';
import { login } from '@/store/slices/authSlice';

import toast from 'react-hot-toast';

// ─────────────────────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ─────────────────────────────────────────────────────────────
// Features
// ─────────────────────────────────────────────────────────────
const FEATURES = [
  'Real-time Analytics & Insights',
  'Advanced User Management',
  'Secure & Scalable Infrastructure',
  '24/7 Support & Monitoring',
];

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [loginMutation, { isLoading }] = useLoginMutation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as any)?.from?.pathname || '/dashboard';

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await loginMutation(data).unwrap();

      localStorage.setItem(
        'accessToken',
        result.accessToken
      );

      localStorage.setItem(
        'refreshToken',
        result.refreshToken
      );

      const resolvedUser = {
        id:        result.user?.id        ?? 'user-id',
        email:     result.user?.email     ?? data.email,
        name:      (result.user?.name     || data.email.split('@')[0]) as string,
        role:      ((result.user as any)?.role      || 'user') as any,
        createdAt: ((result.user as any)?.createdAt || new Date().toISOString()) as string,
        updatedAt: ((result.user as any)?.updatedAt || new Date().toISOString()) as string,
        isActive:  true as const,
      };

      dispatch(
        login({
          user: resolvedUser,
          tokens: {
            accessToken:  result.accessToken,
            refreshToken: result.refreshToken,
          },
        })
      );

      toast.success(
        result.message || 'Login successful!'
      );

      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          err?.message ||
          'Login failed. Please check your credentials.'
      );
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col lg:flex-row overflow-hidden">
      {/* ───────────────────────────────────────────── */}
      {/* LEFT SIDE */}
      {/* ───────────────────────────────────────────── */}
      <div className="relative hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col bg-gradient-to-br from-primary via-primary/90 to-primary/75 p-8 xl:p-14 text-white overflow-hidden">
        {/* Grid Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Decorative Blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

        <div
          className={`relative z-10 flex flex-col justify-between h-full transition-all duration-700 ${
            mounted
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg">
              <Shield className="h-6 w-6" />
            </div>

            <div>
              <p className="text-lg font-bold leading-none">
                Admin Portal
              </p>

              <p className="text-xs text-white/70 mt-0.5">
                Enterprise Management System
              </p>
            </div>
          </div>

          {/* Hero */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl xl:text-4xl font-bold leading-tight mb-3">
                Manage Your Business
                <br />
                With Confidence
              </h2>

              <p className="text-white/75 text-sm xl:text-base leading-relaxed max-w-sm">
                Powerful admin dashboard with
                real-time analytics, user
                management, and comprehensive
                reporting tools.
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-3">
              {FEATURES.map((text, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3"
                  style={{
                    transitionDelay: `${i * 80}ms`,
                  }}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>

                  <span className="text-sm text-white/85">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/50">
            © 2024 Admin Portal. All rights
            reserved.
          </p>
        </div>
      </div>

      {/* ───────────────────────────────────────────── */}
      {/* RIGHT SIDE */}
      {/* ───────────────────────────────────────────── */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 px-4 py-8 sm:px-6 md:px-8 lg:px-10 xl:px-16">
        {/* Theme switcher — top-right corner */}
        <div className="absolute top-4 right-4 z-50">
          <ThemeSwitcher />
        </div>

        <div
          className={`w-full max-w-md transition-all duration-700 delay-150 ${
            mounted
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Mobile Logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
              <Shield className="h-7 w-7 text-primary" />
            </div>

            <p className="text-xl font-bold">
              Admin Portal
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              Enterprise Management System
            </p>
          </div>

          {/* Card */}
          <Card className="border shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="pb-5 pt-7 px-5 sm:px-8">
              <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
                Welcome back
              </CardTitle>

              <CardDescription className="text-sm sm:text-base mt-1">
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>

            <CardContent className="px-5 sm:px-8 pb-7 sm:pb-8 space-y-5">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                {/* Email */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium"
                  >
                    Email address
                  </Label>

                  <div className="relative group">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      autoComplete="email"
                      disabled={isLoading}
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

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium"
                    >
                      Password
                    </Label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-primary hover:underline underline-offset-4 transition-colors whitespace-nowrap"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative group">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

                    <Input
                      id="password"
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={isLoading}
                      className={`h-11 pl-10 pr-11 text-sm transition-shadow ${
                        errors.password
                          ? 'border-destructive focus-visible:ring-destructive/30'
                          : 'focus-visible:ring-primary/30'
                      }`}
                      {...register('password')}
                    />

                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="flex items-center gap-1.5 text-xs text-destructive animate-in slide-in-from-top-1 duration-200">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2.5">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(
                        e.target.checked
                      )
                    }
                    disabled={isLoading}
                    className="h-4 w-4 rounded border-border text-primary accent-primary cursor-pointer focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 transition-all"
                  />

                  <Label
                    htmlFor="remember"
                    className="text-sm cursor-pointer select-none text-muted-foreground"
                  >
                    Remember me for 30 days
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 group mt-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign In

                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  className="h-10 text-sm border hover:bg-accent transition-all"
                >
                  <GoogleIcon />

                  <span className="ml-2">
                    Google
                  </span>
                </Button>

                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  className="h-10 text-sm border hover:bg-accent transition-all"
                >
                  <GitHubIcon />

                  <span className="ml-2">
                    GitHub
                  </span>
                </Button>
              </div>

              {/* Signup */}
              <p className="text-center text-sm text-muted-foreground pt-1">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-primary hover:underline underline-offset-4 transition-colors"
                >
                  Create one
                </Link>
              </p>

              {/* Dev Mode */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5">
                <div className="flex gap-3">
                  <AlertCircle className="h-4 w-4 shrink-0 text-primary mt-0.5" />

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground">
                      Demo mode
                    </p>

                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Using dummy API — no backend required.
                    </p>

                    <p className="text-[11px] sm:text-xs font-mono text-primary mt-1.5">
                      admin@example.com / admin123
                    </p>

                    <p className="text-[11px] sm:text-xs font-mono text-primary mt-0.5">
                      user@example.com / user123
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SSL Badge */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground px-2">
            <Lock className="h-3 w-3 shrink-0" />

            <span>
              Secured with 256-bit SSL encryption
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Google Icon
// ─────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />

      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />

      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />

      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// GitHub Icon
// ─────────────────────────────────────────────────────────────
function GitHubIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}