import { apiSlice } from './apiSlice';
import { mockAuthService } from '@/utils/mockAuth';

// Types for authentication
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  message?: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Auth API endpoints — all using dummy/mock service (no real backend calls)
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation<AuthResponse, LoginRequest>({
      queryFn: async (credentials) => {
        try {
          const result = await mockAuthService.login(credentials);
          const { user, tokens } = result.data!;
          return {
            data: {
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
              },
              message: result.message || 'Login successful',
            },
          };
        } catch (err: any) {
          return {
            error: {
              status: err?.response?.status ?? 401,
              data: err?.response?.data ?? { message: 'Login failed' },
            },
          };
        }
      },
    }),

    // Register
    register: builder.mutation<{ message: string }, RegisterRequest>({
      queryFn: async (userData) => {
        try {
          const result = await mockAuthService.register({
            name: userData.name ?? '',
            email: userData.email,
            password: userData.password,
            confirmPassword: userData.password, // confirmPassword validated on form level
          });
          return {
            data: {
              message: result.message || 'Registration successful',
            },
          };
        } catch (err: any) {
          return {
            error: {
              status: err?.response?.status ?? 400,
              data: err?.response?.data ?? { message: 'Registration failed' },
            },
          };
        }
      },
    }),

    // Refresh Token
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      queryFn: async ({ refreshToken }) => {
        try {
          const result = await mockAuthService.refreshToken(refreshToken);
          return { data: result.data! };
        } catch (err: any) {
          return {
            error: {
              status: err?.response?.status ?? 401,
              data: err?.response?.data ?? { message: 'Token refresh failed' },
            },
          };
        }
      },
    }),

    // Logout — client-side only
    logout: builder.mutation<{ message: string }, void>({
      queryFn: async () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        return { data: { message: 'Logged out successfully' } };
      },
    }),

    // Get Current User (from stored token via mock service)
    getCurrentUser: builder.query<any, void>({
      queryFn: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          return { error: { status: 401, data: 'Not authenticated' } };
        }
        try {
          const result = await mockAuthService.getCurrentUser(token);
          return { data: result.data };
        } catch (err: any) {
          return {
            error: {
              status: err?.response?.status ?? 401,
              data: err?.response?.data ?? 'Invalid token',
            },
          };
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} = authApi;
