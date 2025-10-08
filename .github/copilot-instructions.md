# GitHub Copilot Instructions for Create Learn UI

## Project Overview

This is a Next.js 15 educational management system built with TypeScript, Mantine UI, and JWT authentication. The application provides a comprehensive learning platform with user authentication, teacher management, and administrative features.
---
applyTo: '**'
---
Copilot Instructions — Next.js + Mantine
Context

Project: Next.js (App Router preferred), TypeScript, Mantine UI.

Goal: When editing existing files: send only the minimal patch + exact location.
When creating new files: send full file.

Code must comply with project ESLint config and common SonarQube rules (clean code, no smells, typed, safe).

Global Rules (read me, obey me)

No full-file dumps for existing files. Only provide the changed lines with precise anchors.

For new files, provide the entire file with path and filename.

Prefer Mantine (@mantine/core, @mantine/hooks, @mantine/notifications, etc.) over hand-rolled components or raw HTML where practical.

TypeScript-first: strict types, no any, use discriminated unions / generics where useful.

ESLint/Sonar alignment:

No unused vars/imports.

No any, no implicit any, no // @ts-ignore unless justified.

Avoid duplicated logic, extract helpers.

Keep functions small and pure when possible.

Handle errors; don’t swallow promises.

Accessibility: labels, roles, keyboard nav.

Next.js App Router style unless file tree clearly uses Pages Router.

No secrets in code or comments.

Keep explanations brief; code first.

When in doubt, ask for clarification.

### Tech Stack
- **Framework**: Next.js 15 (App Router) with TypeScript
- **UI Library**: Mantine (components, forms, hooks)
- **Styling**: Tailwind CSS v4, PostCSS
- **Icons**: Tabler Icons, React Icons
- **State Management**: React Context API
- **Authentication**: JWT tokens with localStorage persistence
- **Data Fetching**: Custom API client architecture
- **Runtime**: React 19, Node.js

## Architecture Patterns

### 1. Authentication Flow
The app uses a centralized authentication system with React Context:

```typescript
// Always use AuthContext for authentication state
const { isLoggedIn, user, login, logout } = useAuth();

// Protected routes are wrapped with ProtectedRoute component
<ProtectedRoute>
  <ManagementLayout>{children}</ManagementLayout>
</ProtectedRoute>
```

**Key Files:**
- `src/contexts/AuthContext.tsx` - Global auth state with JWT token management
- `src/components/auth/ProtectedRoute.tsx` - Route protection wrapper
- `src/api/authApi.ts` - Authentication API client

### 2. API Client Architecture
Follow the `BaseApiClient` pattern for consistent API interactions:

```typescript
// Extend BaseApiClient for new entities
class TeacherApiClient extends BaseApiClient<Teacher, CreateTeacherRequest, UpdateTeacherRequest> {
  protected readonly endpoint = '/api/teachers';
  
  // Add custom methods if needed
  async getBySubject(subject: string) {
    return this.request(`${this.endpoint}/subject/${subject}`);
  }
}
```

**Key Files:**
- `src/api/baseApiClient.ts` - Generic CRUD operations base class
- `src/api/teacherApi.ts` - Teacher-specific API implementation
- `src/utils/httpUtils.ts` - HTTP utilities and headers

### 3. State Management with Custom Hooks
Use the established pattern for CRUD operations:

```typescript
// Follow useTeacher pattern for entity management
const [state, setState] = useState({
  entities: [], // Always default to empty array
  isLoading: false,
  error: null,
  total: 0,
  page: 1
});

// Use useCallback for event handlers to prevent re-renders
const handleCreate = useCallback(async (data) => {
  // Implementation
}, [dependencies]);
```

**Key Files:**
- `src/hooks/useTeacher.ts` - Teacher CRUD operations hook
- `src/hooks/useApiEntity.ts` - Generic entity management pattern

### 4. Form Handling with Mantine
Standardized form patterns using Mantine's form library:

```typescript
// Use uncontrolled mode for better performance
const form = useForm({
  mode: 'uncontrolled',
  initialValues: {
    name: '',
    email: '',
    // ... other fields
  },
  validate: {
    name: (value) => (value.length < 2 ? 'Name is too short' : null),
    email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
  }
});
```

**Key Files:**
- `src/components/management/teacher/TeacherForm.tsx` - Teacher form component
- Forms use modal-based UI with success/cancel callbacks

