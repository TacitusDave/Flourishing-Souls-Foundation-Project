# Admin Panel — How It Works

The admin panel lives at **`/admin`**. There's a **Staff login** link in the site
header and mobile menu that takes you straight there.

## Today: passcode + demo mode (works right now)

The Supabase project this app was configured against
(`mvvxmknjxadvjkkedtpo.supabase.co`) is **unreachable** — its DNS no longer
resolves, which means it was paused or deleted on Supabase's side. Because of
that:

- Email/password login cannot work (there is no auth server to talk to).
- The admin panel therefore uses a **passcode gate** instead.

### Using it

1. Go to `/admin` (or click **Staff login** in the header).
2. Enter the passcode from `.env.local`:

   ```
   VITE_ADMIN_PASSCODE=flourish-admin-2026
   ```

3. You're in. The panel shows a green/amber dot telling you which backend
   it's talking to:
   - **Amber — "Demo mode"**: everything is stored in *this browser*
     (localStorage). Events, gallery items, messages, and settings you edit
     persist across refreshes on this machine only.
   - **Green — "Connected"**: talking to the real Supabase database.

> **Change the passcode before deploying publicly.** Any `VITE_` variable is
> compiled into the site bundle, so this is a demo-grade lock, not real
> security. It keeps the panel private from casual visitors; it will not stop
> a determined attacker. That's exactly why the switch to Supabase auth below
> matters for production.

### What you can do in the panel

| Tab | Capability |
| --- | --- |
| **Overview** | Totals across donations, events, volunteers, messages; recent donations; requests needing attention |
| **Events** | Create, edit, delete events — they appear on the public Events page immediately |
| **Gallery** | Add (by image URL) and remove gallery items |
| **Donations** | Searchable ledger with totals and CSV export (read-only by design — rows are written by payment verification) |
| **Messages** | Support requests with a status workflow (pending → in progress → resolved → closed) + volunteer applications |
| **Settings** | Organisation contact details, donation goal, the **donation quick-pick amounts** on the form, and the **impact tiers** shown on the homepage and Donate page; reset demo data |

In demo mode, **Settings → Reset demo data** restores the original sample set.

## Later: switching to real Supabase

When you're ready for the real backend (and real logins):

1. **Create a project** at [supabase.com](https://supabase.com) (free tier is fine).
2. **Run the schema** — open *SQL Editor* and run the contents of
   [`supabase/schema.sql`](supabase/schema.sql). It creates every table, RLS
   policy, and the `is_admin()` helper. It's idempotent — safe to re-run.
3. **Update `.env.local`** with your new project's credentials
   (*Settings → API*):
   ```
   VITE_SUPABASE_URL=https://<your-project>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```
4. **Restart the dev server** (env vars are read at build time).
5. **Create your admin account** — *Authentication → Users → Add user*
   (tick *Auto Confirm User*), then in the SQL Editor:
   ```sql
   update profiles set role = 'admin' where email = 'you@example.com';
   ```
   (If no profile row exists yet, insert one:
   `insert into profiles (id, email, role) select id, email, 'admin' from auth.users where email = 'you@example.com';`)
6. That's it. The admin panel's connection dot turns **green** automatically —
   every tab now reads and writes the real database. The passcode gate stays
   in front of the panel; you can additionally log in via `/login` for the
   Supabase-authenticated dashboard.

### How the switch works under the hood

`src/lib/adminStore.js` probes the Supabase project on first use:

- **Reachable** → all reads/writes go to the real tables (same field names as
  `schema.sql`).
- **Unreachable** → it falls back to a seeded localStorage database.

The rest of the admin UI doesn't know or care which mode is active — that's
why nothing needs to be rebuilt when Supabase comes back.
