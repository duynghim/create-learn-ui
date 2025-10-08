# Create Learn UI

A modern web UI built with Next.js (App Router) and React. The project focuses on a landing experience with reusable components such as headers, class cards, gradient boxes, and a customer review carousel.

This repository was originally bootstrapped with create-next-app and has been customized for this project.

## Tech Stack
- Language: TypeScript
- Framework: Next.js 15 (App Router)
- UI Libraries: Mantine (core, hooks, form), Tabler Icons, React Icons
- Styling: Tailwind CSS v4, PostCSS
- Carousel: embla-carousel / embla-carousel-react
- Date utilities: date-fns
- Linting/Formatting: ESLint (flat config), Prettier
- Runtime: React 19, Node.js
- Package manager: npm (package-lock.json present)

## Requirements
- Node.js >= 18.18.0 (Next.js 15 requirement). Recommended: Node 20 LTS or newer
- npm >= 9

## Getting Started
Install dependencies:

```bash
npm install
```

Run the development server (Turbopack enabled by default in scripts):

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Build and Run in Production
Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Available Scripts
- npm run dev — Start Next.js in development mode with Turbopack
- npm run build — Build the app for production (Turbopack)
- npm run start — Start the Next.js production server
- npm run lint — Run ESLint using the flat config

## Entry Points and App Structure
- App Router root: src/app/page.tsx (home route)
- Additional route: src/app/landing-page/page.tsx
- Components (examples):
  - src/app/components/header/Header.tsx
  - src/app/components/class-card/ClassCard.tsx
  - src/app/components/gradient-box/GradientBox.tsx
  - src/app/components/landing/customer-review-section/CustomerReviewSection.tsx
- Theme/config: src/app/theme/theme.ts
- Types: src/app/types/*.types.ts

Routing, layouts, and metadata follow the Next.js App Router conventions under src/app.

## Environment Variables
No required environment variables were detected in the repository at this time (next.config.ts contains no custom config).

- TODO: Document any runtime API endpoints or third-party keys here if/when they are introduced.
- Common usage: create a .env.local file in the project root. Next.js will load variables prefixed with NEXT_PUBLIC_ into the client bundle, others remain server-only.

## Testing
No test framework or test files were found in this repository.

- TODO: Add a test setup (e.g., Jest + React Testing Library or Vitest) and include instructions such as:
  - npm run test — run the test suite
  - npm run test:watch — watch mode

## Project Structure
A non-exhaustive overview of key files and directories:

```
create-learn-ui/
├─ src/
│  └─ app/
│     ├─ page.tsx                     # Home page route
│     ├─ not-found.tsx                # 404 page
│     ├─ landing-page/page.tsx        # Additional route example
│     ├─ components/
│     │  ├─ header/Header.tsx
│     │  ├─ class-card/ClassCard.tsx
│     │  ├─ gradient-box/GradientBox.tsx
│     │  └─ landing/customer-review-section/
│     │     ├─ CustomerReviewSection.tsx
│     │     └─ CustomerReviewSection.module.css
│     ├─ theme/theme.ts
│     └─ types/
│        └─ classCardType.types.ts
├─ public/                            # Static assets
├─ next.config.ts                     # Next.js config (minimal)
├─ eslint.config.mjs                  # ESLint flat config (Next + TS)
├─ postcss.config.mjs | .cjs          # PostCSS configuration
├─ tailwind (via PostCSS/Tailwind v4)
├─ tsconfig.json                      # TypeScript config
├─ package.json                       # Scripts and dependencies
└─ README.md
```

## Deployment
You can deploy this Next.js application to any Node-compatible host or to platforms with first-class Next.js support (e.g., Vercel).

- Build: npm run build
- Start: npm run start

Refer to Next.js deployment docs for platform-specific guides.

## Useful Next.js References
- Next.js Documentation: https://nextjs.org/docs
- App Router: https://nextjs.org/docs/app
- Fonts optimization: https://nextjs.org/docs/app/building-your-application/optimizing/fonts

## License
No license file was found in this repository.

- TODO: Add a LICENSE file (e.g., MIT, Apache-2.0) and update this section accordingly.