## Development Guidelines

### 1. Component Structure
Follow this directory structure for new features:

```
src/
├── app/
│   ├── [feature]/
│   │   ├── page.tsx              # Main page component
│   │   ├── layout.tsx            # Feature-specific layout
│   │   └── [sub-feature]/
├── components/
│   ├── [feature]/
│   │   ├── Component.tsx
│   │   └── Component.module.css  # Component-specific styles
├── hooks/
│   └── use[Feature].ts           # Feature-specific hooks
├── api/
│   └── [feature]Api.ts           # API client implementations
└── types/
    └── [feature].models.ts       # TypeScript type definitions
```

### 2. Management System Patterns
For admin/management features:

- **Layout**: Use `src/app/management/layout.tsx` with sidebar navigation
- **Sidebar**: Located at `src/components/management/sidebar/SideBar.tsx`
- **Pages**: Support both grid and table views with toggle
- **Search/Filter**: Use debounced search with `useDebouncedValue`
- **Pagination**: Implement server-side pagination with page state

### 3. Performance Optimization
Critical patterns to prevent re-renders and improve performance:

```typescript
// Use separate state for filters to avoid infinite loops
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearch] = useDebouncedValue(searchTerm, 300);

// Use useCallback for all event handlers
const handleSearch = useCallback((value: string) => {
  setSearchTerm(value);
}, []);

// Safe array defaults to prevent undefined errors
const items = data?.items ?? [];
```

### 4. Error Handling
Consistent error handling across the application:

```typescript
// API error responses are handled in BaseApiClient
// UI shows error alerts with dismiss functionality
{error && (
  <Alert variant="light" color="red" onClose={clearError}>
    {error}
  </Alert>
)}
```

## Backend Integration

### API Response Format
The backend expects and returns responses in this format:

```json
{
  "status": 200,
  "message": "Success",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

### Authentication
- JWT tokens stored in localStorage with key `auth_token`
- Tokens automatically included in request headers via `getAuthHeaders()`
- Token validation happens on app initialization in AuthContext
- Auto-logout on token expiration or invalid tokens

## UI/UX Patterns

### 1. Responsive Design
- Mobile-first approach with responsive grid layouts
- Sidebar collapses to drawer on mobile devices
- Tables switch to card view on smaller screens

### 2. Loading States
- Use Mantine's `Loader` component for async operations
- Show skeleton loading for list items
- Disable form submissions during API calls

### 3. Navigation
- Management sidebar with active state indicators
- Breadcrumb navigation for deep pages
- Protected routes redirect to login if not authenticated

## Development Workflow

### Local Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Environment Setup
- Development server runs on `http://localhost:3000`
- Backend API expected at `http://localhost:8080`
- No environment variables required for basic functionality

### Debugging Tips
- Check localStorage for JWT tokens in browser DevTools
- Authentication state logs available in console during development
- Use React DevTools to inspect context state and hook values

## Code Quality Standards

### TypeScript
- Strict TypeScript configuration enabled
- All API responses properly typed
- Use type definitions from `src/types/` directory

### ESLint Configuration
- Flat config setup with Next.js and TypeScript rules
- Automatic formatting with Prettier integration
- Import organization with path aliases (`@/` for `src/`)

### Component Guidelines
- Functional components with hooks
- Props interfaces defined for all components
- CSS Modules for component-specific styling
- Mantine components for consistent UI

## Common Patterns to Follow

### 1. New CRUD Feature Implementation
1. Create type definitions in `src/types/[feature].models.ts`
2. Implement API client extending `BaseApiClient`
3. Create custom hook following `useTeacher` pattern
4. Build form component with Mantine validation
5. Create management page with grid/table views

### 2. Adding Protected Routes
```typescript
// Wrap with ProtectedRoute component
export default function NewProtectedPage() {
  return (
    <ProtectedRoute>
      <PageContent />
    </ProtectedRoute>
  );
}
```

### 3. Form Validation
Use Mantine's built-in validation with custom rules:
```typescript
validate: {
  email: (value) => /^\S+@\S+$/.test(value) ? null : 'Invalid email',
  required: (value) => value?.trim() ? null : 'This field is required'
}
```

This documentation should guide AI assistants and developers in maintaining consistency with the established patterns and architecture of the Create Learn UI project.