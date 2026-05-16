import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { AdminRoute } from '@/components/common/AdminRoute';

// ── Eager auth pages (small, always needed) ──────────────────────────────────
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

// ── Eager core pages ──────────────────────────────────────────────────────────
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { AnalyticsPage } from '@/pages/analytics/AnalyticsPage';
import { ReportsPage } from '@/pages/analytics/ReportsPage';
import { RealtimePage } from '@/pages/analytics/RealtimePage';
import { UsersPage } from '@/pages/users/UsersPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// ── Skeletons / fallbacks ─────────────────────────────────────────────────────
import { ProductSkeleton } from '@/components/common/ProductSkeleton';
import { PageLoadingSkeleton, ProductDetailSkeleton } from '@/components/common/Skeletons';

// ── Lazy pages ────────────────────────────────────────────────────────────────
const ForgotPasswordPage = lazy(() =>
  import('@/pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage }))
);

// Profile
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage }))
);
const OnboardingPage = lazy(() =>
  import('@/pages/onboarding/OnboardingPage').then(m => ({ default: m.OnboardingPage }))
);

// Products
const ProductsPage = lazy(() =>
  import('@/pages/products/ProductsPage').then(m => ({ default: m.ProductsPage }))
);
const ProductDetailPage = lazy(() =>
  import('@/pages/products/ProductDetailPage').then(m => ({ default: m.ProductDetailPage }))
);
const CategoriesPage = lazy(() =>
  import('@/pages/products/CategoriesPage').then(m => ({ default: m.CategoriesPage }))
);
const InventoryPage = lazy(() =>
  import('@/pages/products/InventoryPage').then(m => ({ default: m.InventoryPage }))
);

// Analytics
const PerformancePage = lazy(() =>
  import('@/pages/analytics/PerformancePage').then(m => ({ default: m.PerformancePage }))
);

// Users (admin)
const RolesPage = lazy(() =>
  import('@/pages/users/RolesPage').then(m => ({ default: m.RolesPage }))
);
const PermissionsPage = lazy(() =>
  import('@/pages/users/PermissionsPage').then(m => ({ default: m.PermissionsPage }))
);
const GroupsPage = lazy(() =>
  import('@/pages/users/GroupsPage').then(m => ({ default: m.GroupsPage }))
);

// Content
const PostsPage = lazy(() =>
  import('@/pages/content/PostsPage').then(m => ({ default: m.PostsPage }))
);
const MediaPage = lazy(() =>
  import('@/pages/content/MediaPage').then(m => ({ default: m.MediaPage }))
);
const ContentCategoriesPage = lazy(() =>
  import('@/pages/content/ContentCategoriesPage').then(m => ({ default: m.ContentCategoriesPage }))
);
const TagsPage = lazy(() =>
  import('@/pages/content/TagsPage').then(m => ({ default: m.TagsPage }))
);

// E-commerce
const OrdersPage = lazy(() =>
  import('@/pages/ecommerce/OrdersPage').then(m => ({ default: m.OrdersPage }))
);
const CustomersPage = lazy(() =>
  import('@/pages/ecommerce/CustomersPage').then(m => ({ default: m.CustomersPage }))
);
const PaymentsPage = lazy(() =>
  import('@/pages/ecommerce/PaymentsPage').then(m => ({ default: m.PaymentsPage }))
);

// Communication
const MessagesPage = lazy(() =>
  import('@/pages/communication/MessagesPage').then(m => ({ default: m.MessagesPage }))
);
const NotificationsPage = lazy(() =>
  import('@/pages/communication/NotificationsPage').then(m => ({ default: m.NotificationsPage }))
);
const TemplatesPage = lazy(() =>
  import('@/pages/communication/TemplatesPage').then(m => ({ default: m.TemplatesPage }))
);
const BroadcastsPage = lazy(() =>
  import('@/pages/communication/BroadcastsPage').then(m => ({ default: m.BroadcastsPage }))
);

// Calendar
const CalendarPage = lazy(() =>
  import('@/pages/CalendarPage').then(m => ({ default: m.CalendarPage }))
);

// Tools
const SearchPage = lazy(() =>
  import('@/pages/tools/SearchPage').then(m => ({ default: m.SearchPage }))
);
const ImportExportPage = lazy(() =>
  import('@/pages/tools/ImportExportPage').then(m => ({ default: m.ImportExportPage }))
);
const BackupPage = lazy(() =>
  import('@/pages/tools/BackupPage').then(m => ({ default: m.BackupPage }))
);
const LogsPage = lazy(() =>
  import('@/pages/tools/LogsPage').then(m => ({ default: m.LogsPage }))
);

