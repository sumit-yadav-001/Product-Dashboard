import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store';
import { clearAuth, setTokens } from '@/store/slices/authSlice';
import { mockAuthService } from '@/utils/mockAuth';

// External dummy APIs (dummyjson, jsonplaceholder, etc.) use absolute URLs,
// so the baseUrl here only matters if a relative URL is ever used.
// Auth is fully mocked — no real backend calls are made.
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_DUMMYJSON_API || 'https://dummyjson.com',
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = (getState() as RootState).auth.accessToken;

    // Only attach auth headers for internal/auth endpoints, not external dummy APIs
    const isAuthEndpoint = ['login', 'register', 'refreshToken', 'logout', 'getCurrentUser'].includes(endpoint);

    if (token && isAuthEndpoint) {
      headers.set('authorization', `Bearer ${token}`);
    }

    // Don't set Content-Type on GET requests — it triggers CORS preflight on external APIs
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to refresh using mock service — no real backend call
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (refreshToken) {
      try {
        const refreshResult = await mockAuthService.refreshToken(refreshToken);
        const tokens = refreshResult.data!;

        // Store the new tokens
        api.dispatch(setTokens(tokens));

        // Retry the original query with new token
        result = await baseQuery(args, api, extraOptions);
      } catch {
        // Refresh failed, logout user
        api.dispatch(clearAuth());
      }
    } else {
      // No refresh token, logout user
      api.dispatch(clearAuth());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Auth', 'FeatureFlags', 'Product', 'Post', 'Cart', 'Recipe', 'Quote'],
  endpoints: () => ({}),
});

// Export hooks for usage in functional components
export const {
  util: { getRunningQueriesThunk },
} = apiSlice;

// Export the api slice for use in store
export default apiSlice;