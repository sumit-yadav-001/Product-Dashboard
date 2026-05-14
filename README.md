# 🚀 Admin Template - Production-Ready Product Listing Dashboard

A comprehensive, scalable, and **fully functional** React admin template with a complete Product Listing Dashboard. Built for enterprise-grade applications with **real API integration**, advanced features, performance optimizations, and production-ready architecture.

## ✨ What's New - Complete API Integration! 🎉

**ALL pages now work with REAL APIs!** No more mock data - everything is connected to live APIs:
- ✅ **194 Real Products** from DummyJSON
- ✅ **208 Real Users** with profiles and avatars
- ✅ **251 Real Posts** with engagement metrics
- ✅ **20 Real Shopping Carts** with calculations
- ✅ **50 Real Recipes** with instructions
- ✅ **1454 Real Quotes** for inspiration

---

## 🎯 Quick Start

### Installation
```bash
cd Admin
npm install
npm run dev
```

### Login Credentials
- **Admin:** admin@example.com / admin123
- **User:** user@example.com / user123

### Open Browser
```
http://localhost:3000
```

**That's it! Start exploring! 🚀**

---

## ✨ Features

### 🏗️ Core Stack
- **React 18** with latest features and concurrent rendering
- **TypeScript** in strict mode for type safety
- **Vite** for lightning-fast development and building
- **TailwindCSS** with shadcn/ui for consistent, beautiful UI
- **Redux Toolkit + RTK Query** for state management and API caching
- **React Hook Form** with Zod validation for forms
- **Axios** with interceptors for robust API communication

### 🛍️ Product Listing Dashboard
- **Product Catalog** with real-time data from DummyJSON API
- **Advanced Search** with debounced input (500ms)
- **Category Filtering** with dynamic category loading
- **Multi-sort Options** (Name, Price, Rating) with ascending/descending
- **Pagination** with smart page navigation
- **Product Details** page with image gallery
- **Lazy Image Loading** with loading states
- **Skeleton Loaders** for better UX
- **Empty States** with retry functionality
- **Responsive Grid** (1-4 columns based on screen size)
- **Product Cards** with discount badges, stock indicators
- **Performance Optimized** with React.memo and useMemo

### 🎨 Advanced Theme System
- **Multi-theme support**: Light, Dark, Corporate Blue, Playful Purple
- **Persistent theme preferences** stored in localStorage
- **System preference detection** with `prefers-color-scheme`
- **Hot-swappable themes** without page reload
- **CSS variables** mapped to Tailwind classes
- **Theme switcher UI** with dropdown selection

### 🏛️ Architecture & Reusability
```
src/
├── components/     # Reusable UI components
│   ├── ui/        # shadcn/ui primitives
│   └── common/    # Shared components
│       ├── ProductCard.tsx
│       ├── ProductGrid.tsx
│       ├── ProductSkeleton.tsx
│       ├── EmptyState.tsx
│       ├── Pagination.tsx
│       ├── SearchBar.tsx
│       └── Loader.tsx
├── hooks/         # Custom React hooks
│   ├── useDebounce.ts
│   ├── useIntersectionObserver.ts
│   └── useMediaQuery.ts
├── pages/         # Page-level components
│   └── products/
│       ├── ProductsPage.tsx
│       └── ProductDetailPage.tsx
├── store/         # Redux slices + RTK Query
│   ├── slices/    # Redux Toolkit slices
│   └── api/       # RTK Query endpoints
│       ├── apiSlice.ts
│       ├── authApi.ts
│       └── productsApi.ts
├── theme/         # Theme configuration
├── utils/         # Helper functions
│   ├── constants.ts
│   └── index.ts
└── types/         # TypeScript type definitions
```

### 🔐 Authentication & Authorization
- **JWT + Refresh Token** flow with automatic renewal
- **Role-based routing** (ProtectedRoute, AdminRoute)
- **Persistent authentication** state across sessions
- **Automatic token cleanup** on expiration
- **Secure token storage** with localStorage
- **Mock authentication** for development

### 🚀 Performance Optimizations
- **React.memo** for component memoization
- **useMemo** for expensive computations
- **useCallback** for function memoization
- **Lazy Loading** with React.lazy and Suspense
- **Code Splitting** by route
- **Debounced Search** (500ms delay)
- **RTK Query Caching** (5-10 min cache times)
- **Lazy Image Loading** with loading states
- **Intersection Observer** for visibility detection
- **Optimized Re-renders** with proper dependencies

### 🛡️ Error Handling
- **Global ErrorBoundary** with styled fallback UI
- **Axios interceptors** for API error handling
- **Exponential backoff** retry mechanism
- **Inline error banners** for user feedback
- **Empty states** with retry actions
- **Loading states** everywhere
- **Network error** detection and handling

### 🌍 Internationalization
- **react-i18next** integration
- **Language detection** from browser/localStorage
- **English + Spanish** example translations
- **Language switcher** component

### 🚩 Feature Flags
- **Runtime feature toggles** for A/B testing
- **localStorage persistence** for user preferences
- **TypeScript-safe** feature flag hooks
- **Easy configuration** for beta features

### 📝 Forms & Validation
- **Multi-step wizard forms** with progress tracking
- **Schema validation** using Zod
- **Field arrays** and nested object support
- **Conditional field** rendering
- **Form state persistence** across steps

### 📊 Data Tables
- **Advanced DataTable** with full CRUD operations
- **Sorting, filtering, pagination** out of the box
- **Row selection** with bulk actions
- **Editable cells** for inline editing
- **TypeScript-safe** column definitions

