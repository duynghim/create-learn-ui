---
applyTo: '**'
---

Project Overview
Create Learn UI is a Next.js 15 educational platform built with TypeScript, Mantine UI, JWT authentication, and a clean API client architecture.

Prime Directive

For existing files: return updated code snippets only with precise locations.
Never use diff syntax, +/-, or @@.

For new files: return the entire file with its path.

Use Mantine components whenever possible.

Code must follow ESLint and SonarQube rules (no any, no dead code, good naming, proper error handling).

Output Format

A) Edit an existing file
Use this structure for each edit block:

FILE: path/to/file.tsx
ACTION: REPLACE | INSERT_BEFORE | INSERT_AFTER | INSERT_AT_START | INSERT_AT_END | DELETE
LOCATION: Short, clear description of where in the file
ANCHOR: A unique snippet that already exists in the file
UPDATED CODE:

// The exact code to paste (no diff markers)


Rules:

No diff markers (+/-/@@).

If multiple edits in one file, provide multiple edit blocks.

DELETE actions should include the exact code to remove.

Example:
FILE: src/app/dashboard/page.tsx
ACTION: INSERT_AFTER
LOCATION: Inside <Group justify="space-between"> in the Header section
ANCHOR: <Title order={2}>Dashboard</Title>
UPDATED CODE:

<Button onClick={() => router.push('/projects/new')}>Create Project</Button>


B) Create a new file
Use this structure:

NEW FILE: path/to/NewComponent.tsx
PURPOSE: One short sentence on why this exists
CONTENT:

// Full file content here


Tech Stack

Framework: Next.js 15 (App Router), React 19, TypeScript (strict)

UI: Mantine (core, hooks, notifications)

Styling: Tailwind CSS v4, PostCSS

Icons: Tabler Icons, React Icons

State: React Context + custom hooks

Auth: JWT in localStorage, validated in AuthContext

Data: Custom API clients extending BaseApiClient

Architecture Patterns

Auth
Use AuthContext for all authentication state.
Wrap protected routes in ProtectedRoute.

Key Files:

src/contexts/AuthContext.tsx

src/components/auth/ProtectedRoute.tsx

src/api/authApi.ts

API Clients
Follow the BaseApiClient pattern for new entities. Add custom methods only when needed.

Hooks

Use feature hooks like useTeacher.

Default to safe empty values.

useCallback for handlers.

Use debounced search when needed.

Forms
Use Mantine’s useForm with uncontrolled mode for better performance.

Component Structure
src/
app/[feature]/page.tsx
components/[feature]/Component.tsx
hooks/use[Feature].ts
api/[feature]Api.ts
types/[feature].models.ts

Management Patterns

Sidebar: src/components/management/sidebar/SideBar.tsx

Grid/Table toggle

Debounced search with useDebouncedValue

Server-side pagination

Performance

Separate filter state to avoid loops

useCallback for handlers

Default arrays to avoid undefined errors

Error Handling

BaseApiClient handles API errors consistently

Show UI error alerts with dismiss callbacks

Development Workflow
npm run dev
npm run build
npm run start
npm run lint

Backend Integration

JWT stored in localStorage under auth_token

Auto included in request headers

Token validated on app start

Auto logout on 401/403

Code Quality Standards

Strict TypeScript

Typed API responses

ESLint + Prettier

Path aliases (@/ for src/)

Functional components, typed props

Mantine UI for consistency

Common Patterns

CRUD Feature

Define types in src/types/[feature].models.ts

Create API client extending BaseApiClient

Create custom hook

Build Mantine form with validation

Add page with grid/table views

Protected Routes
Wrap in ProtectedRoute component.

Form Validation
Use Mantine validation functions, no external libs needed.