// Support
const SupportPage = lazy(() =>
  import('@/pages/SupportPage').then(m => ({ default: m.SupportPage }))
);

// Forms
const SimpleFormPage = lazy(() =>
  import('@/pages/SimpleFormPage').then(m => ({ default: m.SimpleFormPage }))
);
const ComprehensiveFormPage = lazy(() =>
  import('@/pages/ComprehensiveFormPage').then(m => ({ default: m.ComprehensiveFormPage }))
);

// ── Fallback wrapper ──────────────────────────────────────────────────────────
const Page = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoadingSkeleton />}>{children}</Suspense>
);

// ── App ───────────────────────────────────────────────────────────────────────
export function App() {
  return (
    <Routes>
      {/* ── Auth ── */}
      <Route element={<AuthLayout />}>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route
        path="/forgot-password"
        element={<Page><ForgotPasswordPage /></Page>}
      />

      {/* ── Protected ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>

          {/* Dashboard */}
          <Route path="/"          element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Profile / Onboarding */}
          <Route path="/profile"    element={<Page><ProfilePage /></Page>} />
          <Route path="/onboarding" element={<Page><OnboardingPage /></Page>} />

          {/* Products */}
          <Route
            path="/products"
            element={<Suspense fallback={<ProductSkeleton count={12} />}><ProductsPage /></Suspense>}
          />
          <Route
            path="/products/:id"
            element={<Suspense fallback={<ProductDetailSkeleton />}><ProductDetailPage /></Suspense>}
          />
          <Route path="/products/categories" element={<Page><CategoriesPage /></Page>} />
          <Route path="/products/inventory"  element={<Page><InventoryPage /></Page>} />

          {/* Analytics */}
          <Route path="/analytics"             element={<AnalyticsPage />} />
          <Route path="/analytics/reports"     element={<ReportsPage />} />
          <Route path="/analytics/realtime"    element={<RealtimePage />} />
          <Route path="/analytics/performance" element={<Page><PerformancePage /></Page>} />

          {/* Content */}
          <Route path="/content/posts"      element={<Page><PostsPage /></Page>} />
          <Route path="/content/media"      element={<Page><MediaPage /></Page>} />
          <Route path="/content/categories" element={<Page><ContentCategoriesPage /></Page>} />
          <Route path="/content/tags"       element={<Page><TagsPage /></Page>} />

          {/* E-commerce */}
          <Route path="/ecommerce/orders"    element={<Page><OrdersPage /></Page>} />
          <Route path="/ecommerce/customers" element={<Page><CustomersPage /></Page>} />
          <Route path="/ecommerce/payments"  element={<Page><PaymentsPage /></Page>} />

          {/* Communication */}
          <Route path="/communication/messages"      element={<Page><MessagesPage /></Page>} />
          <Route path="/communication/notifications" element={<Page><NotificationsPage /></Page>} />
          <Route path="/communication/templates"     element={<Page><TemplatesPage /></Page>} />
          <Route path="/communication/broadcasts"    element={<Page><BroadcastsPage /></Page>} />

          {/* Calendar */}
          <Route path="/calendar" element={<Page><CalendarPage /></Page>} />

          {/* Tools */}
          <Route path="/tools/search"        element={<Page><SearchPage /></Page>} />
          <Route path="/tools/import-export" element={<Page><ImportExportPage /></Page>} />
          <Route path="/tools/backup"        element={<Page><BackupPage /></Page>} />
          <Route path="/tools/logs"          element={<Page><LogsPage /></Page>} />

          {/* Settings — main + sub-routes for direct tab linking */}
          <Route path="/settings"                element={<SettingsPage />} />
          <Route path="/settings/general"        element={<SettingsPage />} />
          <Route path="/settings/security"       element={<SettingsPage />} />
          <Route path="/settings/notifications"  element={<SettingsPage />} />
          <Route path="/settings/integrations"   element={<SettingsPage />} />
          <Route path="/settings/api"            element={<SettingsPage />} />
          <Route path="/settings/billing"        element={<SettingsPage />} />

          {/* Support */}
          <Route path="/support" element={<Page><SupportPage /></Page>} />

          {/* Forms */}
          <Route path="/forms"               element={<Page><SimpleFormPage /></Page>} />
          <Route path="/forms/comprehensive" element={<Page><ComprehensiveFormPage /></Page>} />

          {/* Admin-only */}
          <Route element={<AdminRoute />}>
            <Route path="/users"             element={<UsersPage />} />
            <Route path="/users/roles"       element={<Page><RolesPage /></Page>} />
            <Route path="/users/permissions" element={<Page><PermissionsPage /></Page>} />
            <Route path="/users/groups"      element={<Page><GroupsPage /></Page>} />
          </Route>

        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
