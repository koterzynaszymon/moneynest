# MoneyNest

A clean [Next.js](https://nextjs.org) + [Supabase](https://supabase.com) starting point with email/password authentication ready to go.

## Stack

- Next.js (App Router)
- Supabase Auth (`@supabase/ssr`, cookie-based sessions)
- Tailwind CSS
- shadcn/ui components

## Getting started

1. Create a Supabase project [via the dashboard](https://database.new).

2. Copy the environment file and fill in your project credentials:

   ```bash
   cp .env.example .env.local
   ```

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-or-anon-key
   ```

   Both values are found in your [project's API settings](https://supabase.com/dashboard/project/_?showConnect=true).

3. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

   The app runs on [localhost:3000](http://localhost:3000).

## Project structure

- `app/` — routes, including `app/auth/*` (login, sign-up, password reset) and `app/protected/*` (auth-gated area).
- `components/` — UI and auth components.
- `lib/supabase/` — Supabase client (`client.ts`), server (`server.ts`), and session middleware (`proxy.ts`).
- `proxy.ts` — Next.js middleware that refreshes the Supabase session.

Start building your features under `app/`.
