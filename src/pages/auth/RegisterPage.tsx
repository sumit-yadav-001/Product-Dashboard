import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
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
  User,
  Check,
  X,
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
import {
  useRegisterMutation,
  useLoginMutation,
} from '@/store/api/authApi';

import { useAppDispatch } from '@/hooks/redux';
import { login } from '@/store/slices/authSlice';
import { UserRole } from '@/types';

import toast from 'react-hot-toast';

// ===============================
// Schema
// ===============================

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name is too long'),

    email: z.string().email('Please enter a valid email address'),

    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),

    confirmPassword: z.string(),

    acceptTerms: z.literal(true, {
      errorMap: () => ({
        message: 'You must accept the terms and conditions',
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// ===============================
// Password Rules
// ===============================

const PW_RULES = [
  {
    label: 'At least 6 characters',
    test: (p: string) => p.length >= 6,
  },
  {
    label: 'One uppercase letter',
    test: (p: string) => /[A-Z]/.test(p),
  },
  {
    label: 'One number',
    test: (p: string) => /[0-9]/.test(p),
  },
];

// ===============================
// Branding Bullets
// ===============================

const BULLETS = [
  'Free to get started — no credit card required',
  'Full access to analytics & reporting',
  'Secure, role-based access control',
  'Dedicated onboarding support',
];

// ===============================
// Component
// ===============================

export function RegisterPage() {
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [registerMutation, { isLoading: isRegistering }] =
    useRegisterMutation();

  const [loginMutation, { isLoading: isLoggingIn }] =
    useLoginMutation();

  const isLoading = isRegistering || isLoggingIn;

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: true,
    },
  });

  const pwValue = watch('password') || '';
  const acceptTerms = watch('acceptTerms');

  // ===============================
  // Submit Handler
  // ===============================

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Register
      const regResult = await registerMutation({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();

      toast.success(
        regResult?.message || 'Account created successfully!'
      );

      // Auto Login
      const loginResult = await loginMutation({
        email: data.email,
        password: data.password,
      }).unwrap();

      // Save Tokens
      localStorage.setItem(
        'accessToken',
        loginResult.accessToken
      );

      localStorage.setItem(
        'refreshToken',
        loginResult.refreshToken
      );

      // Save User
      dispatch(
        login({
          user: {
            id: loginResult.user?.id ?? '',
            email: loginResult.user?.email ?? data.email,
            name: (
              loginResult.user?.name ||
              data.name ||
              data.email.split('@')[0]
            ) as string,

            role: UserRole.USER,

            createdAt: new Date().toISOString(),

            updatedAt: new Date().toISOString(),

            isActive: true,
          },

          tokens: {
            accessToken: loginResult.accessToken,
            refreshToken: loginResult.refreshToken,
          },
        })
      );

      toast.success('Welcome aboard!');

      navigate('/dashboard', {
        replace: true,
      });
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.data?.message ||
          err?.message ||
          'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col lg:flex-row">
      {/* ================= LEFT ================= */}

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/75 p-10 text-white lg:flex lg:w-5/12 xl:w-1/2 xl:p-14">
        {/* Grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Blur */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

        <div
          className={`relative z-10 flex h-full flex-col justify-between transition-all duration-700 ${
            mounted
              ? 'translate-y-0 opacity-100'
              : 'translate-y-6 opacity-0'
          }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/15 shadow-lg backdrop-blur-sm">
              <Shield className="h-6 w-6" />
            </div>

            <div>
              <p className="text-lg font-bold leading-none">
                Admin Portal
              </p>

              <p className="mt-0.5 text-xs text-white/70">
                Enterprise Management System
              </p>
            </div>
          </div>

          {/* Hero */}
          <div className="space-y-8">
            <div>
              <h2 className="mb-3 text-4xl font-bold leading-tight">
                Start Your Journey
                <br />
                Today
              </h2>

              <p className="max-w-xs text-sm leading-relaxed text-white/75 xl:text-base">
                Create your account and get instant access to the
                full suite of enterprise management tools.
              </p>
            </div>

            <ul className="space-y-3">
              {BULLETS.map((text, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3"
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
            © 2026 Admin Portal. All rights reserved.
          </p>
        </div>
      </div>

      {/* ================= RIGHT ================= */}

      <div className="flex flex-1 items-start justify-center overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20 px-4 py-10 sm:px-8 lg:px-10 xl:px-16">
        {/* Theme */}
        <div className="absolute right-4 top-4 z-50">
          <ThemeSwitcher />
        </div>

        <div
          className={`w-full max-w-[420px] transition-all delay-150 duration-700 ${
            mounted
              ? 'translate-y-0 opacity-100'
              : 'translate-y-6 opacity-0'
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

            <p className="mt-1 text-sm text-muted-foreground">
              Enterprise Management System
            </p>
          </div>

          {/* Card */}
          <Card className="border shadow-xl">
            <CardHeader className="px-6 pb-5 pt-7 sm:px-8">
              <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
                Create account
              </CardTitle>

              <CardDescription className="mt-1 text-sm sm:text-base">
                Fill in your details to get started
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 px-6 pb-8 sm:px-8">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                {/* Name */}
                <Field
                  label="Full Name"
                  error={errors.name?.message}
                >
                  <div className="group relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      autoComplete="name"
                      disabled={isLoading}
                      className={inputCls(!!errors.name)}
                      {...register('name')}
                    />
                  </div>
                </Field>

                {/* Email */}
                <Field
                  label="Email Address"
                  error={errors.email?.message}
                >
                  <div className="group relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      autoComplete="email"
                      disabled={isLoading}
                      className={inputCls(!!errors.email)}
                      {...register('email')}
                    />
                  </div>
                </Field>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium"
                  >
                    Password
                  </Label>

                  <div className="group relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

                    <Input
                      id="password"
                      type={showPw ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      disabled={isLoading}
                      className={`${inputCls(
                        !!errors.password
                      )} pr-11`}
                      {...register('password')}
                    />

                    <ToggleEye
                      show={showPw}
                      onToggle={() =>
                        setShowPw((prev) => !prev)
                      }
                      disabled={isLoading}
                    />
                  </div>

                  {/* Password Rules */}
                  {pwValue.length > 0 && (
                    <ul className="grid grid-cols-1 gap-1 pt-1">
                      {PW_RULES.map((rule) => {
                        const ok = rule.test(pwValue);

                        return (
                          <li
                            key={rule.label}
                            className={`flex items-center gap-1.5 text-xs ${
                              ok
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {ok ? (
                              <Check className="h-3 w-3 shrink-0" />
                            ) : (
                              <X className="h-3 w-3 shrink-0" />
                            )}

                            {rule.label}
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {errors.password && (
                    <ErrorMsg
                      msg={errors.password.message!}
                    />
                  )}
                </div>

                {/* Confirm Password */}
                <Field
                  label="Confirm Password"
                  error={errors.confirmPassword?.message}
                >
                  <div className="group relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

                    <Input
                      id="confirmPassword"
                      type={showCpw ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      disabled={isLoading}
                      className={`${inputCls(
                        !!errors.confirmPassword
                      )} pr-11`}
                      {...register('confirmPassword')}
                    />

                    <ToggleEye
                      show={showCpw}
                      onToggle={() =>
                        setShowCpw((prev) => !prev)
                      }
                      disabled={isLoading}
                    />
                  </div>
                </Field>

                {/* Terms */}
                <div className="flex items-start gap-3">
                  <input
                    id="acceptTerms"
                    type="checkbox"
                    checked={acceptTerms}
                    disabled={isLoading}
                    onChange={(e) =>
                      setValue(
                        'acceptTerms',
                        e.target.checked as true,
                        {
                          shouldValidate: true,
                        }
                      )
                    }
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-primary focus:ring-2 focus:ring-primary/30 focus:ring-offset-1"
                  />

                  <div>
                    <Label
                      htmlFor="acceptTerms"
                      className="cursor-pointer text-sm leading-snug text-muted-foreground"
                    >
                      I agree to the{' '}
                      <span className="font-semibold text-primary">
                        Terms of Service
                      </span>{' '}
                      and{' '}
                      <span className="font-semibold text-primary">
                        Privacy Policy
                      </span>
                    </Label>

                    {errors.acceptTerms && (
                      <p className="mt-0.5 text-xs text-destructive">
                        {errors.acceptTerms.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="group mt-1 h-11 w-full text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                      {isRegistering
                        ? 'Creating account...'
                        : 'Signing in...'}
                    </>
                  ) : (
                    <>
                      Create Account

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
                  <span className="bg-card px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    or continue with
                  </span>
                </div>
              </div>

              {/* Social */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  className="h-10 border text-sm transition-all hover:bg-accent"
                >
                  <GoogleIcon />

                  <span className="ml-2">Google</span>
                </Button>

                <Button
                  variant="outline"
                  type="button"
                  disabled={isLoading}
                  className="h-10 border text-sm transition-all hover:bg-accent"
                >
                  <GitHubIcon />

                  <span className="ml-2">GitHub</span>
                </Button>
              </div>

              {/* Login */}
              <p className="pt-1 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-primary transition-colors hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />

            <span>
              Secured with 256-bit SSL encryption
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===============================
// Helpers
// ===============================

function inputCls(hasError: boolean) {
  return `h-11 pl-10 text-sm transition-shadow ${
    hasError
      ? 'border-destructive focus-visible:ring-destructive/30'
      : 'focus-visible:ring-primary/30'
  }`;
}

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({
  label,
  error,
  children,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">
        {label}
      </Label>

      {children}

      {error && <ErrorMsg msg={error} />}
    </div>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <p className="animate-in slide-in-from-top-1 flex items-center gap-1.5 text-xs text-destructive duration-200">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />

      {msg}
    </p>
  );
}

function ToggleEye({
  show,
  onToggle,
  disabled,
}: {
  show: boolean;
  onToggle: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={onToggle}
      disabled={disabled}
      aria-label={
        show ? 'Hide password' : 'Show password'
      }
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
    >
      {show ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </button>
  );
}

// ===============================
// Icons
// ===============================

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

function GitHubIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.797 24 17.3 24 12 24 5.373 18.627 0 12 0z" />
    </svg>
  );
}