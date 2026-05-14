import { Routes, Route } from 'react-router-dom';

import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { AdminRoute } from '@/components/common/AdminRoute';

import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { UsersPage } from '@/pages/users/UsersPage';
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AnalyticsPage } from '@/pages/analytics/AnalyticsPage';
import { ReportsPage } from '@/pages/analytics/ReportsPage';
import { RealtimePage } from '@/pages/analytics/RealtimePage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { SimpleFormPage } from '@/pages/SimpleFormPage';
import { ComprehensiveFormPage } from '@/pages/ComprehensiveFormPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

import { lazy, Suspense } from 'react';

import { ProductSkeleton } from '@/components/common/ProductSkeleton';

import {
  ProductDetailSkeleton,
  PageLoadingSkeleton,
} from '@/components/common/Skeletons';

const ProductsPage = lazy(() =>
  import('@/pages/products/ProductsPage').then((m) => ({
    default: m.ProductsPage,
  }))
);

const ProductDetailPage = lazy(() =>
  import('@/pages/products/ProductDetailPage').then((m) => ({
    default: m.ProductDetailPage,
  }))
);

const ForgotPasswordPage = lazy(() =>
  import('@/pages/auth/ForgotPasswordPage').then((m) => ({
    default: m.ForgotPasswordPage,
  }))
);

export function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Forgot Password */}
      <Route
        path="/forgot-password"
        element={
          <Suspense fallback={<PageLoadingSkeleton />}>
            <ForgotPasswordPage />
          </Suspense>
        }
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Products */}
          <Route
            path="/products"
            element={
              <Suspense fallback={<ProductSkeleton count={20} />}>
                <ProductsPage />
              </Suspense>
            }
          />

          <Route
            path="/products/:id"
            element={
              <Suspense fallback={<ProductDetailSkeleton />}>
                <ProductDetailPage />
              </Suspense>
            }
          />

          {/* Analytics */}
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/analytics/reports" element={<ReportsPage />} />
          <Route path="/analytics/realtime" element={<RealtimePage />} />

          {/* Settings */}
          <Route path="/settings" element={<SettingsPage />} />

          {/* Forms */}
          <Route path="/forms" element={<SimpleFormPage />} />
          <Route
            path="/forms/comprehensive"
            element={<ComprehensiveFormPage />}
          />

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}