### 🧪 Testing & Quality
- **Jest + React Testing Library** for comprehensive testing
- **ESLint + Prettier** with Airbnb configuration
- **Stylelint** for CSS best practices
- **Husky** pre-commit hooks for code quality
- **Conventional Commits** with commitlint
- **TypeScript strict mode** enabled

### 🔧 Development Experience
- **Hot Module Replacement** for instant feedback
- **Absolute imports** with path mapping
- **Environment configuration** with .env support
- **Redux DevTools** integration
- **Source maps** for debugging
- **Fast refresh** for React components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Git for version control

### Installation

1. **Clone and setup**
   ```bash
   git clone <your-repo>
   cd Admin
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development**
   ```bash
   npm run dev
   ```
   
   The app will open at `http://localhost:3000`

4. **Login with demo credentials**
   - **Admin**: admin@example.com / admin123
   - **User**: user@example.com / user123

5. **Navigate to Products**
   - Click "Products" in the sidebar
   - Browse, search, filter, and view product details

6. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run lint` | Lint code with ESLint |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Type-check with TypeScript |
| `npm run quality` | Run all quality checks |

## 📁 Project Structure

### Key Files & Folders

#### Core Configuration
- `tsconfig.json` - TypeScript configuration with strict mode
- `tailwind.config.js` - Tailwind + shadcn/ui setup
- `vite.config.ts` - Vite configuration with path aliases
- `.eslintrc.cjs` - ESLint rules for code quality

#### Theme System
- `src/theme/config.ts` - Theme definitions and utilities
- `src/theme/ThemeProvider.tsx` - Theme context and persistence
- `src/styles/globals.css` - CSS variables and theme classes

#### State Management
- `src/store/index.ts` - Redux store configuration
- `src/store/slices/` - Redux Toolkit slices
- `src/store/api/` - RTK Query API endpoints
  - `apiSlice.ts` - Base API configuration
  - `authApi.ts` - Authentication endpoints
  - `productsApi.ts` - Product endpoints

#### Reusable Hooks
- `src/hooks/useDebounce.ts` - Debounce values and callbacks
- `src/hooks/useThrottle.ts` - Throttle function calls
- `src/hooks/useIntersectionObserver.ts` - Visibility detection
- `src/hooks/useMediaQuery.ts` - Responsive breakpoints
- `src/hooks/useClipboard.ts` - Clipboard operations
- `src/hooks/useLocalStorage.ts` - localStorage sync

#### Product Components
- `src/components/common/ProductCard.tsx` - Product card with lazy images
- `src/components/common/ProductGrid.tsx` - Responsive product grid
- `src/components/common/ProductSkeleton.tsx` - Loading skeletons
- `src/components/common/EmptyState.tsx` - Empty state component
- `src/components/common/Pagination.tsx` - Pagination component
- `src/components/common/SearchBar.tsx` - Search with clear button

## 🎯 Usage Examples

### Product API with RTK Query
```tsx
import { useGetProductsQuery, useGetProductQuery } from '@/store/api/productsApi';

function ProductsList() {
  const { data, isLoading, error } = useGetProductsQuery({
    limit: 20,
    skip: 0,
    q: 'phone', // Optional search
  });
  
  if (isLoading) return <ProductSkeleton />;
  if (error) return <EmptyState title="Error loading products" />;
  
  return <ProductGrid products={data.products} />;
}
```

### Debounced Search
```tsx
import { useDebounce } from '@/hooks';

function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  
  // API call only triggers after 500ms of no typing
  const { data } = useGetProductsQuery({ q: debouncedSearch });
  
  return <SearchBar value={search} onChange={setSearch} />;
}
```

### Theme Switching
```tsx
import { useTheme } from '@/theme/ThemeProvider';

function MyComponent() {
  const { theme, themeMode, setTheme, setThemeMode } = useTheme();
  
  return (
    <button onClick={() => setThemeMode('dark')}>
      Switch to Dark Mode
    </button>
  );
}
```

### Feature Flags
```tsx
import { useFeatureFlag } from '@/hooks/redux';

function BetaFeature() {
  const betaEnabled = useFeatureFlag('betaFeatures');
  
  if (!betaEnabled) return null;
  
  return <div>Beta feature content</div>;
}
```

## 🌐 API Integration

### Supported APIs
- **DummyJSON** (https://dummyjson.com) - Products, Categories
- **JSONPlaceholder** (https://jsonplaceholder.typicode.com) - Users, Posts
- **FakeStore API** (https://fakestoreapi.com) - Alternative products

### RTK Query Features
- **Automatic Caching** (5-10 min cache times)
- **Cache Invalidation** on mutations
- **Optimistic Updates** for better UX
- **Retry Logic** with exponential backoff
- **Request Cancellation** on component unmount
- **Normalized State** with tags
- **Loading/Error States** built-in

## 🚢 Deployment

### Environment Variables
```bash
# Production .env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_DUMMYJSON_API=https://dummyjson.com
VITE_APP_NAME="Product Dashboard"
VITE_FEATURE_ANALYTICS_ENABLED=true
VITE_DEFAULT_PAGE_SIZE=20
```

### Build Optimization
The template includes:
- **Tree shaking** for smaller bundles
- **Code splitting** with lazy loading
- **Asset optimization** with Vite
- **Source maps** for debugging
- **Minification** and compression

## 📄 License

This template is available under the MIT License.

---

**Ready to build something amazing?** 🚀

This template provides everything you need for a production-ready Product Listing Dashboard with enterprise-grade features, performance optimizations, and scalable architecture.

Happy coding! 💻