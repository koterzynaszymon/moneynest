# MoneyNest
[Live Demo](https://moneynest-seven.vercel.app/dashboard)

MoneyNest is a shared household finance app for tracking household members,
categories, transactions, budgets, and spending insights in one place.

There are still plenty of things to improve, but the current MVP is already a
reliable product for simple use-cases: create a household, invite members,
organize income and expenses by category, record transactions, set monthly
budgets, and review basic insights.

## Current Features

- Email/password authentication with Supabase Auth.
- Household management with owner-only member management.
- Category management for income and expense categories.
- Transaction tracking with filtering, sorting, pagination, and edit/delete
  actions.
- Monthly budgets with category-level spending limits.
- Insights page with monthly KPIs and charts for spending/income breakdowns.
- Loading skeletons for async household pages.
- Dark/light theme support.
- Supabase RLS-backed data access for multi-user household data.

## Stack

- Next.js 15 App Router
- TypeScript
- Supabase PostgreSQL, Auth, RLS, and generated database types
- Tailwind CSS
- shadcn/ui-style components
- Chart.js / react-chartjs-2
- Sonner toasts

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` and fill in your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-or-anon-key
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

   The app runs on [localhost:3000](http://localhost:3000).

## Useful Scripts

```bash
npm run dev
npm run build
npm run lint
npm run db:types
```

- `npm run db:types` regenerates Supabase TypeScript types into
  `lib/types/database.ts`. Run it after changing database migrations/schema.

## Project Structure

- `app/` - App Router routes, layouts, loading states, and auth pages.
- `components/` - UI components, feature components, skeletons, and modals.
- `lib/supabase/` - Browser/server Supabase clients and session refresh logic.
- `lib/types/` - App and generated database types.
- `lib/*/actions.ts` - Server Actions for mutations.
- `lib/*/queries.ts` - Server-side read helpers.
- `supabase/migrations/` - Database schema, policies, grants, and functions.

## Security Notes

- Every data table should be protected by Supabase RLS.
- Mutating actions use server-side guards where useful for clearer UX and
  defense-in-depth.
- Owner-only UI is hidden for non-owners, but authorization still belongs on
  the server/database side.

## TODO / Roadmap

- Pagination of categories budgets (/household/:id/budgets)
- Add more statistics to the insights page:
  - month-over-month spending changes
  - income vs expense trend
  - biggest category changes
  - average daily spending
  - budget usage percentage
- Add caching
- Add wallets in a later version. Wallets should represent money sources
  such as bank account, cash, or savings, not categories.
- Add shared Zod validation schemas for forms and Server Actions.
- Add stronger input limits for names, amounts, and descriptions.
- Improve transaction amount display with consistent currency formatting.
- Add deployment documentation.
- Add other languages and currencies (for now the app only uses PLN and English language)
