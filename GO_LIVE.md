# Go-Live Checklist — Flourishing Souls Foundation

The site code is **complete**. Every third-party integration is written and
gated behind environment variables / deployed functions — nothing needs to be
rebuilt to go live. What follows is the exact sequence of dashboard work and
credential pasting, most of it 1–3 minutes per step.

Work top to bottom; each phase makes the next one testable.

---

## Phase 1 — Supabase (database, auth, storage) — ~15 min

> Do this first: the admin panel, staff login, gallery, events, and donation
> verification all point at it, and everything auto-switches from demo mode
> to live the moment the project is reachable.

1. **Create the project** — [app.supabase.com](https://app.supabase.com) → New
   project (free tier is fine). Choose a region near your donors (e.g.
   `eu-west-2` or `us-east-1`). Save the database password somewhere safe.
2. **Run the schema** — SQL Editor → New query → paste the entire contents of
   [`supabase/schema.sql`](supabase/schema.sql) → Run. It's idempotent (safe
   to re-run) and creates every table, RLS policy, the `gallery-media`
   storage bucket, and its policies in one shot.
3. **Copy credentials** — Settings → API: copy the **Project URL** and the
   **anon public** key into `.env.local`:
   ```
   VITE_SUPABASE_URL=https://<ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon-key>
   ```
4. **Create your admin user** — Authentication → Users → **Add user**
   (email + password, tick *Auto Confirm User*).
5. **Grant the admin role** — SQL Editor:
   ```sql
   insert into profiles (id, email, full_name, role)
   select id, email, 'Foundation Admin', 'admin' from auth.users
   on conflict (id) do update set role = 'admin';
   ```
6. **Restart the dev server** (env vars are read at startup). The admin panel
   badge at `/admin` turns **green — "Connected to the live database"**.

**Verify:** log in at `/login` with the new user → `/dashboard` loads →
`/admin` shows real tables. Create a test event → it appears on `/events`.

## Phase 2 — Paystack (donations) — ~10 min

1. **Get keys** — [paystack.com](https://paystack.com) → Settings → API Keys
   & Webhooks. Start in **test mode** (`sk_test_…` / `pk_test_…`).
2. **Set the secret as an Edge Function secret** (CLI):
   ```
   supabase login
   supabase link --project-ref <your-project-ref>
   supabase secrets set PAYSTACK_SECRET_KEY=sk_test_xxx
   ```
3. **Deploy the Edge Functions:**
   ```
   supabase functions deploy paystack-verify
   supabase functions deploy paystack-webhook --no-verify-jwt
   ```
   (`--no-verify-jwt` is required for the webhook — it authenticates via
   Paystack's HMAC signature instead.)
4. **Register the webhook** — Paystack dashboard → Settings → API Keys &
   Webhooks → Webhook URL:
   ```
   https://<ref>.supabase.co/functions/v1/paystack-webhook
   ```
5. **Put the public key in `.env.local`:**
   ```
   VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxx
   ```

**Verify (test mode):** donate ₦100 on `/donate` with test card
`4084 0840 8408 4081`, any future expiry, CVV `408`, OTP `123456`. The
success screen appears, and the donation shows in `/admin` → Donations
(written by server-side verification, not the browser).

## Phase 3 — Monitoring & analytics — ~10 min

Both are wired and activate the moment their env vars are set; both are
optional per environment.

1. **Sentry** — [sentry.io](https://sentry.io) → create a React project →
   copy the DSN → `.env.local`: `VITE_SENTRY_DSN=https://…`
   (React render crashes are reported automatically via the ErrorBoundary;
   donation-verification failures are tagged with `flow: donation-verify`.)
2. **GA4** — [analytics.google.com](https://analytics.google.com) → create a
   property (web) → copy the Measurement ID → `.env.local`:
   `VITE_GA4_ID=G-XXXXXXXXXX`
   Tracked conversions: `donation_success` (with amount), `volunteer_submit`,
   `support_submit`, plus automatic pageviews. IP anonymisation is on and ad
   signals are off.

**Verify:** trigger a test error or donation and see it in Sentry/GA4
real-time view within a minute.

## Phase 4 — Production deploy — ~15 min

The build is a static SPA — host anywhere (Vercel/Netlify/Cloudflare Pages
are all one-click with the repo).

1. **Set environment variables in the host's dashboard** (never commit
   `.env.local`): all `VITE_*` values from Phase 1–3, plus:
   - `VITE_SITE_URL` — the final domain (used for canonical/OG tags)
   - Use **live** Paystack keys (`pk_live_…`) only after Phase 2's test pass.
2. **Point the domain** at the host and enable HTTPS (automatic on all three).
3. **Update the Paystack webhook** to the production domain if you used a
   preview URL in Phase 2 (the Supabase function URL doesn't change — only
   re-check it's the one registered in the **live** Paystack dashboard).
4. **Supabase auth URLs** — Authentication → URL Configuration: set Site URL
   to the production domain (used for OAuth redirects).
5. **Change the admin passcode** (`VITE_ADMIN_PASSCODE`) to something strong —
   it's compiled into the bundle, so treat it as a speed bump, not a lock
   (your real gate is the Supabase account from Phase 1).

## Phase 5 — Post-launch verification

- [ ] Donate via Paystack **live mode** with a real ₦100 → receipt email
      arrives, row appears in `/admin` → Donations.
- [ ] Submit a support request → appears in `/admin` → Messages.
- [ ] Upload a gallery photo as admin (Storage bucket working).
- [ ] Sentry captures a forced test error.
- [ ] GA4 real-time shows your visit.
- [ ] Mobile: complete a full donation on a phone.
- [ ] Lighthouse (Chrome DevTools) ≥ 90 across the board on `/`.

---

### Where everything lives

| Piece | File(s) |
| --- | --- |
| Database schema, RLS, storage bucket | `supabase/schema.sql` |
| Payment verification (server) | `supabase/functions/paystack-verify/` |
| Payment webhook (server) | `supabase/functions/paystack-webhook/` |
| Paystack client wrapper | `src/components/payments/PaystackButton.jsx` |
| Monitoring/analytics | `src/lib/monitoring.js` |
| Admin data layer (live ↔ demo) | `src/lib/adminStore.js` |
| Admin setup guide | `ADMIN_SETUP.md` |
