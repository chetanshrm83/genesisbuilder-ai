# IdeaForge AI

IdeaForge AI is a production-ready AI SaaS that turns founder inputs into complete startup plans, including positioning, launch copy, marketing content, and competitor insights.

## Stack

- Next.js 14 (App Router)
- React + Tailwind CSS
- API routes (Node.js runtime)
- OpenAI API
- Supabase Auth + Postgres
- Stripe subscription checkout
- Deployable on Vercel

## Core Features

- Landing page with product narrative, pricing, and auth entry points.
- Supabase signup/login flow.
- AI idea generator:
  - Inputs: skills, interests, budget, available time.
  - Outputs: startup idea, brand name, domain suggestions, revenue model, pricing strategy, marketing plan.
- Startup builder outputs:
  - Landing page copy.
  - Product description.
  - 10 marketing posts.
  - Competitor analysis.
  - Launch checklist.
- Dashboard:
  - Generate ideas.
  - Save ideas.
  - Edit saved product description.
  - Export startup plans as PDF (Pro).
- Monetization:
  - Free: 3 generations/day.
  - Pro: unlimited generations + export.
- Admin panel:
  - User count.
  - Total generations.
  - Pro subscriptions.
  - Estimated monthly subscription revenue.

## Project Structure

- `app/` — pages + API routes
- `components/` — reusable UI components
- `lib/` — integrations (OpenAI, Supabase, Stripe, PDF)
- `supabase/schema.sql` — database schema + RLS policies
- `.env.example` — required env vars

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID`
- `STRIPE_WEBHOOK_SECRET`
- `ADMIN_EMAILS` (comma-separated admin emails)

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in SQL editor.
3. Enable Email provider in Auth settings.
4. Add API keys and URL to `.env.local`.

## Stripe Setup

1. Create a monthly Stripe product ($19).
2. Set `STRIPE_PRICE_ID` to that price id.
3. Configure webhook endpoint:
   - `https://your-domain.com/api/stripe/webhook`
   - Event: `checkout.session.completed`
4. Set `STRIPE_WEBHOOK_SECRET`.

## API Endpoints

- `POST /api/generate-idea`
- `GET /api/ideas`
- `PATCH /api/plans/:id`
- `POST /api/export-plan`
- `POST /api/stripe/checkout`
- `POST /api/stripe/webhook`
- `GET /api/admin/metrics`

## Deploy on Vercel

1. Push to GitHub.
2. Import project in Vercel.
3. Add all environment variables.
4. Deploy.

## Production Hardening Suggestions

- Add Stripe customer portal for self-serve billing management.
- Add webhook handling for subscription cancellation and payment failure.
- Add audit logging for admin endpoints.
- Add API rate limiting and abuse controls.
