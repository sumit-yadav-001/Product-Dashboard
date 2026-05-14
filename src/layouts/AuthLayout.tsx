import { Outlet, Navigate } from 'react-router-dom';
import { useIsAuthenticated } from '@/hooks/redux';

/**
 * AuthLayout — transparent wrapper for auth pages.
 *
 * Responsibilities:
 *  1. Redirect already-authenticated users to /dashboard.
 *  2. Render the page full-width with no extra chrome.
 *
 * Each auth page (LoginPage, RegisterPage, ForgotPasswordPage) owns
 * its own full-screen split layout, branding panel, and ThemeSwitcher,
 * so this layout intentionally adds zero wrapping styles.
 */
export function AuthLayout() {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
